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
// Component imports
import { Alert, Button, Icons, Loading } from '@kui-shell/plugin-client-common'
import { Caption, TableComposable, Thead, Tbody, Th, Tr, Td } from '@patternfly/react-table'
import { Form, FormGroup, FormSelect, FormSelectOption, TextInput } from '@patternfly/react-core'
const Chart = React.lazy(() => import('react-apexcharts'))
// Styling imports
import '../../src/web/scss/static/decisionForm.scss'
// Functional imports
import { DecisionState } from '../modes/state-models'
import GetAnalyticsAssessment from '../utility/get-analytics-assessment'
// import { getAnalyticsResponse } from '../utility/get-response'
import NameDict from '../utility/get-display-name'
import { criteriaChartDesign } from '../utility/variables'
import { trafficCheck, getUserDecision, applyTrafficSplit } from '../components/traffic-split'

// Function for round off
function roundoff(value, fix = 4) {
  if (value == null) {
    return null
  }
  return parseFloat(value.toFixed(fix))
}

// Model for exprForm.tsx state
interface TableProps {
  id: string
  rows: any
  headers: any
  title: string
  params: any
}

const renderTable = (props: TableProps) => (
  <React.Fragment>
    {props.title && <Caption>{props.title}</Caption>}
    <Thead>
      <Tr>
        {props.headers.map(header => (
          <Th key={header.key}>{header.header}</Th>
        ))}
      </Tr>
    </Thead>
    <Tbody>
      {props.rows.map(row => (
        <Tr key={row.id}>
          {row.cells.map(cell => (
            <Td key={cell.id}>
              <div>{cell.value}</div>
            </Td>
          ))}
        </Tr>
      ))}
    </Tbody>
  </React.Fragment>
)

type Props = Tab

export default class DecisionBase extends React.Component<Props, DecisionState> {
  private _isMounted = false
  private winner = ''
  // For displaying Traffic Suggestion Section
  private algoList = []
  private trafficRecs = []
  // Get list of deployments
  private deployList = []

  private notifKey = 0

  // for the table displaying deployment information
  private basicStatsHeader = []
  private basicStatsRows = []

  // For Displaying Advanced Statistics Section
  private advancedStatisticsObject = {}
  private advancedStatisticsNames = {}
  private advancedStatiticsHeaders = []
  private args: Props

  public constructor(props: Props) {
    super(props)
    this.args = props
    this.state = {
      selectedAlgo: 'progressive', // Assumes that progressive is always the first algorithm
      trafficSplit: [{ version: '', split: 0 }], // Traffic split to be applied to each service (modified by analytics service or on toggle)
      currentSplit: [], // Current traffic split that has been applied to the service
      trafficErr: false, // true if sum(traffic) != 100
      notifyUser: false, // true if vs has been successfully created
      notifyTime: '', // timestamp assoc. with notification
      experimentCreated: false, // true if user has finished expr creation
      haveResults: false, // true if Iter8 AJAX call has been successful
      experimentRequest: null, // JSON object sent as Iter8 Request
      experimentResult: null, // JSON object returned from Iter8 API
      haveAdvancedStatistics: false, // Bool set to true if ratio Metrics were added when creating experiment
      haveCriteriaComparison: false, // Bool set to true if any criteria were added when creating expeirment
      selectedAdvancedStatistic: 'Credible Interval', // Initial selection for the analytics assessment dropdown
      showAdvancedStatistics: false, // Toggle to show advanced statistics
      advancedStatisticsRows: [], // table Row values for Advanced statistics
      hasExperimentEnded: false, // set to true if experiment has ended
      experimentDecision: 'rollback', // ID final experiment decision. Defaults to rollback
      endExperimentWinner: '', // Name of the service/deployment which gets all the traffic when experiment ends
      chartData: [], // Stores data for the criteria graphs
      chartOptions: {}, // Stores options for criteria graphs
      edgeService: true,
      hostGateways: []
    }
    this.handleReset = this.handleReset.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleCloseNotif = this.handleCloseNotif.bind(this)
    this.handleGetAssessment = this.handleGetAssessment.bind(this)
    this.toggleAdvancedStatistics = this.toggleAdvancedStatistics.bind(this)
    this.getAdvancedStatistics = this.getAdvancedStatistics.bind(this)
    this.endExperiment = this.endExperiment.bind(this)
  }

