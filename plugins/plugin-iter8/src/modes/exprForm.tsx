import * as React from 'react'
import { useState } from 'react';
import { TooltipIcon, Form, TextInput, Button, Select, SelectItem, MultiSelect } from 'carbon-components-react'
import { CaretDown32, Information16, View32, Data_132, AddAlt32, SubtractAlt32 } from "@carbon/icons-react";
import "../../web/scss/components/exprForm.scss"
import '@kui-shell/plugin-client-common/web/css/static/Tooltip.scss'
import 'carbon-components/scss/components/select/_select.scss'
import 'carbon-components/scss/components/multi-select/_multi-select.scss'
import 'carbon-components/scss/components/button/_button.scss'
import { Tab } from '@kui-shell/core'
import { getNsData } from './get_cluster_info'

let nsList = [
	{
		id: 'ns-0',
		text: 'bookinfo-iter8'
	},

	{
		id: 'ns-1',
		text: 'default'
	},

	{
		id: 'ns-2',
		text: 'kube-system'
	},
]

let svcList = [
	{
		id: 'svc-0',
		text: 'reviews'
	},

	{
		id: 'svc-1',
		text: 'details'
	},

	{
		id: 'svc-2',
		text: 'ratings'
	},
]

let deployList = [
	{
		id: 'dep-0',
		text: 'reviews-v1'
	},

	{
		id: 'dep-1',
		text: 'reviews-v2'
	},

	{
		id: 'dep-2',
		text: 'reviews-v3'
	},
]
// export default StratOptions;
const TextInputProps = {
  id: 'expName',
  labelText: 'Name',
  placeholder: 'Ex. rollout_v1_v2',
  style: {width: 350, height: 50},
};

class Base extends React.Component<any, any> {
	constructor(props){
  	super(props);
    this.state = {showMetrics: false, name: '', ns:'', svc: '', base:'', cand:[],
					metric: [{name: "", type:"", reward: false, limitType: "", limitValue:0}],
					disableOthers: false,
				 };
    this.handleChange = this.handleChange.bind(this);   
  }

  	// Handlers for any input changes
    handleChange(event){
    	this.setState({name: event.target.value.toLowerCase().replace(" ", "_")});
    }
    
    //Adds the candidate value to the state if not already there and not base
    handleAddCand = (e) => {
    	if(!this.state.cand.includes(e.target.value) &&
    		this.state.base !== (e.target.value)){
    		
    		this.setState((prevState) => ({
			cand: [...prevState.cand, e.target.value],
			}));
    	}
	}
	
	handleAddNs = (e) => {
		this.setState({ns: e.target.value, svc: '', base:'', cand:[]});
		event.preventDefault();
	}
	handleAddSvc = (e) => {
		this.setState({svc: e.target.value, base:'', cand:[]});
		event.preventDefault();
	}
	handleAddBase = (e) => {
		this.setState({base: e.target.value, cand: []});
		event.preventDefault();
	}
	handleMetric = (e) => {
		this.setState({showMetrics: !this.state.showMetrics});
		event.preventDefault();
	}
	/*
	* Metric Configuration related functions
	*/
	addMetric = (e) => {
    this.setState((prevState) => ({
      metric: [...prevState.metric, {name: "", type:"", reward: false, limitType: "", limitValue:0}],
    }));
  	}
  	// Removes the metric field from the state
	onDeleteMetric = (idx) => {
	this.setState(state => {
	  const metric = state.metric.filter((m, i) => i !== idx);

	  return {
	    metric,
	  };
	});
	};

