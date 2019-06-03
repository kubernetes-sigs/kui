/*
 * Copyright 2017-19 IBM Corporation
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

/**
 * This plugin adds a /wsk/actions/let command, to enrich the creation process.
 *
 *    let foo = ~/foo.js
 *    let foo.json = ~/foo.js   <-- web-exported, with a JSON mime type
 *    let foo.http = ~/foo.js   <-- ibid, but with an HTTP web action type
 *    let foo.zip = ~/myaction  <-- create a zip action from a directory
 *    let seq = a -> b -> c     <-- sequence
 *    let foo = x=>x            <-- inline functions (an echo action, in this example)
 *    let seq = a-> x=>x -> c   <-- sequence with inline function
 *    let foo = ~/foo.html      <-- make a web page
 *    let foo = ~/foo.svg       <-- icons
 *    let foo = ~/foo.png       <-- icons!
 *    let api/foo = ~/foo.js    <-- auto-creates package, if one doesn't exist
 *
 */

const debug = require('debug')('let')
debug('loading')

const baseName = process.env.BASE_NAME || 'anon'

import minimist = require('yargs-parser')
import { createWriteStream, existsSync, stat, lstat, readFile, readFileSync, unlink, writeFile } from 'fs'
import { basename, join } from 'path'
import needle = require('needle')
import withRetry = require('promise-retry')

import expandHomeDir from '@kui-shell/core/util/home'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { current as currentNamespace } from '../../models/namespace'
import { findFile } from '@kui-shell/core/core/find-file'
import repl = require('@kui-shell/core/core/repl')

import { deployHTMLViaOpenWhisk } from './_html'
import { ANON_KEY, ANON_KEY_FQN, ANON_CODE, isAnonymousLet, isAnonymousLetFor } from './let-core'

debug('finished loading modules')

/**
 * Mimic the request-promise functionality, but with retry
 *
 */
const rp = url => {
  return withRetry((retry, iter) => {
    const method = 'get'
    const timeout = 10000

    return needle(method, url, {
      open_timeout: timeout,
      read_timeout: timeout,
      follow_max: 5
    })
      .then(_ => _.body)
      .catch(err => {
        const isNormalError = err && (err.statusCode === 400 || err.statusCode === 404 || err.statusCode === 409)
        if (!isNormalError && (iter < 10)) {
          console.error(err)
          retry()
        } else {
          console.error(`Error in rp`, err)
          throw err
        }
      })
  })
}

/**
 * Take the output of url.parse, and determine whether it refers to a remote resource
 *
 */
const isRemote = location => location.includes('https:') || location.includes('http:')

/**
 * Resolve the given url to a local file, even if it is remote.
 *
 */
interface IRemote {
  location: string
  removeWhenDone: boolean
}
const fetchRemote = (location, mimeType): Promise<IRemote> => new Promise((resolve, reject) => {
  const locationWithoutQuotes = location.replace(patterns.quotes, '')
  debug(`fetchRemote? ${locationWithoutQuotes}`)

  if (isRemote(locationWithoutQuotes)) {
    // then fetch it
    debug('fetching remote', locationWithoutQuotes)

    return rp(locationWithoutQuotes).then(data => {
      debug(`fetchRemote done`)
      const extension = mimeType || locationWithoutQuotes.substring(locationWithoutQuotes.lastIndexOf('.'))
      const tmp = require('tmp')
      tmp.tmpName({ postfix: extension }, (err, tmpFilePath) => {
        if (err) {
          reject(err)
        } else {
          writeFile(tmpFilePath, data, err => {
            if (err) {
              reject(err)
            } else {
              resolve({ location: tmpFilePath, removeWhenDone: true })
            }
          })
        }
      })
    })
  } else {
    lstat(findFile(expandHomeDir(locationWithoutQuotes)), (err, stats) => {
      if (stats) {
        // nothing to fetch, it's local!
        resolve({ location: locationWithoutQuotes, removeWhenDone: false })
      }
      if (err) {
        // we can't determine how to access the given url
        reject(new Error(`Unable to locate the given resource location ${locationWithoutQuotes}`))
      }
    })
  }
})

