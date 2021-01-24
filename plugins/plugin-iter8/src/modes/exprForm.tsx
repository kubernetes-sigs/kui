/*
 * Copyright 2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
// Component Imports
import {
  Form,
  FormGroup,
  TextInput,
  Button,
  MultiSelect,
  Checkbox,
  ComboBox,
  Tag,
  Toggle
} from 'carbon-components-react'
import { View32, SubtractAlt32, Data_132 as Data132 } from '@carbon/icons-react'
// UI Style imports
import '../../src/web/scss/static/exprForm.scss'
import 'carbon-components/scss/components/combo-box/_combo-box.scss'
import 'carbon-components/scss/components/toggle/_toggle.scss'
import 'carbon-components/scss/components/select/_select.scss'
import 'carbon-components/scss/components/multi-select/_multi-select.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/checkbox/_checkbox.scss'
// Functionality Imports
import GetKubeInfo from '../components/cluster-info'
import { GetMetricConfig } from '../components/metric-config'
import getRequestModel from '../utility/get-iter8-req'
import { Formstate } from '../modes/state-models'
import { experimentTypes } from '../utility/variables'

/*
 * Data models for the state object in ExprForm
 */

export default class ExprBase extends React.Component<{}, Formstate> {
  // imported class of methods from /components
  private kubeMethods = new GetKubeInfo()
  private GetMetricConfig = new GetMetricConfig()
  // Lists of dropdown menu items
  private args

  public constructor(props) {
    super(props)
    this.args = props
    this.state = {
      showCriteria: false, // determines the visibility of metric config section
      invalidCandidate: false, // determines whether candidates values are valid
      name: '', // name of the experiment
      type: experimentTypes.hil, // type of experiment: HIL vs automated
      namespace: '', // namespace of microservice
      service: '', // service name of microservice
      baseline: '', // baseline deployment of microservice
      candidates: [], // list of candidates deployment names of microservice
      criteria: [{ name: '', type: '', reward: false, limitType: '', limitValue: 0 }], // metric attributes
      disableReward: false, // disables the reward select for selected metrics
      edgeService: true,
      hostGateways: [],
      invalidHostGateways: false,
      nsList: [],
      svcList: [],
      deployList: [],
      countMetricsList: [],
      ratioMetricsList: [],
      totalMetricsList: []
    }
    setTimeout(async () => {
      const [nsList] = await Promise.all([this.kubeMethods.getNamespace(this.args)])
      this.setState({ nsList })
    })

    setTimeout(async () => {
      const [countMetricsList] = await Promise.all([this.GetMetricConfig.getCounterMetrics(this.args)])
      this.setState({ countMetricsList })
    })

    setTimeout(async () => {
      const [ratioMetricsList] = await Promise.all([this.GetMetricConfig.getRatioMetrics(this.args)])
      this.setState({ ratioMetricsList })
    })

    // Bound NON-lambda functions to component's scope
    this.submitForm = this.submitForm.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.addCriterion = this.addCriterion.bind(this)
  }

  /*
   * ==== Basic Experiment State Handlers =====
   */
  private handleNameChange(event) {
    console.log(event.target.value)
    this.setState({ name: event.target.value })
  }

  private handleAddCand = value => {
    // Convert all input items into an iterable array
    const versionValue = value.map(data => {
      return data.text
    })
    // Check for invalid selections
    for (let i = 0; i < versionValue.length; i++) {
      if (this.state.baseline === versionValue[i]) {
        versionValue.splice(i, 1)
        this.setState({ invalidCandidate: true, candidates: versionValue })
        return
      }
    }
    this.setState({
      invalidCandidate: false,
      candidates: versionValue
    })
  }

  private handleSplitCand(value) {
    const candList = value.target.value.split(',')
    const obj = []
    for (let i = 0; i < candList.length; i++) {
      obj.push({ id: `c-${i}`, text: candList[i].trim() })
    }
    this.handleAddCand(obj)
  }

  private handleSelectExpType = value => {
    console.log('Running ' + value + ' Experiment')
  }

  private handleAddNs = value => {
    if (value == null) {
      this.setState({ namespace: '', service: '', baseline: '', candidates: [] })
      const svcList = []
      this.setState({ svcList })
    } else {
      this.setState({ namespace: value.text, service: '', baseline: '', candidates: [] })

      setTimeout(async () => {
        const [svcList] = await Promise.all([this.kubeMethods.getSvc(value.text, this.args)])
        this.setState({ svcList })
      })
    }
    this.setState({ deployList: [] })
  }

  private handleAddSvc = value => {
    if (value == null) {
      this.setState({ service: '', baseline: '', candidates: [] })
      const deployList = []
      this.setState({ deployList })
    } else {
      this.setState({ service: value.text, baseline: '', candidates: [] })

      setTimeout(async () => {
        const [deployList] = await Promise.all([
          this.kubeMethods.getDeployment(this.state.namespace, value.text, this.args)
        ])
        this.setState({ deployList })
      })
    }
  }

  private handleEdgeServiceChange = value => {
    if (value === true) {
      this.setState({ edgeService: true })
    } else {
      this.setState({ edgeService: false })
      this.setState({ invalidHostGateways: false })
    }
  }

