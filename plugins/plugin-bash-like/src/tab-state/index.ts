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
import { Capabilities, TabState, registerTabState, Util } from '@kui-shell/core'

import getTabState from './get'
import { apiVersion, name } from './key'

const debug = Debug('plugins/bash-like/tab-state')

function setTabState(tab: TabState, key: string, value: any) {
  tab.setState(name, apiVersion, key, value)
}

const capture = (tab: TabState) => {
  setTabState(tab, 'env', Object.assign({}, process.env))
  setTabState(tab, 'cwd', Util.cwd())

  debug('captured tab state', tab.uuid, getTabState(tab, 'cwd'))
}

const restore = (tab: TabState) => {
  const env = getTabState(tab, 'env')
  const cwd = getTabState(tab, 'cwd')
  debug('restoring state', tab.uuid, cwd)
  process.env = env
  if (cwd !== undefined) {
    if (Capabilities.inBrowser() || process.env.VIRTUAL_CWD) {
      debug('changing cwd', process.env.PWD, cwd)
      process.env.PWD = cwd
    } else {
      try {
        debug('changing cwd', cwd)
        process.chdir(cwd)
      } catch (err) {
        console.error(`Error in chdir, using fallback plan: ${Util.fallbackCWD(cwd)}`, err)
        try {
          process.chdir(Util.fallbackCWD(cwd))
        } catch (err) {
          // wow, things really are weird, then
          console.error(err)
          process.chdir(Util.fallbackCWD())
        }
      }
    }
  }
}

const switchTo = (currentTabState: TabState, nextTabState: TabState) => {
  capture(currentTabState)
  restore(nextTabState)
}

export default function () {
  return registerTabState({ name, apiVersion, capture, restore, switchTo })
}