const patterns = {
  action: {
    expr: {
      inline: /\s*([^=]+)\s*=>\s*(.+)/,
      full: /^.*(const|let)\s+([^.=]+)(\.[^=]+)?\s*=\s*([^=]+\s*=>\s*.+)/,
      fromFileWithExtension: /^.*(const|let)\s+([^=]+)(\.\w+)\s*=\s*(.*)/,
      fromFile: /^.*(const|let)\s+([^=]+)(\.\w+)?\s*=\s*(.*)/
    }
  },
  intention: {
    inline: /\s*\|([^|]+)\|\s*/,
    full: /^.*(const|let)\s+([^.=]+)(\.[^=]+)?\s*=\s*\|([^|]+)\|\s*/
  },
  sequence: {
    expr: /^.*(const|let)\s+([^.=]+)(\.[^=]+)?\s*=\s*(.*)/,
    components: /\s*->\s*/
  },
  annotations: { // -a foo bar at the end of a let
    suffix: /(\s+(-(a|p)\s+.*\s+.*))+/
  },
  quotes: /"/g,
  trailingWhitespace: /\s+$/g
}

const extensionToKind = {
  '.js': 'nodejs:default',
  '.py': 'python:default',
  '.swift': 'swift:default'
}

/** annotations */
const annotations = options => {
  if (!options.annotations) {
    options.annotations = []
  }
  return options.annotations
}
const boolean = key => options => annotations(options).push({ key: key, value: true })
const string = (key, value) => options => annotations(options).push({ key: key, value: value })
const web = extension => [ boolean('web-export'), string('content-type-extension', extension) ]
const annotators = {
  'const': [ boolean('final') ],
  '.json': web('json'),
  '.http': web('http'),
  '.css': web('http'),
  '.ico': web('http'),
  '.webjs': web('http'),
  '.png': web('http'),
  '.jpg': web('http'),
  '.jpeg': web('http'),
  '.svg': web('svg'),
  '.html': web('html')
}

/** maps from: "   hello    "   to: "   hello" */
const cutTrailingWhitespace = (str: string) => str && str.replace(patterns.trailingWhitespace, '')

const quotes = /^"(.*)"$/g
const trim = (str: string) => str.trim().replace(quotes, '$1')

/** is the given extension (with dot) a valid one? */
const isValidExtension = extension => !!annotators[extension] || extension === '.zip'

/** is it foo.bar or foo with a .jpg mime type? */
const figureName = (baseName: string, possibleMimeType = '') => {
  return trim(isValidExtension(possibleMimeType) ? baseName : `${baseName}${possibleMimeType}`)
}

/** is this a web asset, or managed web asset? */
const isWebAsset = action => action.annotations && action.annotations.find(kv => kv.key === 'web-export')

/**
 * Create a zip action, given the location of a zip file
 *
 */
const makeZipActionFromZipFile = (wsk, name: string, location: string, options, execOptions) => new Promise((resolve, reject) => {
  try {
    debug('makeZipActionFromZipFile', name, location, options)

    lstat(location, (err, stats) => {
      if (err) {
        console.error(err)
        reject(new Error(`I think you asked to create a zip action, but the specified zip file does not exist: ${location}`))
      } else {
        readFile(location, (err, data) => {
          if (err) {
            reject(err)
          } else {
            const action = {
              exec: {
                kind: options.kind || 'nodejs:default',
                code: data.toString('base64')
              },
              annotations: ((options.action && options.action.annotations) || []),
              parameters: (options.action && options.action.parameters) || [],
              limits: (options.action && options.action.limits) || {}
            }
            debug('body', action)

            const owOpts = wsk.owOpts({
              name,
              // options.action may be defined, if the command has e.g. -a or -p
              action
            })

            // location on local filesystem
            owOpts.action.annotations.push({ key: 'file', value: expandHomeDir(location) })

            // add an annotation to indicate that this is a managed action
            owOpts.action.annotations.push({
              key: 'wskng.combinators',
              value: [{
                type: 'action.kind',
                role: 'replacement',
                badge: 'zip'
              }]
            })

            // broadcast that this is a binary action
            owOpts.action.annotations.push({ key: 'binary', value: true })

            return wsk.client(execOptions).actions.update(owOpts)
              .then(wsk.addPrettyType('actions', 'update', name))
              .then(resolve)
              .catch(reject)
          }
        })
      }
    })
  } catch (err) {
    console.error(err)
    reject(new Error('Internal error'))
  }
})

