import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useState } from 'react';
import { TooltipIcon, Form, TextInput, Button, Select, SelectItem } from 'carbon-components-react'
import { CaretDown32, Information16, AddAlt32 } from "@carbon/icons-react";
import '@kui-shell/plugin-client-common/web/css/static/Tooltip.scss'
import 'carbon-components/scss/components/select/_select.scss'
import "../../web/scss/components/exprForm.scss"

// export default StratOptions;
const TextInputProps = {
  id: 'expName',
  labelText: 'Name',
  placeholder: 'Ex. rollout_v1_v2',
  style: {width: 350, height: 50},
};

class Base extends React.Component<any, any> {
	candInput = React.createRef();
	constructor(props){
  	super(props);
    this.state = {name: '', ns:'', svc: '', base:'', cand:[]};
    this.handleChange = this.handleChange.bind(this);   
  }

  	// Handlers for any input changes
    handleChange(event){
    	this.setState({name: event.target.value.toLowerCase().replace(" ", "_")});
    }
    
    // Adds the candidate value to the state if not already there and not base
 //    handleAddCand = (e) => {
 //    	if(!this.state.cand.includes(this.candInput.current.value) &&
 //    		this.state.base !== (this.candInput.current.value)){
    		
 //    		this.setState((prevState) => ({
	// 		cand: [...prevState.cand, this.candInput.current.value],
	// 		}));
 //    	}
	// }
	
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

    render(){
    	return (
        <Form>
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
					style={{width: 350}}
				>
					<SelectItem
						value="bookinfo-iter8"
						text="bookinfo-iter8"
					/>
					<SelectItem
						value="istio-system"
						text="istio-system"
					/>
				</Select>
				</div>
			<div style={{ width: 350, position: "relative", top: 340, left: -195 }}>
	            <Select
					id="svc-select"
					labelText="Service"
					helperText="The name of your microservice."
					style={{width: 350}}
				>
					<SelectItem
						value="reviews"
						text="reviews"
					/>
					<SelectItem
						value="ratings"
						text="ratings"
					/>
				</Select>
				</div>
			<div style={{ width: 350, position: "relative", top: 440, left: -260 }}>
	            <Select
					id="base-select"
					labelText="Baseline Deployment"
					helperText="The version of your microservice to use as the experimental baseline."
					style={{width: 350}}
				>
					<SelectItem
						value="reviews-v1"
						text="reviews-v1"
					/>
					<SelectItem
						value="reviews-v2"
						text="reviews-v2"
					/>
				</Select>
			</div>
			<div style={{ width: 350, height:100, position: "relative", top: 555, left: -325, display:"-webkit-inline-box" }}>
				<Select
					id="cand-select"
					labelText="Candidate Deployment(s)"
					helperText="The version(s) of your microservice to use as the experimental candidate."
					style={{width: 350, display:"inline"}}
					// ref={this.candInput}
				>
					<SelectItem
						value="reviews-v1"
						text="reviews-v1"
					/>
					<SelectItem
						value="reviews-v2"
						text="reviews-v2"
					/>
				</Select>
				<div style={{height: 50, position:"relative", top: 50}}>
				<Button
					size="default"
					kind="ghost"
					renderIcon={AddAlt32}
					// onClick={this.handleAddCand}
				>
				Add
				</Button>
				</div>
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