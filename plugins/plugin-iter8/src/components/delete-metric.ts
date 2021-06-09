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
import { dump, load } from 'js-yaml'
import { kubectlApplyRule } from './traffic-split'
import { MetricTypes } from '../modes/get-metrics'
import { Arguments } from '@kui-shell/core'
import { removeExtraneousMetaData } from './metric-config'
import { CounterMetrics, RatioMetrics } from './metric-config-types'

export default function deleteMetric(configMap: any, metricName: string, type: MetricTypes, args: Arguments): boolean {
  try {
    // const { configMap, counterMetrics, ratioMetrics } = getMetricConfig(args)
    const counterMetrics = load(configMap.data['counter_metrics.yaml']) as CounterMetrics
    const ratioMetrics = load(configMap.data['ratio_metrics.yaml']) as RatioMetrics
    const newConfigMap = removeExtraneousMetaData(configMap)
    console.log(`Deleting metric: ${metricName} Type: ${type}`)
    newConfigMap.data['counter_metrics.yaml'] = dump(
      counterMetrics.filter(counterMetric => counterMetric.name !== metricName)
    )
    newConfigMap.data['ratio_metrics.yaml'] = dump(ratioMetrics.filter(ratioMetric => ratioMetric.name !== metricName))

    kubectlApplyRule(newConfigMap, args)

    return true
  } catch (err) {
    return false
  }
}
