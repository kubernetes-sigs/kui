import { PreloadRegistrar } from "@kui-shell/core"
import exprcreateMode from './models/exprSetup'
export default async (registrar: PreloadRegistrar) => {
	await registrar.registerModes(
		exprcreateMode
		)
}