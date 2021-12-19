/*
 * Copyright 2019 The Kubernetes Authors
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

import {
  Capabilities,
  Streamable,
  ExecType,
  CodedError,
  i18n,
  Table,
  RadioTable,
  Arguments,
  MixedResponse,
  KResponse
} from '@kui-shell/core'

import { doStatus } from './status'
import RawResponse from './response'
import KubeResource from '../../lib/model/resource'
import { KubeOptions } from './options'

import { FinalState } from '../../lib/model/states'
import { stringToTable, KubeTableResponse } from '../../lib/view/formatTable'

const strings = i18n('plugin-kubectl')

/** Optional argument prepartion */
export type Prepare<O extends KubeOptions> = (args: Arguments<O>) => string

/** No-op argument preparation */
export const NoPrepare = <O extends KubeOptions>(args: Arguments<O>) => args.command

/** Special case preparation for status */
export type PrepareForStatus<O extends KubeOptions> = (cmd: string, args: Arguments<O>) => string[] | Promise<string[]>

/** Standard status preparation */
function DefaultPrepareForStatus<O extends KubeOptions>(verb: string, args: Arguments<O>) {
  return args.argvNoOptions.slice(args.argvNoOptions.indexOf(verb) + 1)
}

/**
 * Execute the given command in the browser; this dispatches to
 * _kubectl, which runs on the proxy (for electron and headless, these
 * are the same machine).
 *
 */
export async function doExecWithoutPty<O extends KubeOptions>(
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare,
  exec = 'kubectl'
): Promise<RawResponse> {
  const raw = `_${exec}$1`
  const command = prepare(args)
    .replace(new RegExp(`^${exec}(\\s)?`), raw)
    .replace(/^k(\s)?/, raw)

  const dbl = new RegExp(`_${exec}(\\s)?`)
  const doubleCheck = dbl.test(command) ? command : `_${exec} ${command}`
  return args.REPL.qexec<RawResponse>(doubleCheck, undefined, undefined, args.execOptions).catch((err: CodedError) => {
    if (err.code === 500 || err.statusCode === 500) {
      err.code = err.statusCode = 500
    }
    throw err
  })
}

/**
 * Behaves as does `exec`, except that it projects out just the
 * `stdout` part -- thus ignoring the exit `code` and `stderr`.
 *
 */
export function doExecWithStdout<O extends KubeOptions>(
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare,
  exec?: string
): Promise<string> {
  return doExecWithoutPty(args, prepare, exec).then(_ => _.content.stdout)
}

/**
 * Do we see anything in the given command that indicates a PTY is
 * required? That is, versus a plain nodejs spawn/exec.
 *
 */
export function reallyNeedsPty({ argvNoOptions }: Pick<Arguments, 'argvNoOptions'>) {
  return argvNoOptions.includes('|') || argvNoOptions.includes('>') || argvNoOptions.includes('>>')
}

/**
 * Execute the given command using a pty
 *
 */
export async function doExecWithPty<
  Content = void,
  Response extends KResponse<Content> = KResponse<Content>,
  O extends KubeOptions = KubeOptions
>(args: Arguments<O>, prepare: Prepare<O> = NoPrepare, exec?: string): Promise<string | Response> {
  if (!reallyNeedsPty(args) && (Capabilities.isHeadless() || (!Capabilities.inBrowser() && args.execOptions.raw))) {
    return doExecWithStdout(args, prepare, exec)
  } else {
    //
    // For commands `kubectl (--help/-h)` and `k (--help/-h)`, render usage model;
    // Otherwise, execute the given command using a pty
    //
    const commandToPTY = args.command.replace(/^k(\s)/, 'kubectl$1')

    if (args.execOptions.onInit) {
      args.execOptions.quiet = true // don't ever emit anything on your own
      args.execOptions.replSilence = true // repl: same thing
      args.execOptions.echo = false // do not even echo "ok"
    }

    // let pty handle redirection
    args.execOptions.noCoreRedirect = true

    return args.REPL.qexec<string | Response>(
      `sendtopty ${commandToPTY}`,
      args.block,
      undefined,
      args.execOptions.onInit
        ? args.execOptions
        : Object.assign({}, args.execOptions, {
            rawResponse: true,
            quiet:
              args.execOptions.quiet === undefined
                ? args.execOptions.type === ExecType.TopLevel
                  ? false
                  : undefined
                : args.execOptions.quiet
          })
    ).catch((err: CodedError) => {
      if (err.code === 500 || err.statusCode === 500) {
        err.code = err.statusCode = 500
      }
      throw err
    })
  }
}