  public componentDidMount() {
    console.log('Mounted Decision tab')
    this._isMounted = true
    eventChannelUnsafe.on('/get/decision', formstate => {
      this.setState({
        edgeService: formstate.edgeServiceInformation.edgeService,
        hostGateways: formstate.edgeServiceInformation.hostGateways,
        experimentCreated: true,
        experimentRequest: formstate
      })
    })
  }

  public componentWillUnmount() {
    console.log('Unmounted Decision')
    this._isMounted = false
  }

  /*
   *  ==== Methods to populate component attributes ===
   */

  // Sets display with winner information
  private getWinAnalysis(apiResult) {
    if (apiResult.winner_assessment.winning_version_found) {
      const prob = roundoff(apiResult.winner_assessment.probability_of_winning_for_best_version, 4)
      this.winner = `Version: ${apiResult.winner_assessment.current_best_version} is the winner with ${prob} probability of winning`
    } else {
      this.winner = 'Do not have enough data to determine winner'
    }
  }

  // Fill pie chart with version probabilities
  private getWinProbAndBasicStats(apiResult) {
    const dataLabels = []
    this.basicStatsHeader = [
      { header: 'Deployment', key: 'version' },
      { header: 'Type', key: 'type' },
      { header: 'Request Count', key: 'count' },
      { header: 'Win Probability', key: 'winprob' },
      { header: 'Roll Back Recommended', key: 'rollback' }
    ]
    const baseRlts = apiResult.baseline_assessment
    this.basicStatsRows = []
    this.basicStatsRows.push({
      id: baseRlts.id,
      version: baseRlts.id,
      type: 'Baseline',
      count: baseRlts.request_count,
      winprob: roundoff(baseRlts.win_probability, 4),
      rollback: 'Does not apply'
    })
    dataLabels.push(baseRlts.id)

    const candRlts = apiResult.candidate_assessments
    for (let i = 0; i < candRlts.length; i++) {
      this.basicStatsRows.push({
        id: candRlts[i].id,
        version: candRlts[i].id,
        type: 'Candidate',
        count: candRlts[i].request_count,
        winprob: roundoff(candRlts[i].win_probability, 4),
        rollback: candRlts[i].rollback.toString()
      })
      dataLabels.push(candRlts[i].id)
    }
  }

  // Get the list of algorithms available
  private getAlgo(apiResult) {
    const trafficRecs = apiResult.traffic_split_recommendation
    const tempAlgoList = []
    const DisplayDict = new NameDict()
    // Iterate through the traffic recommendations
    Object.getOwnPropertyNames(trafficRecs).forEach(key => {
      const algoName = DisplayDict.getAlgoName(key)
      tempAlgoList.push({
        id: key,
        text: algoName
      })
    })
    this.algoList = tempAlgoList
  }

  // Fill display with traffic rec suggestions
  private getTrafficRecs(algorithm, data) {
    const trafficRecs = data.traffic_split_recommendation
    let algoRecs = {}
    const recList = []
    Object.getOwnPropertyNames(trafficRecs).forEach(key => {
      if (key === algorithm) algoRecs = trafficRecs[key]
    })
    Object.getOwnPropertyNames(algoRecs).forEach(key => {
      recList.push({
        version: key,
        split: algoRecs[key]
      })
    })
    this.trafficRecs = recList
    return recList
  }

  // Returns true if the experiment involves any success/failure criteria
  private haveCriteriaComparison() {
    if (this.state.experimentRequest.criteria.length) {
      return true
    } else {
      return false
    }
  }

