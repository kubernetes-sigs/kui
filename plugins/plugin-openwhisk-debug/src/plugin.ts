/*
 * Copyright 2018-19 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Debug from 'debug'
const debug = Debug('plugins/local')
debug('loading')

import { Docker } from 'node-docker-api'
import { kindToExtension } from './kinds'
import * as needle from 'needle'
import * as withRetry from 'promise-retry'
import * as fs from 'fs-extra'
import * as tmp from 'tmp'
import extract from 'extract-zip'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })
import dockerConfig from './config'
import * as strings from './strings'
import { main as usage } from './docs'

import { UsageError, IUsageModel } from '@kui-shell/core/core/usage-error'
import { oopsMessage } from '@kui-shell/core/core/oops'
import { qexec, pexec } from '@kui-shell/core/core/repl'
import { addNameToSidecarHeader, getSidecar, clearSelection, currentSelection, showEntity } from '@kui-shell/core/webapp/views/sidecar'
import { ITab } from '@kui-shell/core/webapp/cli'
import { removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { injectScript } from '@kui-shell/core/webapp/util/inject'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'

import { addActivationModes } from '@kui-shell/plugin-openwhisk/lib/models/modes'

interface IProtoActivation {
  result?: any
  logs?: string[]
  init_time?: number
}

const promisifyStream = stream => new Promise((resolve, reject) => {
  stream.on('data', data => console.log(data.toString()))
  stream.on('end', resolve)
  stream.on('error', reject)
})

debug('modules loaded')

/** log terminal marker in openwhisk */
const MARKER = '&XXX_THE_END_OF_A_WHISK_ACTIVATION_XXX'

const debuggerURL = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=0.0.0.0:5858'

const uuidPattern = /^[0-9a-f]{32}$/

/** common execOptions for all of the commands */
const commandOptions = {
  needsUI: true,
  fullscreen: false, // width: 800, height: 600,
  // clearREPLOnLoad: true,
  requiresLocal: true, // we need a docker container, so we don't yet support running in-browser
  noAuthOk: true
  // placeholder: 'Loading visualization ...'
}

/** which commands need no command line arguments? */
const needsNoArgs = [ 'clean', 'kill', 'init' ]

let _container
let _containerType
let _containerCode
let _imageDir

/**
 * Mimic the request-promise functionality, but with retry
 *
 */
const rt = opts => {
  const { method, url, json, body, headers } = opts

  const timeout = 10000

  const requestOptions = {
    json: !!json,
    headers,
    follow_max: 5,
    open_timeout: timeout,
    read_timeout: timeout,
    rejectUnauthorized: false // TODO we need to pull this from `wsk`
  }

  debug('making request', method, url, body)

  return withRetry((retry, iter) => {
    return (!body ? needle(method, url, requestOptions) : needle(method, url, body, requestOptions))
      .then(_ => { debug('got response', _.body); return _ })
      .catch(err => {
        const isNormalError = err && (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409)
        if (!isNormalError && (iter < 10)) {
          debug('retrying remote request')
          retry()
        } else {
          console.error(`Error in rp with opts=${JSON.stringify(opts)}`)
          throw err
        }
      })
  })
    .then(_ => {
      if (_.body && _.body.error) {
        const { error } = _.body
        debug('got error response', error)
        throw new Error(error.error || error.message || error)
      } else {
        return _
      }
    })
}

export default async (commandTree: CommandRegistrar) => {
  const handler = local

  commandTree.subtree('/local', { usage, requiresLocal: true })
  commandTree.listen('/local/invoke', handler, Object.assign({ docs: strings.invoke }, commandOptions))
  commandTree.listen('/local/debug', handler, Object.assign({ docs: strings.debug }, commandOptions))
  commandTree.listen('/local/init', handler, Object.assign({ docs: strings.init }, commandOptions))
  commandTree.listen('/local/kill', handler, Object.assign({ docs: strings.kill }, commandOptions))
  commandTree.listen('/local/clean', handler, Object.assign({ docs: strings.clean }, commandOptions))

  if (typeof document === 'undefined' || typeof window === 'undefined') return

  window.addEventListener('beforeunload', () => {
    if (_container) {
      _container.stop()
      _container.delete({ force: true })
    }
  })
}

