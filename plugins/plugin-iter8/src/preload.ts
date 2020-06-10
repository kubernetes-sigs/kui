import { PreloadRegistrar } from '@kui-shell/core'
import { exprcreateMode, decisionMode } from './models/renderCreateExpr'
import { metricListMode, metricYamlMode } from './models/metrics'

export default async (registrar: PreloadRegistrar) => {
  await registrar.registerModes(exprcreateMode, decisionMode, metricListMode, metricYamlMode)
}
