import { ModeRegistration } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'
import { renderForm } from "./exprForm"
// Interface used by Custom Kubernetes Resource (Experiment)
interface ExprResource extends KubeResource {
  status: any;
}

/*
* Checks the correct command response 
*/
function verifyResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === "Experiment Creation";
}

/*
*	Renders the Form for the Sidecar
*/
async function renderView(){
	return renderForm();
}
/*
 * This is the model for the View rendering
 */
const exprcreateMode: ModeRegistration<KubeResource> = {
	when: verifyResponse,
	mode: {
		mode: "Experiment Setup",
		content: renderView,
	}
}

export default exprcreateMode;
