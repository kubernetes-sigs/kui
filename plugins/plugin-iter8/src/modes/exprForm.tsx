import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
// Component Imports
import { Form, FormGroup, TextInput, Button, MultiSelect, Checkbox, ComboBox, Tag } from 'carbon-components-react'
import { View32, SubtractAlt32, Data_132 as Data132 } from '@carbon/icons-react'
// UI Style imports
import '../../src/web/scss/static/exprForm.scss'
import '@kui-shell/plugin-client-common/web/css/static/Tooltip.scss'
import 'carbon-components/scss/components/combo-box/_combo-box.scss'
import 'carbon-components/scss/components/select/_select.scss'
import 'carbon-components/scss/components/multi-select/_multi-select.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/checkbox/_checkbox.scss'
// Functionality Imports
import GetKubeInfo from '../components/cluster-info'
import GetMetricConfig from '../components/metric-config'
import getRequestModel from '../utility/get-iter8-req'
import { Formstate, experimentTypes } from '../modes/state-models'

/*
 * Data models for the state object in ExprForm
 */

class ExprBase extends React.Component<{}, Formstate> {
  // imported class of methods from /components
  private kubeMethods = new GetKubeInfo()
  private GetMetricConfig = new GetMetricConfig()
  // Lists of dropdown menu items
  private nsList = this.kubeMethods.getNamespace()
  private countMetricsList = this.GetMetricConfig.getCounterMetrics()
  private ratioMetricsList = this.GetMetricConfig.getRatioMetrics()
  private totMetricsList = this.countMetricsList.concat(this.ratioMetricsList)
  private svcList = []
  private deployList = []

