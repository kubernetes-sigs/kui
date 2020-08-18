import { iter8ServiceStatus } from '../utility/iter8-svc-status'

export function getiter8config(): boolean {
  if (iter8ServiceStatus('iter8-controller') && iter8ServiceStatus('iter8-analytics')) {
    return true
  }
  return false
}
