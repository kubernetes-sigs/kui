import { safeLoad, safeDump } from 'js-yaml'
import { applyKube } from './traffic-split'
import { MetricTypes } from '../modes/get-metrics'
import { RatioMetrics, CounterMetrics } from './metric-config-types'

const execSync = require('child_process').execSync

export default function deleteMetric(metricName: string, type: MetricTypes): { success?: string } {
  try {
    const configMap = safeLoad(execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', {
      encoding: 'utf-8',
      stdio: 'pipe'
    }))

    const newConfigMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: 'iter8config-metrics',
        namespace: 'iter8',
        annotations: {
          version: '1.0.0'
        }
      },
      data: {}
    }

    const counterMetrics = safeLoad(configMap['data']['counter_metrics.yaml']) as CounterMetrics
    const ratioMetrics = safeLoad(configMap['data']['ratio_metrics.yaml']) as RatioMetrics

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics.filter(counterMetric => counterMetric.name !== metricName))
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics.filter(ratioMetric => ratioMetric.name !== metricName))

    applyKube(newConfigMap)

    return { success: metricName }
  } catch (err) {
    return {}
  }
}
