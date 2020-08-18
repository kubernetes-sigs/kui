import { Table } from '@kui-shell/core'
import { iter8ServiceStatus , getAnalyticsURL } from '../utility/iter8-svc-status'


export const getiter8config = (): Table => ({
  header: { name: 'Iter8 Service', attributes: [{ value: 'Available' }, { value: 'URL' }] },
  body: [
    { name: 'Iter8 Controller', attributes: [{ value: iter8ServiceStatus('iter8-controller') }, { value: 'None' }] },
    {
      name: 'Iter8 Analytics',
      attributes: [{ value: iter8ServiceStatus('iter8-analytics') }, { value: getAnalyticsURL() }]
    }
  ]
})
