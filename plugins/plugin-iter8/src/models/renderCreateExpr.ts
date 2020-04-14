import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { renderForm } from '../modes/exprForm'
import { renderDecisionTab } from '../modes/decisionForm'

//Checks the correct command response
function verifyResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === "Experiment Creation";
}

//Model for Experiment Creation Form
const exprcreateMode: ModeRegistration<KubeResource> = {
	when: verifyResponse,
	mode: {
		mode: "Experiment Setup",
		content: renderForm,
	}
}
// Model for Decision Tab View
const decisionMode: ModeRegistration<KubeResource> = {
	when: verifyResponse,
	mode: {
		mode: "Decision",
		content: renderDecisionTab,
	},

}

export {
	exprcreateMode,
	decisionMode
}
