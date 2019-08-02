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
const debug = Debug('k8s/controller/kubectl')
debug('loading')

import { isHeadless } from '@kui-shell/core/core/capabilities'
import { findFile } from '@kui-shell/core/core/find-file'
import { UsageError, UsageModel } from '@kui-shell/core/core/usage-error'
import {
  CommandRegistrar,
  CommandHandler,
  ExecType,
  EvaluatorArgs,
  ParsedOptions
} from '@kui-shell/core/models/command'
import { ExecOptions } from '@kui-shell/core/models/execOptions'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { CodedError } from '@kui-shell/core/models/errors'

import abbreviations from './abbreviations'
import { formatLogs } from '../util/log-parser'
import { renderHelp } from '../util/help'
import { fillInTheBlanks } from '../util/discovery/kubeconfig'
import pickHelmClient from '../util/discovery/helm-client'
import createdOn from '../util/created-on'

import { Resource, KubeResource } from '../model/resource'
import { FinalState } from '../model/states'
import { Table, MultiTable, formatWatchableTable, isTable, isMultiTable } from '@kui-shell/core/webapp/models/table'
import { Delete } from '@kui-shell/core/webapp/models/basicModels'

import { redactJSON, redactYAML } from '../view/redact'
import { registry as formatters } from '../view/registry'
import { preprocessTable, formatTable } from '../view/formatTable'
import { deleteResourceButton } from '../view/modes/crud'
import { statusButton, renderAndViewStatus } from '../view/modes/status'
import { status as statusImpl } from './status'
import helmGet from './helm/get'

import repl = require('@kui-shell/core/core/repl')

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface KubeExecOptions extends ExecOptions {
  /*  credentials?: {
    k8s: {
      kubeconfig: string
      ca: string
      cafile: string
    }
  } */
}

/**
 * Several commands seem to be cropping up that give a facade over
 * kubectl; this is a start at such a list
 *
 * 1) kubectl, bien sûr
 * 2) oc, redhat openshift CLI
 *
 */
const kubelike = /kubectl|oc/
const isKubeLike = (command: string): boolean => kubelike.test(command)

/** lazily load js-yaml and invoke its yaml parser */
const parseYAML = async (str: string): Promise<KubeResource | KubeResource[]> => {
  const { safeLoadAll } = await import('js-yaml')
  const yamls = safeLoadAll(str)
  return yamls.length === 1 ? yamls[0] : yamls
}

/**
 * Export credentials to the filesystem, if we need to
 *
 */
type CleanupFunction = () => void
const possiblyExportCredentials = (execOptions: KubeExecOptions, env: NodeJS.ProcessEnv): Promise<CleanupFunction> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    // debug('possiblyExportCredentials', process.env.KUBECONFIG, execOptions && execOptions.credentials)

    if (!process.env.KUBECONFIG && execOptions && execOptions.credentials && execOptions.credentials.k8s) {
      debug('exporting kubernetes credentials')
      const { dir: tmpDir } = await import('tmp')
      tmpDir(async (err, path) => {
        if (err) {
          reject(err)
        } else {
          const { join } = await import('path')
          const { writeFile, remove } = await import('fs-extra')
          const { kubeconfig, ca, cafile } = execOptions.credentials.k8s

          try {
            const kubeconfigFilepath = join(path, 'kubeconfig.yml')

            await Promise.all([writeFile(kubeconfigFilepath, kubeconfig), writeFile(join(path, cafile), ca)])

            env.KUBECONFIG = kubeconfigFilepath
            resolve(() => remove(path))
          } catch (err) {
            reject(err)
          }
        }
      })
    } else {
      resolve(() => {
        /* nothing to do */
      })
    }
  })

/**
 * Should we attempt to display this entity as a REPL table?
 *
 * @param verb the kubectl verb, e.g. kubectl <get>
 * @param output the optional output type, e.g. kubectl get pods -o <json>
 *
 */
