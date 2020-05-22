import { safeLoad, safeDump } from 'js-yaml'
import { applyKube } from './traffic-split'
import { CounterMetric, RatioMetric, CounterMetrics, RatioMetrics } from './metric-config-types'
import { MetricTypes } from '../modes/get-metrics'

const execSync = require('child_process').execSync

export default function restoreMetric(metric: CounterMetric | RatioMetric, type: MetricTypes): { success?: string } {
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

    if (type === MetricTypes.counter) {
      counterMetrics.push(metric as CounterMetric)
    } else {
      ratioMetrics.push(metric as RatioMetric)
    }

    newConfigMap.data['counter_metrics.yaml'] = safeDump(counterMetrics)
    newConfigMap.data['ratio_metrics.yaml'] = safeDump(ratioMetrics)

    applyKube(newConfigMap)

    return { success: metric.name }
  } catch (err) {
    return {}
  }
}
