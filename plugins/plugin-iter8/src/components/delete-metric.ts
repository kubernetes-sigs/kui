import { safeLoad, safeDump } from 'js-yaml'
import { kubectlApplyRule } from './traffic-split'
import { MetricTypes } from '../modes/get-metrics'
import { RatioMetrics, CounterMetrics } from './metric-config-types'
import { getMetricConfig, removeExtraneousMetaData } from './metric-config'

export default function deleteMetric(metricName: string, type: MetricTypes): { success?: string } {
  try {
    const { configMap } = getMetricConfig()
    const newConfigMap = removeExtraneousMetaData(configMap)

    const counterMetrics = safeLoad(configMap['data']['counter_metrics.yaml']) as CounterMetrics
    const ratioMetrics = safeLoad(configMap['data']['ratio_metrics.yaml']) as RatioMetrics

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics.filter(counterMetric => counterMetric.name !== metricName))
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics.filter(ratioMetric => ratioMetric.name !== metricName))

    kubectlApplyRule(newConfigMap)

    return { success: metricName }
  } catch (err) {
    return {}
  }
}
