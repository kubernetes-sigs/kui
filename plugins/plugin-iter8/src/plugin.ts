import { Registrar } from '@kui-shell/core'
import { metricDeleteCommand } from './models/metrics'
import { printiter8about } from './modes/about'
import { getiter8config } from './modes/config'

// Registers a custom command
export default async (registrar: Registrar) => {
  registrar.listen('/iter8/create/experiment', () => ({
    kind: 'Command',
    metadata: { name: 'Experiment Creation' },
    modes: []
  }))

  registrar.listen('/iter8/metrics', () => ({
    kind: 'Command',
    metadata: { name: 'Metric Command', namespace: 'Use: kubectl get configmaps -n iter8' },
    modes: []
  }))

  const cmd = registrar.listen('/iter8/delete/metric', metricNames => metricDeleteCommand(metricNames))

  registrar.synonym('/iter8/delete/metrics', metricNames => metricDeleteCommand(metricNames), cmd)

  registrar.listen('/iter8/about', () => printiter8about)

  registrar.listen('/iter8/config', () => getiter8config())
}
