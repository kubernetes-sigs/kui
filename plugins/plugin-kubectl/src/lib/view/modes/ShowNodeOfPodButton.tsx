/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { VirtualMachine16 as ShowNodeIcon } from '@carbon/icons-react'
import { i18n, Tab, ModeRegistration } from '@kui-shell/core'

import { isPod, Pod } from '../../model/resource'
import { getCommandFromArgs } from '../../../lib/util/util'

const strings = i18n('plugin-kubectl')

/**
 * Extract the events
 *
 */
function command(tab: Tab, pod: Pod, args: { argvNoOptions: string[] }) {
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
    order: 80, // we want this to appear before DeleteButton, but after others...
    label: strings('Show Node'),
    icon: <ShowNodeIcon />,
    command
  }
}

export default mode
