import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
import { Form, FormGroup, InlineLoading, Button, Slider, Dropdown, DataTable } from 'carbon-components-react'
import { Renew32 } from '@carbon/icons-react'
import Chart from 'react-apexcharts'
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/slider/_slider.scss'
import 'carbon-components/scss/components/dropdown/_dropdown.scss'
import '../../src/web/scss/static/decisionForm.scss'
import { DecisionState, RequestModel } from '../components/get-iter8-req'
import GetAnalyticsAssessment from "../components/get-analytics-assessment"

//sample values for testing purposes
const sampleHeaders=[
    {
    	header: 'Version',
    	key: 'version'
    },
    {
    	header: 'Mean Latency',
    	key: 'mean_latency'
    },
    {
    	header: "Total Error",
    	key: 'tot_error'
    }
]

const sampleRows = [
    {
    	id: 0,
    	version: "reviews-v2",
    	mean_latency: 15,
    	tot_error: 20,
    },
    {
    	id: 1,
    	version: "reviews-v2",
    	mean_latency: 15,
    	tot_error: 20,
    }
  ]
export class DecisionBase extends React.Component<{}, DecisionState> {
  // For displaying Pie Chart
  private winProbData = [];
  private winProbLabels = {};
  // For displaying Traffic Suggestion Section
  private algoList = [];
  private trafficRecs = [];
  public constructor(props) {
    super(props)
    this.state = {
      selectedAlgo: '',
      exprCreated: false, // User has finished expr setup
      haveResults: false, // First AJAX call has been successful
      exprReq: null,
      exprResult: null,
    }
    eventChannelUnsafe.on('/my/channel', (formstate) => { this.setState({exprCreated: true, exprReq: formstate}); });
  }
  //Makes an AJAX call to Iter8 API
  private refreshHandler = () => {
  	if(!this.state.haveResults){
	  	let AnalyticsAssess = new GetAnalyticsAssessment(this.state.exprReq);
	  	AnalyticsAssess.getAnalyticsAssessment()
	  		.then((result) => {let jsonrlts = JSON.parse(JSON.parse(result));
	  		 				this.setState({haveResults: true, exprResult: jsonrlts});
	  		 })
	  		.catch((failure) => {console.log(failure);})
  	}else{
  		// Update the request model to have last_state
  		let apiModels = new RequestModel();
  		let updatedReq = apiModels.updateLastState(this.state.exprResult, this.state.exprReq);
  		// Make API request using 
  		let AnalyticsAssess = new GetAnalyticsAssessment(updatedReq);
	  	AnalyticsAssess.getAnalyticsAssessment()
	  		.then((result) => {let jsonrlts = JSON.parse(JSON.parse(result));
	  		 					this.setState({exprResult: jsonrlts});
	  		 })
	  		.catch((failure) => {console.log(failure);})  		
  		}

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
  // Get the list of algorithms available
  private getAlgo(){
  	let trafficRecs = this.state.exprResult.traffic_split_recommendation;
  	let algoName = ''
  	let tempAlgoList = []
  	//Iterate through the traffic recommendations
  	Object.getOwnPropertyNames(trafficRecs).forEach(key => {
	  if(key === 'unif'){
	  	algoName = "Uniform Split"
	  }
	  	
	  tempAlgoList.push({
	  	id: key,
	  	text: algoName
	  });
	});
	this.algoList = tempAlgoList;
  }
  //Fill display with traffic rec suggestions
  private getTrafficRecs(algorithm){
	let trafficRecs = this.state.exprResult.traffic_split_recommendation;
  	let algoRecs = {};
  	let recList = [];
  	Object.getOwnPropertyNames(trafficRecs).forEach(key => {
  		if(key === algorithm)
  			algoRecs = trafficRecs[key];
  	});
  	Object.getOwnPropertyNames(algoRecs).forEach(key => {
  		recList.push({
  			version: key,
  			split: algoRecs[key]
  		});
  	});
  	this.trafficRecs = recList;
  }
  private handleAlgoChange = (value) => {
  	this.setState({selectedAlgo: value.id});
  	this.getTrafficRecs(value.id);
  }
  public render() {
  	if(this.state.haveResults){
  		this.getWinProbs();
  		this.getAlgo();
  		// Fills the arrays with an inital value
  		if(this.state.selectedAlgo === ''){
			//Assumes algorithm list is not empty
	  		this.setState({selectedAlgo: this.algoList[0].id});
	  		this.getTrafficRecs(this.algoList[0].id);
  		}
  	}
    return (
      <Form className="formProps" style={{ display: 'block' }}>
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
        <FormGroup legendText="Metric Summary">
        	<DataTable
        		headers={sampleHeaders}
        		rows={sampleRows}
			/>
        </FormGroup>
        {this.state.haveResults ? (
        	<div>
        	<FormGroup legendText="">
	        	<h3> {this.state.exprResult.winner_assessment.winning_version_found ? 
	        			this.getWinAnalysis() : "No winners determined. Need more data..." } </h3>
        	</FormGroup>
        	<FormGroup legendText="Win Probabilities" className="formGroupProps">
	        	<Chart
					type="pie"
					options={this.winProbLabels}
					series={this.winProbData}
					width="400"
				/>
			</FormGroup>
			<FormGroup legendText="Traffic Split Suggestion" className="formGroupProps">
				<Dropdown
					id="analyticsAlgo"
					label="Analytics Algorithm"
					items={this.algoList}
					itemToString={item => (item ? item.text : '')}
					initialSelectedItem={this.algoList[0]}
					titleText="Analytics Algorithm"
					helperText="Choose the algorithm to view its traffic routing suggestions."
					onChange={(value) => this.handleAlgoChange(value.selectedItem)}
				/>
				</FormGroup>
				<FormGroup legendText=''>
				{this.trafficRecs.map((val, idx) => {
					return(
							<Slider
								key={idx}
								value={val.split}
								min={0}
								max={100}
								labelText={val.version}
								style={{width: 200}}
							/>					
					)
				})}
				</FormGroup>
				<FormGroup legendText="Metric Summary">
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
