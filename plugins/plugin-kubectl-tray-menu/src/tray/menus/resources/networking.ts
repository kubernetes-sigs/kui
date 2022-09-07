/*
 * Copyright 2022 The Kubernetes Authors
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

import { CreateWindowFunction } from '@kui-shell/core'
import openWindowWith from './open'

export default function networkingMenu(
  createWindow: CreateWindowFunction
): import('electron').MenuItemConstructorOptions {
  return {
    label: 'Networking',
    submenu: [
      { label: 'Services', click: openWindowWith(['kubectl', 'get', 'services'], createWindow) },
      { label: 'Routes', click: openWindowWith(['kubectl', 'get', 'routes'], createWindow) },
      { label: 'Ingresses', click: openWindowWith(['kubectl', 'get', 'ingresses'], createWindow) },
      { label: 'NetworkPolicies', click: openWindowWith(['kubectl', 'get', 'networkpolicyies'], createWindow) }
    ]
  }
}
