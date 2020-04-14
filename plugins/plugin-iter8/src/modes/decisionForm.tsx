import * as React from 'react'
import { InlineLoading } from 'carbon-components-react'
import 'carbon-components/scss/components/loading/_loading.scss'
import '../../src/web/scss/static/decisionForm.scss'
class DecisionBase extends React.Component<any, any> {
	
	public constructor(props){
		super(props);
		this.state = {
			exprCreated: false //User has finished expr setup
		}
	}

	public render(){
		return(
			<InlineLoading
				description="Waiting for Experiment creation..."
				iconDescription="Active loading indicator"
				status="active"
				onSuccess={this.state.exprCreated}
			/>
		)
	}
}

export function renderDecisionTab(){
	return {
		react: () => <DecisionBase />
	}
}