  // Fill chart data with an initial template
  private fillchartDataTemplate() {
    const baselineCriteriaResults = this.state.experimentResult.baseline_assessment.criterion_assessments
    const tempChartData = []
    const tempChartOptions = {}
    // Get chart details from baseline
    for (let i = 0; i < baselineCriteriaResults.length; i++) {
      // Getting Chart Options
      const options = JSON.parse(JSON.stringify(criteriaChartDesign))
      const d = new Date()
      const time = d.toISOString()
      options.xaxis.categories.push(time)
      tempChartOptions[baselineCriteriaResults[i].metric_id] = options

      // Get Chart Data
      const perMetricData = { title: baselineCriteriaResults[i].metric_id, data: [] }
      if ({}.hasOwnProperty.call(this.state.experimentRequest.criteria[i], 'threshold')) {
        if (this.state.experimentRequest.criteria[i].threshold.type === 'absolute') {
          perMetricData.data.push({
            name: 'threshold',
            data: [roundoff(this.state.experimentRequest.criteria[i].threshold.value, 4)]
          })
        } else {
          perMetricData.data.push({
            name: 'threshold',
            data: [
              roundoff(
                (1 + this.state.experimentRequest.criteria[i].threshold.value) *
                  baselineCriteriaResults[i].statistics.value
              )
            ]
          })
        }
      }
      perMetricData.data.push({
        name: this.state.experimentResult.baseline_assessment.id,
        data: [roundoff(baselineCriteriaResults[i].statistics.value)]
      })
      tempChartData.push(perMetricData)
    }

    // getchart details from candidates
    const candidateCriteriaResult = this.state.experimentResult.candidate_assessments
    for (let i = 0; i < candidateCriteriaResult.length; i++) {
      const candidateVersion = candidateCriteriaResult[i].id
      for (let j = 0; j < candidateCriteriaResult[i].criterion_assessments.length; j++) {
        const metricResult = candidateCriteriaResult[i].criterion_assessments[j]
        tempChartData[j].data.push({ name: candidateVersion, data: [roundoff(metricResult.statistics.value)] })
      }
    }
    this.setState({ chartData: tempChartData, chartOptions: tempChartOptions })
  }

  // Get details for the criteria charts
  private getChartData() {
    // let baselineCriteriaResults = this.state.experimentResult.baseline_assessment.criterion_assessments
    if (this.state.chartData.length === 0) {
      this.fillchartDataTemplate()
    } else {
      const baselineCriteriaResults = this.state.experimentResult.baseline_assessment.criterion_assessments
      const tempChartData = JSON.parse(JSON.stringify(this.state.chartData))
      const tempChartOptions = JSON.parse(JSON.stringify(this.state.chartOptions))
      // Get chart details from baseline
      for (let i = 0; i < baselineCriteriaResults.length; i++) {
        // Get chart options
        const d = new Date()
        const time = d.toISOString()
        tempChartOptions[baselineCriteriaResults[i].metric_id].xaxis.categories.push(time)

        // Get Chart Data
        if ({}.hasOwnProperty.call(this.state.experimentRequest.criteria[i], 'threshold')) {
          if (this.state.experimentRequest.criteria[i].threshold.type === 'absolute') {
            // tempChartData.data.push({name: 'threshold', data: [this.state.experimentRequest.criteria[i].threshold.value]})
            tempChartData[i].data[0].data.push(roundoff(tempChartData[i].data[0].data[0]))
          } else {
            tempChartData[i].data[0].data.push(
              roundoff(
                (1 + this.state.experimentRequest.criteria[i].threshold.value) *
                  baselineCriteriaResults[i].statistics.value
              )
            )
          }
        }
        tempChartData[i].data[1].data.push(roundoff(baselineCriteriaResults[i].statistics.value))
      }
      // get chart details from candidates
      const candidateCriteriaResult = this.state.experimentResult.candidate_assessments
      for (let i = 0; i < candidateCriteriaResult.length; i++) {
        for (let j = 0; j < candidateCriteriaResult[i].criterion_assessments.length; j++) {
          const metricResult = candidateCriteriaResult[i].criterion_assessments[j]
          tempChartData[j].data[i + 2].data.push(roundoff(metricResult.statistics.value))
        }
      }
      this.setState({ chartData: tempChartData, chartOptions: tempChartOptions })
    }
  }

