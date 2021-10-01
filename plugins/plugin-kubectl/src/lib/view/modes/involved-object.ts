/*
 * Copyright 2019 The Kubernetes Authors
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
import { hasInvolvedObject, KubeResourceWithInvolvedObject } from '../../model/resource'
import { getCommandFromArgs, getCurrentDefaultNamespace } from '../../..'

const strings = i18n('plugin-kubectl')

/**
 * Extract the events
 *
 */
async function command(
  tab: Tab,
  { involvedObject: { apiVersion, kind, name, namespace } }: KubeResourceWithInvolvedObject,
  args: { argvNoOptions: string[] }
) {
  return `${getCommandFromArgs(args)} get ${fqn(
    apiVersion,
    encodeComponent(kind),
    encodeComponent(name),
    encodeComponent(namespace || (await getCurrentDefaultNamespace(tab)))
  )} -o yaml`
}

/**
 * Add an Involved Object mode button
 *
 */
const mode: ModeRegistration<KubeResourceWithInvolvedObject> = {
  when: hasInvolvedObject,
  mode: {
    mode: 'involvedObject',
    label: strings('Show Involved Object'),
    showRelatedResource: true,
    command,
    kind: 'drilldown'
  }
}

export default mode
