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

import { i18n, Tab, Table, ModeRegistration } from '@kui-shell/core'

import toMap from './table-to-map'
import { fqnOf } from '../../../controller/kubectl/fqn'
import { KubeResource, ConfigMap, isConfigMap } from '../../model/resource'

const strings = i18n('plugin-kubectl')

export async function getDefaultSummaryMap(
  tab: Tab,
  resource: KubeResource,
  args: {
    argvNoOptions: string[]
  }
) {
  const { getCommandFromArgs } = await import('../../util/util')

  // a command that will fetch a single-row table
  const cmd = `${getCommandFromArgs(args)} get ${fqnOf(resource)} -o wide`

  // fetch the table model and the dump function from js-yaml
  return tab.REPL.qexec<Table>(cmd).then(toMap)
}

/**
 * Extract the events
 *
 */
async function content(tab: Tab, cm: ConfigMap, args: { argvNoOptions: string[] }) {
  const [map, { dump }] = await Promise.all([getDefaultSummaryMap(tab, cm, args), import('js-yaml')])

  if (cm.data) {
    delete map.Data

    try {
      for (const key in cm.data) {
        if (typeof cm.data[key] === 'string') {
          map[key] = cm.data[key]
        }
      }
    } catch (err) {
      console.error('error parsing configmap data', err)
    }
  }

  return {
    content: dump(map),
    contentType: 'yaml'
  }
}

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
const mode: ModeRegistration<ConfigMap> = {
  when: isConfigMap,
  mode: {
    mode: 'summary',
    label: strings('summary'),
    content,
    priority: 10 // override default Summary
  }
}

export default mode