  public constructor(props) {
    super(props)
    this.state = {
      disableResubmit: false, // prevents form resubmission
      showCriteria: false, // determines the visibility of metric config section
      invalidCandidate: false, // determines whether candidates values are valid
      name: '', // name of the experiment
      type: experimentTypes.HIL, // type of experiment: HIL vs automated
      namespace: '', // namespace of microservice
      service: '', // service name of microservice
      baseline: '', // baseline deployment of microservice
      candidates: [], // list of candidates deployment names of microservice
      criteria: [{ name: '', type: '', reward: false, limitType: '', limitValue: 0 }], // metric attributes
      disableReward: false // disables the reward select for selected metrics
    }
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

  private handleSelectExpType = value => {
    console.log('Running ' + value + ' Experiment')
  }

  private handleAddNs = value => {
    if (value == null) {
      this.setState({ namespace: '', service: '', baseline: '', candidates: [] })
      this.svcList = []
    } else {
      this.setState({ namespace: value.text, service: '', baseline: '', candidates: [] })
      this.svcList = this.kubeMethods.getSvc(value.text)
    }
    this.deployList = []
  }

  private handleAddSvc = value => {
    if (value == null) {
      this.setState({ service: '', baseline: '', candidates: [] })
      this.deployList = []
    } else {
      this.setState({ service: value.text, baseline: '', candidates: [] })
      this.deployList = this.kubeMethods.getDeployment(this.state.namespace, value.text)
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
      for (let i = 0; i < this.countMetricsList.length; i++) {
        if (this.countMetricsList[i].name === value.name) metricType = 'Counter'
      }
    }
    const newMetric = [...this.state.criteria]
    newMetric[idx] = { ...newMetric[idx], name: metricName, type: metricType }
    this.setState({ criteria: newMetric })
  }

  // Updates states based on limit type changes
  private handleLimitTypeChange = (value, idx) => {
    const limitType = value == null ? '' : value
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
    // Get the current time in ISO form
    const d = new Date()
    const time = d.toISOString()
    // Reorganize form input into Iter8 Request model
    const jsonOutput = getRequestModel(time, this.state)
    // Transmit data to Decision form using eventBus
    eventChannelUnsafe.emit('/get/decision', jsonOutput)
    this.setState({ disableResubmit: true })
  }

  // Cancels form submission event caused by "Enter" press
  private preventFormRefresh(event) {
    event.preventDefault()
  }

  public render() {
    const { criteria } = this.state
    return (
      <Form className="formProps" onSubmit={this.preventFormRefresh}>
        <div>
          <FormGroup style={{ width: 600 }}>
            <h3>
              <span style={{ fontFamily: 'monospace', fontSize: 'larger' }}>iter8 </span> Experiment Configurations{' '}
            </h3>
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <TextInput
              id="experiment-name"
              labelText="Name"
              helperText="Name to identify the experiment."
              placeholder="Eg: experiment_v1_v2"
              onChange={this.handleNameChange}
              type="text"
            ></TextInput>
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <ComboBox
              id="experiment-type-select"
              titleText="Experiment Type"
              helperText="Type of experiment to be conducted"
              placeholder="Select an Experiment Type"
              items={[experimentTypes.HIL]}
              onChange={value => this.handleSelectExpType(value.selectedItem)}
            />
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <ComboBox
              id="namespace-select"
              titleText="Service Namespace"
              helperText="Namespace where the target service resides"
              placeholder="Select a Namespace"
              items={this.nsList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddNs(value.selectedItem)}
            />
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <ComboBox
              id="service-select"
              titleText="Service"
              helperText="Name of the target service"
              placeholder="Select a Service"
              items={this.svcList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddSvc(value.selectedItem)}
            />
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <ComboBox
              id="baseline-select"
              titleText="Baseline Deployment"
              helperText="The version of the service to be used as experimental baseline"
              placeholder="Select a Baseline Deployment"
              items={this.deployList}
              itemToString={item => (item ? item.text : '')}
              onChange={value => this.handleAddBase(value.selectedItem)}
            />
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <p>
              <span className="coralColor"> Candidate Deployment(s) </span>
              <br />
              <span className="helper"> The version(s) of the service to be used as experimental candidate(s).</span>
            </p>
            <MultiSelect
              classname="extendwidth"
              id="candidates-select"
              items={this.deployList}
              itemToString={item => (item ? item.text : '')}
              label="Select Candidate Deployment(s)"
              onChange={value => this.handleAddCand(value.selectedItems)}
              invalid={this.state.invalidCandidate}
              invalidText="Cannot select same version as experimental baseline."
            />
          </FormGroup>
          <FormGroup style={{ width: 350 }}>
            <Button
              style={{ position: 'relative', backgroundColor: 'mediumseagreen' }}
              size="default"
              kind="primary"
              renderIcon={Data132}
              onClick={this.addCriterion}
            >
              Add Criterion
            </Button>
          </FormGroup>
          {this.state.showCriteria ? (
            <FormGroup>
              <div style={{ position: 'relative' }}>
                {criteria.map((val, idx) => {
                  const criterionId = `criterion-${idx}`
                  const limitTypeId = `limitType-${idx}`
                  const limitValueId = `limitValue-${idx}`
                  const checkId = `checkbox-${idx}`
                  return (
                    <div
                      style={{ padding: 5, borderBottom: 'gray', borderStyle: 'dashed', borderBottomWidth: 'thin' }}
                      key={idx}
                    >
                      <h5> {`Criterion #${idx + 1}`}</h5>
                      <ComboBox
                        id={criterionId}
                        titleText="Metric name"
                        helperText="Metric to be used for this critetion"
                        placeholder="Select a Metric"
                        items={this.totMetricsList}
                        itemToString={item => (item ? item.name : '')}
                        onChange={value => this.handleMetricName(value.selectedItem, idx)}
                      />
                      <Tag type="teal">{'Info:'}</Tag>
                      <Tag type="cyan">{val.type === '' ? '...' : val.type}</Tag>
                      <Tag type="magenta">{val.reward ? 'Reward' : '...'}</Tag>
                      <Tag type="cool-gray">{val.limitType === '' ? '...' : `${val.limitType} threshold`}</Tag>
                      <ComboBox
                        id={limitTypeId}
                        titleText="Limit Type"
                        helperText="For non-reward criteria, designate the type of threshold to be set for the metric"
                        placeholder="Select the type of threshold"
                        disabled={val.reward}
                        invalid={val.reward && val.limitType !== ''}
                        invalidText="Limits can only be set for non-reward metrics"
                        items={['absolute', 'relative']}
                        onChange={value => this.handleLimitTypeChange(value.selectedItem, idx)}
                        style={{ width: 350 }}
                      />
                      <TextInput
                        id={limitValueId}
                        labelText="Limit Value"
                        helperText="Set a value for the threshold selected"
                        disabled={val.reward}
                        invalid={val.reward && val.limitValue !== 0}
                        invalidText="Limit values can only be set for non-reward metrics"
                        onChange={e => this.handleLimitValChange(e.target.value, idx)}
                        style={{ width: 350 }}
                      />
                      <Checkbox
                        id={checkId}
                        labelText="Set as reward"
                        disabled={(!val.reward && this.state.disableReward) || val.type === 'Counter'}
                        onChange={() => this.handleRewardChange(idx)}
                      />
                      <Button
                        size="small"
                        kind="ghost"
                        renderIcon={SubtractAlt32}
                        onClick={() => this.deleteCriterion(idx)}
                        style={{ color: 'red' }}
                      >
                        {`Delete Criterion ${idx + 1}`}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </FormGroup>
          ) : null}
          <FormGroup style={{ width: 350 }}>
            <Button
              size="default"
              kind="primary"
              renderIcon={View32}
              disabled={this.state.invalidCandidate || this.state.disableResubmit}
              onClick={this.submitForm}
              style={{ fontSize: 'medium' }}
            >
              Create Experiment
            </Button>
          </FormGroup>
        </div>
      </Form>
    )
  }
}

export function renderForm() {
  return {
    react: function renderComponent() {
      return <ExprBase />
    }
  }
}
