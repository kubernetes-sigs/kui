/*
 * Copyright 2019 IBM Corporation
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

import { Tab } from '../../webapp/tab'
import { MetadataBearing } from '../entity'
import { MultiModalResponse, Button } from './types'
import { SidecarMode } from '../../webapp/bottom-stripe'

export function formatButton<T extends MetadataBearing>(
  tab: Tab,
  resource: T,
  { mode, label, command, confirm, kind }: Button
): SidecarMode {
  const cmd = typeof command === 'string' ? command : command(tab, resource)

  return {
    mode,
    label,
    flush: 'right',
    actAsButton: true,
    direct: confirm ? `confirm "${cmd}"` : cmd,
    execOptions: {
      exec: kind === 'view' || confirm ? 'qexec' : 'pexec'
    }
  }
}

export function formatButtons(tab: Tab, mmr: MultiModalResponse, buttons: Button[]): SidecarMode[] {
  return buttons.map(button => formatButton(tab, mmr, button))
}
