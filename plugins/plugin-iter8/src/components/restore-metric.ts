import { safeLoad, safeDump } from 'js-yaml'
import { kubectlApplyRule } from './traffic-split'
import { CounterMetric, RatioMetric, CounterMetrics, RatioMetrics } from './metric-config-types'
import { MetricTypes } from '../modes/get-metrics'
import { getMetricConfig, removeExtraneousMetaData } from './metric-config'

export default function restoreMetric(metric: CounterMetric | RatioMetric, type: MetricTypes): { success?: string } {
  try {
    const { configMap } = getMetricConfig()
    const newConfigMap = removeExtraneousMetaData(configMap)

    const counterMetrics = safeLoad(configMap['data']['counter_metrics.yaml']) as CounterMetrics
    const ratioMetrics = safeLoad(configMap['data']['ratio_metrics.yaml']) as RatioMetrics

    if (type === MetricTypes.counter) {
      counterMetrics.push(metric as CounterMetric)
    } else {
      ratioMetrics.push(metric as RatioMetric)
    }

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics)
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics)

    kubectlApplyRule(newConfigMap)

    return { success: metric.name }
  } catch (err) {
    return {}
  }
}
