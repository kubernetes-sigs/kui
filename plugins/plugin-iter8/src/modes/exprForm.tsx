import * as React from 'react'
import { TooltipIcon, Form, TextInput, Button, Select, SelectItem, MultiSelect, Checkbox, ComboBox } from 'carbon-components-react'
import { CaretDown32, Information16, View32, AddAlt32, SubtractAlt32 } from "@carbon/icons-react";
import { Data_132 as Data132 } from "@carbon/icons-react";
import "../../src/web/scss/static/exprForm.scss"
import '@kui-shell/plugin-client-common/web/css/static/Tooltip.scss'
import 'carbon-components/scss/components/combo-box/_combo-box.scss'
import 'carbon-components/scss/components/select/_select.scss'
import 'carbon-components/scss/components/multi-select/_multi-select.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/checkbox/_checkbox.scss'
import GetKubeInfo from './get_cluster_info'

// Component Properties
const TextInputProps = {
  id: 'expName',
  labelText: 'Name',
  placeholder: 'Ex. rollout_v1_v2',
  style: {width: 350, height: 50},
};

class Base extends React.Component<any, any> {
	private kubeMethods = new GetKubeInfo();
	private svcList = [];
	private deployList = [];
	
	public constructor(props){
  	super(props);
    this.state = {
    	showMetrics: false, //determines the visibility of metric config
    	invalidCand: false, //determines whether cand values are valid
    	name: '', ns:'', svc: '', base:'', cand:[], //basic expr attributes
		metric: [{name: "", type:"", reward: false, limitType: "", limitValue:0}], //metric attributes
		disableReward: false, //disables the reward select for other metrics
				 };
    this.handleNameChange = this.handleNameChange.bind(this);   
  }
  	/*
  	* ==== Sets the basic experiment state attributes =====
  	*/
    private handleNameChange(event){
    	this.setState({name: event.target.value.toLowerCase().replace(" ", "_")});
    }
    
    private handleAddCand = (value) => {
    	// Convert all input into an iterable array
    	let versionValue = value.map((data) => {return data.text});
    	this.setState({invalidCand: false});
    	// Check for invalid selections
    	for(let i = 0; i <versionValue.length; i++){
    		console.log("Candidate:", versionValue[i]);
	    	if(this.state.base === (versionValue[i])){
	    		this.setState({invalidCand: true});
	    		versionValue.splice(i, 1);	
	    	}
    	}
    	this.setState({
			cand: versionValue
		});
	}
	
	private handleAddNs = (value) => {
		if(value == null){
			this.setState({ns: '', svc: '', base:'', cand:[]});
			this.svcList = [];
		}else{
			this.setState({ns: value.text, svc: '', base:'', cand:[]});
			this.svcList = this.kubeMethods.getSvc(value.text);	
		}
		this.deployList = [];
	}
	private handleAddSvc = (value) => {
		if(value == null){
			this.setState({svc: '', base:'', cand:[]});
			this.deployList = []
		}else{
			this.setState({svc: value.text, base:'', cand:[]});
			this.deployList = this.kubeMethods.getDeployment(this.state.ns, value.text);
		}
	}
	private handleAddBase = (value) => {
		
		if(value == null){
			console.log("The value is null");
			this.setState({base: '', cand: []});
		}
		else{
			console.log("Baseline: ", value.text);
			this.setState({base: value.text, cand: []});
		}
	}

	private handleMetric = (e) => {
		this.setState({showMetrics: !this.state.showMetrics});
		event.preventDefault();
	}
	/*
	* ==== Metric Configuration related functions ====
	*/
	private addMetric = () => {
    this.setState((prevState) => ({
      metric: [...prevState.metric, {name: "", type:"", reward: false, limitType: "", limitValue:0}],
    }));
  	}
  	// Removes the metric field from the state
	private onDeleteMetric = (idx) => {
	this.setState(state => {
	  const metric = state.metric.filter((m, i) => i !== idx);
	  return {
	    metric,
	  };
	});
	};

    public render(){
    	let { metric } = this.state;
    	const nsList = this.kubeMethods.getNamespace();
    	
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
		            	onChange={this.handleNameChange} 
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
	            <ComboBox
					id="ns-select"
					titleText="Namespace"
					helperText="Namespace where your application resides."
					placeholder="Select a Namespace"
					items={nsList}
					itemToString={item => (item ? item.text : '')}
					onChange={(value) => this.handleAddNs(value.selectedItem)}
					style={{width: 350}}
				/>
				</div>
			<div style={{ width: 350, position: "relative", top: 340, left: -195 }}>
	            <ComboBox
					id="svc-select"
					titleText="Service"
					helperText="The name of your microservice."
					placeholder="Select a Service"
					items={this.svcList}
					itemToString={item => (item ? item.text : '')}
					onChange={(value) => this.handleAddSvc(value.selectedItem)}
					style={{width: 350}}
				/>
				</div>
			<div style={{ width: 350, position: "relative", top: 440, left: -260 }}>
	            <ComboBox
					id="base-select"
					titleText="Baseline Deployment"
					helperText="The version of your microservice to use as the experimental baseline."
					placeholder="Select a Baseline Deployment"
					items={this.deployList}
					itemToString={item => (item ? item.text : '')}
					onChange={(value) => this.handleAddBase(value.selectedItem)}
					style={{width: 350}}
				/>
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
						items={this.deployList}
						itemToString={item => (item ? item.text : '')}
						label="Select Candidate Deployment(s)"
						onChange={(value) => {this.handleAddCand(value.selectedItems)}}
						invalid={this.state.invalidCand}
						invalidText="Cannot select same version as baseline."
					>
					</MultiSelect>
				</div>
				<div style={{position: "relative", top: 120, left: -700}}>
					<Button
						size="default"
						kind="primary"
						renderIcon={View32}
						disabled={this.state.invalidCand}
					> Observe </Button>
					<div style={{position: "relative", top: -48, left: 190}}>
						<Button
							size="default"
							kind="secondary"
							renderIcon={Data132}
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
        								limitValueId=`limitValue-${idx}`,
        								checkId=`checkbox-${idx}`
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
		            							<Checkbox 
		            								id={checkId}
		            								labelText="Set as reward"
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