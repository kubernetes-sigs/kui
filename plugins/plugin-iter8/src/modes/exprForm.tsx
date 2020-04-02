import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState } from 'react';
import { faCaretSquareDown} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Button, UncontrolledTooltip } from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/custom.css';

// Metric Options 
class Metrics extends React.Component<any, any>{
	state = {
		metric: [{name: "", type:"", reward: false, limitType: "", limitValue:0}],
		disableOthers: false,
	}
	addMetric = (e) => {
		this.setState((prevState) => ({
			metric: [...prevState.metric, {name: "", type:"", reward: false, limitType: "", limitValue:0}],
		}));
	}

	// Disables all the other checkboxes
	onSelectedChange = (idx) => {
		let newMetricArr = this.state.metric.map((metric, i) => {
			if(i === idx){
				return {
					...metric,
					reward: !metric.reward
				}
			}
			return metric;
		})

		this.setState( (prevState) => ({
			metric: newMetricArr,
			disableOthers: !prevState.disableOthers
		}));		
	};

	// Removes the metric field from the state
	onDeleteMetric = (idx) => {
		this.setState(state => {
			const metric = state.metric.filter((m, i) => i !== idx);

			return {
				metric,
			};
		});
	};

	//updates the metric name in the state
	handleNameChange = (e, idx) => {
		let newMetricArr = this.state.metric.map((metric, i) => {
			if(i === idx){
				return {
					...metric,
					name: e.target.value
				}
			}
			return metric;
		})

		this.setState( () => ({
			metric: newMetricArr
		}));
	}
	render(){
		let { metric } = this.state
		return(
			<form>
				<h2> Metric Configuration </h2>
				<button onClick={this.addMetric} className="btn-long"> Add Metric </button>
				<br/> <br/>
				{
					metric.map((val, idx) => {
						let metricId = `metric-${idx}`, typeId=`type-${idx}`, rewardId=`reward-${idx}`, limitTypeId=`limitType-${idx}`, limitValueId=`limitValue-${idx}`
						return (
							<div key={idx}>
							<label htmlFor={metricId}> <span id="nameTool" style={{color:"white", width: "200px"}}> {`Metric #${idx+1}`}</span> </label>
							<UncontrolledTooltip placement="top-start" target="nameTool">
        						Metrics supported by Iter8.<br/>
        						More information found in iter8config-metrics ConfigMap.
      						</UncontrolledTooltip>
							<select
								name={metricId}
								data-id={idx}
								id={typeId}
								onChange={(e) => this.handleNameChange(e,idx)}
							>
							<option value="iter8_latency"> Latency </option>
							<option value="iter8_error_rate"> Error Rate </option>
							<option value="iter8_error_count"> Error Count </option>
							</select>
							
							<label htmlFor={typeId}> <span id="typeTool" style={{color:"white", width: "200px"}}> Type</span> </label>
							<UncontrolledTooltip placement="top-start" target="typeTool">
        						The associated type of the given metric: Counter or Gauge.
      						</UncontrolledTooltip>
							<input
								type="text"
								name={typeId}
								data-id={idx}
								id={typeId}
								placeholder="Counter/Gauge"
							/>
      						
      						<label htmlFor={limitTypeId}> <span id="limitTypeTool" style={{color:"white", width: "200px"}}> Limit Type </span></label>
							<UncontrolledTooltip placement="top-start" target="limitTypeTool">
        						For non-reward metrics, designate the type of threshold for the metric. <br/>
        						This serves as the upper limit for the metric. 
      						</UncontrolledTooltip>
      						<select
      							name={limitTypeId}
      							data-id={idx}
      							id={limitTypeId}
      						>
      							<option> Absolute Threshold </option>
      							<option> Delta Threshold</option>
      						</select>

      						<label htmlFor={limitValueId}> <span id="limitValueTool" style={{color:"white", width: "200px"}}> Limit Value </span></label>
							<UncontrolledTooltip placement="top-start" target="limitValueTool">
        						Set the value for the designated threshold selected. <br/>
        						Delta-%, abosolute-metric dependent.
      						</UncontrolledTooltip>
      						<input
      							type="number"
      							name={limitValueId}
      							data-id={idx}
      							id={limitValueId}
      						/>

      						<label htmlFor={rewardId}> <span id="rewardTool" style={{color:"white", width: "200px"}}> Set as reward </span></label>
							<UncontrolledTooltip placement="top-start" target="rewardTool">
        						The metric is intended to be maximize in the experiment. Only 1 metric can be designated as the reward.
      						</UncontrolledTooltip>
      						<input 
      							type="checkbox"
      							name={rewardId}
      							data-id={idx}
      							id={rewardId}
      							disabled={(!metric[idx].reward && this.state.disableOthers) || val.name === "iter8_error_count"}
      							onChange = {() => this.onSelectedChange(idx)}
      						/>

      						<input
      							type="button"
      							value="X"
      							onClick={() => this.onDeleteMetric(idx)}
      							className="btn-rmv"
      						/>
							</div>
						) 
					})
				}
			</form>
		);
	}
}
// Extra options for strategies
const StratOptions = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="btn-wrap">
      <Button onClick={toggle} className="btn-long">Strategy Config</Button>
      <div>
	      <Collapse isOpen={isOpen}>
	      	<br/>
	      	<Metrics/>
	      </Collapse>
      </div>
      <br/> <br/>
      <button className="btn"> Submit </button>
    </div>
  );
}