/**
 * Execute `npm install` in the given directory
 *
 */
const doNpmInstall = (dir: string) => new Promise((resolve, reject) => {
  require('child_process').exec('npm install', { cwd: dir }, err => {
    if (err) {
      reject(err)
    } else {
      resolve(true)
    }
  })
})

/**
 * Create a zip action, given location, which is a directory
 * containing (at least) an index.js.  If the directory also contains
 * a package.json, and the directory does not contain a node_modules
 * subdirectory, then `npm install` will executed prior to zipping up
 * the directory
 *
 */
const makeZipAction = (wsk, name: string, location: string, options, execOptions) => new Promise((resolve, reject) => {
  try {
    debug('makeZipAction', location)
    stat(location, (err, stats) => {
      if (err) {
        reject(err)
      } else if (!stats.isDirectory()) {
        reject(new Error('I think you asked to create a zip action, but the specified location is not a directory.'))
      } else {
        const needsNpmInstall = existsSync(join(location, 'package.json')) && !existsSync(join(location, 'node_modules'))
        const npmInstallTask = !needsNpmInstall ? Promise.resolve(true) : doNpmInstall(location)

        npmInstallTask.then(() => {
          const archiver = require('archiver')
          const tmp = require('tmp')
          const archive = archiver('zip')

          tmp.tmpName((err, path) => {
            if (err) {
              reject(err)
            } else {
              const output = createWriteStream(path)

              // when the zip archiver completes, and closes the output file...
              output.on('close', () => {
                makeZipActionFromZipFile(wsk, name, path, options, execOptions)
                  .then(resolve, reject)
              })

              // create the zip
              archive.pipe(output)
              archive.directory(location, '')
              archive.finalize()
            }
          })
        })
      }
    })
  } catch (err) {
    console.error(err)
    reject(new Error('Internal error'))
  }
})

/**
 * Create a managed web asset
 *
 */
const webAssetTransformer = (location, text, extension) => {
  let headers = ''
  let extensionWithoutDot = extension.substring(1)
  let contentType = extensionWithoutDot

  // any base64 or whatever
  let identity = x => x
  let base64 = x => Buffer.from(x).toString('base64')
  let xform = identity

  if (extension === '.css') {
    headers = 'headers: { "content-type": "text/css" },'
    contentType = 'body'
  } else if (extension === '.webjs') {
    headers = 'headers: { "content-type": "application/javascript" },'
    contentType = 'body'
  } else if (extension === '.png') {
    headers = 'headers: { "content-type": "image/png" },'
    contentType = 'body'
    xform = base64
  } else if (extension === '.ico') {
    headers = 'headers: { "content-type": "image/x-icon" },'
    contentType = 'body'
    xform = base64
  } else if (extension === '.jpg' || extension === '.jpeg') {
    headers = 'headers: { "content-type": "image/jpeg" },'
    contentType = 'body'
    xform = base64
  }

  return "const stripSlash = s => s.substring(0, s.lastIndexOf('/'))\n" +
    'const getHostRelativeRoot = () => `/api/v1/web${stripSlash(stripSlash(process.env.__OW_ACTION_NAME))}`\n' + // eslint-disable-line
    'const getReferer = hostRelativeRoot => `${process.env.__OW_API_HOST}${hostRelativeRoot}\`\n' + // eslint-disable-line
    `function main(params) { const hostRelativeRoot = getHostRelativeRoot(); const referer = getReferer(hostRelativeRoot); const getParams = () => { delete params.__ow_headers; delete params.__ow_path; delete params.__ow_method; return params; }; return { ${headers} ${contentType}: \`` +
    xform(text || readFileSync(expandHomeDir(location))) +
    '\`} }'  // eslint-disable-line
}

/**
 * Create an HTML, CSS, script-js, etc. action
 *
 */