const doInvoke = async (tab: ITab, input: Object, argvWithoutOptions: string[], spinnerDiv: Element) => new Promise(async () => {
  try {
    debug('executing invoke command')

    const [ nameAndInputPart ] = await Promise.all([
      getActionNameAndInputFromActivations(argvWithoutOptions[2], spinnerDiv),
      getImageDir()
    ])

    updateSidecarHeader(tab, 'local invoke')(nameAndInputPart)

    const action = await getActionCode(nameAndInputPart.name, spinnerDiv) // data: code, kind, binary
    action.name = nameAndInputPart.name
    action.kind = nameAndInputPart.kind

    await init(action.kind, spinnerDiv)

    const start = Date.now() // remember the activation start time; note that this is AFTER dockerization

    const res = await runActionInDocker(action.code,
      action.kind,
      Object.assign({}, action.param, action.input, input), action.binary, spinnerDiv)

    displayAsActivation(tab, 'local activation', action, start, res)
  } catch (err) {
    appendIncreContent(err, spinnerDiv, 'error')
  }
}) /* doInvoke */

/**
 * Local debug
 *
 */
const doDebug = (tab: ITab, input: Object, argvWithoutOptions: string[], dashOptions, returnDiv: Element, spinnerDiv: Element) => new Promise(async (resolve) => {
  debug('executing debug command')

  resolve([{
    mode: 'stop-debugger',
    label: strings.stopDebugger,
    actAsButton: true,
    direct: stopDebugger(tab)
  }])

  try {
    const [ nameAndInputPart ] = await Promise.all([
      getActionNameAndInputFromActivations(argvWithoutOptions[2], spinnerDiv),
      getImageDir()
    ])
    debug('nameAndInput for debug', nameAndInputPart)

    updateSidecarHeader(tab, 'debugger')(nameAndInputPart)

    const action = await getActionCode(nameAndInputPart.name, spinnerDiv)
    debug('action for debug', action)

    if (action.kind.indexOf('node') === -1) {
      // not a node action - return
      throw new Error('Currently, debugging support is limited to nodejs actions')
    } else {
      action.name = nameAndInputPart.name
      action.kind = 'nodejs:8' // debugger only works for nodejs:8

      await init(action.kind, spinnerDiv)
      debug('init for debug done')

      // remember the activation start time; note that this is AFTER dockerization
      const start = Date.now()

      const res = await runActionDebugger(action.name,
        action.code,
        action.kind,
        Object.assign({}, action.param, action.input, input), action.binary, spinnerDiv, returnDiv, dashOptions)

      displayAsActivation(tab, 'debug session', action, start, res)

      closeDebuggerUI()
      debug('debug session done')
    }
  } catch (err) {
    appendIncreContent(err, spinnerDiv, 'error')
  }
}) /* doDebug */

/**
 * Main command handler routine
 *
 */
