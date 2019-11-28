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
import { Button, isViewButton } from './types'

function getCommand<T extends MetadataBearing>(tab: Tab, resource: T, button: Button<T>) {
  if (isViewButton(button)) {
    return button.command
  } else {
    const cmd = typeof button.command === 'string' ? button.command : button.command(tab, resource)
    if (button.confirm) {
      return `confirm "${cmd}"`
    } else {
      return cmd
    }
  }
}

export function onclick<T extends MetadataBearing>(tab: Tab, resource: T, button: Button<T>) {
  const cmd = getCommand(tab, resource, button)

  if (typeof cmd === 'string') {
    if (isViewButton(button) || button.confirm) {
      return tab.REPL.qexec(cmd, undefined, undefined, { rethrowErrors: true })
    } else {
      return tab.REPL.pexec(cmd)
    }
  } else {
    cmd(tab, resource)
  }
}
