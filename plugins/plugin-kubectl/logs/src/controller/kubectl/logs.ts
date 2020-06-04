/*
 * Copyright 2019-2020 IBM Corporation
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

import { Arguments, CodedError, ExecType, MultiModalResponse, Registrar, flatten, i18n } from '@kui-shell/core'
import {
  isUsage,
  doHelp,
  KubeOptions,
  doExecWithPty,
  doExecWithStdout,
  defaultFlags as flags,
  getLabel,
  getTransformer,
  getCommandFromArgs,
  getContainer,
  getNamespace,
  KubeItems,
  isKubeItems,
  isKubeItemsOfKind,
  KubeResource,
  Pod,
  isPod
} from '@kui-shell/plugin-kubectl'

import commandPrefix from '../command-prefix'

const strings = i18n('plugin-kubectl', 'logs')

interface LogOptions extends KubeOptions {
  f: string
  follow: string
  previous: boolean
  tail: number
}

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
      return doExecWithStdout(args)
    }

    if (args.execOptions.type === ExecType.TopLevel) {
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
          return doExecWithStdout(args)
        }
      }

      const label = getLabel(args)

      if (!label) {
        const idx = args.argvNoOptions.indexOf(verb)
        const name = args.argvNoOptions[idx + 1]
        return args.REPL.qexec(`${cmd} get pod ${name} -n ${await getNamespace(args)} -o yaml`)
      } else {
        return args.REPL.qexec(`${cmd} get pod -l ${label} -n ${await getNamespace(args)} -o json`)
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
  response: Pod
): Promise<MultiModalResponse> {
  return Object.assign({}, await getTransformer(args, response), { defaultMode, argsForMode: args })
}

/** Multiple-resource response. We've already assured that we have >= 1 item via isKubeItemsOfKind(). */
async function transformMulti(defaultMode: string, args: Arguments<KubeOptions>, response: KubeItems<Pod>) {
  const containers = flatten(
    response.items.map(pod => {
      return pod.spec.containers.map(container =>
        Object.assign({}, container, { name: `${pod.metadata.name}:${container.name}` })
      )
    })
  )

  const container = getContainer(args, 'logs')
  const owningPod = container && response.items.find(pod => pod.spec.containers.find(_ => _.name === container))
  const owningPodName = owningPod ? owningPod.metadata.name : undefined

  response.items[0].isSimulacrum = true
  response.items[0].spec.containers = containers

  const names = response.items.map(_ => _.metadata.name).join(', ')
  response.items[0].metadata.name = names

  const multi = await transformSingle(defaultMode, args, response.items[0])

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
  return async (args: Arguments<KubeOptions>, response: KubeResource | KubeItems<Pod>) => {
    if (isKubeItemsOfKind(response, isPod)) {
      return transformMulti(defaultMode, args, response)
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

export const doLogs = getOrPty('logs')
export const logsFlags = Object.assign({}, flags, { viewTransformer: viewTransformer('logs') })

export const doExec = getOrPty('exec')
export const execFlags = Object.assign({}, flags, { viewTransformer: viewTransformer('terminal') })

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/kubectl/logs`, doLogs, logsFlags)
  registrar.listen(`/${commandPrefix}/k/logs`, doLogs, logsFlags)

  registrar.listen(`/${commandPrefix}/kubectl/exec`, doExec, execFlags)
  registrar.listen(`/${commandPrefix}/k/exec`, doExec, execFlags)
}
