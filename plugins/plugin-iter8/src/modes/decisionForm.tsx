import * as React from 'react'
import { eventChannelUnsafe } from '@kui-shell/core'
// Component imports
import {
  Form,
  FormGroup,
  InlineLoading,
  Button,
  Slider,
  Dropdown,
  DataTable,
  InlineNotification,
  ToastNotification
} from 'carbon-components-react'
import { Renew32, Undo32, Export32, Data_132 as Data132 } from '@carbon/icons-react'
import Chart from 'react-apexcharts'
// Styling imports
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/slider/_slider.scss'
import 'carbon-components/scss/components/dropdown/_dropdown.scss'
import 'carbon-components/scss/components/data-table/_data-table.scss'
import 'carbon-components/scss/components/notification/_inline-notification.scss'
import 'carbon-components/scss/components/notification/_toast-notification.scss'
import '../../src/web/scss/static/decisionForm.scss'
// Functional imports
import { DecisionState } from '../modes/state-models'
import GetAnalyticsAssessment from '../utility/get-analytics-assessment'
import NameDict from '../utility/get-display-name'
import { trafficCheck, getUserDecision, applyTrafficSplit } from '../components/traffic-split'
// Deconstructs the DataTable component
const { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } = DataTable

interface TableProps {
  rows: any
  headers: any
  getHeaderProps: any
}
// Functional Component for Data Table rendering
const renderTable = TableProps => (
  <TableContainer title="Metrics Comparison" description="Current values of all experimental metrics">
    <Table>
      <TableHead>
        <TableRow>
          {TableProps.headers.map(header => (
            <TableHeader {...TableProps.getHeaderProps({ header })} key={header.key}>
              {header.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {TableProps.rows.map(row => (
          <TableRow key={row.id}>
            {row.cells.map(cell => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)
/*eslint-disable */
// var finalans = {
//   "timestamp": "2020-05-22T16:15:10.758576",
//   "baseline_assessment": {
//     "id": "reviews_v2",
//     "request_count": 8,
//     "criterion_assessments": [
//       {
//         "id": "0",
//         "metric_id": "iter8_mean_latency",
//         "statistics": {
//           "value": 0.010749841000000001,
//           "ratio_statistics": null
//         },
//         "threshold_assessment": null
//       },
//       {
//         "id": "1",
//         "metric_id": "iter8_error_rate",
//         "statistics": {
//           "value": 0,
//           "ratio_statistics": null
//         },
//         "threshold_assessment": null
//       },
//       {
//         "id": "2",
//         "metric_id": "iter8_request_count",
//         "statistics": {
//           "value": 8.09915,
//           "ratio_statistics": null
//         },
//         "threshold_assessment": null
//       }
//     ],
//     "win_probability": 0.5
//   },
//   "candidate_assessments": [
//     {
//       "id": "reviews_v3",
//       "request_count": 16,
//       "criterion_assessments": [
//         {
//           "id": "0",
//           "metric_id": "iter8_mean_latency",
//           "statistics": {
//             "value": 0.00962141154047805,
//             "ratio_statistics": null
//           },
//           "threshold_assessment": null
//         },
//         {
//           "id": "1",
//           "metric_id": "iter8_error_rate",
//           "statistics": {
//             "value": 0,
//             "ratio_statistics": null
//           },
//           "threshold_assessment": null
//         },
//         {
//           "id": "2",
//           "metric_id": "iter8_request_count",
//           "statistics": {
//             "value": 16.698300000000003,
//             "ratio_statistics": null
//           },
//           "threshold_assessment": null
//         }
//       ],
//       "win_probability": 0.5,
//       "rollback": false
//     }
//   ],
//   "traffic_split_recommendation": {
//     "uniform": {
//       "reviews_v3": 60,
//       "reviews_v2": 40
//     },
//     "random": {
//       "reviews_v3": 30,
//       "reviews_v2": 70
//     }
//   },
//   "winner_assessment": {
//     "winning_version_found": false,
//     "current_winner": null,
//     "winning_probability": null
//   },
//   "status": [],
//   "status_interpretations": {},
//   "last_state": {}}
/* eslint-enable */
export class DecisionBase extends React.Component<{}, DecisionState> {
  private winner = ''
  // For displaying Pie Chart
  private winProbData = []
  private winProbLabels = {}
  // For displaying Traffic Suggestion Section
  private algoList = []
  private trafficRecs = []
  // For displaying Metric Comparison Section
  private criteriaTableHeaders = []
  private criteriaTableRows = []
  private notifKey = 0

  // For Displaying Advanced Statistics Section
  private advancedStatisticsObject = {}
  private advancedStatisticsNames = {}
  private advancedStatiticsHeaders = []

  public constructor(props) {
    super(props)
    this.state = {
      selectedAlgo: 'uniform', // Assumes that uniform is always the first algorithm
      trafficSplit: [{ version: '', split: 0 }],
      trafficErr: false, // true if sum(traffic) != 100
      notifyUser: false, // true if vs has been successfully created
      notifyTime: '', // timestamp assoc. with notification
      experimentCreated: false, // true if user has finished expr creation
      haveResults: false, // true if Iter8 AJAX call has been successful
      experimentRequest: null, // JSON object sent as Iter8 Request
      experimentResult: null, // JSON object returned from Iter8 API
      haveAdvancedStatistics: false,
      haveCriteriaComparison: false,
      selectedAdvancedStatistic: 'Improvement Over Baseline',
      showAdvancedStatistics: false,
      advancedStatisticsRows: []
    }
    eventChannelUnsafe.on('/get/decision', formstate => {
      this.setState({ experimentCreated: true, experimentRequest: formstate })
    })
    // Bound NON-lambda functions to component's scope
    this.handleReset = this.handleReset.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleCloseNotif = this.handleCloseNotif.bind(this)
    this.handleGetAssessment = this.handleGetAssessment.bind(this)
    this.toggleAdvancedStatistics = this.toggleAdvancedStatistics.bind(this)
    this.getAdvancedStatistics = this.getAdvancedStatistics.bind(this)
  }

  /*
   *  ==== Methods to populate component attributes ===
   */

  // Sets display with winner information
  private getWinAnalysis(apiResult) {
    if (apiResult.winner_assessment.winning_version_found) {
      // const assessment = apiResult.winner_assessment
      const prob = apiResult.winner_assessment.winning_probability
      this.winner = `%{assessment.current_winner} is the winner with ${prob} % of winning`
    } else {
      this.winner = 'No winners determined.'
    }
  }

  // Fill pie chart with version probabilities
  private getWinProbs(apiResult) {
    const dataLabels = []

    const baseRlts = apiResult.baseline_assessment
    this.winProbData.push(baseRlts.win_probability)
    dataLabels.push(baseRlts.id)

    const candRlts = apiResult.candidate_assessments
    for (let i = 0; i < candRlts.length; i++) {
      this.winProbData.push(candRlts[i].win_probability)
      dataLabels.push(candRlts[i].id)
    }
    this.winProbLabels = { labels: dataLabels }
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

  // Populate the metric table header
  private getCriteriaHeaders(apiResult) {
    const DisplayDict = new NameDict()
    const tempHeaders = [{ header: 'Deployment Name', key: 'version' }]

    const baseAssess = apiResult.baseline_assessment.criterion_assessments
    for (let i = 0; i < baseAssess.length; i++) {
      const metricId = baseAssess[i].metric_id
      const metricName = DisplayDict.getMetricName(metricId)
      tempHeaders.push({
        header: metricName,
        key: metricId
      })
    }
    this.criteriaTableHeaders = tempHeaders
  }

  // Populate row information for metric table
  private getCriteriaRows(apiResult) {
    const baseCriteria = apiResult.baseline_assessment.criterion_assessments
    const baseId = apiResult.baseline_assessment.id

    const tempRows = []
    const tempBase = { id: baseId, version: baseId }
    for (let i = 0; i < baseCriteria.length; i++) {
      tempBase[baseCriteria[i].metric_id] = baseCriteria[i].statistics.value
    }
    tempRows.push(tempBase)
    // Iterate through every candidate assessment
    const candList = apiResult.candidate_assessments
    for (let i = 0; i < candList.length; i++) {
      const tempCand = { id: candList[i].id, version: candList[i].id }
      // Iterate through every metric in the candidate
      const candAssess = candList[i].criterion_assessments
      for (let j = 0; j < candAssess.length; j++) {
        tempCand[candAssess[j].metric_id] = candAssess[j].statistics.value
      }
      tempRows.push(tempCand)
    }
    this.criteriaTableRows = tempRows
  }

  // Returns true if the experiment involves any success/failure criteria
  private haveCriteriaComparison() {
    if (this.state.experimentRequest.criteria.length) {
      return true
    } else {
      return false
    }
  }

  // Returns true is the experiment involves criteria involving ratio metrics
  private haveAdvancedStatistics() {
    if (!this.state.experimentRequest.criteria.length) {
      return false
    } else {
      this.advancedStatiticsHeaders = [{ header: 'Deployment', key: 'version' }]
      const DisplayDict = new NameDict()
      const ratioMetrics = this.state.experimentRequest.metric_specs.ratio_metrics
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
    if (key === 'credible_interval') {
      return val['lower']
    } else if (key === 'improvement_over_baseline') {
      return val['lower']
    }
    return val
    /* eslint-enable */
  }

  // Create a JSON object to store row values for advanced staistics
  private createadvancedStatisticsObject() {
    const DisplayDict = new NameDict()
    this.advancedStatisticsNames = DisplayDict.advancedStatisticsNames

    const versionRows = []
    for (let i = 0; i < this.criteriaTableRows.length; i++) {
      versionRows.push({ id: this.criteriaTableRows[i].id, version: this.criteriaTableRows[i].version })
    }
    const criterionAssessments = []
    criterionAssessments.push(this.state.experimentResult.baseline_assessment.criterion_assessments)
    for (let i = 0; i < this.state.experimentResult.candidate_assessments.length; i++) {
      criterionAssessments.push(this.state.experimentResult.candidate_assessments[i].criterion_assessments)
    }
    const tempObject = {}
    for (let version = 0; version < criterionAssessments.length; version++) {
      for (let metric = 0; metric < criterionAssessments[version].length; metric++) {
        if ({}.hasOwnProperty.call(criterionAssessments[version][metric].statistics, 'ratio_statistics')) {
          const value = {
            /*eslint-disable */
            improvement_over_baseline: {
              lower: Math.random() * -1,
              upper: Math.random()
            },
            probability_of_beating_baseline: Math.random(),
            probability_of_being_best_version: Math.random(),
            credible_interval: {
              lower: Math.random() * -1,
              upper: Math.random()
            }
            /* eslint-enable */
          }
          let keys = []
          keys = Object.values(this.advancedStatisticsNames)
          for (let k = 0; k < keys.length; k++) {
            if (!{}.hasOwnProperty.call(tempObject, keys[k])) {
              tempObject[keys[k]] = JSON.parse(JSON.stringify(versionRows))
              console.log(tempObject)
            }
            tempObject[keys[k]][version][
              criterionAssessments[version][metric].metric_id
            ] = this.parseAdvancedStatisticsValues(keys[k], value[keys[k]])
          }
        }
      }
    }
    console.log(tempObject)
    this.advancedStatisticsObject = tempObject
  }

  // Get and set Advanced Statistics table values
  private getAdvancedStatistics(key) {
    this.setState({ selectedAdvancedStatistic: key })
    this.setState({ advancedStatisticsRows: this.advancedStatisticsObject[this.advancedStatisticsNames[key]] })
    console.log(key)
    console.log(this.state.advancedStatisticsRows)
    console.log(this.advancedStatiticsHeaders)
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
    const AnalyticsAssess = new GetAnalyticsAssessment(this.state.experimentRequest)
    AnalyticsAssess.getAnalyticsAssessment()
      .then(result => {
        const jsonrlts = JSON.parse(JSON.parse(result))
        // const jsonrlts = finalans
        this.getWinAnalysis(jsonrlts)
        this.getWinProbs(jsonrlts)
        this.getAlgo(jsonrlts)
        this.getCriteriaHeaders(jsonrlts)
        this.getCriteriaRows(jsonrlts)
        const traffic = this.getTrafficRecs(this.state.selectedAlgo, jsonrlts)
        this.setState({
          haveResults: true,
          experimentResult: jsonrlts,
          trafficSplit: traffic,
          haveAdvancedStatistics: this.haveAdvancedStatistics(),
          haveCriteriaComparison: this.haveCriteriaComparison()
        })
        if (this.haveAdvancedStatistics) {
          this.createadvancedStatisticsObject()
          this.getAdvancedStatistics(this.state.selectedAdvancedStatistic)
        }
      })
      .catch(failure => {
        console.log(failure)
      })
  }

  // Get new traffic recommendations for the selected algorithm type
  private handleAlgoChange = value => {
    this.setState({ selectedAlgo: value.id })
    this.getTrafficRecs(value.id, this.state.experimentResult)
    this.handleReset()
  }

  // Handle sliders changing
  private handleTrafficChange = (value, version) => {
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

  // Copy trafficRecs into new array and reset state
  private handleReset() {
    const newTraffic = Array.from(this.trafficRecs)
    this.setState({ trafficSplit: newTraffic, trafficErr: false })
  }

  // Converts traffic implementation into VS and Dest. Rules
  private handleApply() {
    const namespace = this.state.experimentRequest.baseline.version_labels.destination_service_namespace
    const service = this.state.experimentRequest.service_name
    const decision = getUserDecision(namespace, service, this.state.trafficSplit)
    applyTrafficSplit(decision)
    const d = new Date()
    const time = d.toISOString()
    this.setState({ notifyTime: time, notifyUser: true })
  }

  // Handle closing toast notification
  private handleCloseNotif() {
    this.setState({ notifyUser: false })
  }

  public render() {
    ++this.notifKey // To regenerate notification
    const { trafficSplit } = this.state
    return (
      <Form className="formProps" style={{ display: 'block' }}>
        <FormGroup legendText="">
          <InlineLoading
            description={
              !this.state.experimentCreated ? 'Waiting for Experiment Creation Completion...' : 'Experiment Created:'
            }
            iconDescription="Active loading indicator"
            status={this.state.experimentCreated ? 'finished' : 'active'}
            style={{ width: 350 }}
          />
        </FormGroup>
        {this.state.haveResults ? (
          <div>
            <FormGroup legendText="">
              <h3> {this.winner} </h3>
            </FormGroup>
            <FormGroup legendText="Win Probabilities" className="formGroupProps">
              <Chart type="pie" options={this.winProbLabels} series={this.winProbData} width="400" />
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
                onChange={value => this.handleAlgoChange(value.selectedItem)}
              />
              <Button size="default" kind="danger" renderIcon={Undo32} onClick={this.handleReset}>
                Reset
              </Button>
              <Button
                size="default"
                kind="primary"
                renderIcon={Export32}
                onClick={this.handleApply}
                disabled={this.state.trafficErr}
              >
                Apply
              </Button>
              {this.state.notifyUser ? (
                <ToastNotification
                  key={this.notifKey}
                  caption={this.state.notifyTime}
                  kind="success"
                  title="Virtual Service & Destination Rule Created"
                  subtitle="Traffic is being re-routed. Allow a few seconds for changes to be implemented."
                  onCloseButtonClick={this.handleCloseNotif}
                  style={{ width: 680 }}
                />
              ) : null}
            </FormGroup>
            <FormGroup legendText="">
              {trafficSplit.map((val, idx) => {
                const sliderId = `${idx}=${val.split}`
                return (
                  <Slider
                    key={sliderId}
                    value={val.split}
                    min={0}
                    max={100}
                    labelText={val.version}
                    style={{ width: 200 }}
                    onRelease={num => this.handleTrafficChange(num.value, val.version)}
                  />
                )
              })}
              {this.state.trafficErr ? (
                <InlineNotification
                  kind="error"
                  notificationType="inline"
                  role="alert"
                  title="Invalid Traffic Split"
                  subtitle="Traffic percentages must add to 100%"
                  hideCloseButton={true}
                  style={{ width: 600 }}
                />
              ) : null}
            </FormGroup>
            <FormGroup legendText="">
              {this.state.haveCriteriaComparison ? (
                <DataTable
                  headers={this.criteriaTableHeaders}
                  rows={this.criteriaTableRows}
                  render={({ rows, headers, getHeaderProps }) => renderTable({ rows, headers, getHeaderProps })}
                />
              ) : (
                <h4> No Criteria Assessment to show</h4>
              )}
            </FormGroup>
            <FormGroup legendText="">
              <Button
                style={{ position: 'relative' }}
                size="default"
                kind="ghost"
                renderIcon={Data132}
                onClick={this.toggleAdvancedStatistics}
              >
                Advanced Statistics
              </Button>
            </FormGroup>
            {this.state.showAdvancedStatistics && this.state.haveAdvancedStatistics ? (
              <FormGroup legendText="">
                <Dropdown
                  id="advancedStatistics"
                  label="Advanced Statistics"
                  items={Object.keys(this.advancedStatisticsNames)}
                  initialSelectedItem={this.state.selectedAdvancedStatistic}
                  titleText="Get Advanced Statistics"
                  helperText="Choose the statistic to compare"
                  onChange={value => this.getAdvancedStatistics(value.selectedItem)}
                />
                <DataTable
                  headers={this.advancedStatiticsHeaders}
                  rows={this.state.advancedStatisticsRows}
                  render={({ rows, headers, getHeaderProps }) =>
                    renderTable({ rows, headers, getHeaderProps, title: 'Advanced Metric Assessment' })
                  }
                />
              </FormGroup>
            ) : null}
            {this.state.showAdvancedStatistics && !this.state.haveAdvancedStatistics ? (
              <FormGroup legendText="">
                <h4> Do not have Advanced Statistics</h4>
              </FormGroup>
            ) : null}
          </div>
        ) : null}
        <FormGroup legendText="">
          <Button
            size="default"
            kind="primary"
            renderIcon={Renew32}
            disabled={!this.state.experimentCreated}
            onClick={this.handleGetAssessment}
          >
            Get Assessment
          </Button>
        </FormGroup>
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
