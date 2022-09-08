/*
 * Copyright 2021 The Kubernetes Authors
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

/* eslint-disable no-unmodified-loop-condition */

import Debug from 'debug'
import { encodeComponent, getTab, isTopLevelTab, TabState, registerTabState } from '@kui-shell/core'

const debug = Debug('plugins/plugin-kubectl/tab-state')

const name = 'plugins/plugin-kubectl'
const apiVersion = 'v1'

export function getTabState(tab: TabState, key: string) {
  try {
    return tab.getState(name, apiVersion, key)
  } catch (err) {
    return undefined
  }
}

function setTabState(tab: TabState, key: string, value: any) {
  tab.setState(name, apiVersion, key, value)
}

async function capture(tabState: TabState) {
  const tab = getTab(parseInt(tabState.uuid))
  if (tab) {
    try {
      const { getCurrentDefaultContextName, getCurrentDefaultNamespace } = await import('./controller/kubectl/contexts')

      const [currentContext, currentNamespace] = await Promise.all([
        getCurrentDefaultContextName(tab),
        getCurrentDefaultNamespace(tab)
      ])
      const context = getTabState(tabState, 'context')
      const namespace = getTabState(tabState, 'namespace')

      if (!context || currentContext !== context) {
        setTabState(tabState, 'context', currentContext)
      }

      if (!namespace || currentNamespace !== namespace) {
        setTabState(tabState, 'namespace', currentNamespace)
      }

      debug('captured tab state', tab.uuid, currentContext, currentNamespace)
    } catch (err) {
      if (!/command not found/.test(err)) {
        console.error(`plugin-kubectl: failed to capture tab-state`, err, tabState)
      }

      // clear state
      setTabState(tabState, 'context', '')
      setTabState(tabState, 'namespace', '')
    }
  }
}

async function restore(tabState: TabState) {
  const tab = getTab(parseInt(tabState.uuid))
  const namespace = getTabState(tabState, 'namespace')
  const context = getTabState(tabState, 'context')
  try {
    const { getCurrentDefaultContextName, getCurrentDefaultNamespace } = await import('./controller/kubectl/contexts')

    const [currentContext, currentNamespace] = await Promise.all([
      getCurrentDefaultContextName(tab),
      getCurrentDefaultNamespace(tab)
    ])

    if (currentContext !== context || currentNamespace !== namespace) {
      const kubectl = (await import('./controller/cli')).default

      await tab.REPL.qexec(`${kubectl} config set-context ${encodeComponent(context)} --namespace=${namespace}`)
      await tab.REPL.qexec(`${kubectl} config use-context ${encodeComponent(context)}`)
    }

    debug('restored tab state', tab.uuid, context, namespace)
  } catch (err) {
    if (!/command not found/.test(err)) {
      console.error(`plugin-kubectl: failed to restore tab-state`, err, tabState)
    }
  }
}

const switchTo = async (currentTabState: TabState, nextTabState: TabState) => {
  if (isTopLevelTab(currentTabState)) {
    try {
      await capture(currentTabState)
      await restore(nextTabState)
    } catch (err) {
      console.error(`plugin-kubectl: failed to switch tab`, err, currentTabState, nextTabState)
    }
  }
}

export default function () {
  return registerTabState({ name, apiVersion, capture, restore, switchTo })
}
