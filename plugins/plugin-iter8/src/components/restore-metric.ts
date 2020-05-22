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