const local = async ({ argv: fullArgv, argvNoOptions: argvWithoutOptions, parsedOptions: dashOptions, tab }: IEvaluatorArgs) => {
  // we always want to have "local" at the front, so e.g. invoke => local invoke
  if (argvWithoutOptions[0] && argvWithoutOptions[0] !== 'local') {
    argvWithoutOptions.unshift('local')
  }
  debug('args', argvWithoutOptions)

  if (argvWithoutOptions.length === 1) {
    debug('overall usage requested')
    throw new UsageError({ usage })
  } else if (Object.keys(strings).indexOf(argvWithoutOptions[1]) < 1) {
    // missing will be -1, 'overall' will be 0. so none of that
    debug('unknown command')
    throw new UsageError({ usage })
  } else if (argvWithoutOptions.length === 2 &&
             !needsNoArgs.find(_ => _ === argvWithoutOptions[1]) &&
             !fillInWithImplicitEntity(tab, argvWithoutOptions, 2)) { // has the user has already selected an entity in the sidecar?
    debug('insufficient args')
    throw new UsageError({ usage })
  } else {
    //
    // otherwise, we are good to go with executing the command
    //

    // parse the "-p key value" inputs
    const input = {}
    for (let i = 2; i < fullArgv.length; i++) {
      let addIndex = 0
      if (fullArgv[i] === '-p' && fullArgv[i + 1] && fullArgv[i + 1] !== '-p') {
        addIndex++
        if (fullArgv[i + 2] && fullArgv[i + 2] !== '-p') {
          input[fullArgv[i + 1]] = fullArgv[i + 2]
          addIndex++
        }
      }
      i += addIndex
    }

    // we use these to display incremental output in the sidecar
    const returnDiv = document.createElement('div')
    returnDiv.style.flex = '1'
    returnDiv.style.display = 'flex'

    const spinnerDiv = document.createElement('div')
    spinnerDiv.style.flex = '1'
    spinnerDiv.style.display = 'flex'
    spinnerDiv.style.justifyContent = 'center'
    spinnerDiv.style.alignItems = 'center'
    spinnerDiv.style.fontSize = '1.5em'
    spinnerDiv.style.margin = '1em'
    returnDiv.appendChild(spinnerDiv)

    const replayOutput = document.createElement('div')
    replayOutput.classList.add('replay_output')
    replayOutput.style.minWidth = '50%'
    replayOutput.style.order = '2'
    replayOutput.style.marginLeft = '1.5rem'
    spinnerDiv.appendChild(replayOutput)

    const replaySpinner = document.createElement('div')
    replaySpinner.classList.add('replay_spinner')
    replaySpinner.style.animation = 'spin 2s linear infinite'
    replaySpinner.style.fontSize = '5em'
    replaySpinner.style.color = 'var(--color-support-02)'
    spinnerDiv.appendChild(replaySpinner)

    const icon = document.createElement('i')
    icon.className = 'fas fa-cog'
    replaySpinner.appendChild(icon)

    // determine bottom bar modes based on the command
    let modes = []

    if (argvWithoutOptions[1] === 'invoke') {
      doInvoke(tab, input, argvWithoutOptions, spinnerDiv)
    } else if (argvWithoutOptions[1] === 'debug') {
      modes = modes.concat(await doDebug(tab, input, argvWithoutOptions, dashOptions, returnDiv, spinnerDiv))
    } else if (argvWithoutOptions[1] === 'init') {
      debug('executing init command')
      getImageDir()
        .then(() => init('', spinnerDiv)) // this is broken, missing kind
        .then(() => {
          appendIncreContent('Done', spinnerDiv)
          removeSpinner(returnDiv)
        })
        .catch(e => appendIncreContent(e, spinnerDiv, 'error'))
    } else if (argvWithoutOptions[1] === 'kill') {
      debug('executing kill command')
      await kill(spinnerDiv)
      return true
      // we will resolve the promise
    } else if (argvWithoutOptions[1] === 'clean') {
      debug('executing clean command')
      try {
        return await clean(spinnerDiv)
      } catch (err) {
        appendIncreContent(err, spinnerDiv, 'error')
      }
    }

    // this resolves the top-level promise, telling the repl to open the sidecar
    return {
      type: 'custom',
      content: returnDiv,
      modes
    }
  }
} /* end of local */

/**
 * If the user has selected an entity, e.g. via a previous "action get", then fill it in
 *
 */
const fillInWithImplicitEntity = (tab: ITab, args: string[], idx: number): string => {
  const entity = currentSelection(tab)
  if (entity) {
    const pathAnno = entity.annotations.find(({ key }) => key === 'path')
    const path = pathAnno ? `/${pathAnno.value}` : `/${entity.namespace}/${entity.name}`
    debug('implicit entity', path)
    args[idx] = path
    return path
  }
}

/**
 * Call the OpenWhisk API to retrieve the list of docker base
 * images. The result will be cached in the _imageDir variable.
 *
 */
const getImageDir = () => {
  if (_imageDir !== undefined) {
    // we have cached it
    return Promise.resolve(_imageDir)
  } else {
    // we haven't cached it, yet
    debug('get image locations')

    return qexec('host get')
      .then(data => {
        if (data.indexOf('http') !== 0) {
          data = 'https://' + data
        }

        debug('get image locations:remote call')
        return rt({
          method: 'get',
          url: data,
          json: true
        })
      })
      .then(data => {
        _imageDir = data.body.runtimes
        return _imageDir
      })
  }
}

/**
 * Kill and clean can tolerate non-existance of containers or images
 *
 */
const squash = err => {
  debug('got unimportant error', err)
}

/**
 * Kill the current local docker container
 *
 */
