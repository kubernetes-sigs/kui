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

import { ModeRegistration, Tab } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { getMetricConfig } from '../components/metric-config'

async function getMetricsYaml(args) {
  const { dump } = await import('js-yaml')
  const [res] = await Promise.all([getMetricConfig(args)])
  delete res['originatingCommand']
  delete res['kuiRawData']
  delete res['isKubeResource']
  return dump(res)
}

function verifyMetricResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === 'Metric Command'
}

const metricListMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric List',
    content: (tab: Tab) => import('./MetricsUI').then(_ => _.default(tab))
  }
}

const metricYamlMode: ModeRegistration<KubeResource> = {
  when: verifyMetricResponse,
  mode: {
    mode: 'Metric Yaml',
    label: 'Config Map',
    content: getMetricsYaml,
    contentType: 'yaml'
  }
}

// function metricDeleteCommand(metricName) {
//   console.log(metricName)
//   return deleteMetrics(metricName.argv.splice(3), metricName)
// }

export { metricListMode, metricYamlMode }
