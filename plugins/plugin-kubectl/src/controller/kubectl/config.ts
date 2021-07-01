/*
 * Copyright 2020 The Kubernetes Authors
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

import { Arguments, eventBus, Tab, Registrar, eventChannelUnsafe } from '@kui-shell/core'

import flags from './flags'
import { doExecWithPty } from './exec'
import { KubeOptions, getNamespaceAsExpressed } from './options'
import { getCurrentContextName } from './contexts'

const kubectlConfigChangeChannel = '/kubectl/config/change'
type Change = 'NewContext' | 'AlteredContext'
type Handler = (type: 'SetNamespaceOrContext' | 'CreateOrDeleteNamespace', namespace?: string, context?: string) => void

const mutators = [
  'delete-cluster',
  'delete-context',
  'rename-context',
  'set',
  'set-cluster',
  'set-context',
  'set-credentials',
  'unset',
  'use-context'
]

export function emitKubectlConfigChangeEvent(
  type: 'SetNamespaceOrContext' | 'CreateOrDeleteNamespace',
  namespace?: string,
  context?: string,
  tab?: Tab
) {
  try {
    eventChannelUnsafe.emit(kubectlConfigChangeChannel, type, namespace, context, tab)
  } catch (err) {
    console.error('Error in onKubectlConfigChangeEvent handler', err)
  }
}

export function onKubectlConfigChangeEvents(handler: Handler) {
  eventChannelUnsafe.on(kubectlConfigChangeChannel, handler)
}

export function offKubectlConfigChangeEvents(handler: Handler) {
  eventChannelUnsafe.off(kubectlConfigChangeChannel, handler)
}

/**
 * Here, we conservatively broadcoast that the kubectl config *may*
 * have changed.
 *
 */
async function emitChangeEventIfNeeded(args: Arguments<KubeOptions>) {
  const idx = args.argvNoOptions.indexOf('config')
  const verb = args.argvNoOptions[idx + 1]
  const change =
    verb === 'set' || verb === 'use-context' || (verb === 'set-context' && !args.parsedOptions.current)
      ? 'NewContext'
      : verb === 'set-context' || verb === 'set-cluster' || verb === 'set-credentials' || verb === 'rename-context'
      ? 'AlteredContext'
      : undefined

  if (change) {
    const ns = getNamespaceAsExpressed(args) || (await args.tab.REPL.qexec('namespace current'))

    emitKubectlConfigChangeEvent(
      'SetNamespaceOrContext',
      ns,
      verb === 'use-context' ? args.argvNoOptions[idx + 2] : undefined,
      args.tab
    )
  }
}

/** Kui proxy-side handler; we just pass it through to the PTY, and then emit a config change event */
async function doConfig(args: Arguments<KubeOptions>) {
  args.command = args.command.replace(/_config/, 'config')
  args.argvNoOptions[1] = 'config'
  args.argv[1] = 'config'
  const response = await doExecWithPty(args)
  await emitChangeEventIfNeeded(args)
  return response
}

/** Kui client-side handler; we pass it through to the proxy-side handler, but also emit a config change event */
async function doConfigClient(cmd: string, verb: string, args: Arguments<KubeOptions>) {
  const command = args.command.replace(/config/, '_config')
  const response = await args.REPL.qexec(command)
  await emitChangeEventIfNeeded(args)
  return response
}

eventBus.onEnvUpdate('KUBECONFIG', async args => {
  const tab = args.tab
  const context = await getCurrentContextName(tab)
  const ns = await args.tab.REPL.qexec<string>('namespace current')
  emitKubectlConfigChangeEvent('SetNamespaceOrContext', ns, context, tab)
})

export function register(registrar: Registrar, cmd: string) {
  mutators.forEach(verb => {
    registrar.listen(`/${cmd}/_config/${verb}`, doConfig, Object.assign({}, flags, { requiresLocal: true }))
    registrar.listen(`/${cmd}/config/${verb}`, doConfigClient.bind(undefined, cmd, verb), flags)
  })
}

/**
 * Register the commands
 *
 */
export default (registrar: Registrar) => {
  register(registrar, 'kubectl')
  register(registrar, 'k')
}
