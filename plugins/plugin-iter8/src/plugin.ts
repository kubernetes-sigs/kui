import { Registrar } from '@kui-shell/core'
import { metricDeleteCommand } from './models/metrics'
// Registers a custom command
export default async (registrar: Registrar) => {
  registrar.listen('/create/exp', () => ({
    kind: 'Command',
    metadata: { name: 'Experiment Creation' },
    modes: []
  }))
  registrar.listen('/iter8/metrics', () => ({
    kind: 'Command',
    metadata: { name: 'Metric Command', namespace: 'Use: kubectl get configmaps -n iter8' },
    modes: []
  }))
  registrar.listen('/iter8/delete/metric', () => metricDeleteCommand)
}
