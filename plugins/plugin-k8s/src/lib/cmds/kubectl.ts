/*
 * Copyright 2018 IBM Corporation
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
const debug = Debug('k8s/cmds/kubectl')
debug('loading')

import * as expandHomeDir from 'expand-home-dir'

import { isHeadless, inBrowser } from '@kui-shell/core/core/capabilities'
import { findFile } from '@kui-shell/core/core/find-file'
import UsageError from '@kui-shell/core/core/usage-error'
import repl = require('@kui-shell/core/core/repl')
import { oopsMessage } from '@kui-shell/core/core/oops'
import { ExecType } from '@kui-shell/core/core/command-tree'

import { FinalState } from './states'
import abbreviations from './abbreviations'
import { IResource, statusButton, deleteResourceButton, renderAndViewStatus } from './modes'
import { formatLogs } from '../util/log-parser'
import { renderHelp } from '../util/help'
import { preprocessTable, formatTable } from '../formatters/formatTable'
import { registry as formatters } from '../formatters/registry'

import { redactJSON, redactYAML } from '../formatters/redact'

/** add the user's option to the command line */
const dashify = str => {
  if (str.length === 1) {
    return `-${str}`
  } else {
    return `--${str}`
  }
}

/**
 * Export credentials to the filesystem, if we need to
 *
 */
type CleanupFunction = () => void
const possiblyExportCredentials = (execOptions, env): Promise<CleanupFunction> => new Promise(async (resolve, reject) => {
  debug('possiblyExportCredentials', process.env.KUBECONFIG, execOptions && execOptions.credentials)

  if (!process.env.KUBECONFIG && execOptions && execOptions.credentials && execOptions.credentials.k8s) {
    debug('exporting kubernetes credentials')
    const { dir: tmpDir } = await import('tmp')
    tmpDir(async (err, path, cleanupCallback) => {
      if (err) {
        reject(err)
      } else {
        const { join } = await import('path')
        const { writeFile, remove } = await import('fs-extra')
        const { kubeconfig, ca, cafile } = execOptions.credentials.k8s
        try {
          const kubeconfigFilepath = join(path, 'kubeconfig.yml')

          await Promise.all([
            writeFile(kubeconfigFilepath, kubeconfig),
            writeFile(join(path, cafile), ca)
          ])

          env.KUBECONFIG = kubeconfigFilepath
          resolve(() => remove(path))

        } catch (err) {
          reject(err)
        }
      }
    })
  } else {
    resolve(() => { /* nothing to do */ })
  }
})

/**
 * Dispatch the given cmdline to the action proxy
 *
 */
