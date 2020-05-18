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
import { Renew32, Undo32, Export32 } from '@carbon/icons-react'
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
}
// Functional Component for Data Table rendering
const renderTable = TableProps => (
  <TableContainer title="Metrics Comparison" description="Current values of all experimental metrics">
    <Table>
      <TableHead>
        <TableRow>
          {TableProps.headers.map(header => (
            <TableHeader key={header.key}>{header.header}</TableHeader>
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

export class DecisionBase extends React.Component<{}, DecisionState> {
  private winner = ''
  // For displaying Pie Chart
  private winProbData = []
  private winProbLabels = {}
  // For displaying Traffic Suggestion Section
  private algoList = []
  private trafficRecs = []
  // For displaying Metric Comparison Section
  private metricTableHeaders = []
  private metricTableRows = []
  private notifKey = 0
  public constructor(props) {
    super(props)
    this.state = {
      selectedAlgo: 'unif', // Assumes that unif is always the first algorithm
      trafficSplit: [{ version: '', split: 0 }],
      trafficErr: false, // true if sum(traffic) != 100
      notifyUser: false, // true if vs has been successfully created
      notifyTime: '', // timestamp assoc. with notification
      experimentCreated: false, // true if user has finished expr creation
      haveResults: false, // true if Iter8 AJAX call has been successful
      experimentRequest: null, // JSON object sent as Iter8 Request
      experimentResult: null // JSON object returned from Iter8 API
    }
    eventChannelUnsafe.on('/get/decision', formstate => {
      console.log(JSON.stringify(formstate))
      this.setState({ experimentCreated: true, experimentRequest: formstate })
    })
    // Bound NON-lambda functions to component's scope
    this.handleReset = this.handleReset.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleCloseNotif = this.handleCloseNotif.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
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
  private getMetricHeaders(apiResult) {
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
    this.metricTableHeaders = tempHeaders
  }

  // Populate row information for metric table
  private getMetricRows(apiResult) {
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
    this.metricTableRows = tempRows
  }

  /*
   *  ==== Handlers for DOM elements ===
   */

  // Makes an AJAX call to Iter8 API
  private handleRefresh() {
    const AnalyticsAssess = new GetAnalyticsAssessment(this.state.experimentRequest)
    AnalyticsAssess.getAnalyticsAssessment()
      .then(result => {
        const jsonrlts = JSON.parse(JSON.parse(result))
        this.getWinAnalysis(jsonrlts)
        this.getWinProbs(jsonrlts)
        this.getAlgo(jsonrlts)
        this.getMetricHeaders(jsonrlts)
        this.getMetricRows(jsonrlts)
        const traffic = this.getTrafficRecs(this.state.selectedAlgo, jsonrlts)
        console.log(jsonrlts)
        this.setState({ haveResults: true, experimentResult: jsonrlts, trafficSplit: traffic })
      })
      .catch(failure => {
        console.log(failure)
      })
  }

  // Get new traffic recommendations for the selected algorithm type
  private handleAlgoChange = value => {
    this.setState({ selectedAlgo: value.id })
    this.getTrafficRecs(value.id, this.state.experimentResult)
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
              !this.state.experimentCreated ? 'Waiting for Experiment Creation Completion...' : 'Experiment Created.'
            }
            iconDescription="Active loading indicator"
            status={this.state.experimentCreated ? 'finished' : 'active'}
            style={{ width: 350 }}
          />
          <Button
            size="default"
            kind="primary"
            renderIcon={Renew32}
            disabled={!this.state.experimentCreated}
            onClick={this.handleRefresh}
            className="refreshBtn"
          >
            Refresh
          </Button>
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
              <DataTable
                headers={this.metricTableHeaders}
                rows={this.metricTableRows}
                render={({ rows, headers }) => renderTable({ rows, headers })}
              />
            </FormGroup>
          </div>
        ) : null}
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
