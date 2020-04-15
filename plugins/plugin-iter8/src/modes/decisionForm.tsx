import * as React from 'react'
import { InlineLoading } from 'carbon-components-react'
import Chart from 'react-apexcharts'
import ExprBase from "./exprForm"
import 'carbon-components/scss/components/loading/_loading.scss'
import '../../src/web/scss/static/decisionForm.scss'
const options = {
	labels:['reviews-v1', 'reviews-v2', 'reviews-v3']
};
const series = [20, 55, 25];	//add to 100?

class DecisionBase extends React.Component<any, any> {
	
	public constructor(props){
		super(props);
		this.state = {
			exprCreated: false //User has finished expr setup
		}
		this.handleComponentData = this.handleComponentData.bind(this);
	}
	// Receive data from Experiment Creation Form
	private handleComponentData (formModel){
		console.log(formModel);
		if(formModel.ns !== '')
			this.setState({exprCreated: true});
	}
	public render(){
		<ExprBase handleData={this.handleComponentData}/>
		return(
			<div>
				<InlineLoading
					description={!this.state.exprCreated ?
						 "Waiting for Experiment Creation Completion...":"Experiment Created."}
					iconDescription="Active loading indicator"
					status="active"
					onSuccess={this.state.exprCreated}
				/>
				<Chart
					type="pie"
					options={options}
					series={series}
					width="500"
				/>
			</div>
		)
	}
}

export function renderDecisionTab(){
	return {
		react: () => <DecisionBase />
	}
}