  // Returns true is the experiment involves criteria involving ratio metrics
  private haveAdvancedStatistics() {
    if (!this.state.experimentRequest.criteria.length) {
      return false
    } else {
      this.advancedStatiticsHeaders = [{ header: 'Deployment', key: 'version' }]
      const DisplayDict = new NameDict()
      const ratioMetrics = JSON.parse(JSON.stringify(this.state.experimentRequest.metric_specs.ratio_metrics))
      for (let i = 0; i < ratioMetrics.length; i++) {
        ratioMetrics[i] = ratioMetrics[i].name
      }
      const criteria = this.state.experimentRequest.criteria
      for (let i = 0; i < criteria.length; i++) {
        if (ratioMetrics.includes(criteria[i].metric_id)) {
          this.advancedStatiticsHeaders.push({
            header: DisplayDict.getMetricName(criteria[i].metric_id),
            key: criteria[i].metric_id
          })
        }
      }
      if (this.advancedStatiticsHeaders.length > 1) {
        return true
      }
      return false
    }
  }

  // Parse the advanced statistics values to be displayed in the table
  private parseAdvancedStatisticsValues(key, val) {
    /*eslint-disable */
    if (key === 'credible_interval' || key === 'improvement_over_baseline') {
      return JSON.stringify([roundoff(val['lower']), roundoff(val['upper'])])
    }
    return roundoff(val)
    /* eslint-enable */
  }

  // Create a JSON object to store row values for advanced staistics
  private createadvancedStatisticsObject() {
    const DisplayDict = new NameDict()
    this.advancedStatisticsNames = DisplayDict.advancedStatisticsNames

    // get all version ids and names
    const versionRows = []
    versionRows.push({
      id: this.state.experimentResult.baseline_assessment.id,
      version: this.state.experimentResult.baseline_assessment.id
    })

    const candList = this.state.experimentResult.candidate_assessments
    for (let i = 0; i < candList.length; i++) {
      versionRows.push({ id: candList[i].id, version: candList[i].id })
    }

    // Get baseline assessment

    const criterionAssessments = []
    criterionAssessments.push(this.state.experimentResult.baseline_assessment.criterion_assessments)
    for (let i = 0; i < this.state.experimentResult.candidate_assessments.length; i++) {
      criterionAssessments.push(this.state.experimentResult.candidate_assessments[i].criterion_assessments)
    }
    const tempObject = {}
    for (let version = 0; version < criterionAssessments.length; version++) {
      for (let metric = 0; metric < criterionAssessments[version].length; metric++) {
        if ({}.hasOwnProperty.call(criterionAssessments[version][metric].statistics, 'ratio_statistics')) {
          if (criterionAssessments[version][metric].statistics['ratio_statistics'] != null) {
            const value = {
              /*eslint-disable */
              improvement_over_baseline: {
                lower: Math.random() * -1,
                upper: Math.random()
              },
              probability_of_beating_baseline: Math.random(),
              probability_of_being_best_version: Math.random(),
              credible_interval: {
                lower: criterionAssessments[version][metric].statistics['ratio_statistics'].credible_interval.lower,
                upper: criterionAssessments[version][metric].statistics['ratio_statistics'].credible_interval.upper
              }
              /* eslint-enable */
            }
            let keys = []
            keys = Object.values(this.advancedStatisticsNames)
            for (let k = 0; k < keys.length; k++) {
              if (!{}.hasOwnProperty.call(tempObject, keys[k])) {
                tempObject[keys[k]] = JSON.parse(JSON.stringify(versionRows))
              }
              tempObject[keys[k]][version][
                criterionAssessments[version][metric].metric_id
              ] = this.parseAdvancedStatisticsValues(keys[k], value[keys[k]])
            }
          }
        }
      }
    }
    this.advancedStatisticsObject = tempObject
  }

  // Get and set Advanced Statistics table values
  private getAdvancedStatistics(key: string) {
    this.setState({ selectedAdvancedStatistic: key })
    this.setState({ advancedStatisticsRows: this.advancedStatisticsObject[this.advancedStatisticsNames[key]] })
  }

  // Toggle Show Advanced Statistics
  private toggleAdvancedStatistics() {
    this.setState({ showAdvancedStatistics: !this.state.showAdvancedStatistics })
  }

  /*
   *  ==== Handlers for DOM elements ===
   */

