import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
import { Form, FormGroup, InlineLoading, Button, Slider, Dropdown, DataTable } from 'carbon-components-react'
import { Renew32, Undo32, Export32 } from '@carbon/icons-react'
import Chart from 'react-apexcharts'
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/slider/_slider.scss'
import 'carbon-components/scss/components/dropdown/_dropdown.scss'
import 'carbon-components/scss/components/data-table/_data-table.scss'
import '../../src/web/scss/static/decisionForm.scss'
import { DecisionState, RequestModel } from '../components/get-iter8-req'
import GetAnalyticsAssessment from "../components/get-analytics-assessment"
import DisplayName from "../components/displayname-dict"
//Deconstructs the DataTable component
const util = require('util');
const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} = DataTable;
//sample values for testing purposes
const sampleHeaders=[
    {
      header: 'Deployment Version',
      key: 'version'
    },
    {
      header: 'Mean Latency (msec)',
      key: 'mean_latency'
    },
    {
      header: 'Total Errors',
      key: 'tot_error'
    }
  ]

const sampleRows = [
    {
      id: 'reviews-v2',
      version: "reviews-v2",
      mean_latency: 20,
      tot_error: 10
    },
    {
      id: 'reviews-v3',
      version: "reviews-v3",
      mean_latency: 13,
      tot_error: 2
    }
  ]
// Functional Component for Data Tabel rendering
const renderTable = ({rows, headers}) => (
  <TableContainer 
  	title="Metrics Comparison" 
  	description="Current values of all experimental metrics"
  >
    <Table>
      <TableHead>
        <TableRow>
          {headers.map(header => (
            <TableHeader>
              {header.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id}>
            {row.cells.map(cell => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export class DecisionBase extends React.Component<{}, DecisionState> {
  // For displaying Pie Chart
  private winProbData = [];
  private winProbLabels = {};
  // For displaying Traffic Suggestion Section
  private algoList = [];
  private trafficRecs = [];
  // For displaying Metric Comparison Section
  private metricTableHeaders = [];
  private metricTableRows = [];
  public constructor(props) {
    super(props)
    this.state = {
      selectedAlgo: '',
      exprCreated: false, // User has finished expr setup
      haveResults: false, // First AJAX call has been successful
      exprReq: null,
      exprResult: null,
    }
    eventChannelUnsafe.on('/my/channel', (formstate) => {this.setState({exprCreated: true, exprReq: formstate}); });
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
  	let tempAlgoList = []
  	let DisplayDict = new DisplayName();
  	//Iterate through the traffic recommendations
  	Object.getOwnPropertyNames(trafficRecs).forEach(key => {
  	  let algoName = DisplayDict.getAlgoName(key);	  	
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
  // Populate the metric table header
  private getMetricHeaders(){
  	let DisplayDict = new DisplayName();
  	let tempHeaders = [{header: "Deployment Name", key: "version"}];
  	// An array returned
  	let baseAssess = this.state.exprResult.baseline_assessment.criterion_assessments;
  	for(let i = 0; i < baseAssess.length; i++){
  		let metricId = baseAssess[i].metric_id;
  		let metricName = DisplayDict.getMetricName(metricId);
  		tempHeaders.push({
  			header: metricName,
  			key: metricId,
  		});
  	}
  	this.metricTableHeaders = tempHeaders;
  }

  private getMetricRows(){
	let baseCriteria = this.state.exprResult.baseline_assessment.criterion_assessments;
	let baseId = this.state.exprResult.baseline_assessment.id;

	let tempRows = [];
	let tempBase = {"id":baseId, "version": baseId}
	for(let i = 0; i < baseCriteria.length; i++){
		tempBase[baseCriteria[i].metric_id] = baseCriteria[i].statistics.value;
	}
	tempRows.push(tempBase);
	// Iterate through every candidate assessment
	let candList = this.state.exprResult.candidate_assessments;
	for(let i = 0; i < candList.length; i++){
		let tempCand = {"id":candList[i].id, "version": candList[i].id}
		//Iterate through every metric in the candidate
		let candAssess = candList[i].criterion_assessments;
		for(let j = 0; j < candAssess.length; j++){
			tempCand[candAssess[j].metric_id] = candAssess[j].statistics.value;
		}
		tempRows.push(tempCand);
	}
	this.metricTableRows = tempRows;
  }
  // On changing the algorithm type
  private handleAlgoChange = (value) => {
  	this.setState({selectedAlgo: value.id});
  	this.getTrafficRecs(value.id);
  }
  public render() {
  	if(this.state.haveResults){
  		this.getWinProbs();
  		this.getAlgo();
  		this.getMetricHeaders();
  		this.getMetricRows();
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
				<Button
					size="default"
					kind="danger"
					renderIcon={Undo32}
					onClick={() => this.getTrafficRecs(this.state.selectedAlgo)}
				>
					Reset
				</Button>
				<Button
					size="default"
					kind="primary"
					renderIcon={Export32}
				>
					Apply
				</Button>
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
		        <FormGroup legendText="">
		        	<DataTable
		        		headers={this.metricTableHeaders}
		        		rows={this.metricTableRows}
		        		render={({rows, headers}) => renderTable({rows, headers})}
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
