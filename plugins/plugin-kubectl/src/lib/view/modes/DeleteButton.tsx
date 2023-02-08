/*
 * Copyright 2018 The Kubernetes Authors
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

import React from 'react'
import { i18n, Tab, ParsedOptions, ModeRegistration } from '@kui-shell/core'
import { KubeResource, isCrudableKubeResource as when } from '@kui-shell/plugin-kubectl-core'

import Icons from '@kui-shell/plugin-client-common/mdist/components/spi/Icons'

const strings = i18n('plugin-kubectl')

/** Formulate the delete command line */
async function command(
  tab: Tab,
  resource: KubeResource,
  args: { argvNoOptions: string[]; parsedOptions: ParsedOptions }
) {
  const [{ fqnOf }, { getCommandFromArgs }, { withKubeconfigFrom }] = await Promise.all([
    import('../../../controller/kubectl/fqn'),
    import('../../util/util'),
    import('../../../controller/kubectl/options')
  ])
  return withKubeconfigFrom(args, `${getCommandFromArgs(args)} delete ${fqnOf(resource)}`)
}

/** The Delete button mode */
const mode = {
  icon: <Icons icon="Trash" />,
  mode: 'delete',
  order: 100, // delete button at the end; see ShowOwnersButton, which also has an `order` constraint
  label: strings('deleteResource'),
  kind: 'drilldown' as const,
  command,
  confirm: true
}

/** The DeleteButton mode registration: a `when` filter and a `mode` definition. */
const reg: ModeRegistration<KubeResource> = {
  when,
  mode
}

export default reg