const kill = async (spinnerDiv: Element): Promise<void> => {
  if (_container) {
    // if in this session there's a container started, remove it.
    debug('kill from variable')
    await _container.stop()
    await _container.delete({ force: true })
  } else {
    // if no docker container currently recorded, we still try
    // to kill and remove the container, in case shell crashed
    // and left a container open
    debug('kill from api')
    await docker.container.get('shell-local').status().catch(squash)
      .then(container => container && container.stop().catch(squash)
        .then(() => container.delete({ force: true })))
  }
  debug('so far so good with kill')

  // reset globals
  _container = _containerType = _containerCode = undefined
}

/** flatten array of arrays */
const flatten = arrays => [].concat.apply([], arrays)

/**
 * Remove the locally pulled copy of the image
 *
 */
const clean = async (spinnerDiv: Element) => {
  debug('clean')

  await kill(spinnerDiv)
  debug('kill done')

  const images = await getImageDir()
    .then(imageDir => Object.keys(imageDir).map(_ => imageDir[_]))
    .then(flatten)

  await Promise.all(images.map(({ image }) => {
    debug(`cleaning ${image}`)
    return docker.image.get(image).status().catch(squash) // catch here in case the container doesn't exist
      .then(image => {
        if (image) {
          return image.remove({ force: true }).catch(squash)
        }
      })
  }))
  debug('clean done')

  return true
}

/**
 * Initialize a local docker container
 *
 */
const init = async (kind, spinnerDiv) => {
  debug('init', _containerType, kind, _container)

  appendIncreContent('Starting local container', spinnerDiv)

  const containerCreateNeeded = ! (_container && (_containerType && _containerType === kind))

  if (!containerCreateNeeded) {
    // only in one condition that we will reuse a container, is in the same shell session the same kind of action being invoked
    debug('reusing the current container')
  } else {
    // for all other cases, stop and delete the container, reopen a new one
    try {
      await kill(spinnerDiv)
    } catch (err) {
      // ok
    }

    try {
      // continue to the next phase no matter what:
      // if there's any error, it will be caught when starting a container
      // delay here is small enough that it can be ignored
      const imageList = await docker.image.list()

      // determine which dockerhub image corresponds to the
      // kind we're trying to invoke; this will be stored in
      // the image variable:
      let image = 'openwhisk/action-nodejs-v8'
      if (_imageDir) {
        //
        // _imageDir is the output of the openwhisk `/`
        // api, which gives some schema information,
        // including a of this form: { nodejs: [ { kind1,
        // image1 }, { kind2, image2 } ] }
        //
        try {
          debug(`scanning imageDir for kind=${kind}`, _imageDir)
          Object.keys(_imageDir).forEach(key => {
            _imageDir[key].forEach(o => {
              if (o.kind === kind) {
                image = o.image
              }
            })
          })
        } catch (err) {
          console.error(err)
          // let's hope for the best
        }
      }

      debug('using image', image)
      // separate image name and tag. tag is always 'latest'.
      if (image.indexOf(':') !== -1) image = image.substring(0, image.indexOf(':'))

      debug('checking to see if the image already exists locally', image, imageList)

      if (imageList.find(({ data }) => data['RepoTags'] && data['RepoTags'].find(_ => _.match(new RegExp(`^${image}`))))) {
        debug('skipping docker pull, as it is already local')
      } else {
        debug('docker pull', image)
        appendIncreContent(`Pulling image (one-time init)`, spinnerDiv)
        await docker.image.create({}, { fromImage: image, tag: 'latest' })
          .then(stream => promisifyStream(stream))
          .then(() => docker.image.get(image).status())
      }

      debug('docker container create', image, dockerConfig)
      _container = await docker.container.create(Object.assign({ Image: image }, dockerConfig))
      _containerType = kind

      debug('container start', _container)

      setupLogs(await _container.start())
    } catch (err) {
      console.error('error in init', err)
      appendIncreContent(err, spinnerDiv, 'error')
    }
  }
}

/**
 * Given an activation id, determine the action name and (if possible)
 * input data for that activation.
 *
 */