  // Makes an AJAX call to Iter8 API
  private handleGetAssessment() {
    this.setState({ haveResults: false })

    // Update last state for next iteration
    if (!(this.state.experimentResult === null)) {
      const newIterationRequest = this.state.experimentRequest
      newIterationRequest['last_state'] = this.state.experimentResult.last_state
      this.setState({ experimentRequest: newIterationRequest })
    }
    const AnalyticsAssess = new GetAnalyticsAssessment(this.state.experimentRequest)
    AnalyticsAssess.getAnalyticsAssessment()
      .then(result => {
        const jsonrlts = JSON.parse(JSON.parse(result))
        console.log(jsonrlts)
        // const jsonrlts = getAnalyticsResponse()
        this.getWinAnalysis(jsonrlts)
        this.getWinProbAndBasicStats(jsonrlts)
        this.getAlgo(jsonrlts)
        const traffic = this.getTrafficRecs(this.state.selectedAlgo, jsonrlts)
        this.setState({
          haveResults: true,
          experimentResult: jsonrlts,
          trafficSplit: traffic,
          haveAdvancedStatistics: this.haveAdvancedStatistics(),
          haveCriteriaComparison: this.haveCriteriaComparison(),
          endExperimentWinner: jsonrlts.baseline_assessment.id
        })
        if (this.state.haveCriteriaComparison) {
          this.getChartData()
        }
        if (this.state.haveAdvancedStatistics) {
          this.createadvancedStatisticsObject()
          this.getAdvancedStatistics(this.state.selectedAdvancedStatistic)
        }
        this.getdeployList()
      })
      .catch(failure => {
        console.log(failure)
      })
  }

  // Get list of deployments
  private getdeployList() {
    if (this.deployList.length === 0) {
      this.deployList.push(this.state.experimentRequest.baseline.id)
      const candidates = this.state.experimentRequest.candidates
      for (let i = 0; i < candidates.length; i++) {
        this.deployList.push(candidates[i].id)
      }
    }
  }

  // Get new traffic recommendations for the selected algorithm type
  private handleAlgoChange = (value: string) => {
    this.setState({ selectedAlgo: value })
    this.getTrafficRecs(value, this.state.experimentResult)
    this.handleReset()
  }

  // Handle sliders changing
  private handleTrafficChange = (value: number, version: string) => {
    let newSplit
    for (let i = 0; i < this.state.trafficSplit.length; i++) {
      if (this.state.trafficSplit[i].version === version) {
        newSplit = [...this.state.trafficSplit]
        newSplit[i] = { ...newSplit[i], split: value }
        break
      }
    }
    // Error notification if sum(traffic) != 100
    if (trafficCheck(newSplit)) this.setState({ trafficSplit: newSplit, trafficErr: false })
    else this.setState({ trafficSplit: newSplit, trafficErr: true })
  }

  // Do Nothing
  private doNothing(num) {
    if (num === 'undefined') {
      console.log('Updating')
    }
  }

  // Copy trafficRecs into new array and reset state
  private handleReset() {
    const newTraffic = Array.from(this.trafficRecs)
    this.setState({ trafficSplit: newTraffic, trafficErr: false })
  }

  // Converts traffic implementation into VS and Dest. Rules
  private handleApply() {
    const namespace = this.state.experimentRequest.baseline.version_labels.destination_workload_namespace
    const service = this.state.experimentRequest.service_name
    const decision = getUserDecision(namespace, service, this.state.trafficSplit)
    decision['edgeService'] = this.state.edgeService
    decision['hostGateways'] = this.state.hostGateways
    applyTrafficSplit(decision, this.args)
    const d = new Date()
    const time = d.toISOString()
    this.setState({ notifyTime: time, notifyUser: true, currentSplit: this.state.trafficSplit })
  }

  // Handle closing toast notification
  private handleCloseNotif() {
    this.setState({ notifyUser: false })
  }

  // update decision
  private updateExperimentDecision(value: string) {
    this.setState({ experimentDecision: value })
    const baseline = this.state.experimentResult.baseline_assessment.id
    if (value === 'rollback') {
      this.updateEndExperimentWinner(baseline)
    } else if (value === 'rollforwardwinner') {
      const winner = this.state.experimentResult.winner_assessment.winning_version_found
        ? this.state.experimentResult.winner_assessment.current_best_version
        : baseline
      this.updateEndExperimentWinner(winner)
    }
  }

  // Update winner
  private updateEndExperimentWinner(value: string) {
    this.setState({ endExperimentWinner: value })
  }

