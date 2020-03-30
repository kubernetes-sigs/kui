/*
 * Copyright 2018 IBM Corporation
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
import { i18n, Tab } from '@kui-shell/core'
import { TrashCan16 as DeleteIcon } from '@carbon/icons-react'

import { KubeResource, isCrudableKubeResource as when } from '../../model/resource'
import { fqnOf } from '../../../controller/kubectl/fqn'
import { getCommandFromArgs } from '../../../lib/util/util'

const strings = i18n('plugin-kubectl')

/** Formulate the delete command line */
function command(tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) {
  return `${getCommandFromArgs(args)} delete ${fqnOf(resource)}`
}

/** The Delete button mode */
const mode = {
  icon: <DeleteIcon />,
  mode: 'delete',
  order: 100, // delete button at the end
  label: strings('deleteResource'),
  kind: 'drilldown' as const,
  command,
  confirm: true
}

/** The DeleteButton mode registration: a `when` filter and a `mode` definition. */
export default {
  when,
  mode
}