  private addHostGatewayPairs = value => {
    const hostgateway = value.target.value.split(';')
    const obj = []
    let temp = []
    for (let i = 0; i < hostgateway.length; i++) {
      temp = hostgateway[i].trim().split(',')
      temp[0] = typeof temp[0] === typeof '' ? temp[0].trim() : ''
      temp[1] = typeof temp[1] === typeof '' ? temp[1].trim() : ''
      if (temp[0] === '' || temp[1] === '') {
        continue
      }
      obj.push({ name: temp[0], gateway: temp[1] })
    }
    if (obj.length === 0) {
      this.setState({ invalidHostGateways: true })
    } else {
      this.setState({ invalidHostGateways: false })
      this.setState({ hostGateways: obj })
    }
  }

  private handleAddBase = value => {
    if (value == null) this.setState({ baseline: '', candidates: [] })
    else this.setState({ baseline: value.text, candidates: [] })
  }

  /*
   * ==== Metric Configuration Handler Functions ====
   */

  // Method for Add Metric (+) button
  private addCriterion() {
    this.setState({ totalMetricsList: this.state.countMetricsList.concat(this.state.ratioMetricsList) })

    if (this.state.showCriteria) {
      // If a criterion is already shown, add a new criterion
      this.setState(prevState => ({
        criteria: [...prevState.criteria, { name: '', type: '', reward: false, limitType: '', limitValue: 0 }]
      }))
    } else {
      // If no criteria has been addded, add the first criterion
      this.setState({ showCriteria: true })
    }
  }

  // Removes the metric field from the state
  private deleteCriterion = idx => {
    this.setState(state => {
      const criteria = state.criteria.filter((m, i) => i !== idx)
      return {
        criteria
      }
    })
  }

