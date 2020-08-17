import { safeLoad } from 'js-yaml'

import { MetricConfigMap, CounterMetrics, RatioMetrics } from './metric-config-types'

import { execSync } from 'child_process'

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

export function getMetricConfig(): {
  configMap: MetricConfigMap
  counterMetrics: CounterMetrics
  ratioMetrics: RatioMetrics
} {
  try {
    const configMap = safeLoad(
      execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', {
        encoding: 'utf-8',
        stdio: 'pipe'
      })
    ) as MetricConfigMap

    return {
      configMap,
      counterMetrics: safeLoad(configMap.data['counter_metrics.yaml']),
      ratioMetrics: safeLoad(configMap.data['ratio_metrics.yaml'])
    }
  } catch (e) {
    throw new Error('Could not obtain config map.')
  }
}

// Only keep the name and namespace metadata fields in the config map
export function removeExtraneousMetaData(configMap: MetricConfigMap): MetricConfigMap {
  const { name, namespace } = configMap.metadata

  const newConfigMap = { ...configMap }

  newConfigMap.metadata = { name, namespace }

  return newConfigMap
}

export class GetMetricConfig {
  private output: MetricConfigData

  public constructor() {
    try {
      this.output = {
        configmaps: execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', {
          encoding: 'utf-8',
          stdio: 'pipe'
        })
      }
    } catch (err) {
      this.output = { error: err }
    }
  }

  public errorResponse(): ErrorData {
    if ({}.hasOwnProperty.call(this.output['error'], 'stderr')) {
      return {
        error: {
          message: [this.output['error']['stderr']],
          response: this.output['error']
        }
      }
    } else {
      return {
        error: {
          message: ['An error occured while trying to find available metrics'],
          response: this.output['error']
        }
      }
    }
  }

  public getMetricsConfigMap(): string | ErrorData {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    return this.output['configmaps']
  }

  public getCounterMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    // TODO: This seems inefficient, to YAML parse twice whenever you need this
    return safeLoad(safeLoad(this.output['configmaps'])['data']['counter_metrics.yaml'])
  }

  public getRatioMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    // TODO: This seems inefficient, to YAML parse twice whenever you need this
    return safeLoad(safeLoad(this.output['configmaps'])['data']['ratio_metrics.yaml'])
  }

  // Return list of names of counter and ratio metrics in the config map
  public getMetricList(): { counter: string[]; ratio: string[] } | ErrorData {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }

    const counterMetrics = safeLoad(
      safeLoad(this.output['configmaps'])['data']['counter_metrics.yaml']
    ) as CounterMetrics
    const ratioMetrics = safeLoad(safeLoad(this.output['configmaps'])['data']['ratio_metrics.yaml']) as RatioMetrics

    return {
      counter: counterMetrics.map(metric => metric['name']),
      ratio: ratioMetrics.map(metric => metric['name'])
    }
  }
}
