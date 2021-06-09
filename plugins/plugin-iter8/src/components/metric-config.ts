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

import { MetricConfigMap, CounterMetrics, RatioMetrics } from './metric-config-types'

import { Arguments } from '@kui-shell/core'

// TODO: configmaps to camelCase
type MetricConfigData = { configmaps: string } | { error: any }
type ErrorData = {
  error: {
    message: any[]
    response: any
  }
}

// TODO: Make metric attributes data contain this data
export const ITER8_METRIC_NAMES = {
  counter: ['iter8_request_count', 'iter8_total_latency', 'iter8_error_count'],
  ratio: ['iter8_mean_latency', 'iter8_error_rate']
}

export async function getMetricConfig(args: Arguments) {
  return await args.REPL.qexec(`kubectl get configmaps -n iter8 iter8config-metrics -o yaml`)
}

// Only keep the name and namespace metadata fields in the config map
export function removeExtraneousMetaData(configMap: any): MetricConfigMap {
  const { name, namespace } = configMap.metadata

  const newConfigMap = { ...configMap }

  newConfigMap.metadata = { name, namespace }

  return newConfigMap
}

export class GetMetricConfig {
  private output: MetricConfigData
  private cmetrics
  private rmetrics

  public async getmetrics(args: Arguments) {
    return await args.REPL.qexec<MetricConfigMap>(`kubectl get configmaps -n iter8 iter8config-metrics -o yaml`)
  }

  public async getCounterMetrics(args: Arguments) {
    const res = (await args.REPL.qexec<MetricConfigMap>(`kubectl get configmaps -n iter8 iter8config-metrics -o json`))
      .data['counter_metrics.yaml']
    const { load } = await import('js-yaml')
    return load(res) as CounterMetrics
  }

  public async getRatioMetrics(args: Arguments) {
    const res = (await args.REPL.qexec<MetricConfigMap>(`kubectl get configmaps -n iter8 iter8config-metrics -o json`))
      .data['ratio_metrics.yaml']
    const { load } = await import('js-yaml')
    return load(res) as RatioMetrics
  }
}
