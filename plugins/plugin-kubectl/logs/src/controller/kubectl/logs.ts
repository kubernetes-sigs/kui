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

import { Arguments, CodedError, ExecType, MultiModalResponse, Registrar, i18n, Util } from '@kui-shell/core'
import {
  isUsage,
  doHelp,
  KubeOptions,
  doExecWithPty,
  doExecWithStdout,
  defaultFlags,
  flags,
  getLabel,
  getAsMMRTransformer as getTransformer,
  getCommandFromArgs,
  getContainer,
  KubeItems,
  isKubeItems,
  isKubeItemsOfKind,
  KubePartial,
  isPodList,
  KubeResource,
  withKubeconfigFrom,
  Pod,
  PodStatus,
  isPod
} from '@kui-shell/plugin-kubectl'

const strings = i18n('plugin-kubectl', 'logs')

interface LogOptions extends KubeOptions {
  // f: boolean
  follow: boolean
  p: boolean
  previous: boolean
  tail: number
}

/** for command registration, which of those options is a boolean? */
const booleans = ['p', 'previous', 'f', 'follow']

/**
 * Send the request to a PTY for deeper handling, then (possibly) add
 * some ANSI control codes for coloring.
 *
 */
function getOrPty(verb: string) {
  return async (args: Arguments<LogOptions>) => {
    const cmd = getCommandFromArgs(args)

    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(cmd === 'k' ? 'kubectl' : cmd, args)
    }

    if (args.execOptions.raw) {
      return doExecWithStdout(args, undefined, cmd)
    }

    const label = getLabel(args)
    const idx = args.argvNoOptions.indexOf(verb)
    const name = args.argvNoOptions[idx + 1]

    if (args.execOptions.type !== ExecType.Nested && !/\|>/.test(args.command) && (label || !/\//.test(name))) {
      // the !/\//.test(name) means: we want to use a pty if the user
      // is doing e.g. `k logs deploy/hello`; we look for a slash in
      // the name to indicate that the user is doing a more bulk query
      // across a deployment
      if (verb === 'exec') {
        // special case for kubectl exec cat, ls, pwd, etc.
        const idx = args.argvNoOptions.indexOf('exec')
        const execThis = args.argvNoOptions[idx + 2]
        if (
          execThis === 'cat' ||
          execThis === 'ls' ||
          execThis === 'pwd' ||
          execThis === 'mv' ||
          execThis === 'cp' ||
          execThis === 'ln'
        ) {
          return doExecWithStdout(args, undefined, cmd)
        }
      }

      if (!label) {
        if (!name) {
          return doExecWithStdout(args, undefined, cmd)
        } else {
          const getPodCmd = withKubeconfigFrom(args, `${cmd} get pod ${name} -o yaml`)
          return args.REPL.qexec(getPodCmd, undefined, undefined, {
            tab: args.tab
          })
        }
      } else {
        const getPodCmd = withKubeconfigFrom(args, `${cmd} get pod -l ${label} -o json`)
        return args.REPL.qexec(getPodCmd, undefined, undefined, { tab: args.tab })
      }
    } else {
      return doExecWithPty(args)
    }
  }
}

/** Single-resource response */
async function transformSingle(
  defaultMode: string,
  args: Arguments<KubeOptions>,
  response: KubePartial<PodStatus, Pod>
): Promise<MultiModalResponse> {
  return Object.assign({}, await getTransformer(args, Object.assign({ apiVersion: 'v1', kind: 'Pod' }, response)), {
    defaultMode,
    argsForMode: args
  })
}

/** Multiple-resource response. We've already assured that we have >= 1 item via isKubeItemsOfKind(). */
async function transformMulti(defaultMode: string, args: Arguments<KubeOptions>, items: KubePartial<PodStatus, Pod>[]) {
  const containers = Util.flatten(
    items.map(pod => {
      return pod.spec.containers.map(container =>
        Object.assign({}, container, { name: `${pod.metadata.name}:${container.name}` })
      )
    })
  )

  const container = getContainer(args, 'logs')
  const owningPod = container && items.find(pod => pod.spec.containers.find(_ => _.name === container))
  const owningPodName = owningPod ? owningPod.metadata.name : undefined

  items[0].isSimulacrum = true
  items[0].spec.containers = containers

  const names = items.map(_ => _.metadata.name).join(', ')
  items[0].metadata.name = names

  const multi = await transformSingle(defaultMode, args, items[0])

  if (owningPodName) {
    const encoded = `${owningPodName}:${container}`
    multi.argsForMode.parsedOptions.c = multi.argsForMode.parsedOptions.container = encoded
  } else if (container) {
    // couldn't find a pod for the given container
    const error: CodedError = new Error('Specified container not found')
    error.code = 404
    throw error
  }

  return multi
}

/** Pod -> MultiModalResponse view transformer */
function viewTransformer(defaultMode: string) {
  return async (args: Arguments<KubeOptions>, response: KubeResource | KubeItems<PodStatus, Pod>) => {
    if (isPodList(response)) {
      return transformMulti(defaultMode, args, response.items)
    } else if (isKubeItemsOfKind(response, isPod)) {
      return transformMulti(defaultMode, args, response.items)
    } else if (isKubeItems(response)) {
      // otherwise, we have an empty list of items
      const error: CodedError = new Error(strings('No matching pods'))
      error.code = 404
      throw error
    }

    if (isPod(response)) {
      return transformSingle(defaultMode, args, response)
    }
  }
}

const doLogs = getOrPty('logs')
const logsFlags = Object.assign({}, flags(booleans), { viewTransformer: viewTransformer('logs') })

const doExec = getOrPty('exec')
const execFlags = Object.assign({}, defaultFlags, { viewTransformer: viewTransformer('terminal') })

export function registerLogs(registrar: Registrar, cmd: string) {
  registrar.listen(`/${cmd}/logs`, doLogs, logsFlags)
}

export function registerExec(registrar: Registrar, cmd: string) {
  registrar.listen(`/${cmd}/exec`, doExec, execFlags)
}

export default (registrar: Registrar) => {
  ;['kubectl', 'k'].forEach(cmd => {
    registerLogs(registrar, cmd)
    registerExec(registrar, cmd)
  })
}
