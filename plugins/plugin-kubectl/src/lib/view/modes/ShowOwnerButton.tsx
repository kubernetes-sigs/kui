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

import { i18n, encodeComponent, Tab, ModeRegistration } from '@kui-shell/core'

import { fqn } from '../../../controller/kubectl/fqn'
import { hasSingleOwnerReference, KubeResourceWithOwnerReferences } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * Extract the events
 *
 */
async function command(
  tab: Tab,
  {
    metadata: {
      namespace,
      ownerReferences: [{ apiVersion, kind, name }]
    }
  }: KubeResourceWithOwnerReferences,
  args: { argvNoOptions: string[] }
) {
  const { getCommandFromArgs } = await import('../../util/util')

  return `${getCommandFromArgs(args)} get ${fqn(
    apiVersion,
    encodeComponent(kind),
    encodeComponent(name),
    encodeComponent(namespace || 'default')
  )} -o yaml`
}

/**
 * Add an Involved Object mode button
 *
 */
const mode: ModeRegistration<KubeResourceWithOwnerReferences> = {
  when: hasSingleOwnerReference,
  mode: {
    mode: 'ownerReference',
    kind: 'drilldown',
    showRelatedResource: true,
    label: strings('Show Owner Reference'),
    command
  }
}

export default mode
