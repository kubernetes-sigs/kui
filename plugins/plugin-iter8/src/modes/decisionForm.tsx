import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
import { Form, FormGroup, InlineLoading, Button } from 'carbon-components-react'
import { Renew32 } from '@carbon/icons-react'
import Chart from 'react-apexcharts'
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import '../../src/web/scss/static/decisionForm.scss'
import { DecisionState } from '../components/get-iter8-req'
import GetAnalyticsAssessment from "../components/get-analytics-assessment"

export class DecisionBase extends React.Component<{}, DecisionState> {
  private winProbData = [];
  private winProbLabels = {};
  public constructor(props) {
    super(props)
    this.state = {
      exprCreated: false, // User has finished expr setup
      haveResults: false, //AJAX call has been successful
      exprReq: null,
      exprResult: null,
    }
    eventChannelUnsafe.on('/my/channel', (formstate) => { this.setState({exprCreated: true, exprReq: formstate}); });
  }
  //Makes an AJAX call to Iter8 API
  private refreshHandler = () => {
  	let AnalyticsAssess = new GetAnalyticsAssessment(this.state.exprReq);
  	AnalyticsAssess.getAnalyticsAssessment()
  		.then((result) => {let jsonrlts = JSON.parse(JSON.parse(result));
  		 				this.setState({haveResults: true, exprResult: jsonrlts});
  		 })
  		.catch((failure) => {console.log(failure);})
  }
  //Returns a string with winner information
  private getWinAnalysis(){
  	let assessment = this.state.exprResult.winner_assessment;
  	let prob = this.state.exprResult.winner_assessment.winning_probability*100;
  	return(assessment.current_winner + "is the winner with" + prob + "% of winning");
  }
  //Fill pie chart with version probabilities
  private getWinProbs(){
  	let dataLabels = []

  	let baseRlts = this.state.exprResult.baseline_assessment;
  	this.winProbData.push(baseRlts.win_probability*100);
  	dataLabels.push(baseRlts.id);

  	let candRlts = this.state.exprResult.candidate_assessments;
  	for(let i = 0; i < candRlts.length; i++){
  		this.winProbData.push(candRlts[i].win_probability*100);
  		dataLabels.push(candRlts[i].id);
  	}
  	this.winProbLabels = {labels: dataLabels}
  }
  public render() {
  	if(this.state.haveResults){
  		this.getWinProbs();
  	}
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
        {this.state.haveResults ? (
        	<div>
        	<FormGroup legendText="">
	        	<h3> {this.state.exprResult.winner_assessment.winning_version_found ?
	        			this.getWinAnalysis() : "No winners determined. Need more data..." } </h3>
        	</FormGroup>
        	<FormGroup legendText="Win Probabilities">
	        	<Chart
					type="pie"
					options={this.winProbLabels}
					series={this.winProbData}
					width="500"
				/>
			</FormGroup>
			</div>
        ) : null}
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