const dispatch = async (argv: Array<string>, options, FQN, command, execOptions) => {
  //
  // output format option
  //
  const output = options.output || options.o

  //
  // parameters to the invoke of the kubectl action proxy
  //
  const parameters = {}

  const verb = argv[1]
  const entityType = command === 'helm' ? command : argv[2]
  const entity = command === 'helm' ? argv[2] : argv[3]

  /** strip trailing e.g. .app */
  const entityTypeWithoutTrailingSuffix = entityType && entityType.replace(/\..*$/, '')

  /** what we want to display for the entity kind */
  const entityTypeForDisplay = abbreviations[entityTypeWithoutTrailingSuffix] || entityTypeWithoutTrailingSuffix

  if (!inBrowser()) {
    const { readFile } = require('fs-extra')
    const { join, dirname, basename } = require('path')

    //
    // filepath to the CA. if the user doesn't provide this as an
    // explicit argument, we will attempt to find this filepath inside
    // the kubeconfig file... below
    //
    let CA_FILE = options.cafile
    delete options.cafile

    // filepath to the kubeconfig
    const kubeconfigFile = options.kubeconfig || process.env.KUBECONFIG
    delete options.kubeconfig
    if (!kubeconfigFile) {
      throw new UsageError({ message: 'Missing kubeconfig', usage: usage(command) })
    }

    // contents of the kubeconfig file
    const kubeconfigContents = await readFile(kubeconfigFile)

    if (!CA_FILE && kubeconfigFile) {
      //
      // here is where we hunt for the CA by inspecting the kubeconfig
      //
      const { safeLoadAll: parseYAML } = require('js-yaml')
      const kubeconfig = parseYAML(kubeconfigContents)
      debug('kubeconfig contents', kubeconfig)

      // the ca is located in the same directory as the kubeconfig file
      const caFileBase = kubeconfig[0].clusters[0].cluster['certificate-authority']
      CA_FILE = join(dirname(kubeconfigFile), caFileBase)
    }

    parameters['ca'] = (await readFile(CA_FILE)).toString('base64') // base64-encoded content of the CA pem
    parameters['cafile'] = basename(CA_FILE) // name of the CA pem file

    parameters['kubeconfig'] = kubeconfigContents.toString('base64') // base64-encoded content of the kube config
  }

  const push = (key, value) => {
    const equals = (key === 'f' || command === 'helm') ? ' ' : '='
    argv.push(`${dashify(key)}${equals}${value}`)
  }
  for (const key in options) {
    if (key !== '_') { // skip yargs-parser artifact
      const value = options[key]

      if (Array.isArray(value)) {
        // yargs-parser oddity with repeated keys
        value.forEach(_ => push(key, _))
      } else {
        push(key, value)
      }
    }
  }

  // slice(1) skips over "kubectl"; the action proxy expects it to be gone
  const cmdlineForDisplay = argv.slice(1).join(' ')
  parameters['cmdline'] = cmdlineForDisplay // we may add or modify this below e.g. for -f support

  parameters['output'] = output // so that the action knows whether the output is json

  //
  // prepare a -f argument
  //
  debug('checking for -f', options.f || options.file)
  if (!inBrowser()) {
    const addFile = async filepathAsGiven => {
      const { readFile } = require('fs-extra')
      const { basename } = require('path')

      if (!parameters['filename']) {
        parameters['filename'] = []
        parameters['fileIsLocal'] = []
        // parameters['fileIsDirectory'] = [];
        parameters['file'] = []
      }

      const isRemote = filepathAsGiven.startsWith('http')
      parameters['fileIsLocal'].push(!isRemote)

      if (!isRemote) {
        // user is pointing to a local file?
        const filepath = findFile(expandHomeDir(filepathAsGiven))
        const base = basename(filepath)
        debug('using local file', filepath)

        const { lstat } = require('fs-extra')
        const isDirectory = (await lstat(filepath)).isDirectory()
        // parameters['fileIsDirectory'].push(isDirectory);

        if (!isDirectory) {
          parameters['filename'].push(base)
          parameters['file'].push((await readFile(filepath)).toString('base64'))
        } else {
          debug('file is a directory')

          const generateZip = async () => new Promise((resolve, reject) => {
            const tmp = require('tmp')
            const archiver = require('archiver')
            const { createWriteStream } = require('fs')

            tmp.file(async (err, zipfile, fd, cleanupCallback) => {
              if (err) {
                console.error(err)
                reject(err)
              }

              const output = createWriteStream(zipfile)
              const archive = archiver('tar', { gzip: true })

              output.on('close', async () => {
                parameters['filename'].push(`${base}.tgz`)
                parameters['file'].push((await readFile(zipfile)).toString('base64'))

                // cleanupCallback();
                resolve()
              })
              archive.on('error', err => {
                cleanupCallback()
                reject(err)
              })
              archive.on('warning', function (err) {
                console.error(err)

                if (err.code === 'ENOENT') {
                  // log warning
                } else {
                  // throw error
                  cleanupCallback()
                  reject(err)
                }
              })

              archive.pipe(output)
              archive.directory(filepath, base)
              archive.finalize()
            })
          })

          await generateZip()
        }

        // update cmdline to use -f <nameForCmdline>
        const nameForCmdline = parameters['filename'][parameters['filename'].length - 1]
        parameters['cmdline'] = parameters['cmdline'].replace(new RegExp(filepathAsGiven), nameForCmdline)
      } else {
        // user is pointing to an http file
        debug('using remote file', filepathAsGiven)
        parameters['filename'].push(filepathAsGiven)
        parameters['file'].push(false) // not used for remote files, but we need to fill the slot
        // parameters['fileIsDirectory'].push(false);
      }
    }

    if (verb !== 'logs' && (options.f || options.file)) {
      const filepath = options.f || options.file
      if (Array.isArray(filepath)) {
        await Promise.all(filepath.map(addFile))
      } else {
        await addFile(filepath)
      }
    }

    if (command === 'helm' && verb === 'install') {
      await addFile(entity)
    }

    parameters['numFiles'] = (parameters['file'] || []).length
  }

  debug('FQN', FQN)
  debug('parameters', parameters)
  debug('options', options)

  const result = await repl.qexec(`action invoke "${FQN}"`, undefined, undefined, {
    parameters
  })
  debug('result', result)

  if (result.response && !result.response.success) {
    debug('oops', result)

    const message = oopsMessage({ error: result })
    const code = message.match(/no resources found/i) || message.match(/not found/i) || message.match(/doesn't have/i) ? 404
      : message.match(/already exists/i) ? 409
      : 500

    throw new UsageError({ message, usage: usage(command), code })
  }

  if (execOptions.raw) {
    // caller asked for the raw output
    debug('returning raw output', result)
    return result.response.result.items || Buffer.from(result.response.result.result, 'base64').toString().replace(/\n$/, '')
  } else if (output === 'json') {
    //
    // yay, we should already have good JSON; display this in the sidecar
    //
    result.prettyType = entityTypeForDisplay || command
    result.activationId = cmdlineForDisplay
    result.name = entity || verb
    result.noCost = true // don't display the cost in the UI
    return result
  } else if ((options.f || options.file) && (verb === 'create' || verb === 'apply' || verb === 'delete')) {
    //
    // then this was a create or delete from file; show the status of the operation
    //
    if (!execOptions.noStatus) {
      debug('fetching status')

      const finalState = `--final-state ${(verb === 'create' || verb === 'apply' ? FinalState.OnlineLike : FinalState.OfflineLike).toString()}`
      return repl.qexec(`{statusCommand} status ${repl.encodeComponent(options.f || options.file)} ${finalState}`,
                        undefined, undefined, { parameters: execOptions.parameters })
    } else {
      return Promise.resolve(true)
    }
  } else {
    // otherwise, the output will be { result: <base64> }
    const decodedResult = new Buffer(result.response.result.result, 'base64').toString().replace(/\n$/, '')

    const tryThis = formatters[command] && formatters[command][verb]
    if (tryThis) {
      return tryThis(command, verb, entityType, options, decodedResult)
    }

    if (shouldWeDisplayAsTable(verb, entityType, output, options)) {
      return table(decodedResult, '', command, verb, command === 'helm' ? '' : entityType, entity, options)
    } else {
      //
      // generic handling of other output formats, for now
      //
      result.prettyType = entityTypeForDisplay || command
      result.activationId = cmdlineForDisplay
      result.name = entity || verb

      result.noCost = true // don't display the cost in the UI
      result.contentType = output
      result.contentTypeProjection = 'result'
      result.response.result.result = decodedResult
      return result
    }
  }
}

/**
 * Should we attempt to display this entity as a REPL table?
 *
 * @param verb the kubectl verb, e.g. kubectl <get>
 * @param output the optional output type, e.g. kubectl get pods -o <json>
 *
 */
const shouldWeDisplayAsTable = (verb: string, entityType: string, output: string, options) => {
  return !options.help && !options.h &&
    verb !== 'describe' &&
    verb !== 'install' &&
    (!output || output === 'wide' || output === 'name' || output.match(/^custom-columns/))
}

/**
 * Display the given string as a REPL table
 *
 */
const table = (decodedResult: string, stderr: string, command: string, verb: string, entityType: string, entity: string, options) => {
  debug('displaying as table', verb, entityType)

  // TODO move this to shouldWe...
  const reallyTabularize = verb === 'ls' ||
    verb === 'list' ||
    verb === 'get' ||
    (verb === 'config' && entityType.match(/^get/))

  // the ?=\s+ part is a positive lookahead; we want to
  // match only "NAME " but don't want to capture the
  // whitespace
  const tables = reallyTabularize && preprocessTable(decodedResult.split(/^(?=LAST SEEN|NAMESPACE|NAME\s+)/m))

  if (tables && tables.length === 1 && tables[0].length === 0) {
    // degenerate case of "really not a table"
    return pre(decodedResult || stderr)
  } else if (tables && tables.length >= 1) {
    // try use display this as a table
    const tablesModel = formatTable(command, verb, entityType, options, tables)
    return tablesModel.length === 1 ? tablesModel[0] : tablesModel
  } else if (verb === 'delete') {
    debug('returning delete entity for repl')
    return {
      verb,
      name: entity
    }
  } else {
    // otherwise, display the raw output
    return pre(decodedResult)
  }
}

/**
 * Ensure that the given string is display in a whitespace-preserving way
 *
 */
const pre = str => {
  const pre = document.createElement('div')
  pre.classList.add('whitespace')
  pre.innerText = str

  return pre
}

/**
 * Confirm either the command line did not specify a -f file, or
 * that the specified -f file exists
 *
 */
const confirmFileExistence = async (filepathAsGiven, command) => {
  debug('confirmFileExistence', filepathAsGiven)

  if (!filepathAsGiven || filepathAsGiven.startsWith('http')) {
    return true
  } else if (!inBrowser()) {
    const { pathExists } = require('fs-extra')
    const filepath = findFile(filepathAsGiven)
    debug('confirmFileExistence filepath', filepath)

    if (!await pathExists(filepath)) {
      debug('file does not exist')
      throw new UsageError({
        message: `The specified file does exist: ${filepathAsGiven}`,
        extra: filepath,
        code: 404,
        usage: usage(command)
      })
    }
  } else {
    throw new UsageError({ message: '-f file not supported when running in a browser', usage: usage(command) })
  }
}

const usage = command => ({
  title: command,
  command,
  strict: command,
  onlyEnforceOptions: [ '-f' ],
  noHelp: true, // kubectl and helm both provide their own -h output
  docs: `Execute ${command} commands`,
  optional: [
    { name: '-f', file: true, docs: 'Filename, directory, or URL to files to use to create the resource' }
  ]
})

const prepareUsage = async (command: string) => {
  debug('prepareUsage', command)

  try {
    const usage = await repl.qexec(`${command} -h`, undefined, undefined, { failWithUsage: true })
    return usage
  } catch (err) {
    console.error('Error preparing usage')
    return undefined
  }
}

/**
 * Spawn a local executable
 *
 * @param command the executable
 * @param rawArgv the full command line, including [ command, ... ]
 * @param argv command line without options
 * @param execOptions control-channel options passed by programmatic execution
 * @param options parsed-out command line options
 *
 */
/* ({ command, argv, execOptions, argvNoOptions, parsedOptions }) => {
  return executeLocaly('helm', argv, argvNoOptions, execOptions, parsedOptions, command)
} */
const executeLocally = (command: string) => ({ argv: rawArgv, argvNoOptions: argv, execOptions, parsedOptions: options, command: rawCommand }) => new Promise(async (resolveBase, reject) => {
  debug('exec', command)

  const verb = argv[1]
  const entityType = command === 'helm' ? command : verb && verb.match(/log(s)?/) ? verb : argv[2]
  const entity = command === 'helm' ? argv[2] : entityType === 'secret' ? argv[4] : argv[3]

  // helm status exists; kubectl status does not, but we offer one via `k8s`
  const statusCommand = command === 'kubectl' ? 'k8s' : command

  //
  // output format option
  //
  const output = !options.help &&
    (options.output || options.o
     || (command === 'helm' && verb === 'get' && 'yaml') // helm get seems to spit out yaml without our asking
     || (command === 'kubectl' && verb === 'describe' && 'yaml')
     || (command === 'kubectl' && verb === 'logs' && 'accesslog'))

  // strip trailing e.g. .app
  const entityTypeWithoutTrailingSuffix = entityType && entityType.replace(/\..*$/, '').replace(/-[a-z0-9]{9}-[a-z0-9]{5}$/, '')

  // what we want to display for the entity kind
  const entityTypeForDisplay = abbreviations[entityTypeWithoutTrailingSuffix] || entityTypeWithoutTrailingSuffix

  const cmdlineForDisplay = argv.slice(1).join(' ')

  // replace @seed/yo.yaml with full path
  const argvWithFileReplacements = await Promise.all(rawArgv.slice(1).map(async _ => {
    if (_.match(/^!.*/)) {
      // !foo params mean they flow programatically via execOptions.parameters.foo
      // we will pass this via stdin, which kubectl represents with a '-'
      return '-'
    } else if (_.match(/\.asar\//)) {
      // then this is an in-asar filepath. kubectl won't
      // know what to do with this, so copy it out
      debug('copying out of asar', _)

      const { copyOut } = await import('./copy') // why the dynamic import? being browser friendly here
      return copyOut(_)
    } else if (_.match(/^(@.*$)/)) {
      // then this is a cloudshell-hosted file
      const filepath = findFile(_)
      if (filepath.match(/\.asar\//)) {
        // then this is an in-asar filepath. kubectl won't
        // know what to do with this, so copy it out
        debug('copying @ file out of asar', filepath)
        const { copyOut } = await import('./copy') // why the dynamic import? being browser friendly here
        return copyOut(filepath)
      } else {
        return filepath
      }
    } else {
      return _
    }
  }))
  if (verb === 'delete' && !options.hasOwnProperty('wait')) {
    // by default, apparently, kubernetes treats finalizers as
    // synchronous, and --wait defaults to true
    argvWithFileReplacements.push('--wait=false')
  }
  debug('argvWithFileReplacements', argvWithFileReplacements)

  const env = Object.assign({}, process.env)
  const cleanupCallback = await possiblyExportCredentials(execOptions, env)
  const resolve = async val => {
    await cleanupCallback()
    resolveBase(val)
  }

  const { spawn } = require('child_process')
  delete env.DEBUG // don't pass this through to kubectl or helm; helm in particular emits crazy output
  const child = spawn(command,
                      argvWithFileReplacements,
                      { env, shell: true })

  const file = (options.f || options.file)
  const isProgrammatic = file && file.charAt(0) === '!'
  const programmaticResource = isProgrammatic && execOptions.parameters[file.slice(1)]
  if (isProgrammatic) {
    const param = file.slice(1)
    debug('writing to stdin', param, programmaticResource)
    child.stdin.write(programmaticResource + '\n')
    child.stdin.end()
  }

  let out = ''
  child.stdout.on('data', data => {
    out += data.toString()
  })

  let err = ''
  child.stderr.on('data', data => {
    err += data.toString()
  })

  const status = async (command: string, code?: number, stderr?: string) => {
    if (options.f || options.file || verb === 'delete' || verb === 'create') {
      if (!execOptions.noStatus) {
        const finalState = `--final-state ${(verb === 'create' || verb === 'apply' ? FinalState.OnlineLike : FinalState.OfflineLike).toString()}`
        const resourceNamespace = options.n || options.namespace
          ? `-n ${repl.encodeComponent(options.n || options.namespace)}`
          : ''

        debug('about to get status', options.f || options.file, entityType, entity)
        return repl.qexec(`${statusCommand} status ${options.f || options.file || entityType} ${entity || ''} ${finalState} ${resourceNamespace}`,
                          undefined, undefined, { parameters: execOptions.parameters })
      } else {
        return Promise.resolve(true)
      }
    } else if (code && code !== 0) {
      return Promise.reject(new UsageError({
        code,
        message: stderr || `${command} exited with an error`,
        usage: await prepareUsage(command)
      }))
    } else {
      return Promise.resolve(out || true)
    }
  }

  child.on('close', code => {
    // debug('exec close', code);
    // debug('exec stdout', out);
    if (err.length > 0 || code !== 0) {
      debug('exec has stderr with code %s', code)
      debug('exec stderr args', argvWithFileReplacements.join(' '))
      debug('exec stderr', err)
    } else if (verb === 'delete') {
      debug('exec OK', argvWithFileReplacements.join(' '))
    }

    // e.g. kubectl config without any args results in an exit code of 1
    // whereas kubectl config -h results in an exit code of 0,
    // but we'd like to display them the same
    const isUsage = code !== 0 && verb === 'config' && !entityType && !entity
    if (isUsage) {
      code = 0
      out = err
    }

    const noResources = err.match(/no resources found/i)
    if (code !== 0 || noResources) {
      //
      // then kubectl exited with some error
      //

      const message = err
      const fileNotFound = message.match(/error: the path/)
      const codeForREPL = noResources || message.match(/not found/i) || message.match(/doesn't have/i) ? 404
        : message.match(/already exists/i) ? 409
        : fileNotFound ? 412
        : 500

      debug('handling non-zero exit code %s', code, codeForREPL, err)

      // fail function
      const nope = async () => {
        if (execOptions.failWithUsage) {
          reject(undefined)
        } else {
          const usage = await prepareUsage(command)
          if (!usage) {
            // error generating usage
            reject(message)
          } else {
            reject(new UsageError({ message: err, code: codeForREPL, usage }))
          }
        }
      }

      if (codeForREPL === 404 || codeForREPL === 409 || codeForREPL === 412) {
        // already exists or file not found?
        const error = new Error(err)
        error['code'] = codeForREPL
        debug('rejecting without usage', codeForREPL, error)
        reject(error)
      } else if ((verb === 'create' || verb === 'apply' || verb === 'delete') && (options.f || options.file)) {
        debug('fetching status after error')
        status(command, codeForREPL, err).then(resolve).catch(reject)
      } else {
        nope()
      }
    } else if (execOptions.raw || (isHeadless() && execOptions.type === ExecType.TopLevel && !execOptions.isProxied)) {
      //
      // caller asked for the raw output
      //
      // debug('raw', output);
      debug('resolving raw', argvWithFileReplacements.join(' '), output)
      if (output === 'json') {
        try {
          const json = JSON.parse(out)
          resolve(json.items || json)
        } catch (err) {
          console.error(err)
          resolve(pre(out))
        }
      } else {
        resolve(out.trim())
      }
    } else if (output === 'json' || output === 'yaml' || output === 'accesslog') {
      //
      // return a sidecar entity
      //
      debug('formatting structured output', output)

      const modes = [
        { mode: 'result',
          direct: () => repl.pexec(rawCommand),
          label: output === 'json' || output === 'yaml' ? output.toUpperCase() : output,
          defaultMode: true }
      ]
      if (verb === 'get') {
        const resource: IResource = { kind: command !== 'helm' && entityType, name: entity }
        modes.push(statusButton(command, resource, FinalState.NotPendingLike)),
        deleteResourceButton(() => renderAndViewStatus(command, resource, FinalState.OfflineLike))
        modes.push(deleteResourceButton())
      }

      const result = {
        type: 'activations',
        annotations: [],
        namespace: options.namespace || options.n,
        prettyType: entityTypeForDisplay || command,
        activationId: cmdlineForDisplay,
        name: entity || verb,
        noCost: true, // don't display the cost in the UI
        modes,
        response: {
          success: true,
          status: 'success',
          result: output === 'json'
            ? JSON.parse(out)
            : {
              result: output === 'accesslog' ? formatLogs(out)
                : output === 'yaml' ? redactYAML(out, options)
                : redactJSON(out, options)
            }
        }
      }

      if (output !== 'json') {
        result['contentType'] = output
        result['contentTypeProjection'] = 'result'
      }

      debug('exec output json', result)
      resolve(result)
    } else if ((options.f || options.file || (command === 'kubectl' && entity)) && (verb === 'create' || verb === 'apply' || verb === 'delete')) {
      //
      // then this was a create or delete from file; show the status of the operation
      //
      debug('status after success')
      status(command).then(resolve).catch(reject)
    } else if (options.help || options.h || argv.length === 1 || isUsage) {
      resolve(renderHelp(out, command, verb, entityType))
    } else if (formatters[command] && formatters[command][verb]) {
      debug('using custom formatter')
      resolve(formatters[command][verb].format(command, verb, entityType, options, out))
    } else if (shouldWeDisplayAsTable(verb, entityType, output, options)) {
      //
      // tabular output
      //
      debug('attempting to display as a table')
      resolve(table(out, err, command, verb, command === 'helm' ? '' : entityType, entity, options))
    } else {
      //
      // otherwise, return raw text for display in the repl
      //
      debug('passing through preformatted output')
      resolve(pre(out))
    }
  })
})

/**
 * Executor implementations
 *
 */
const kubectl = executeLocally('kubectl')
const helm = executeLocally('helm')

/**
 * Delegate 'k8s <verb>' to 'kubectl verb'
 *
 */
const dispatchViaDelegationTo = delegate => opts => {
  if (opts.argv[0] === 'k8s') {
    opts.argv[0] = 'kubectl'
    opts.argvNoOptions[0] = 'kubectl'
    opts.command = opts.command.replace(/^(\s*)(k8s)(\s*)/, '$1kubectl$2')
  } else {
    opts.argv.splice(0, 0, 'kubectl')
    opts.argvNoOptions.splice(0, 0, 'kubectl')
    opts.command = `kubectl ${opts.command}`
  }

  debug('delegating invoke', opts.argv[0], opts.command)
  return delegate(opts)
}

/**
 * Register the commands
 *
 */
export default async (commandTree, prequire) => {
  await commandTree.listen('/k8s/kubectl', kubectl, { usage: usage('kubectl'), noAuthOk: [ 'openwhisk' ] })
  await commandTree.listen('/k8s/helm', helm, { usage: usage('helm'), noAuthOk: [ 'openwhisk' ] })

  //
  // register some of the common verbs so that the kubectl plugin works more gracefully:
  // e.g. kubectl kui get pods
  //
  const shorthands = [
    'create',
    'get',
    'delete',
    'describe',
    'explain',
    'logs'
  ]
  await Promise.all(shorthands.map(verb => {
    return commandTree.listen(`/k8s/${verb}`,
                              dispatchViaDelegationTo(kubectl),
                              { usage: usage('kubectl'), noAuthOk: [ 'openwhisk' ] })
  }))
}