interface IProtoAction {
  name: string
  kind?: string
  input: Object
}
const getActionNameAndInputFromActivations = async (actId, spinnerDiv): Promise<IProtoAction> => {
  if (!actId.trim().match(uuidPattern)) {
    // then actId is really an action name, so there's nothing to do here
    return { name: actId, input: {} }
  }

  appendIncreContent('Retrieving activations', spinnerDiv)
  const d = await qexec(`wsk activation get ${actId}`)

  // appendIncreContent('Retrieving the action code', spinnerDiv);
  let name = d.name
  if (d.annotations && Array.isArray(d.annotations)) {
    d.annotations.forEach(a => {
      if (a.key === 'path') {
        name = a.value
      }
    })
  }

  const cause = d.cause && await qexec(`wsk activation get ${d.cause}`)

  // get the previous activation if there's any
  const previous = cause && cause.logs.indexOf(actId) > 0
    && await qexec(`wsk activation get ${cause.logs[cause.logs.indexOf(actId) - 1]}`)

  return {
    name,
    input: previous ? previous.response.result : {}
  }
}

/**
 * Fetches the code for a given action
 *
 */
const getActionCode = (actionName: string, spinnerDiv: Element) => {
  appendIncreContent('Fetching action', spinnerDiv)
  return qexec(`wsk action get ${actionName}`)
    .then(action => {
      let param = {}
      if (action.parameters) {
        action.parameters.forEach(a => { param[a.name] = a.value })
      }
      return Object.assign(action.exec, { param: param })
    })
}

/**
 * Fetch logs from the current container
 *
 */
const setupLogs = container => {
  debug('setup logs')

  // const { skip = 0 } = container
  container.skip += 2 // two end markers per invoke

  if (!container.logger) {
    container.logger = container.logs({
      follow: true,
      stdout: true,
      stderr: true
    })
      .then(stream => {
        stream.on('data', info => {
          const lines = info.toString().replace(/\n$/, '').split(/\n/) // remove trailing newline

          const first = lines.indexOf(_ => _.indexOf(MARKER) >= 0)
          const slicey = first >= 0 && lines.length > 2 ? first + 1 : 0

          lines.slice(slicey).forEach(line => {
            if (line.indexOf(MARKER) >= 0) {
              // if (soFar++ >= skip) {
              // oh great, we found the end marker, which means we're done!
              debug('logs are done', container.logLines)
              container.logLineResolve(container.logLines)
              // }
            } else /* if (soFar >= skip) */ {
              // then we haven't reached the end marker, yet
              debug('log line', line)
              container.logLines.push(logLine('stdout', line))
            }
          })
        })
        stream.on('error', err => container.logLines.push(logLine('stderr', err)))
      }).catch(container.logLineReject)
  }

  container.logLinesP = new Promise((resolve, reject) => {
    container.logLines = []
    container.logLineResolve = resolve
    container.logLineReject = reject
  })
}

/**
 * Use the bits established by setupLogs to create a { result, logs } structure
 *
 */
const fetchLogs = container => result => {
  debug('fetch logs')
  if (container.logLinesP) {
    return container.logLinesP
      .then(logs => ({ result, logs }))
      .catch(err => {
        // something bad happened collecting the logs
        console.error(err)
        return { result, logs: [] }
      })
  } else {
    return { result, logs: [] }
  }
}

/**
 * Run the given code in a local docker container. We use the /init
 * and /run REST API offered by the container. If the /init call has
 * already been made, e.g. for repeated local invocations of the same
 * action, we can avoid calling /init again.
 *
 */
const runActionInDocker = async (functionCode, functionKind, functionInput, isBinary, spinnerDiv): Promise<IProtoActivation> => {
  let start
  let init

  if (_container && _containerCode === functionCode && _containerType === functionKind) {
    debug('skipping init action')
  } else {
    // console.log(_container);
    debug('init action')
    appendIncreContent('Initializing action', spinnerDiv)
    start = Date.now()
    await rt({
      method: 'post',
      url: 'http://localhost:8080/' + 'init',
      headers: {
        'Content-Type': 'application/json'
      },
      json: true,
      body: {
        value: {
          code: functionCode,
          main: 'main',
          binary: isBinary || false
        }
      }
    })

    _containerCode = functionCode
    init = Date.now()
    appendIncreContent('Running the action', spinnerDiv)

    return rt({
      method: 'post',
      url: 'http://localhost:8080/' + 'run',
      headers: {
        'Content-Type': 'application/json'
      },
      json: true,
      body: {
        value: functionInput
      }
    })
      .then(fetchLogs(_container))
      .then(({ result, logs }) => {
        return {
          init_time: start ? init - start : undefined,
          result: result.body,
          logs
        }
      })
      .catch(error => {
        if (_container && _container.stop && _container.delete) {
          console.error(error)
          kill(spinnerDiv).then(() => {
            // appendIncreContent('Done', spinnerDiv);
            throw error
          })
        } else {
          console.error(error)
          throw error
        }
      })
  }
}

