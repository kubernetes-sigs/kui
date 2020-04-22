import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
import { Form, FormGroup, InlineLoading, Button } from 'carbon-components-react'
import { Renew32 } from '@carbon/icons-react'
// import Chart from 'react-apexcharts'
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import '../../src/web/scss/static/decisionForm.scss'
import { DecisionState } from '../components/get-iter8-req'
import GetAnalyticsAssessment from "../components/get-analytics-assessment"
// const options = {
// 	labels:['reviews-v1', 'reviews-v2', 'reviews-v3']
// };
// const series = [20, 55, 25];	//add to 100?
// <Chart
// 	type="pie"
// 	options={options}
// 	series={series}
// 	width="500"
// />
export class DecisionBase extends React.Component<{}, DecisionState> {
  public constructor(props) {
    super(props)
    this.state = {
      exprCreated: false, // User has finished expr setup
      exprReq: null,
      exprResult: null,
    }
    eventChannelUnsafe.on('/my/channel', (formstate) => { this.setState({exprCreated: true, exprReq: formstate}); });
  }
  private refreshHandler = () => {
  	let AnalyticsAssess = new GetAnalyticsAssessment(this.state.exprReq);
  	AnalyticsAssess.getAnalyticsAssessment()
  		.then((result) => {let jsonrlts = JSON.parse(result); this.setState({exprResult: jsonrlts})})
  		.catch((failure) => {console.log(failure);})
  }
  public render() {
  	// try{
  	// 	console.log("The state is a", typeof this.state.exprResult);
  	// 	console.log(this.state.exprResult["baseline_assessment"]);
  	// }catch{
  	// 	console.log("there is no state");
  	// }

    return (
      <Form style={{ display: 'block' }}>
      	<FormGroup legendText="">
	        <InlineLoading
	          description={
	            !this.state.exprCreated ? 'Waiting for Experiment Creation Completion...' : 'Experiment Created.'
	          }
	          iconDescription="Active loading indicator"
	          status={this.state.exprCreated ? "finished": "active"}
	          style={{ width: 350 }}
	        />
	        <Button
	        size="default"
	        kind="primary"
	        renderIcon={Renew32}
	        disabled={!this.state.exprCreated}
	        onClick={this.refreshHandler}
	        >
	          Refresh
	        </Button>
        </FormGroup>
        <FormGroup>
        	{this.state.exprResult}
        </FormGroup>
      </Form>
    )
  }
}

export function renderDecisionTab() {
  return {
    react: function renderComponent() {
      return <DecisionBase />
    }
  }
}