const shouldWeDisplayAsTable = (verb: string, entityType: string, output: string, options: ParsedOptions) => {
  const hasTableVerb =
    verb === 'ls' ||
    verb === 'search' ||
    verb === 'list' ||
    verb === 'get' ||
    (verb === 'config' && entityType.match(/^get/))

  return (
    !options.help &&
    !options.h &&
    verb !== 'describe' &&
    verb !== 'install' &&
    (!output || output === 'wide' || output === 'name' || output.match(/^custom-columns/)) &&
    hasTableVerb
  )
}

/**
 * Ensure that the given string is display in a whitespace-preserving way
 *
 */
const pre = (str: string): HTMLElement => {
  const pre = document.createElement('div')
  pre.classList.add('whitespace')
  pre.innerText = str

  return pre
}

/**
 * Display the given string as a REPL table
 *
 */
const table = (
  decodedResult: string,
  stderr: string,
  command: string,
  verb: string,
  entityType: string,
  entity: string,
  options: ParsedOptions,
  execOptions: KubeExecOptions
): Table | MultiTable | HTMLElement | Delete => {
  debug('displaying as table', verb, entityType)
  // the ?=\s+ part is a positive lookahead; we want to
  // match only "NAME " but don't want to capture the
  // whitespace
  const preTables = preprocessTable(decodedResult.split(/^(?=LAST SEEN|NAMESPACE|NAME\s+)/m))

  if (preTables && preTables.length === 1 && preTables[0].length === 0) {
    // degenerate case of "really not a table"
    return pre(decodedResult || stderr)
  } else if (preTables && preTables.length >= 1) {
    // try use display this as a table
    if (preTables.length === 1) {
      const T = formatTable(command, verb, entityType, options, preTables[0])
      if (execOptions.filter) {
        T.body = execOptions.filter(T.body)
      }
      return T
    } else {
      return {
        tables: preTables.map(preTable => {
          const T = formatTable(command, verb, entityType, options, preTable)
          if (execOptions.filter) {
            T.body = execOptions.filter(T.body)
          }
          return T
        })
      }
    }
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

const usage = (command: string): UsageModel => ({
  title: command,
  command,
  strict: command,
  onlyEnforceOptions: ['-f'],
  noHelp: true, // kubectl and helm both provide their own -h output
  docs: `Execute ${command} commands`,
  optional: [
    {
      name: '-f',
      file: true,
      docs: 'Filename, directory, or URL to files to use to create the resource'
    }
  ]
})

const prepareUsage = async (command: string): Promise<UsageModel> => {
  debug('prepareUsage', command)

  try {
    const usage: UsageError = await repl.qexec(`${command} -h`, undefined, undefined, { failWithUsage: true })
    return usage.getUsageModel()
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
const executeLocally = (command: string) => (opts: EvaluatorArgs) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const {
      block,
      argv: rawArgv,
      argvNoOptions: argv,
      execOptions,
      parsedOptions: options,
      command: rawCommand,
      createOutputStream
    } = opts

    const isKube = isKubeLike(command)
    debug('exec', command, isKube)

    const verb = command === 'helm' && argv[1] === 'repo' ? argv[2] : argv[1]
    const entityType = command === 'helm' ? command : verb && verb.match(/log(s)?/) ? verb : argv[2]
    const entity = command === 'helm' ? argv[2] : entityType === 'secret' ? argv[4] : argv[3]

    if (!isHeadless() && isKube && verb === 'edit') {
      debug('redirecting kubectl edit to shell')
      repl
        .qexec(`! ${rawCommand}`, block, undefined, Object.assign({}, execOptions, { createOutputStream }))
        .then(resolve)
        .catch(reject)
      return
    }

    //
    // output format option
    //
    const output =
      !options.help &&
      (options.output ||
      options.o ||
      (command === 'helm' && verb === 'get' && 'yaml') || // helm get seems to spit out yaml without our asking
        (isKube && verb === 'describe' && 'yaml') ||
        (isKube && verb === 'logs' && 'Latest') ||
        (isKube && verb === 'get' && execOptions.raw && 'json'))

    if (
      (!isHeadless() || execOptions.isProxied) &&
      !execOptions.noDelegation &&
      isKube &&
      ((verb === 'summary' || (verb === 'get' && (output === 'yaml' || output === 'json'))) &&
        (execOptions.type !== ExecType.Nested || execOptions.delegationOk))
    ) {
      debug('delegating to summary provider', execOptions.delegationOk, ExecType[execOptions.type].toString())
      const describeImpl = (await import('./describe')).default
      return describeImpl(opts)
        .then(resolve)
        .catch(reject)
    } else if (isKube && (verb === 'status' || verb === 'list')) {
      return statusImpl(verb)(opts)
        .then(resolve)
        .catch(reject)
    }

    // helm status exists; kubectl status does not, but we offer one via `k8s`
    const statusCommand = isKube ? 'k' : command

    // for "raw" execution, force json output
    if (isKube && verb === 'get' && output === 'json' && execOptions.raw && !options.output) {
      debug('forcing json output for raw mode execution', options)
      rawArgv.push('-o')
      rawArgv.push('json')
    }

    //
    // the default log limit is... unlimited? let's make sure we don't
    // cause chaos here by requesting too many log lines
    //
    if (verb === 'logs' && !options.tail && !options.since) {
      debug('limiting log lines')
      rawArgv.push('--tail')
      rawArgv.push('1000')
    }

    if (options.watch || options.w || options['watch-only']) {
      const idxs = [
        rawArgv.indexOf('--watch'),
        rawArgv.indexOf('--watch=true'),
        rawArgv.indexOf('-w'),
        rawArgv.indexOf('-w=true'),
        rawArgv.indexOf('--watch-only'),
        rawArgv.indexOf('--watch-only=true')
      ].filter(_ => _ !== -1)

      idxs.map(idx => rawArgv.splice(idx, 1))
    }

    // strip trailing e.g. .app
    const entityTypeWithoutTrailingSuffix =
      entityType && entityType.replace(/\..*$/, '').replace(/-[a-z0-9]{9}-[a-z0-9]{5}$/, '')

    // what we want to display for the entity kind
    const entityTypeForDisplay = abbreviations[entityTypeWithoutTrailingSuffix] || entityTypeWithoutTrailingSuffix

    // replace @seed/yo.yaml with full path
    const argvWithFileReplacements: string[] = await Promise.all(
      rawArgv.slice(1).map(
        async (_: string): Promise<string> => {
          if (_.match(/^!.*/)) {
            // !foo params mean they flow programatically via execOptions.parameters.foo
            // we will pass this via stdin, which kubectl represents with a '-'
            return '-'
          } else if (_.match(/\.asar\//)) {
            // then this is an in-asar filepath. kubectl won't
            // know what to do with this, so copy it out
            debug('copying out of asar', _)

            const { copyOut } = await import('../util/copy') // why the dynamic import? being browser friendly here
            return copyOut(_)
          } else if (_.match(/^(@.*$)/)) {
            // then this is a cloudshell-hosted file
            const filepath = findFile(_)
            if (filepath.match(/\.asar\//)) {
              // then this is an in-asar filepath. kubectl won't
              // know what to do with this, so copy it out
              debug('copying @ file out of asar', filepath)
              const { copyOut } = await import('../util/copy') // why the dynamic import? being browser friendly here
              return copyOut(filepath)
            } else {
              return filepath
            }
          } else {
            return _
          }
        }
      )
    )
    if (verb === 'delete' && !Object.prototype.hasOwnProperty.call(options, 'wait') && isKube) {
      // by default, apparently, kubernetes treats finalizers as
      // synchronous, and --wait defaults to true
      argvWithFileReplacements.push('--wait=false')
    }
    debug('argvWithFileReplacements', argvWithFileReplacements)

    const env = Object.assign({}, process.env)
    const cleanupCallback = await possiblyExportCredentials(execOptions as KubeExecOptions, env)
    const cleanupAndResolve = async val => {
      await cleanupCallback()
      resolve(val)
    }

    const { spawn } = await import('child_process')
    delete env.DEBUG // don't pass this through to kubectl or helm; helm in particular emits crazy output

    await fillInTheBlanks(env || {})

    debug('kubeconfig', env.KUBECONFIG)

    const commandForSpawn = command === 'helm' ? await pickHelmClient(env) : command
    const child = spawn(commandForSpawn, argvWithFileReplacements, {
      env,
      shell: true
    })

    const file = options.f || options.filename
    const hasFileArg = file !== undefined

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
      if (hasFileArg || verb === 'delete' || verb === 'create') {
        if (!execOptions.noStatus) {
          const expectedState = verb === 'create' || verb === 'apply' ? FinalState.OnlineLike : FinalState.OfflineLike
          const finalState = `--final-state ${expectedState.toString()}`
          const resourceNamespace =
            options.n || options.namespace ? `-n ${repl.encodeComponent(options.n || options.namespace)}` : ''

          debug('about to get status', file, entityType, entity, resourceNamespace)
          return repl
            .qexec(
              `${statusCommand} status ${file || entityType} ${entity ||
                ''} ${finalState} ${resourceNamespace} --watch`,
              undefined,
              undefined,
              { parameters: execOptions.parameters }
            )
            .catch(err => {
              if (err.code === 404 && expectedState === FinalState.OfflineLike) {
                // that's ok!
                debug('resource not found after status check, but that is ok because that is what we wanted')
                return out
              } else {
                throw err
              }
            })
        } else {
          return Promise.resolve(true)
        }
      } else if (code && code !== 0) {
        return Promise.reject(
          new UsageError({
            code,
            message: stderr || `${command} exited with an error`,
            usage: await prepareUsage(command)
          })
        )
      } else {
        return Promise.resolve(out || true)
      }
    }

    child.on('close', async (code: number) => {
      // debug('exec close', code)
      // debug('exec stdout', out)
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
      const originalCode = code
      const isUsage = code !== 0 && ((verb === 'config' && !entityType && !entity) || /Error: unknown.*flag/i.test(err))
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
        const codeForREPL =
          noResources || message.match(/not found/i) || message.match(/doesn't have/i)
            ? 404
            : message.match(/already exists/i)
            ? 409
            : fileNotFound
            ? 412
            : 500

        debug('handling non-zero exit code %s', code, codeForREPL, err)

        // fail function
        const nope = async () => {
          if (execOptions.failWithUsage) {
            reject(new Error(undefined))
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
          if (codeForREPL === 404 && verb === 'get' && (options.w || options.watch)) {
            // NOTE(5.30.2019): for now, we only support watchable table, so we have to return an empty table here
            debug('return an empty watch table')
            return cleanupAndResolve(
              formatWatchableTable(new Table({ body: [] }), {
                refreshCommand: rawCommand.replace(/--watch|-w/g, ''),
                watchByDefault: true
              })
            )
          }
          // already exists or file not found?
          const error: CodedError = new Error(err)
          error.code = codeForREPL
          debug('rejecting without usage', codeForREPL, error)
          reject(error)
        } else if ((verb === 'create' || verb === 'apply' || verb === 'delete') && hasFileArg) {
          debug('fetching status after error')
          status(command, codeForREPL, err)
            .then(cleanupAndResolve)
            .catch(reject)
        } else {
          nope()
        }
      } else if (
        execOptions.raw ||
        (isHeadless() && !output && execOptions.type === ExecType.TopLevel && !execOptions.isProxied)
      ) {
        //
        // caller asked for the raw output
        //
        // debug('raw', output);
        debug('resolving raw', argvWithFileReplacements.join(' '), output)
        if (output === 'json') {
          try {
            const json = JSON.parse(out)
            cleanupAndResolve(json.items || json)
          } catch (err) {
            console.error(err)
            cleanupAndResolve(pre(out))
          }
        } else {
          cleanupAndResolve(out.trim())
        }
      } else if (options.help || options.h || argv.length === 1 || isUsage) {
        try {
          cleanupAndResolve(renderHelp(out, command, verb, originalCode))
        } catch (err) {
          console.error('error rendering help', err)
          reject(out)
        }
      } else if (output === 'json' || output === 'yaml' || verb === 'logs') {
        //
        // return a sidecar entity
        //
        debug('formatting structured output', output)

        const result =
          output === 'json'
            ? JSON.parse(out)
            : verb === 'logs'
            ? formatLogs(out, execOptions)
            : output === 'yaml'
            ? redactYAML(out)
            : redactJSON(out)

        // debug('structured output', result)

        if (isHeadless() && execOptions.type === ExecType.TopLevel && !execOptions.isProxied) {
          debug('directing resolving', isHeadless())
          return cleanupAndResolve(result)
        }

        const modes: SidecarMode[] = [
          {
            mode: 'result',
            direct: rawCommand,
            label:
              verb === 'describe' ? 'describe' : output === 'json' || output === 'yaml' ? output.toUpperCase() : output,
            defaultMode: true
          }
        ]

        if (verb === 'logs') {
          modes.push({
            mode: 'previous',
            direct: `${rawCommand} --previous`,
            execOptions: {
              exec: 'pexec'
            }
          })

          if (options.previous) {
            modes[0].defaultMode = false
            modes[1].defaultMode = true
          }
        }

        const yaml = verb === 'get' && (await parseYAML(out))

        if (Array.isArray(yaml)) {
          const { safeDump } = await import('js-yaml')
          cleanupAndResolve({
            type: 'custom',
            content: safeDump(yaml),
            contentType: 'yaml'
          })
          return
        }

        const subtext = createdOn(yaml)

        // sidecar badges
        const badges = []
        // badges.push(yaml && yaml.metadata && yaml.metadata.generation && `Generation ${yaml.metadata.generation}`)

        if (verb === 'get') {
          const resource: Resource = {
            kind: command !== 'helm' && yaml.kind,
            name: entity,
            resource: yaml
          }
          modes.push(statusButton(command, resource, FinalState.NotPendingLike))

          deleteResourceButton(() =>
            renderAndViewStatus(opts.tab, {
              command,
              resource,
              finalState: FinalState.OfflineLike
            })
          )
          modes.push(deleteResourceButton())
        } else if (verb === 'describe') {
          const getCmd = opts.command.replace(/describe/, 'get').replace(/(-o|--output)[= ](yaml|json)/, '')
          modes.push({
            mode: 'raw',
            label: 'YAML',
            direct: `${getCmd} -o yaml`,
            order: 999,
            leaveBottomStripeAlone: true
          })
        }

        const content = result

        // some resources have a notion of duration
        const startTime = yaml && yaml.status && yaml.status.startTime && new Date(yaml.status.startTime)
        const endTime = yaml && yaml.status && yaml.status.completionTime && new Date(yaml.status.completionTime)
        const duration = startTime && endTime && endTime.getTime() - startTime.getTime()

        // some resources have a notion of version
        const version = yaml && yaml.metadata && yaml.metadata.labels && yaml.metadata.labels.version

        const record = {
          type: 'custom',
          isEntity: verb === 'describe' || (yaml && yaml.metadata !== undefined),
          name: entity || verb,
          packageName: (yaml && yaml.metadata && yaml.metadata.namespace) || '',
          namespace: options.namespace || options.n,
          duration,
          version,
          prettyType: (yaml && yaml.kind) || entityTypeForDisplay || command,
          subtext,
          toolbarText: {
            type: 'info',
            text: 'You are in read-only view mode'
          },
          noCost: true, // don't display the cost in the UI
          modes,
          badges: badges.filter(x => x),
          resource: yaml,
          content
        }

        record['contentType'] = output

        debug('exec output json', record)
        cleanupAndResolve(record)
      } else if (isKube && verb === 'run' && argv[2]) {
        const entity = argv[2]
        const namespace = options.namespace || options.n || 'default'
        debug('status after kubectl run', entity, namespace)
        repl
          .qexec(`k status deploy "${entity}" -n "${namespace}"`)
          .then(cleanupAndResolve)
          .catch(reject)
      } else if ((hasFileArg || (isKube && entity)) && (verb === 'create' || verb === 'apply' || verb === 'delete')) {
        //
        // then this was a create or delete from file; show the status of the operation
        //
        debug('status after success')
        status(command)
          .then(cleanupAndResolve)
          .catch(reject)
      } else if (formatters[command] && formatters[command][verb]) {
        debug('using custom formatter')
        cleanupAndResolve(
          formatters[command][verb].format(
            command,
            verb,
            entityType,
            options,
            out,
            opts.createOutputStream(),
            execOptions
          )
        )
      } else if (shouldWeDisplayAsTable(verb, entityType, output, options)) {
        //
        // tabular output
        //
        debug('attempting to display as a table')
        const tableModel = table(
          out,
          err,
          command,
          verb,
          command === 'helm' ? '' : entityType,
          entity,
          options,
          execOptions
        )

        if ((options.watch || options.w) && (isTable(tableModel) || isMultiTable(tableModel))) {
          cleanupAndResolve(
            formatWatchableTable(tableModel, {
              refreshCommand: rawCommand.replace(/--watch|-w/g, ''),
              watchByDefault: true
            })
          )
        } else {
          cleanupAndResolve(tableModel)
        }
      } else {
        //
        // otherwise, return raw text for display in the repl
        //
        debug('passing through preformatted output')
        cleanupAndResolve(pre(out))
      }
    })
  })

/**
 * Executor implementations
 *
 */
const kubectl = executeLocally('kubectl')
export const _helm = executeLocally('helm')

function helm(opts: EvaluatorArgs) {
  const idx = opts.argvNoOptions.indexOf('helm')
  if (opts.argvNoOptions[idx + 1] === 'get') {
    return helmGet(opts)
  } else {
    return _helm(opts)
  }
}

/**
 * Delegate 'k8s <verb>' to 'kubectl verb'
 *
 */
const dispatchViaDelegationTo = (delegate: CommandHandler) => (opts: EvaluatorArgs) => {
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
export default async (commandTree: CommandRegistrar) => {
  const kubectlCmd = await commandTree.listen('/k8s/kubectl', kubectl, {
    usage: usage('kubectl'),
    requiresLocal: true,
    noAuthOk: ['openwhisk']
  })
  await commandTree.synonym('/k8s/k', kubectl, kubectlCmd, {
    usage: usage('kubectl'),
    requiresLocal: true,
    noAuthOk: ['openwhisk']
  })

  await commandTree.listen('/k8s/helm', helm, {
    usage: usage('helm'),
    requiresLocal: true,
    noAuthOk: ['openwhisk']
  })

  // for debugging: read in a previously captured raw kubectl output from disk, and then pass it to the visualizations
  await commandTree.listen(
    '/k8s/kdebug',
    async ({ argvNoOptions, parsedOptions, execOptions }) => {
      const file = argvNoOptions[argvNoOptions.length - 1]
      const { readFile } = await import('fs-extra')
      const out = (await readFile(file)).toString()

      const command = parsedOptions.command || 'kubectl'
      const verb = parsedOptions.verb || 'get'
      const entityType = parsedOptions.entityType || 'pod'
      const tableModel = table(out, '', command, verb, command === 'helm' ? '' : entityType, undefined, {}, execOptions)
      return tableModel
    },
    { noAuthOk: true }
  )

  //
  // register some of the common verbs so that the kubectl plugin works more gracefully:
  // e.g. kubectl kui get pods
  //
  const shorthands = [
    'create',
    'get',
    'delete',
    //    'describe',
    'explain',
    'logs'
  ]
  await Promise.all(
    shorthands.map(verb => {
      return commandTree.listen(`/k8s/${verb}`, dispatchViaDelegationTo(kubectl), {
        usage: usage('kubectl'),
        requiresLocal: true,
        noAuthOk: ['openwhisk']
      })
    })
  )
}