/**
 * Wrap the given code with the debug harness
 *
 * @param code the text of the main code
 * @param input the JSON structure which is the input parameter
 * @param path the (container-local) output path to which we should write the result
 *
 * @return the text of the harnessed code
 */
const debugCodeWrapper = (code, input, path) => {
  return `

${code}





// below is the debugger harness
const debugMainFunc = exports.main || main
Promise.resolve(debugMainFunc(${JSON.stringify(input)}))
.then(result => require('fs').writeFileSync('${path}', JSON.stringify(result)))`
}

/**
 * Run the given code inside a local debugging session
 *
 */
const runActionDebugger = (actionName: string, functionCode: string, functionKind: string, functionInput: Object, isBinary: boolean, spinnerDiv: Element, returnDiv: Element, dashOptions) => new Promise((resolve, reject): IProtoActivation | void => {
  debug('runActionDebugger', actionName)

  appendIncreContent('Preparing container', spinnerDiv)

  // this specifies a path inside docker container, so we should not
  // need to worry about hard-coding something here
  const resultFilePath = '/tmp/debug-session.out'

  // we need to amend the functionCode with a prolog that writes the
  // result somewhere we can find
  let fileCode
  let entry
  if (isBinary) {
    // then "fileCode" is really the zip contents; we'll extract this below
    fileCode = functionCode
  } else {
    // otherwise, this is a plain action
    fileCode = debugCodeWrapper(functionCode, functionInput, resultFilePath)
  }

  // note that we use the action's name (e.g. myAction.js) as the
  // file name, so that it appears nicely in call stacks and other
  // line numbery displays in the debugger
  let debugFileName
  if (isBinary) {
    debugFileName = actionName + '.zip' // for zip actions, use .zip as the extension name
  } else {
    debugFileName = actionName.substring(actionName.lastIndexOf('/') + 1) +
      (kindToExtension[functionKind.replace(/:.*$/, '')] || '')
  }

  //
  // write out our function code, copy it into the docker container,
  // then spawn the debugger, and finally wait for the debug session
  // to complete; at that point, we resolve with { result, logs }
  //

  // first, create a local temp folder
  createTempFolder().then(({ path: dirPath, cleanupCallback }) => {
    const containerFolderPath = dirPath.substring(dirPath.lastIndexOf('/') + 1)

    fs.outputFile(`${dirPath}/${debugFileName}`, fileCode, isBinary ? 'base64' : undefined) // write file to that local temp folder
      .then(() => new Promise((resolve, reject) => {
        if (isBinary) { // if it is a zip action, unzip first
          extract(`${dirPath}/${debugFileName}`, { dir: `${dirPath}` }, function (err) {
            if (err) {
              reject(err)
            } else {
              // see if a package.json exists; if so read it
              // in, because there may be a "main" field
              // that indicates the name of the file which
              // includes the main routine
              const packageJsonPath = `${dirPath}/package.json`
              fs.pathExists(packageJsonPath)
                .then(exists => {
                  if (exists) {
                    // yup, we found a package.json, now see if it has a main field
                    return fs.readFile(packageJsonPath)
                      .then(data => JSON.parse(data).main || 'index.js') // backup plan: index.js
                  } else {
                    // nope, no package.json, so use the default main file
                    return 'index.js'
                  }
                })
                .then(entry => fs.readFile(`${dirPath}/${entry}`) // read in the entry code, so we can wrap it with debug
                  .then(data => debugCodeWrapper(data.toString(), functionInput, resultFilePath)) // wrap it!
                  .then(newCode => fs.outputFile(`${dirPath}/${entry}`, newCode)) // write the new file to temp directory
                  .then(() => resolve(entry))) // return value: the location of the entry
                .catch(reject)
            }
          })
        } else {
          // otherwise, this is a plain (not zip) action
          entry = debugFileName
          resolve(entry) // return value: the location of the entry
        }
      }))
      .then(entry => qexec(`! docker cp ${dirPath} shell-local:/nodejsAction`) // copy temp dir into container
        .then(() => appendIncreContent('Launching debugger', spinnerDiv)) // status update
        .then(() => entry))
      .then(entry => {
        // this is where we launch the local debugger, and wait for it to terminate
        // as to why we need to hack for the Waiting for debugger on stderr:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=706916
        const logLines = []
        qexec(`! docker exec shell-local node --inspect-brk=0.0.0.0:5858 ${containerFolderPath}/${entry}`, undefined, undefined,
          { stdout: line => logLines.push(logLine('stdout', line)),
            stderr: line => {
              if (line.indexOf('Waiting for the debugger to disconnect') >= 0) {
                qexec(`! docker cp shell-local:${resultFilePath} ${dirPath}/debug-session.out`)
                  .then(() => fs.readFile(`${dirPath}/debug-session.out`))
                  .then(result => JSON.parse(result.toString()))
                  .then(result => { cleanupCallback(); return result }) // clean up tmpPath
                  .then(result => resolve({
                    result,
                    logs: logLines,
                    init_time: 0
                  }))
              } else if (line.indexOf('Debugger listening on') >= 0) {
                // squash
              } else if (line.indexOf('For help see https://nodejs.org/en/docs/inspector') >= 0) {
                // squash
              } else if (line.indexOf('Debugger attached') >= 0) {
                // squash
              } else {
                // otherwise, hopefully this is a legit application log line
                logLines.push(logLine('stderr', line))
              }
            } }).catch(reject)
      })
    // now, we fetch the URL exported by the local debugger
    // and use this URL to open a webview container around it
      .then(() => rt({ method: 'get', url: 'http://0.0.0.0:5858/json', json: true })) // fetch url...
      .then(data => {
        // here, we extract the relevant bits of the URL from the response
        if (data && data.body && data.body.length > 0 && data.body[0].devtoolsFrontendUrl) {
          return data.body[0].devtoolsFrontendUrl.substring(data.body[0].devtoolsFrontendUrl.lastIndexOf('/'))
        }
      })
      .then(backtag => {
        // and make webview container from it!
        if (backtag) {
          // remove the spinnery bits
          removeAllDomChildren(returnDiv)

          // create and attach the webview
          const webviewWrapper = document.createElement('div')
          webviewWrapper.id = 'debuggerDiv'
          webviewWrapper.style.flex = '1'
          webviewWrapper.style.display = 'flex'
          returnDiv.appendChild(webviewWrapper)

          const webview = document.createElement('webview')
          webview.style.flex = '1'
          webview.style.display = 'flex'
          webview.setAttribute('src', `${debuggerURL}${backtag}`)
          webview.setAttribute('autosize', 'on')
          webviewWrapper.appendChild(webview)

          // avoid the repl capturing mouse clicks
          webviewWrapper.onmouseup = e => { e.stopPropagation() }
        }
      })
      .catch(reject)
  })
})

