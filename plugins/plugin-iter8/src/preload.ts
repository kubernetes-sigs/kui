import { PreloadRegistrar } from "@kui-shell/core"
import exprcreateMode from './modes/exprSetup'
export default async (registrar: PreloadRegistrar) => {
	await registrar.registerModes(
		exprcreateMode
		)
}
