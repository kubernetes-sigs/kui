import { execSync } from 'child_process'

export function iter8ServiceStatus(svc) {
  const svcStr = execSync(`kubectl get svc -n iter8 -o jsonpath='{.items[*].metadata.name}'`, {
    encoding: 'utf-8'
  })
  const s = svcStr.split(' ')
  if (s.includes(svc)) {
    return `Available`
  } else {
    return `Unavailable`
  }
}

export function getAnalyticsURL() {
  let url = process.env.ITER8_ANALYTICS_URL
  if (url === undefined) {
    url = 'http://0.0.0.0:8080/'
  }
  return url
}