/**
 * Determine whether this is user error or internal (our) error
 *
 */
const isUserError = error => {
  if (error.statusCode === 404) {
    // then this is probably a normal "action not found" error
    // from the backend; display the backend's message,to be
    // compatible with the REPL's experience
    return true
  } else {
    return false
  }
}

/**
 * Add a status message
 *
 */
const appendIncreContent = (content, div?, error?) => {
  if (div === undefined) {
    console.error('Error: content div undefined. content=' + content)
    return
  }

  if (error) {
    console.error(content)

    // tell the spinner to change to an error icon
    errorSpinner(div)

    // format the error message
    const err = content
    const message = isUserError(err) ? oopsMessage(err) : 'Internal Error'

    // and then display it
    const messageDom = document.createElement('div')
    messageDom.style.paddingTop = '0.25ex'
    messageDom.className = 'red-text fade-in'
    messageDom.innerText = message
    div.querySelector('.replay_output').appendChild(messageDom)
  } else if (typeof content === 'string') {
    const messageDom = document.createElement('div')
    messageDom.style.paddingTop = '0.25ex'
    messageDom.className = 'red-fade-in'
    messageDom.innerText = content
    div.querySelector('.replay_output').appendChild(messageDom)
  } else if (content.response) {
    const messageDom = document.createElement('div')
    const messageDomInner = document.createElement('span')
    messageDomInner.style.whiteSpace = 'pre'
    messageDomInner.className = 'red-fade-in'
    messageDomInner.innerText = JSON.stringify(content, null, 4)
    messageDom.appendChild(messageDomInner)
    div.querySelector('.replay_output').appendChild(messageDom)
  } else {
    div.querySelector('.replay_output').appendChild(content)
  }
}

