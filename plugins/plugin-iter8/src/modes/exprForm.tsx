import * as React from 'react'
import { TooltipIcon, Form, TextInput, Button, Select, SelectItem, MultiSelect, Checkbox } from 'carbon-components-react'
import { CaretDown32, Information16, View32, AddAlt32, SubtractAlt32 } from "@carbon/icons-react";
import { Data_132 as Data132 } from "@carbon/icons-react";
import "../../web/scss/components/exprForm.scss"
import '@kui-shell/plugin-client-common/web/css/static/Tooltip.scss'
import 'carbon-components/scss/components/select/_select.scss'
import 'carbon-components/scss/components/multi-select/_multi-select.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/checkbox/_checkbox.scss'
import GetKubeInfo from './get_cluster_info'

// export default StratOptions;
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
    this.state = {showMetrics: false, name: '', ns:'', svc: '', base:'', cand:[],
					metric: [{name: "", type:"", reward: false, limitType: "", limitValue:0}],
					disableOthers: false,
				 };
    this.handleChange = this.handleChange.bind(this);   
  }

  	// Handlers for any input changes
    private handleChange(event){
    	this.setState({name: event.target.value.toLowerCase().replace(" ", "_")});
    }
    
    //Adds the candidate value to the state if not already there and not base
    private handleAddCand = (e) => {
    	if(!this.state.cand.includes(e.target.value) &&
    		this.state.base !== (e.target.value)){
    		
    		this.setState((prevState) => ({
			cand: [...prevState.cand, e.target.value],
			}));
    	}
	}
	
	private handleAddNs = (e) => {
		this.setState({ns: e.target.value, svc: '', base:'', cand:[]});
		this.svcList = this.kubeMethods.getSvc(e.target.value);
		this.deployList = []
		event.preventDefault();
	}
	private handleAddSvc = (e) => {
		this.setState({svc: e.target.value, base:'', cand:[]});
		this.deployList = this.kubeMethods.getDeployment(this.state.ns, e.target.value);
		event.preventDefault();
	}
	private handleAddBase = (e) => {
		this.setState({base: e.target.value, cand: []});
		event.preventDefault();
	}
	private handleMetric = (e) => {
		this.setState({showMetrics: !this.state.showMetrics});
		event.preventDefault();
	}
	/*
	* Metric Configuration related functions
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
					onChange={this.handleAddNs}
					style={{width: 350}}
				>
				{
					nsList.map((val,idx) => {
						let itemName = `${val.text}`
						return(
							<SelectItem
								value={itemName}
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
					onChange={this.handleAddSvc}
					style={{width: 350}}
				>
				{
					this.svcList.map((val,idx) => {
						let itemName = `${val.text}`
						return(
							<SelectItem
								value={itemName}
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
					this.deployList.map((val,idx) => {
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
						items={this.deployList}
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