import { Registrar } from '@kui-shell/core'

// Registers a custom command
export default async (registrar: Registrar) => {
  registrar.listen('/iter8/create/experiment', () => ({
    kind: 'Command',
    metadata: { name: 'Experiment Creation' },
    modes: []
  }))
}
