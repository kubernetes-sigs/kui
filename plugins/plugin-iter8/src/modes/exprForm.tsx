/*
 * Copyright 2020 The Kubernetes Authors
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
import { eventChannelUnsafe, Tab } from '@kui-shell/core'
// Component Imports
import {
  ActionGroup,
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  FormSelect,
  FormSelectOption,
  Switch as Toggle
} from '@patternfly/react-core'
import { Button, Tag } from '@kui-shell/plugin-client-common'
// UI Style imports
import '../../src/web/scss/static/exprForm.scss'
// Functionality Imports
import GetKubeInfo from '../components/cluster-info'
import { GetMetricConfig } from '../components/metric-config'
import getRequestModel from '../utility/get-iter8-req'
import { Formstate } from '../modes/state-models'
import { experimentTypes } from '../utility/variables'

import MultiSelect from './MultiSelect'

/*
 * Data models for the state object in ExprForm
 */

type Props = Tab

export default class ExprBase extends React.Component<Props, Formstate> {
  // imported class of methods from /components
  private kubeMethods = new GetKubeInfo()
  private GetMetricConfig = new GetMetricConfig()
  // Lists of dropdown menu items
  private args: Props

  public constructor(props: Props) {
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

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
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

  private handleSelectExpType = (value: string) => {
    console.log('Running ' + value + ' Experiment')
  }

  private handleAddNs = (value: string) => {
    if (value == null) {
      this.setState({ namespace: '', service: '', baseline: '', candidates: [] })
      const svcList = []
      this.setState({ svcList })
    } else {
      this.setState({ namespace: value, service: '', baseline: '', candidates: [] })

      setTimeout(async () => {
        const [svcList] = await Promise.all([this.kubeMethods.getSvc(value, this.args)])
        this.setState({ svcList })
      })
    }
    this.setState({ deployList: [] })
  }

  private handleAddSvc = (value: string) => {
    if (value == null) {
      this.setState({ service: '', baseline: '', candidates: [] })
      const deployList = []
      this.setState({ deployList })
    } else {
      this.setState({ service: value, baseline: '', candidates: [] })

      setTimeout(async () => {
        const [deployList] = await Promise.all([this.kubeMethods.getDeployment(this.state.namespace, value, this.args)])
        this.setState({ deployList })
      })
    }
  }

  private handleEdgeServiceChange = (value: boolean) => {
    if (value === true) {
      this.setState({ edgeService: true })
    } else {
      this.setState({ edgeService: false })
      this.setState({ invalidHostGateways: false })
    }
  }

  private addHostGatewayPairs = (value: string) => {
    const hostgateway = value.split(';')
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

  private handleAddBase = (value: string) => {
    if (value == null) this.setState({ baseline: '', candidates: [] })
    else this.setState({ baseline: value, candidates: [] })
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
  private handleLimitTypeChange = (value: boolean, idx: number) => {
    const limitType = value ? 'relative' : 'absolute'
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], limitType: limitType }
    this.setState({ criteria: newMetric })
  }

  // Update the state for limit value
  private handleLimitValChange = (value: string, idx: number) => {
    const limitValue = value === '' ? 0 : parseFloat(value)
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], limitValue: limitValue }
    this.setState({ criteria: newMetric })
  }

  // Disables all the other checkboxes
  private handleRewardChange = (idx: number) => {
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
      <div className="padding-content scrollable scrollable-auto">
        <h2>iter8 Experiment Configurations</h2>
        <Form className="plugin-iter8-formProps" onSubmit={this.preventFormRefresh}>
          <FormGroup
            style={{ width: 350 }}
            label="Name"
            helperText="Name to identify the experiment"
            helperTextInvalid="This is a required field"
            isRequired
            fieldId="exprForm-id-2"
          >
            <TextInput
              id="experiment-name"
              placeholder="Eg: experiment_v1_v2"
              onChange={this.handleNameChange}
              type="text"
            ></TextInput>
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Experiment Type"
            helperText="Type of experiment to be conducted"
            isRequired
            fieldId="exprForm-id-3"
          >
            <FormSelect
              id="experiment-type-select"
              placeholder="Select an Experiment Type"
              onChange={value => this.handleSelectExpType(value)}
            >
              {[experimentTypes.hil].map((option, idx) => (
                <FormSelectOption key={idx} label={option} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Service Namespace"
            helperText="Namespace where the target service resides"
            isRequired
            fieldId="exprForm-id-4"
          >
            <FormSelect
              id="namespace-select"
              placeholder="Select a Namespace"
              onChange={value => this.handleAddNs(value)}
            >
              {this.state.nsList.map((option, idx) => (
                <FormSelectOption key={idx} label={option ? option.text : ''} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup label="Edge Service" fieldId="exprForm-id-5">
            <Toggle
              aria-label=""
              id="edge-service"
              isChecked
              label="False"
              labelOff="True"
              onChange={value => this.handleEdgeServiceChange(value)}
            />
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Host/Gateway pairs"
            helperText="Enter Host and gateway names for edge service"
            helperTextInvalid="Invalid Host Gateway Pairs. Try again"
            validated={this.state.invalidHostGateways ? 'error' : 'default'}
            fieldId="exprForm-id-6"
          >
            <TextInput
              id="hostGateway"
              placeholder="Eg: hostname1, gatewayname1; hostname2, gatewayname2"
              onChange={value => this.addHostGatewayPairs(value)}
              type="text"
              isDisabled={!this.state.edgeService}
            ></TextInput>
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Service"
            helperText="Name of the target service"
            isRequired
            fieldId="exprForm-id-7"
          >
            <FormSelect id="service-select" placeholder="Select a Service" onChange={value => this.handleAddSvc(value)}>
              {this.state.svcList.map((option, idx) => (
                <FormSelectOption key={idx} label={option ? option.text : ''} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Baseline Deployment"
            helperText="The version of the service to be used as experimental baseline"
            isRequired
            fieldId="exprForm-id-8"
          >
            <FormSelect
              id="baseline-select"
              placeholder="Select a Baseline Deployment"
              onChange={value => this.handleAddBase(value)}
            >
              {this.state.deployList.map((option, idx) => (
                <FormSelectOption key={idx} label={option ? option.text : ''} />
              ))}
            </FormSelect>
          </FormGroup>
          <FormGroup
            style={{ width: 350 }}
            label="Select Candidate Deployment(s)"
            validated={this.state.invalidCandidate ? 'error' : 'default'}
            helperTextInvalid="Cannot select same version as experimental baseline."
            fieldId="exprForm-id-9"
          >
            <p>
              <span> Candidate Deployment(s) </span>
              <br />
              <span className="helper"> The version(s) of the service to be used as experimental candidate(s).</span>
            </p>
            <MultiSelect
              id="candidates-select"
              options={this.state.deployList.map(_ => (_ ? _.text : ''))}
              onChange={selectedItems => this.handleAddCand(selectedItems)}
            />
          </FormGroup>
          <FormGroup
            label="or Add Candidate Deployment(s) below:"
            helperText="Comma separated candidate names"
            fieldId="exprForm-id-10"
          >
            <TextInput
              id="candidate-name"
              placeholder="reviews_v3, reviews_v4"
              onChange={value => this.handleSplitCand(value)}
              type="text"
            ></TextInput>
          </FormGroup>
          {this.state.showCriteria ? (
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
                    <FormGroup
                      fieldId={`exprForm-id-11-${idx}-1`}
                      label="Metric name"
                      helperText="Metric to be used for this critetion"
                    >
                      <FormSelect id={criterionId} onChange={value => this.handleMetricName(value, idx)}>
                        {this.state.totalMetricsList.map((option, idx) => (
                          <FormSelectOption key={idx} label={option ? option.name : ''} />
                        ))}
                      </FormSelect>
                    </FormGroup>
                    <Tag type="ok">{val.type === '' ? '...' : val.type}</Tag>
                    <Tag type="warning">
                      {val.reward
                        ? 'Reward'
                        : val.limitType === ''
                        ? 'Absolute Threshold'
                        : `${val.limitType} threshold`}
                    </Tag>
                    <br></br>
                    <span className="child">
                      {val.limitType ? null : this.handleLimitTypeChange(false, idx)}
                      <FormGroup fieldId={`exprForm-id-11-${idx}-2`} label="Threshold Type">
                        <Toggle
                          aria-label=""
                          id={limitTypeId}
                          isDisabled={val.reward}
                          label="Absolute"
                          labelOff="Relative"
                          onChange={value => this.handleLimitTypeChange(value, idx)}
                        />
                      </FormGroup>
                    </span>
                    <span className="child">
                      <FormGroup
                        fieldId={`exprForm-id-11-${idx}-3`}
                        label="Limit Value"
                        helperText="Set a value for the threshold selected"
                        helperTextInvalid="Limit values can only be set for non-reward metrics"
                        validated={val.reward && val.limitValue !== 0 ? 'error' : 'default'}
                      >
                        <TextInput
                          id={limitValueId}
                          isDisabled={val.reward}
                          onChange={value => this.handleLimitValChange(value, idx)}
                        />
                      </FormGroup>
                    </span>
                    <FormGroup fieldId={`exprForm-id-11-${idx}-4`} label="Set as reward">
                      <Checkbox
                        id={checkId}
                        isDisabled={(!val.reward && this.state.disableReward) || val.type === 'Counter'}
                        onChange={() => this.handleRewardChange(idx)}
                      />
                    </FormGroup>
                    <Button id={deletecriterion} size="small" kind="danger" onClick={() => this.deleteCriterion(idx)}>
                      {`Delete Criterion ${idx + 1}`}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : null}
          <ActionGroup>
            <FormGroup style={{ width: 350 }} fieldId="exprForm-id-12">
              <Button id="addcriterion" size="default" kind="primary" onClick={this.addCriterion}>
                Add Criterion
              </Button>
            </FormGroup>
            <FormGroup style={{ width: 350 }} fieldId="exprForm-id-13">
              <Button id="submitform" type="submit" size="default" onClick={this.submitForm}>
                Create Experiment
              </Button>
            </FormGroup>
          </ActionGroup>
        </Form>
      </div>
    )
  }
}