/**
 * Execute the given command using a pty, but return a string
 *
 */
export async function doExecWithStdoutViaPty<O extends KubeOptions = KubeOptions>(
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare
): Promise<string> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<string>(async (resolve, reject) => {
    let stdout = ''

    // a bit of plumbing: tell the PTY that we will be handling everything
    const myExecOptions = Object.assign({}, args.execOptions, {
      rethrowErrors: true, // we want to handle errors
      quiet: true, // don't ever emit anything on your own
      replSilence: true, // repl: same thing
      echo: false, // do not even echo "ok"

      // the PTY will call this when the PTY process is ready; in
      // return, we send it back a consumer of streaming output
      onInit: () => {
        return (chunk: Streamable) => {
          if (typeof chunk === 'string') {
            stdout += chunk
          }
        }
      }
    })

    const myArgs = Object.assign({}, args, { execOptions: myExecOptions })

    await doExecWithPty(myArgs, prepare).catch(err => {
      console.error(err)
      reject(err)
    })

    resolve(stdout)
  })
}

/**
 * Decide whether to use a pty or a raw exec.
 *
 */
export async function exec<O extends KubeOptions>(
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare,
  exec = 'kubectl'
): Promise<RawResponse> {
  if (reallyNeedsPty(args)) {
    return Promise.resolve({
      content: {
        code: 0,
        stdout: await doExecWithPty(args, prepare),
        stderr: undefined,
        wasSentToPty: true
      }
    })
  } else {
    return doExecWithoutPty(args, prepare, exec)
  }
}

/**
 * Behaves as does `exec`, except that it projects out just the
 * `stdout` part and parses it into a Table model.
 *
 */
export async function doExecWithTable<O extends KubeOptions>(
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare,
  command = 'kubectl',
  {
    usePty = false,
    nameColumn,
    verb,
    entityType
  }: { usePty?: boolean; nameColumn?: string; verb?: string; entityType?: string } = {}
): Promise<Table | MixedResponse> {
  const response = usePty
    ? { content: { stdout: await doExecWithStdoutViaPty(args, prepare), stderr: undefined } }
    : await doExecWithoutPty(args, prepare, command)

  const table = await stringToTable(
    response.content.stdout,
    response.content.stderr,
    args,
    command,
    verb,
    entityType,
    nameColumn
  )
  if (typeof table === 'string') {
    throw new Error(strings('Unable to parse table'))
  } else {
    return table
  }
}

/**
 * Execute a command, and then execute the status command which will
 * poll until the given FinalState is reached.
 *
 */
export const doExecWithStatus = <O extends KubeOptions>(
  verb: string,
  finalState: FinalState,
  command = 'kubectl',
  prepareForExec: Prepare<O> = NoPrepare,
  prepareForStatus: PrepareForStatus<O> = DefaultPrepareForStatus
) => async (args: Arguments<O>): Promise<KubeTableResponse> => {
  const response = await exec<O>(args, prepareForExec, command)

  if (response.content.code !== 0) {
    const err: CodedError = new Error(response.content.stderr)
    err.code = response.content.code
    throw err
  } else if (Capabilities.isHeadless()) {
    return response.content.stdout
  } else {
    const statusArgs = await prepareForStatus(verb, args)
    const initialResponse = response ? response.content.stdout : ''

    return doStatus(args, verb, command, initialResponse, finalState, statusArgs)
  }
}

export async function doExecWithRadioTable<Resource extends KubeResource>(
  resources: Resource[],
  defaultSelectedIdx: number,
  onSelect: (name: string, resource: Resource) => string,
  { title = resources.length === 0 ? undefined : resources[0].kind, nameColumnTitle = 'NAME' } = {}
): Promise<RadioTable | void> {
  if (resources.length > 0) {
    return {
      apiVersion: 'kui-shell/v1',
      kind: 'RadioTable',
      title,
      defaultSelectedIdx,

      header: {
        cells: [nameColumnTitle]
      },
      body: resources.map(resource => {
        const name = resource.metadata.name
        return {
          nameIdx: 0,
          cells: [name],
          onSelect: onSelect(name, resource)
        }
      })
    }
  }
}

export default exec
