/*
 * Copyright 2018-19 IBM Corporation
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

import { Tab } from '@kui-shell/core/api/ui-lite'

import { KubeResource } from '../../model/resource'

/** makeButton is passed a subset of SidecarMode */
interface BaseInfo {
  mode: string
  label?: string
}

type Renderer = (resource: KubeResource) => KubeResource

interface Parameters {
  overrides: BaseInfo
}
export const renderButton = (mode: string) => (tab: Tab, resource: KubeResource) => {
  const { kind, metadata } = resource
  const namespace = metadata.namespace

  return `kubectl ${mode} ${kind} ${metadata.name} ${namespace ? '-n ' + namespace : ''}`
}

const makeButton = (overrides: BaseInfo) => ({
  mode: overrides.mode,
  label: overrides.label,
  command: renderButton(overrides.mode),
  kind: 'drilldown' as const,
  confirm: true
  // balloonLength: 'medium',
})

export default makeButton
