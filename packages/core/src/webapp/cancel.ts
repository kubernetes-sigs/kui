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
 * User has requested that we "cancel" whatever is currently happening.
 *
 * If there is nothing happening, then terminate the current prompt
 * and start a new one
 *
 * TODO cancel the actual command?
 *
 */

import eventBus from '../core/events'
import { Tab, getTabId } from './tab'
import { Block } from './models/block'
import { ExecType } from '../models/command'

export default function doCancel(tab: Tab, block: Block) {
  block.className = `${block.getAttribute('data-base-class')} cancelled`
  block.isCancelled = true

  const execUUID = block.getAttribute('data-uuid')
  const endEvent = { tab, execType: ExecType.TopLevel, cancelled: true, execUUID }
  eventBus.emit(`/command/complete/fromuser/${getTabId(tab)}`, endEvent)
}