export default StratOptions;

class Base extends React.Component<any, any> {
	constructor(props){
  	super(props);
    this.state = {name: '', ns:'', svc: '', base:'', cand:[]};
    this.handleChange = this.handleChange.bind(this);
  }
  	// Handlers for any input changes
    handleChange(event){
    	this.setState({name: event.target.value.toLowerCase().replace(" ", "_")});
    }
    
    handleSubmit(event){
    	event.preventDefault();
    }
    // Adds the candidate value to the state if not already there and not base
    handleAddCand = (e) => {
    	if(!this.state.cand.includes((ReactDOM.findDOMNode(this.refs.candSelect) as HTMLInputElement).value) &&
    		this.state.base !== (ReactDOM.findDOMNode(this.refs.candSelect) as HTMLInputElement).value){
    		
    		this.setState((prevState) => ({
			cand: [...prevState.cand, (ReactDOM.findDOMNode(this.refs.candSelect) as HTMLInputElement).value],
			}));
    	}
	}
	
	handleAddNs = (e) => {
		this.setState({ns: e.target.value, svc: '', base:'', cand:[]});
	}
	handleAddSvc = (e) => {
		this.setState({svc: e.target.value, base:'', cand:[]});
	}
	handleAddBase = (e) => {
		this.setState({base: e.target.value, cand: []});
	}
    render(){
    	return (
        <form onSubmit={this.handleSubmit}>
        <div>
	        <div className="iconDiv">
	        	<FontAwesomeIcon icon={faCaretSquareDown} color="#3AAFA9"/>
			</div>
			<h2> Experiment Basics</h2>
	          <div className="labelDiv">
	            <label htmlFor="expName" >Name </label>
	            <input type="text" id="expName" placeholder="Experiment Name" value={this.state.name} onChange={this.handleChange} />
	          </div>
	        <div className="iconDiv">
	        	<FontAwesomeIcon icon={faCaretSquareDown} color="#3AAFA9"/>
			</div>
	         <h2> Target Configuration</h2>
	        <div className="labelDiv">
	            <p><span id="nsTool" style={{color:"white", width: "50px"}}> Namespace </span></p>
	            <UncontrolledTooltip placement="top-start" target="nsTool">
        		Namespace of your application.
      			</UncontrolledTooltip>
	            <select onChange={this.handleAddNs}>
	            	<option> bookinfo-iter8 </option>
	            </select>
	        </div>
	        
	        <div className="labelDiv">
	            <span id="svcTool" style={{color:"white"}}> Service </span>
	            <UncontrolledTooltip placement="top-start" target="svcTool">
        		Service name of your microservice.
      			</UncontrolledTooltip>
	            <select onChange={this.handleAddSvc}>
	              <option> reviews </option>
	              <option> details </option>
	            </select>
	        </div>
	        
	        <div className="labelDiv">
	            <span id="baseTool" style={{color:"white", width: "200px"}}> Baseline Deployment </span>
	            <UncontrolledTooltip placement="top-start" target="baseTool">
        		The version of your microservice to use as the experimental baseline.
      			</UncontrolledTooltip>
	            <select onChange={this.handleAddBase}>
	              <option value='reviews-v1'> reviews-v1 </option>
	              <option value='reviews-v2'> reviews-v2 </option>
	              <option value='reviews-v3'> reviews-v3 </option>
	              <option value='reviews-v4'> reviews-v4 </option>
	            </select>
	        </div>
	         
	         <div className="labelDiv">
	            <span id="candTool" style={{color:"white", width: "200px"}}> Candidate Deployment(s) </span>
	            <UncontrolledTooltip placement="top-start" target="candTool">
        		The version of your microservice to use as the experimental candidate. <br/> (Can select >1.)
      			</UncontrolledTooltip>
	            <select ref="candSelect">
	              <option value='reviews-v1'> reviews-v1 </option>
	              <option value='reviews-v2'> reviews-v2 </option>
	              <option value='reviews-v3'> reviews-v3 </option>
	              <option value='reviews-v4'> reviews-v4 </option>
	            </select>
	            <input
					type="button"
					value="+"
					className="btn-add"
					onClick={this.handleAddCand}
      			/>
      			<span>
    				Added Candidates: <b>{this.state.cand.join(' , ')}</b>
				</span>
	        </div>
	    </div>
	    <br/>
        <br/>
        </form> 	  	
      );
    }
  }



export function renderForm(){
	return {
		react: () => <Base />
	}
}