  // handle end of experiment
  private endExperiment() {
    const temporarySplit = this.state.trafficSplit
    for (let i = 0; i < temporarySplit.length; i++) {
      if (temporarySplit[i]['version'] === this.state.endExperimentWinner) {
        temporarySplit[i]['split'] = 100
      } else {
        temporarySplit[i]['split'] = 0
      }
    }
    this.setState({ trafficSplit: temporarySplit, hasExperimentEnded: true })
    this.handleApply()
  }

  public render() {
    ++this.notifKey // To regenerate notification
    const { trafficSplit } = this.state
    return (
      <Form className="plugin-iter8-formProps">
        <FormGroup fieldId="decisionForm-id-1">
          <Loading
            description={
              !this.state.experimentCreated ? 'Waiting for iter8 Experiment to be created...' : 'Experiment Created: '
            }
          />
        </FormGroup>
        {this.state.haveResults ? (
          <div>
            <FormGroup fieldId="decisionForm-id-2">
              <h4 className="titletexts"> Winner Assessments </h4>
              {this.state.experimentResult.winner_assessment.winning_version_found ? (
                <div>
                  <h4 className="green">Winner Found!</h4>
                  <h5 className="green"> {this.winner} </h5>
                </div>
              ) : (
                <div>
                  <h4 className="red">{this.winner}</h4>
                </div>
              )}
            </FormGroup>
            <FormGroup fieldId="decisionForm-id-3">
              <h4 className="titletexts"> High Level Overview </h4>
              <TableComposable>
                {renderTable({
                  headers: this.basicStatsRows,
                  rows: this.basicStatsHeader,
                  title: '',
                  id: 'basic',
                  params: {}
                })}
              </TableComposable>
            </FormGroup>
            <FormGroup fieldId="decisionForm-id-4">
              <Button
                size="default"
                kind="primary"
                isDisabled={!this.state.experimentCreated || this.state.hasExperimentEnded}
                onClick={this.handleGetAssessment}
              >
                Get Assessment
              </Button>
            </FormGroup>
            <FormGroup
              fieldId="decisionForm-id-5"
              label="Traffic Routing Goal"
              aria-label="Routing Goal Unavailable"
              helperText="Choose your traffic routing goal"
            >
              <h4 className="titletexts"> Traffic Assessments </h4>
              <FormSelect id="analyticsAlgo" onChange={value => this.handleAlgoChange(value)}>
                {this.algoList.map((option, idx) => (
                  <FormSelectOption key={idx} label={option ? option.text : ''} />
                ))}
              </FormSelect>
              <div>
                <Button size="default" kind="danger" onClick={this.handleReset}>
                  Reset Traffic
                </Button>
                <Button
                  size="default"
                  kind="primary"
                  onClick={this.handleApply}
                  isDisabled={this.state.trafficErr || this.state.hasExperimentEnded}
                >
                  Apply Traffic Split
                </Button>
              </div>
              {this.state.notifyUser ? (
                <Alert
                  isGlobal
                  key={this.notifKey}
                  alert={{
                    type: 'success',
                    title: 'Virtual Service & Destination Rule Created',
                    body: 'Traffic is being re-routed. Allow a few seconds for changes to be implemented.'
                  }}
                  onCloseButtonClick={this.handleCloseNotif}
                />
              ) : null}
            </FormGroup>
            {this.state.currentSplit.length > 0 ? (
              <FormGroup className="currenttraffic" fieldId="decisionForm-id-6">
                <p> Current Traffic Split: </p>
                {this.state.currentSplit.map((val, idx) => {
                  const sliderId = `${idx}=${val.split}`
                  return (
                    <p key={sliderId}>
                      {' '}
                      {val.version} : {val.split}{' '}
                    </p>
                  )
                })}
              </FormGroup>
            ) : null}

            {trafficSplit.map((val, idx) => {
              const sliderId = `${idx}=${val.split}`
              return (
                <FormGroup key={idx} fieldId={`decisionForm-id-7-${idx}`} label={val.version}>
                  <TextInput
                    key={sliderId}
                    value={val.split}
                    onChange={
                      value => this.handleTrafficChange(parseInt(value, 10), val.version) /* FIXME validate!! */
                    }
                  />
                </FormGroup>
              )
            })}
            {this.state.trafficErr ? (
              <Alert
                alert={{ type: 'error', title: 'Invalid Traffic Split', body: 'Traffic percentages must add to 100%' }}
                hideCloseButton={true}
              />
            ) : null}
            <FormGroup fieldId="decisionForm-id-8">
              <h4 className="titletexts"> Criteria Assessments </h4>
              {this.state.haveCriteriaComparison ? (
                <div>
                  {this.state.chartData.map(data => (
                    <div key={data.title + ':div'}>
                      <h5 key={data.title + ':h5'} className="titletexts">
                        {' '}
                        {data.title}{' '}
                      </h5>
                      <Chart
                        key={data.title + ':Chart'}
                        type="line"
                        options={this.state.chartOptions[data.title]}
                        series={data.data}
                        width="400"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <h4> No Criteria Assessment to show</h4>
              )}
            </FormGroup>
            <FormGroup className="advancedstats" fieldId="decisionForm-id-9">
              <h4 onClick={this.toggleAdvancedStatistics}>
                Advanced Statistics{' '}
                <sup>
                  <Icons icon="Help" /> <div> Advanced Statistics is only available for Ratio Metrics </div>{' '}
                </sup>
              </h4>
            </FormGroup>
            {this.state.showAdvancedStatistics && this.state.haveAdvancedStatistics ? (
              <FormGroup
                fieldId="decisionForm-id-10"
                label="Advanced Statistics"
                aria-label="Advanced Statistics Unavailable"
                helperText="Choose a statistic to compare"
              >
                <FormSelect id="advancedStatistics" onChange={value => this.getAdvancedStatistics(value)}>
                  {Object.keys(this.advancedStatisticsNames).map((option, idx) => (
                    <FormSelectOption key={idx} label={option} />
                  ))}
                </FormSelect>
                <TableComposable>
                  {renderTable({
                    rows: this.state.advancedStatisticsRows,
                    headers: this.advancedStatiticsHeaders,
                    title: 'Advanced Metric Assessment',
                    id: 'advanced',
                    params: {}
                  })}
                </TableComposable>
              </FormGroup>
            ) : null}
            {this.state.showAdvancedStatistics && !this.state.haveAdvancedStatistics ? (
              <FormGroup fieldId="decisionForm-id-11">
                <h4> No Advanced Statistics to show</h4>
              </FormGroup>
            ) : null}
          </div>
        ) : null}
        <FormGroup fieldId="decisionForm-id-12">
          <Button
            size="default"
            kind="primary"
            isDisabled={!this.state.experimentCreated || this.state.hasExperimentEnded}
            onClick={this.handleGetAssessment}
          >
            Get Assessment
          </Button>
        </FormGroup>
        {this.state.haveResults ? (
          <div>
            <h4 className="titletexts"> End Experiment </h4>
            <FormGroup
              fieldId="decisionForm-id-13"
              label="End the Experiment by choosing to roll back traffic to baseline or roll forward traffic to winner"
            >
              <FormSelect
                name="end-experiment"
                onChange={value => this.updateExperimentDecision(value)}
                className="pad10"
              >
                <FormSelectOption id="rollback" label="Roll Back to Baseline" value="rollback" />
                <FormSelectOption id="rollforwardwinner" label="Roll Forward to Winner" value="rollforwardwinner" />
                <FormSelectOption
                  id="rollforwardother"
                  label="Roll Forward to Another Deployment"
                  value="rollforwardother"
                />
              </FormSelect>
            </FormGroup>
            {this.state.experimentDecision === 'rollforwardother' ? (
              <FormGroup fieldId="decisionForm-id-13b" helperText="Select the winner of the experiment">
                <FormSelect
                  id="winner-select"
                  placeholder="Select"
                  onChange={value => this.updateEndExperimentWinner(value)}
                >
                  {this.deployList.map((option, idx) => (
                    <FormSelectOption key={idx} label={option} />
                  ))}
                </FormSelect>
              </FormGroup>
            ) : null}
            <FormGroup className="endexpbtn" fieldId="decisionForm-id-14">
              <Button
                size="default"
                kind="primary"
                onClick={this.endExperiment}
                isDisabled={this.state.hasExperimentEnded}
              >
                End Experiment
              </Button>
            </FormGroup>
          </div>
        ) : null}
      </Form>
    )
  }
}