  // Handles metric selection from dropdown
  private handleMetricName = (value, idx) => {
    let metricName
    let metricType
    // Removal of a selected value
    if (value == null) {
      metricName = ''
      metricType = ''
    }
    // Check for metric type (ratio/counter)
    else {
      metricName = value.name
      metricType = 'Ratio'

      // TODO: handle error
      for (let i = 0; i < this.state.countMetricsList.length; i++) {
        if (this.state.countMetricsList[i].name === value.name) metricType = 'Counter'
      }
    }
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], name: metricName, type: metricType }
    this.setState({ criteria: newMetric })
  }

  // Updates states based on limit type changes
  private handleLimitTypeChange = (value, idx) => {
    const limitType = value ? 'relative' : 'absolute'
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], limitType: limitType }
    this.setState({ criteria: newMetric })
  }

  // Update the state for limit value
  private handleLimitValChange = (value, idx) => {
    const limitValue = value === '' ? 0 : parseFloat(value)
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], limitValue: limitValue }
    this.setState({ criteria: newMetric })
  }

  // Disables all the other checkboxes
  private handleRewardChange = idx => {
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], reward: !newMetric[idx].reward }
    this.setState(prevState => ({
      criteria: newMetric,
      disableReward: !prevState.disableReward
    }))
  }

  /*
   *	==== Form Submission Handlers ====
   */
  private submitForm() {
    const d = new Date(Date.now() - 20000)
    const time = d.toISOString()
    const jsonOutput = getRequestModel(time, this.state, this.args)
    // Transmit data to Decision form using eventBus
    eventChannelUnsafe.emit('/get/decision', jsonOutput)
  }

  // Cancels form submission event caused by "Enter" press
  private preventFormRefresh(event) {
    event.preventDefault()
    document.getElementById('submitform').setAttribute('disabled', '')
    document.getElementById('addcriterion').setAttribute('disabled', '')
  }

  public render() {
    const { criteria } = this.state
    return (
      <Form className="plugin-iter8-formProps" onSubmit={this.preventFormRefresh}>
        <div>
          <FormGroup legendText="" style={{ width: 600 }}>
            <h3>
              <span style={{ fontFamily: 'monospace', fontSize: 'larger' }}>iter8 </span> Experiment Configurations{' '}
            </h3>
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <TextInput
              id="experiment-name"
              labelText="Name"
              helperText="Name to identify the experiment."
              placeholder="Eg: experiment_v1_v2"
              onChange={this.handleNameChange}
              type="text"
              invalidText="This is a required field."
              required
            ></TextInput>
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <ComboBox
              id="experiment-type-select"
              titleText="Experiment Type"
              helperText="Type of experiment to be conducted"
              placeholder="Select an Experiment Type"
              items={[experimentTypes.hil]}
              onChange={value => this.handleSelectExpType(value.selectedItem)}
              required
            />
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <ComboBox
              id="namespace-select"
              titleText="Service Namespace"
              helperText="Namespace where the target service resides"
              placeholder="Select a Namespace"
              items={this.state.nsList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddNs(value.selectedItem)}
              required
            />
          </FormGroup>
          <FormGroup legendText="">
            <Toggle
              aria-label=""
              labelText="Edge Service"
              id="edge-service"
              defaultToggled
              labelA="False"
              labelB="True"
              onToggle={value => this.handleEdgeServiceChange(value)}
            />
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <TextInput
              id="hostGateway"
              labelText="Host/Gateway pairs"
              helperText="Enter Host and gateway names for edge service"
              placeholder="Eg: hostname1, gatewayname1; hostname2, gatewayname2"
              onChange={value => this.addHostGatewayPairs(value)}
              type="text"
              disabled={!this.state.edgeService}
              invalid={this.state.invalidHostGateways}
              invalidText="Invalid Host Gateway Pairs. Try again"
            ></TextInput>
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <ComboBox
              id="service-select"
              titleText="Service"
              helperText="Name of the target service"
              placeholder="Select a Service"
              items={this.state.svcList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddSvc(value.selectedItem)}
              required
            />
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <ComboBox
              id="baseline-select"
              titleText="Baseline Deployment"
              helperText="The version of the service to be used as experimental baseline"
              placeholder="Select a Baseline Deployment"
              items={this.state.deployList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddBase(value.selectedItem)}
              required
            />
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <p>
              <span> Candidate Deployment(s) </span>
              <br />
              <span className="helper"> The version(s) of the service to be used as experimental candidate(s).</span>
            </p>
            <MultiSelect
              id="candidates-select"
              items={this.state.deployList}
              itemToString={item => (item ? item.text : '')}
              label="Select Candidate Deployment(s)"
              onChange={value => this.handleAddCand(value.selectedItems)}
              invalid={this.state.invalidCandidate}
              invalidText="Cannot select same version as experimental baseline."
            />
            <br />
            <TextInput
              id="candidate-name"
              labelText="or Add Candidate Deployment(s) below:"
              helperText="Comma separated candidate names"
              placeholder="reviews_v3, reviews_v4"
              onChange={value => this.handleSplitCand(value)}
              type="text"
            ></TextInput>
          </FormGroup>
          {this.state.showCriteria ? (
            <FormGroup legendText="">
              <div style={{ position: 'relative' }}>
                {criteria.map((val, idx) => {
                  const criterionId = `criterion-${idx}`
                  const limitTypeId = `limitType-${idx}`
                  const limitValueId = `limitValue-${idx}`
                  const deletecriterion = `deletecriterion-${idx}`
                  const checkId = `checkbox-${idx}`
                  return (
                    <div style={{ padding: 20 }} key={idx}>
                      <h5> {`Criterion #${idx + 1}`}</h5>
                      <ComboBox
                        id={criterionId}
                        titleText="Metric name"
                        helperText="Metric to be used for this critetion"
                        placeholder="Select a Metric"
                        items={this.state.totalMetricsList}
                        itemToString={item => (item ? item.name : '')}
                        onChange={value => this.handleMetricName(value.selectedItem, idx)}
                      />
                      <Tag type="cyan">{val.type === '' ? '...' : val.type}</Tag>
                      <Tag type="magenta">
                        {val.reward
                          ? 'Reward'
                          : val.limitType === ''
                          ? 'Absolute Threshold'
                          : `${val.limitType} threshold`}
                      </Tag>
                      <br></br>
                      <span className="child">
                        {val.limitType ? null : this.handleLimitTypeChange(false, idx)}
                        <Toggle
                          aria-label=""
                          labelText="Threshold Type"
                          id={limitTypeId}
                          disabled={val.reward}
                          labelA="Absolute"
                          labelB="Relative"
                          onToggle={value => this.handleLimitTypeChange(value, idx)}
                        />
                      </span>
                      <span className="child">
                        <TextInput
                          id={limitValueId}
                          labelText="Limit Value"
                          helperText="Set a value for the threshold selected"
                          disabled={val.reward}
                          invalid={val.reward && val.limitValue !== 0}
                          invalidText="Limit values can only be set for non-reward metrics"
                          onChange={e => this.handleLimitValChange(e.target.value, idx)}
                        />
                      </span>
                      <Checkbox
                        id={checkId}
                        labelText="Set as reward"
                        disabled={(!val.reward && this.state.disableReward) || val.type === 'Counter'}
                        onChange={() => this.handleRewardChange(idx)}
                      />
                      <Button
                        id={deletecriterion}
                        size="small"
                        kind="ghost"
                        renderIcon={SubtractAlt32}
                        onClick={() => this.deleteCriterion(idx)}
                        style={{ color: 'red', paddingLeft: 'initial' }}
                      >
                        {`Delete Criterion ${idx + 1}`}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </FormGroup>
          ) : null}
          <FormGroup legendText="" style={{ width: 350 }}>
            <Button
              id="addcriterion"
              style={{ position: 'relative', backgroundColor: 'mediumseagreen' }}
              size="default"
              kind="primary"
              renderIcon={Data132}
              onClick={this.addCriterion}
            >
              Add Criterion
            </Button>
          </FormGroup>
          <FormGroup legendText="" style={{ width: 350 }}>
            <Button id="submitform" type="submit" size="default" renderIcon={View32} onClick={this.submitForm}>
              Create Experiment
            </Button>
          </FormGroup>
        </div>
      </Form>
    )
  }
}
