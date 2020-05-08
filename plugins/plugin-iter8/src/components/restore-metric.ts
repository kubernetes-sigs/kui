import { safeLoad, safeDump } from 'js-yaml'
import { applyKube } from './traffic-split'
const execSync = require('child_process').execSync

export default function restoreMetric(metric, details, type) {
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
      data: {
        'counter_metrics.yaml': '',
        'ratio_metrics.yaml': ''
      }
    }
    let restored = ''
    if (type === 'counter') {
      restored = metric
      cM.push(details)
    } else {
      restored = metric
      rM.push(details)
    }
    newconfigmap.data['counter_metrics.yaml'] = safeDump(cM)
    newconfigmap.data['ratio_metrics.yaml'] = safeDump(rM)
    applyKube(newconfigmap)
    return { success: restored }
  }
}
