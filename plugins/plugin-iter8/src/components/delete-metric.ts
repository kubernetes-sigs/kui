import { safeLoad, safeDump } from 'js-yaml'
import { applyKube } from './traffic-split'
const execSync = require('child_process').execSync
import { iter8Metrics } from './metric-config'

export default function deleteMetric(metric, type = null) {
  let configmap = {}
  try {
    configmap = execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', {
      encoding: 'utf-8',
      stdio: 'pipe'
    })
  } catch (err) {
    configmap = { error: err }
  }
  if (!{}.hasOwnProperty.call(configmap, 'error')) {
    const rM = safeLoad(safeLoad(configmap)['data']['ratio_metrics.yaml'])
    const cM = safeLoad(safeLoad(configmap)['data']['counter_metrics.yaml'])
    const newconfigmap = {
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
    if (type === null) {
      for (let i = 0; i < cM.length; i++) {
        if (cM[i].name === metric) {
          type = 'counter'
          break
        }
      }
    }
    if (type === null) {
      type = 'ratio'
    }

    let deleted = ''
    if (type === 'counter') {
      for (let i = 0; i < cM.length; i++) {
        if (cM[i].name === metric) {
          deleted = cM[i].name
          cM.splice(i, 1)
          break
        }
      }
    } else {
      for (let i = 0; i < rM.length; i++) {
        if (rM[i].name === metric) {
          deleted = rM[i].name
          rM.splice(i, 1)
          break
        }
      }
    }
    newconfigmap.data['counter_metrics.yaml'] = safeDump(cM)
    newconfigmap.data['ratio_metrics.yaml'] = safeDump(rM)

    applyKube(newconfigmap)
    return { success: deleted }
  }
}
export function deleteMetricCommand(metrics) {
  let response = ''
  for (let i = 0; i < metrics.length; i++) {
    if (iter8Metrics.counter.includes(metrics[i]) || iter8Metrics.ratio.includes(metrics[i])) {
      response = response + '\n' + 'Cannot delete iter8 metric: ' + metrics[i]
    } else {
      if (deleteMetric(metrics[i]).success === metrics[i]) {
        response = response + '\n' + 'Deleted: ' + metrics[i]
      } else {
        response = response + '\n' + 'Could not delete: ' + metrics[i]
      }
    }
  }
  return response
}