const makeWebAsset = (wsk, name, extension, location, text, options, execOptions) => {
  const extensionWithoutDot = extension.substring(1)
  const action = Object.assign({}, options.action, {
    exec: { kind: 'nodejs:default' }
  })

  // add annotations
  if (!action.annotations) {
    action.annotations = []
  }
  (annotators[extension] || []).forEach(annotator => annotator(action))
  action.annotations.push({ key: 'file', value: expandHomeDir(location) })

  // add an annotation to indicate that this is a managed action
  action.annotations.push({
    key: 'wskng.combinators',
    value: [{
      type: 'web',
      role: 'replacement',
      badge: 'web',
      contentType: extensionWithoutDot
    }]
  })

  action.exec.code = webAssetTransformer(location, text, extension)

  const owOpts = wsk.owOpts({ name, action })
  return wsk.client(execOptions).actions.update(owOpts)
    .then(wsk.addPrettyType('actions', 'update', name))
}

/** here is the module */
export default async (commandTree, wsk) => {
  /**
   * Create an OpenWhisk action from a given file
   *
   * @param letType let or const?
   *
   */
  const createFromFile = (name, mimeType, location, letType, options, execOptions) => {
    const extension = location.substring(location.lastIndexOf('.'))
    const kind = options.kind || extensionToKind[extension]

    if (extension === '.zip') {
      return makeZipActionFromZipFile(wsk, name, location, options, execOptions)
    } else if (mimeType === '.zip') {
      return makeZipAction(wsk, name, location, options, execOptions)
    } else if (kind && mimeType !== '.webjs') {
      //
      // then this is a built-in type
      //
      // const annotationArgs = (options.annotations || []).map(kv => `-a ${kv.key} ${kv.value}`).join(' ')
      return repl.qexec(`wsk action update "${name}" "${location}" --kind "${kind}"`)
        .then(action => {
          (annotators[letType] || []).forEach(annotator => annotator(action))
          if (mimeType) (annotators[mimeType] || []).forEach(annotator => annotator(action))
          if (options.action) {
            action.annotations = action.annotations.concat(options.action.annotations || [])
            action.parameters = options.action.parameters
            action.limits = options.action.limits
          }
          const owOpts = wsk.owOpts({
            name: name,
            action: action
          })
          return wsk.client(execOptions).actions.update(owOpts)
        })
        .then(wsk.addPrettyType('actions', 'update', name))
    } else {
      //
      // otherwise, assume this is a web action for now
      //
      const extra = mimeType === '.html' || extension === '.html'
        ? deployHTMLViaOpenWhisk(location)
        : Promise.resolve({ location })
      return extra.then(({ location, text }) => {
        return makeWebAsset(wsk, name, mimeType || extension, location, text,
          options, execOptions)
      })
    }
  }

  let currentIter = 0 // optimization
  const createWithRetryOnName = (code: string, parentActionName: string, execOptions, idx: number, iter: number, desiredName?: string) => wsk.client(execOptions).actions.create(wsk.owOpts({
    name: desiredName || `${baseName}-${idx}-${iter}`,
    action: {
      exec: {
        kind: 'nodejs:default',
        code: code
      },
      annotations: [{ key: ANON_KEY_FQN, value: `/${currentNamespace()}/${parentActionName}` },
        { key: ANON_KEY, value: parentActionName },
        { key: ANON_CODE, value: code.replace(/^let main = /, '') }] // .*\s*=>\s*
    }
  })).then(action => {
    currentIter++ // optimization
    return action
  }).catch(err => {
    if (err.statusCode === 409) {
      // name conflict
      if (!desiredName) currentIter++ // optimization
      return createWithRetryOnName(code, parentActionName, execOptions, idx, desiredName ? iter : iter + 1)
    } else {
      throw err
    }
  })

  const doCreate = ({ block: retryOK, argv: fullArgv, modules, command: fullCommand, execOptions }) => {
    const update = execOptions.createOnly ? 'create' : 'update'

    /**
     * If the create failed, maybe this is because the package does not exist?
     *
     */
    const packageAutoCreate = name => err => {
      if (err.statusCode === 404 && retryOK) {
        // create failure with 404, maybe package not found?
        const path = name.split('/')
        const packageName = path.length === 2 ? path[0] : path.length === 3 ? path[1] : undefined
        if (packageName) {
          return repl.qexec(`wsk package update "${packageName}"`)
            .then(() => doCreate({ block: false, argv: fullArgv, modules, command: fullCommand, execOptions }))
        }
      }

      // otherwise, it wasn't a package existence issue
      throw err
    }

    const maybeComponentIsFile = (name, mimeType, location, letType = 'let', options = {}, execOptions = {}) => {
      return fetchRemote(location, mimeType)
        .then(location => {
          return createFromFile(name, mimeType, location.location, letType, options, execOptions)
            .catch(packageAutoCreate(name))
            .then(resource => {
              if (location.removeWhenDone) {
                // we were asked to clean up when we finished with the location
                debug('cleaning up', location.location)
                unlink(location.location, err => {
                  if (err) {
                    console.error(err)
                  }
                })
              }

              return resource
            })
        })
    }

    /**
     * Take an expression of a component and wrap, if it is an interior inline function
     *
     */
    interface IKeyValue {
      key: string
      value: string
    }
    interface IEntity {
      name: string
      namespace?: string
      annotations?: IKeyValue[]
    }
    const furlSequenceComponent = (parentActionName: string) => (component: string, idx: number): Promise<IEntity> => {
      const intentionMatch = component.match(patterns.intention.inline)
      const match = component.match(patterns.action.expr.inline)

      if (!intentionMatch && match && match.length === 3) {
        // then this component is an inline function
        debug('sequence component is inline function', match[0])
        const body = `let main = ${match[0]}`
        const candidateName = `${parentActionName}-${idx + 1}`
        return createWithRetryOnName(body, parentActionName, execOptions, idx, currentIter, candidateName)
      } else {
        if (intentionMatch) {
          debug('sequence component is intention', intentionMatch[1])
          const intention = intentionMatch[1] // e.g. |save to cloudant|
          return repl.iexec(intention) // this will return the name of the action that services the intent
        } else if (!inBrowser() && existsSync(expandHomeDir(component))) {
          debug('sequence component is local file', component)
          // then we assume that the component identifies a local file
          //    note: the first step reserves a name
          return createWithRetryOnName('let main=x=>x', parentActionName, execOptions, idx, currentIter, basename(component.replace(/\..*$/, '')))
            .then(reservedAction => reservedAction.name)
            .then(reservedName => maybeComponentIsFile(reservedName, undefined, component, 'let', {}, { nested: true }))
        } else {
          debug('sequence component is named action', component)
          // then we assume, for now, that `component` is a named action
          return Promise.resolve({ name: component })
        }
      }
    }
    const furl = (components: string[], parentActionName: string): Promise<IEntity[]> => {
      return Promise.all(components.map(furlSequenceComponent(parentActionName)))
    }

    const argvWithOptions = fullArgv
    const pair = wsk.parseOptions(argvWithOptions.slice(), 'action')
    const regularOptions = minimist(pair.argv, { configuration: { 'camel-case-expansion': false } })
    const options = Object.assign({}, regularOptions, pair.kvOptions)
    const argv = options._

    // remove the minimist bits
    delete options._

    // debug('args', options, fullCommand)

    const actionMatch = fullCommand.match(patterns.action.expr.full)
    const intentionMatch = fullCommand.match(patterns.intention.full)
    const sequenceMatch = fullCommand.match(patterns.sequence.expr)
    const components = sequenceMatch && sequenceMatch[4].split(patterns.sequence.components)
    const isSequenceMatch = sequenceMatch && components.length > 1

    if (intentionMatch && !isSequenceMatch) {
      debug('intentionMatch', intentionMatch)
      const letType = intentionMatch[1]
      const mimeType = cutTrailingWhitespace(intentionMatch[3])
      const name = figureName(intentionMatch[2], mimeType)
      const intention = intentionMatch[4] // e.g. |save to cloudant|

      return repl.iexec(`${intention} --name ${name}`) // this will return the name of the action that services the intent
        .then(action => {
          (annotators[letType] || []).forEach(annotator => annotator(action))
          if (mimeType) (annotators[mimeType] || []).forEach(annotator => annotator(action))
          if (options.action) {
            action.annotations = action.annotations.concat(options.action.annotations || [])
            action.parameters = options.action.parameters
            action.limits = options.action.limits
          }

          const owOpts = wsk.owOpts({
            name: action.name,
            namespace: action.namespace,
            action: action
          })
          return wsk.client(execOptions).actions[update](owOpts)
            .then(wsk.addPrettyType('actions', 'update'))
        })
        .catch(packageAutoCreate(name))
    } else if (actionMatch && !isSequenceMatch) {
      //
      // then this is an anonymous action-creating let
      //
      const letType = actionMatch[1] // let or const?
      const mimeType = cutTrailingWhitespace(actionMatch[3]) // did the user specify a content type?
      const extension = mimeType || '.js' // for now, we assume that the inline code is nodejs
      const kind = extensionToKind[extension] || 'nodejs:default'
      const name = figureName(actionMatch[2], extensionToKind[extension] ? '' : mimeType) // name of action
      const annoMatch = actionMatch[4].match(patterns.annotations.suffix) // the code might've captured the -a and -p arguments

      if (annoMatch) {
        actionMatch[4] = actionMatch[4].replace(patterns.annotations.suffix, '')
      }
      const code = `let main = ${actionMatch[4]}`

      /* if (!kind) {
         throw new Error('Please use a name with an extension of .js, .py, or .swift')
         } */

      const action = options.action || {}
      action.exec = {
        kind: kind,
        code: code
      };

      // add any annotations
      (annotators[letType] || []).forEach(annotator => annotator(action))
      if (annotators[extension]) annotators[extension].forEach(annotator => annotator(action))

      debug('inline-function::create', name)
      return repl.qexec(`wsk action update "${name}"`, undefined, undefined, { entity: { action } })
        .catch(packageAutoCreate(name))
    } else {
      // maybe a sequence?
      debug('sequenceMatch', sequenceMatch, components)
      if (sequenceMatch) {
        // maybe it is a sequence!
        const letType = sequenceMatch[1]
        const mimeType = cutTrailingWhitespace(sequenceMatch[3])
        const name = figureName(sequenceMatch[2].trim(), mimeType)

        if (components.length >= 2) {
          //
          // the last component might have grabbed the annotations
          //
          const last = components[components.length - 1]
          const annoMatch = last.match(patterns.annotations.suffix)
          if (annoMatch) {
            components[components.length - 1] = last.replace(patterns.annotations.suffix, '')
          }

          return furl(components, name)
            .then(componentEntities => {
              let extraArgs = ''
              let last = componentEntities[componentEntities.length - 1]
              let components = componentEntities.map(C => C.namespace ? '/' + C.namespace + '/' + C.name : C.name)

              if (execOptions.dryRun) {
                // caller is just asking for the details, not for us to create something
                const action = options.action || {}
                return {
                  name,
                  components,
                  componentEntities,
                  annotations: action.annotations,
                  parameters: action.parameters }
              }

              if (isWebAsset(last)) {
                // if the last element in the sequence is a web action, then make the sequence a web action
                extraArgs = '--web'
                const contentType = last.annotations && last.annotations.find(kv => kv.key === 'content-type-extension')
                if (contentType) {
                  extraArgs += ` --content-type ${contentType.value}`
                }
              }

              debug('creating sequence', extraArgs, name, components)
              return repl.qexec(`wsk action update --sequence ${extraArgs} "${name}" ${components.join(',')}`)
                .then(action => {
                  (annotators[letType] || []).forEach(annotator => annotator(action))
                  if (mimeType) {
                    (annotators[mimeType] || []).forEach(annotator => annotator(action))

                    // make sure this appears as a sequence
                    //    for the case where the entity was first created e.g. with let s=|request|
                    //    then later the user added a second element, turning the action into a sequence
                    action.annotations = action.annotations.filter(kv => kv.key !== 'wskng.combinators')
                  }
                  if (options.action) {
                    action.annotations = action.annotations.concat(options.action.annotations || [])
                    action.parameters = options.action.parameters
                    action.limits = options.action.limits
                  }

                  if (annoMatch) {
                    // e.g. let seq = a->b (-a foo bar)   <-- the parenthesized last part
                    const commandLineOptions = wsk.parseOptions(annoMatch[2].split(/\s+/), 'action')
                    if (commandLineOptions && commandLineOptions.action) {
                      if (commandLineOptions.action.annotations) {
                        action.annotations = action.annotations.concat(commandLineOptions.action.annotations)
                      }
                      if (commandLineOptions.action.parameters) {
                        action.parameters = action.parameters.concat(commandLineOptions.action.parameters)
                      }
                    }
                  }

                  const owOpts = wsk.owOpts({
                    name: action.name,
                    namespace: action.namespace,
                    action: action
                  })
                  return wsk.client(execOptions).actions[update](owOpts)
                    .then(wsk.addPrettyType('actions', 'update'))
                })
            })
            .catch(packageAutoCreate(name))
        } else {
          // maybe from a file
          const command = argv.join(' ')
          const actionFromFileMatch = command.match(patterns.action.expr.fromFileWithExtension) || command.match(patterns.action.expr.fromFile)
          debug('fileMatch', actionFromFileMatch, command)

          if (actionFromFileMatch) {
            const letType = actionFromFileMatch[1]
            const mimeType = cutTrailingWhitespace(actionFromFileMatch[3])
            const name = figureName(actionFromFileMatch[2], mimeType)
            const location = actionFromFileMatch[4]

            return maybeComponentIsFile(name, mimeType, location, letType, options, execOptions)
          } else {
            throw new Error('Unable to parse your command')
          }
        }
      } else {
        throw new Error('Unable to parse your command')
      }
    }
  } /* doCreate */

  // Install the routes
  wsk.synonyms('actions').forEach(async syn => {
    const cmd = commandTree.listen(`/wsk/${syn}/let`, doCreate, { docs: 'Create an OpenWhisk action' })
    commandTree.synonym(`/wsk/${syn}/const`, doCreate, cmd)

    try {
      const createCmd = await commandTree.find(`/wsk/${syn}/create`)
      const updateCmd = await commandTree.find(`/wsk/${syn}/update`)
      if (createCmd && createCmd.options) createCmd.options.hide = true
      if (updateCmd && updateCmd.options) updateCmd.options.hide = true
    } catch (e) {
      console.error(e)
    }
  })

  return {
    /** is the given action the result of an anonymous let */
    isAnonymousLet,
    isAnonymousLetFor,

    // resolve the given expression to an action
    //   e.g. is "a" the name of an action, or the name of a file
    resolve: (expr, parentActionName, execOptions, idx) => repl.qexec(`wsk actions get ${expr}`, undefined, undefined, { noRetry: true })
      .catch(err => {
        if (err.statusCode === 404 || err.statusCode === 400) {
          // then this isn't an action (yet)

          const commandFn = (iter, baseName = parentActionName) => `let ${baseName}-anon${iter === 0 ? '' : '-' + iter} = ${expr}`
          const command = commandFn(0)
          const actionMatch = command.match(patterns.action.expr.full)
          const intentionMatch = command.match(patterns.intention.full)
          const sequenceMatch = command.match(patterns.sequence.expr)
          const components = sequenceMatch && sequenceMatch[4].split(patterns.sequence.components)
          const isSequenceMatch = sequenceMatch && components.length > 1

          if (!intentionMatch && !isSequenceMatch && actionMatch) {
            // then this is an inline anonymous function
            debug('resolve::inline')
            return createWithRetryOnName(`let main = ${expr}`, parentActionName, execOptions, idx, 0)
          } else if (intentionMatch) {
            const baseName = intentionMatch[4].substring(1, intentionMatch[4].indexOf(' '))
            return repl.iexec(`${intentionMatch[4]} --name ${baseName}-anon-${idx}`)
          } else {
            const actionFromFileMatch = command.match(patterns.action.expr.fromFile)
            let baseName

            if (actionFromFileMatch) {
              // try to pull an action name from the file name
              baseName = basename(actionFromFileMatch[4])
            }

            const once = iter => repl.qexec(commandFn(iter, baseName), undefined, undefined, { createOnly: true })
              .catch(err => {
                if (err.statusCode === 409) {
                  return once(iter + 1)
                }
              })
            debug('resolve::via let', baseName, parentActionName)
            return once(0)
          }
        } else {
          throw err
        }
      })
  }
}
