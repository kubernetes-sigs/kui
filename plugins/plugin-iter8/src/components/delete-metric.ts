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
import { safeDump } from 'js-yaml'
import { kubectlApplyRule } from './traffic-split'
import { MetricTypes } from '../modes/get-metrics'
import { getMetricConfig, removeExtraneousMetaData } from './metric-config'

export default function deleteMetric(metricName: string, type: MetricTypes): boolean {
  try {
    const { configMap, counterMetrics, ratioMetrics } = getMetricConfig()
    const newConfigMap = removeExtraneousMetaData(configMap)
    console.log(`Delteing metric: ${metricName} Type: ${type}`)
    newConfigMap.data['counter_metrics.yaml'] = safeDump(
      counterMetrics.filter(counterMetric => counterMetric.name !== metricName)
    )
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(
      ratioMetrics.filter(ratioMetric => ratioMetric.name !== metricName)
    )

    kubectlApplyRule(newConfigMap)

    return true
  } catch (err) {
    return false
  }
}
