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

import { Tab } from '@kui-shell/core'
import { KubeResource } from '../../model/resource'
import { fqnOf } from '../../../controller/kubectl/fqn'
import { getCommandFromArgs } from '../../../lib/util/util'

/** makeButton is passed a subset of SidecarMode */
interface BaseInfo {
  mode: string
  label?: string
  fontawesome?: string
  balloon?: string
}

export const renderButton = (mode: string) => (tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) =>
  `${getCommandFromArgs(args)} ${mode} ${fqnOf(resource)}`

const makeButton = (overrides: BaseInfo) => ({
  mode: overrides.mode,
  label: overrides.label,
  kind: 'drilldown' as const,
  command: renderButton(overrides.mode),
  confirm: true
})

export default makeButton