    render(){
    	let { metric } = this.state
    	return (
        <Form className="formProps">
        	<div className="header">
        		<CaretDown32 className="iconprops"/>
        		<h3> Experiment Basics </h3>
        	</div>
        	<div className="inputInfoDiv">
	            <div className="textinputDiv">
		            <TextInput 
		            	{...TextInputProps}
		            	type="text"
		            	value={this.state.name} 
		            	onChange={this.handleChange} 
		            />
		        </div>
		        <div className='helpDiv'>
		            <TooltipIcon
					    direction='top' 
					    align='center'
	    				tooltipText="The name of the Experiment K8s Custom Resouce"
					  >
				    <Information16 />
		  			</TooltipIcon>
	            </div>
            </div>
            <div className="header" style={{position: "relative", top: 150, left: -130}}>
            	<CaretDown32 className="iconprops"/>
        		<h3> Target Configuration </h3>
            </div>
            <div style={{ width: 350, position: "relative", top: 240, left: -130 }}>
	            <Select
					id="ns-select"
					labelText="Namespace"
					helperText="Namespace where your application resides."
					defaultValue="Select a namespace"
					style={{width: 350}}
				>
				{
					nsList.map((val,idx) => {
						let itemId = `${val.id}`,
						itemName = `${val.text}`
						return(
							<SelectItem
								value={itemId}
								text={itemName}
							/>
						)
					})
				}
				</Select>
				</div>
			<div style={{ width: 350, position: "relative", top: 340, left: -195 }}>
	            <Select
					id="svc-select"
					labelText="Service"
					helperText="The name of your microservice."
					defaultValue="Select a service"
					style={{width: 350}}
				>
				{
					svcList.map((val,idx) => {
						let itemId = `${val.id}`,
						itemName = `${val.text}`
						return(
							<SelectItem
								value={itemId}
								text={itemName}
							/>
						)
					})
				}
				</Select>
				</div>
			<div style={{ width: 350, position: "relative", top: 440, left: -260 }}>
	            <Select
					id="base-select"
					labelText="Baseline Deployment"
					helperText="The version of your microservice to use as the experimental baseline."
					defaultValue="Select a Baseline"
					style={{width: 350}}
				>
				{
					deployList.map((val,idx) => {
						let itemId = `${val.id}`,
						itemName = `${val.text}`
						return(
							<SelectItem
								value={itemId}
								text={itemName}
							/>
						)
					})
				}
				</Select>
			</div>
			<div style={{ width: 350, height:100, position: "relative", top: 555, left: -325, display:"-webkit-inline-box" }}>
				<div style={{height: 50}}>
					<p> Candidate Deployment(s) <br/>
					<p className="helper"> The version(s) of your microservice to use as the experimental candidate.</p>
					</p>
				</div>
				<div style={{position: "relative", top: 55, left: -350}}>
					<MultiSelect
						id="cand-select"
						items={deployList}
						itemToString={item => (item ? item.text : '')}
						label="Candidate Deployment(s)"
					>
					</MultiSelect>
				</div>
				<div style={{position: "relative", top: 120, left: -700}}>
					<Button
						size="default"
						kind="primary"
						renderIcon={View32}
						// disabled={this.disableSubmit()}
					> Observe </Button>
					<div style={{position: "relative", top: -48, left: 190}}>
						<Button
							size="default"
							kind="secondary"
							renderIcon={Data_132}
							onClick={this.handleMetric}
						> Metric Config </Button>
					</div>
				</div>
				{this.state.showMetrics ?
					(
						<div>
							<div className="header" style={{position: 'relative', top: 160, right: 920}}>
        						<CaretDown32 className="iconprops"/>
        						<h3> Metric Configuration </h3>
        					</div>
        						<Button
        							size="small"
        							kind="ghost"
        							renderIcon={AddAlt32}
        							onClick={this.addMetric}
        							style={{position: "relative", top:95, right:600}}
        						> Add Metric </Button>
        						<div style={{position: "relative", top:110, right:865 }}>
        						{
        							metric.map((val, idx) => {
        								let metricId = `metric-${idx}`,
        								rewardId=`reward-${idx}`,
        								limitTypeId=`limitType-${idx}`,
        								limitValueId=`limitValue-${idx}`
        								return(
        									<div key={idx}>
        										<p> {`Metric #${idx+1}`} </p>
        										<Select
        											id={metricId}
													labelText="Name"
													defaultValue="Select a metric"
													helperText="Metrics supported by Iter8."
													style={{width: 350}}
												>
													<SelectItem
														text="latency"
														value="iter8-latency"
													/>
												</Select>
												<Select
													id={limitTypeId}
													labelText="Limit Type"
													helperText="For non-reward metrics, designate the type of threshold for the metric."
													style={{width: 350}}
												>
													<SelectItem
														text="Absolute Threshold"
														value="abs-thres"
													/>
													<SelectItem
														text="Delta Threshold"
														value="delt-thres"
													/>
												</Select>
												<TextInput 
									            	id={limitValueId}
									            	labelText="Limit Value"
									            	helperText="Set the value for the designated threshold selected.
									            	(Delta-%, abs-number)."
									            	style={{width: 350}}
		            							/>
		            							<Button
		            								size="small"
		            								kind="ghost"
		            								renderIcon={SubtractAlt32}
		            								onClick={() => this.onDeleteMetric(idx)}
		            								style={{color: "red"}}
		            							>
		            							{`Delete Metric ${idx+1}`}
		            							</Button>					

        									</div>
        								)
        							})
        						}
        						</div>
						</div>
					)
					: null
				}
			</div>

        </Form> 	  	
      );
    }
  }



export function renderForm(){
	return {
		react: () => <Base />
	}
}