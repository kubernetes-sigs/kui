/*
 * Copyright 2019-2020 IBM Corporation
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
import { KubeResource, isSummarizableKubeResource, isKubeResourceWithItsOwnSummary } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * The content renderer for the summary tab
 *
 */
async function renderSummary(tab: Tab, resource: KubeResource) {
  if (isKubeResourceWithItsOwnSummary(resource)) {
    return resource.summary
  }

  // a command that will fetch a single-row table
  const cmd = `kubectl get ${resource.kind} ${resource.metadata.name} -n ${resource.metadata.namespace} -o wide`

  // in parallel, fetch the table model and the safeDump function from js-yaml
  const [map, { safeDump }] = await Promise.all([tab.REPL.qexec<Table>(cmd).then(toMap), import('js-yaml')])

  // our content is that map, rendered as yaml
  return {
    content: safeDump(map),
    contentType: 'yaml'
  }
}

/**
 * The Summary mode applies to all KubeResources, and uses
 * `renderContent` to render the view.
 *
 */
const summaryMode: ModeRegistration<KubeResource> = {
  when: isSummarizableKubeResource,
  mode: {
    mode: 'summary',
    label: strings('summary'),

    content: renderSummary,

    // traits:
    defaultMode: true, // we'd like this to be the default selected tab
    order: -999 // we want this to be placed as the first tab
  }
}

export default summaryMode
