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

import { i18n, Tab, ModeRegistration } from '@kui-shell/core'

import { isPod, Pod } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * Extract the events
 *
 */
async function command(tab: Tab, pod: Pod, args: { argvNoOptions: string[] }) {
  const { getCommandFromArgs } = await import('../../util/util')
  return `${getCommandFromArgs(args)} get node ${pod.spec.nodeName} -o yaml`
}

/**
 * Add an Involved Object mode button
 *
 */
const mode: ModeRegistration<Pod> = {
  when: isPod,
  mode: {
    mode: 'show-node',
    kind: 'drilldown',
    showRelatedResource: true,
    label: strings('Show Node'),
    command
  }
}

export default mode