/**
 * Remove the appendIncreContent dom bits, i.e. the status messages
 *
 */
const removeSpinner = div => {
  const spinner = div.querySelector('.replay_spinner')
  div.removeChild(spinner)
}

/**
 * Display a given icon in place of the spinner icon
 *
 */
const iconForSpinner = (spinnerDiv, icon, extraCSS) => {
  const iconContainer = spinnerDiv.querySelector('.replay_spinner')
  iconContainer.style.animation = ''
  iconContainer.style.color = ''
  if (extraCSS) iconContainer.classList.add(extraCSS)
  removeAllDomChildren(iconContainer)

  const iconDom = document.createElement('i')
  iconDom.className = icon
  iconContainer.appendChild(iconDom)
}
const errorSpinner = spinnerDiv => iconForSpinner(spinnerDiv, 'fas fa-exclamation-triangle', 'red-text')
// const okSpinner = spinnerDiv => iconForSpinner(spinnerDiv, 'fas fa-thumbs-up', 'green-text')

/**
 * Update the sidecar header to reflect the given viewName and entity
 * name stored in data.
 *
 */
const updateSidecarHeader = (tab: ITab, viewName: string) => data => {
  const { name } = data
  const split = name.split('/')
  const packageName = split.length > 3 ? split[2] : undefined
  const actionName = split[split.length - 1]
  const onclick = () => pexec(`action get ${name}`)

  addNameToSidecarHeader(getSidecar(tab), actionName, packageName, onclick, viewName)

  data.actionName = actionName
  data.packageName = packageName

  return data
}

/**
 * @return a timestamp compatible with OpenWhisk logs
 *
 */
const timestamp = (date = new Date()) => date.toISOString()

/**
 * Make an OpenWhisk-compatible log line
 *
 */
const logLine = (type, line) => `${timestamp()} stdout: ${line.toString()}`

/**
 * Write the given string to a temp file
 *
 * @return {tmpPath, cleanupCallback}
 *
 */
/* const writeToTempFile = string => new Promise((resolve, reject) => {
   tmp.file((err, tmpPath, fd, cleanupCallback) => {
   if (err) {
   console.error(res.err)
   reject('Internal Error')
   } else {
   return fs.outputFile(tmpPath, string).then(() => resolve({tmpPath, cleanupCallback}))
   }
   })
   }) */

const createTempFolder = () => new Promise((resolve, reject) => {
  tmp.dir({ unsafeCleanup: true }, function _tempDirCreated (err, path, cleanupCallback) {
    if (err) {
      console.error(err)
      reject(new Error('Internal Error'))
    } else {
      resolve({ path: path, cleanupCallback: cleanupCallback })
    }
    // console.log('Dir: ', path);
  })
})

/**
 *
 *
 */
const displayAsActivation = async (tab: ITab, sessionType: string, { kind, name: actionName, name }: { kind: string; actionName: string; name: string }, start: number, protoActivation?: IProtoActivation) => {
  try {
    // when the session ended
    const end = Date.now()

    const ns = await qexec('wsk namespace current')

    const annotations: { key: string; value: string | number | boolean }[] = [
      { key: 'path', value: `${ns}/${name}` },
      { key: 'kind', value: kind }
    ]

    if (protoActivation && protoActivation.init_time) {
      // fake up an initTime annotation
      annotations.push({ key: 'initTime', value: protoActivation.init_time })
    }

    // fake up an activation record and show it
    showEntity(tab, addActivationModes({
      type: 'activations',
      activationId: sessionType, // e.g. "debug session"
      name: actionName,
      annotations,
      statusCode: 0, // FIXME
      start,
      end,
      duration: end - start,
      logs: protoActivation && protoActivation.logs,
      response: {
        success: true, // FIXME
        result: protoActivation && protoActivation.result
      }
    }))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Clean up the debugger UI
 *
 */
const closeDebuggerUI = () => {
  const div = document.querySelector('#debuggerDiv')
  div.parentNode.removeChild(div)
}

/**
 * Clean up the debugger UI and close the sidecar
 *
 */
const stopDebugger = (tab: ITab) => () => {
  closeDebuggerUI()
  clearSelection(tab)
}

debug('loading done')
