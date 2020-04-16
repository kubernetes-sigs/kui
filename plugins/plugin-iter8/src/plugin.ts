import { Registrar } from '@kui-shell/core'

// Registers a custom command
export default async (registrar: Registrar) => {
  registrar.listen('/create/exp', () => ({
    kind: 'Command',
    metadata: { name: 'Experiment Creation' },
    modes: []
  }))
}
