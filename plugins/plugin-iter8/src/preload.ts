import { PreloadRegistrar } from "@kui-shell/core"
import { exprcreateMode, decisionMode } from './models/renderCreateExpr'

export default async (registrar: PreloadRegistrar) => {
	await registrar.registerModes(
		exprcreateMode,
		decisionMode
		)
}