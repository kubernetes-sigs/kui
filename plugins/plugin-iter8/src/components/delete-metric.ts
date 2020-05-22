import { safeDump } from 'js-yaml'
import { kubectlApplyRule } from './traffic-split'
import { MetricTypes } from '../modes/get-metrics'
import { getMetricConfig, removeExtraneousMetaData } from './metric-config'

export default function deleteMetric(metricName: string, type: MetricTypes): boolean {
  try {
    const { configMap, counterMetrics, ratioMetrics } = getMetricConfig()
    const newConfigMap = removeExtraneousMetaData(configMap)

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics.filter(counterMetric => counterMetric.name !== metricName))
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics.filter(ratioMetric => ratioMetric.name !== metricName))

    kubectlApplyRule(newConfigMap)

    return true
  } catch (err) {
    return false
  }
}
