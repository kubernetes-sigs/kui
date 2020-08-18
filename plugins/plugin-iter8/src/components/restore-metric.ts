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
import { CounterMetric, RatioMetric } from './metric-config-types'
import { MetricTypes } from '../modes/get-metrics'
import { getMetricConfig, removeExtraneousMetaData } from './metric-config'

export default function restoreMetric(metric: CounterMetric | RatioMetric, type: MetricTypes): boolean {
  try {
    const { configMap, counterMetrics, ratioMetrics } = getMetricConfig()
    const newConfigMap = removeExtraneousMetaData(configMap)

    if (type === MetricTypes.counter) {
      counterMetrics.push(metric as CounterMetric)
    } else {
      ratioMetrics.push(metric as RatioMetric)
    }

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics)
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics)

    kubectlApplyRule(newConfigMap)

    return true
  } catch (err) {
    return false
  }
}
