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

import Debug from 'debug'

import { TabState, cwd as kuiCwd, registerTabState, inBrowser, expandHomeDir } from '@kui-shell/core'

const debug = Debug('plugins/bash-like/tab-state')

const name = 'plugins/plugin-bash-like'
const apiVersion = 'v1'

export function getTabState(tab: TabState, key: string) {
  return tab.getState(name, apiVersion, key)
}

function setTabState(tab: TabState, key: string, value: any) {
  tab.setState(name, apiVersion, key, value)
}

const capture = (tab: TabState) => {
  setTabState(tab, 'env', Object.assign({}, process.env))
  setTabState(tab, 'cwd', kuiCwd())

  debug('captured tab state', tab.uuid, getTabState(tab, 'cwd'))
}

const restore = (tab: TabState) => {
  const env = getTabState(tab, 'env')
  const _cwd = getTabState(tab, 'cwd')
  const cwd = _cwd === '~' ? expandHomeDir(_cwd) : _cwd

  debug('restoring state', tab.uuid, cwd)
  process.env = env
  if (cwd !== undefined) {
    if (inBrowser() || process.env.VIRTUAL_CWD) {
      debug('changing cwd', process.env.PWD, cwd)
      process.env.PWD = cwd
    } else {
      debug('changing cwd', process.cwd(), cwd)
      process.chdir(cwd)
    }
  }
}

const switchTo = (currentTabState: TabState, nextTabState: TabState) => {
  capture(currentTabState)
  restore(nextTabState)
}

export default function() {
  return registerTabState({ name, apiVersion, capture, restore, switchTo })
}
