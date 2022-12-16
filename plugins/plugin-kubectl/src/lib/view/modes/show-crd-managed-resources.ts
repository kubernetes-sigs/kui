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

import { i18n, Tab, ModeRegistration, encodeComponent } from '@kui-shell/core'

import { fqn } from '../../../controller/kubectl/fqn'
import { CustomResourceDefinition, isCustomResourceDefinition } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * Extract the events
 *
 */
export async function command(tab: Tab, crd: CustomResourceDefinition, args: { argvNoOptions: string[] }) {
  const [{ getCommandFromArgs }, { getCurrentDefaultNamespace }] = await Promise.all([
    import('../../util/util'),
    import('../../../controller/kubectl/contexts')
  ])

  return `${getCommandFromArgs(args)} get ${fqn(
    crd.apiVersion,
    encodeComponent(crd.kind),
    encodeComponent(crd.metadata.name),
    encodeComponent(crd.metadata.namespace || (await getCurrentDefaultNamespace(tab)))
  )}`
}

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
const mode: ModeRegistration<CustomResourceDefinition> = {
  when: isCustomResourceDefinition,
  mode: {
    mode: 'show-crd-resources',
    label: strings('Show Resources'),
    command,
    kind: 'drilldown'
  }
}

export default mode
