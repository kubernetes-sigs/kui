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
  ToastNotification,
  RadioButtonGroup,
  RadioButton
} from 'carbon-components-react'
import { Stop32, Undo32, Export32, ChartLineData32, Help16, FaceCool20, FaceNeutral20 } from '@carbon/icons-react'
import Chart from 'react-apexcharts'
// Styling imports
import 'carbon-components/scss/components/loading/_loading.scss'
import 'carbon-components/scss/components/form/_form.scss'
import 'carbon-components/scss/components/list/_list.scss'
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
  title: string
}
// Function for round off
function roundoff(value, fix = 4) {
  console.log(value)
  return parseFloat(value.toFixed(fix))
}
// Functional Component for Chart Rendering
const lineoptions = {
  chart: {
    type: 'line',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  stroke: {
    width: 2,
    curve: 'straight',
    dashArray: [9]
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 3
  },
  title: {
    text: '',
    align: 'left'
  },
  yaxis: {
    labels: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm'
      }
    }
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  }
}
const renderTable = TableProps => (
  <TableContainer title={TableProps.title}>
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
              <TableCell key={cell.id}>
                <div>{cell.value}</div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)
/*eslint-disable */
function analytics_response() {
  let resp = {
    timestamp: '2020-05-22T16:15:10.758576',
    baseline_assessment: {
      id: 'reviews-v2',
      request_count: Math.random() * (1500 - 1000) + 1000,
      criterion_assessments: [
        {
          id: '0',
          metric_id: 'iter8_error_count',
          statistics: {
            value: Math.random() * (25 - 20) + 20,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 3,
                upper: 56
              },
              probability_of_beating_baseline: 23,
              probability_of_being_best_version: 54,
              credible_interval: {
                lower: 32,
                upper: 90
              }
            }
          },
          threshold_assessment: {
            threshold_breached: false,
            probability_of_satisfying_threshold: 0.002
          }
        },
        {
          id: '1',
          metric_id: 'iter8_mean_latency',
          statistics: {
            value: Math.random() * (4 - 2) + 2,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 7,
                upper: 5
              },
              probability_of_beating_baseline: 0,
              probability_of_being_best_version: 0,
              credible_interval: {
                lower: 5,
                upper: 30
              }
            }
          },
          threshold_assessment: {
            threshold_breached: false,
            probability_of_satisfying_threshold: 0.04
          }
        },
        {
          id: '2',
          metric_id: 'iter8_error_rate',
          statistics: {
            value: Math.random() * (0.2 - 0.1) + 0.1,
            ratio_statistics: {
              improvement_over_baseline: {
                lower: 7,
                upper: 5
              },
              probability_of_beating_baseline: 0,
              probability_of_being_best_version: 0,
              credible_interval: {
                lower: 5,
                upper: 30
              }
            }
          },
          threshold_assessment: {
            threshold_breached: true,
            probability_of_satisfying_threshold: 0.02
          }
        }
      ],
      win_probability: 0.5
    },
    candidate_assessments: [
      {
        id: 'reviews-v3',
        request_count: Math.random() * (1000 - 900) + 900,
        criterion_assessments: [
          {
            id: '0',
            metric_id: 'iter8_error_count',
            statistics: {
              value: Math.random() * (25 - 15) + 15,
              ratio_statistics: null
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 0.4
            }
          },
          {
            id: '1',
            metric_id: 'iter8_mean_latency',
            statistics: {
              value: Math.random() * (2 - 1) + 1,
              ratio_statistics: {
                improvement_over_baseline: {
                  lower: 34,
                  upper: 54
                },
                probability_of_beating_baseline: 0.5,
                probability_of_being_best_version: 0.7,
                credible_interval: {
                  lower: 23,
                  upper: 30
                }
              }
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 2
            }
          },
          {
            id: '2',
            metric_id: 'iter8_error_rate',
            statistics: {
              value: Math.random() * (0.09 - 0.08) + 0.08,
              ratio_statistics: {
                improvement_over_baseline: {
                  lower: 0.7,
                  upper: 53
                },
                probability_of_beating_baseline: 32,
                probability_of_being_best_version: 34,
                credible_interval: {
                  lower: 43,
                  upper: 60
                }
              }
            },
            threshold_assessment: {
              threshold_breached: false,
              probability_of_satisfying_threshold: 0.3
            }
          }
        ],
        win_probability: 0.5,
        rollback: false
      }
    ],
    traffic_split_recommendation: {
      uniform: {
        reviews_v3: 60,
        reviews_v2: 40
      },
      random: {
        reviews_v3: 30,
        reviews_v2: 70
      }
    },
    winner_assessment: {
      winning_version_found: true,
      current_winner: 'reviews-v2',
      winning_probability: 0.34
    },
    status: [],
    status_interpretations: {},
    last_state: {}
  }
  return resp
}
/* eslint-enable */
export class DecisionBase extends React.Component<{}, DecisionState> {
  private winner = ''
  // For displaying Pie Chart
  private winProbData = []
  private winProbLabels = {}
  // For displaying Traffic Suggestion Section
  private algoList = []
  private trafficRecs = []

  private notifKey = 0

  // For Displaying Advanced Statistics Section
  private advancedStatisticsObject = {}
  private advancedStatisticsNames = {}
  private advancedStatiticsHeaders = []

  public constructor(props) {
    super(props)
    this.state = {
      selectedAlgo: 'uniform', // Assumes that uniform is always the first algorithm
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
      selectedAdvancedStatistic: 'Improvement Over Baseline', // Initial selection for the analytics assessment dropdown
      showAdvancedStatistics: false, // Toggle to show advanced statistics
      advancedStatisticsRows: [], // table Row values for Advanced statistics
      hasExperimentEnded: false, // set to true if experiment has ended
      experimentDecision: 'rollback', // ID final experiment decision. Defaults to rollback
      chartData: [], // Stores data for the criteria graphs
      chartOptions: {} // Stores options for criteria graphs
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
    this.endExperiment = this.endExperiment.bind(this)
  }

  /*
   *  ==== Methods to populate component attributes ===
   */

  // Sets display with winner information
  private getWinAnalysis(apiResult) {
    if (apiResult.winner_assessment.winning_version_found) {
      const prob = apiResult.winner_assessment.winning_probability
      this.winner = `%{assessment.current_winner} is the winner with ${prob} % of winning`
    } else {
      this.winner = 'No winners determined.'
    }
  }

  // Fill pie chart with version probabilities
  private getWinProbs(apiResult) {
    const dataLabels = []
    this.winProbData = []

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
      const options = JSON.parse(JSON.stringify(lineoptions))
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
            data: [roundoff(this.state.experimentRequest.criteria[i].threshold.value, 2)]
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
            }
            tempObject[keys[k]][version][
              criterionAssessments[version][metric].metric_id
            ] = this.parseAdvancedStatisticsValues(keys[k], value[keys[k]])
          }
        }
      }
    }
    this.advancedStatisticsObject = tempObject
  }

  // Get and set Advanced Statistics table values
  private getAdvancedStatistics(key) {
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
    // if (!(this.state.experimentResult === null)) {
    //   let new_iteration_request = this.state.experimentRequest
    //   new_iteration_request.last_state = this.state.experimentResult.last_state
    //   this.setState({experimentRequest: new_iteration_request})
    // }
    const AnalyticsAssess = new GetAnalyticsAssessment(this.state.experimentRequest)
    AnalyticsAssess.getAnalyticsAssessment()
      .then(result => {
        console.log('Experiment Response')
        console.log(result)
        const jsonrlts = analytics_response()
        this.getWinAnalysis(jsonrlts)
        this.getWinProbs(jsonrlts)
        this.getAlgo(jsonrlts)
        const traffic = this.getTrafficRecs(this.state.selectedAlgo, jsonrlts)
        this.setState({
          haveResults: true,
          experimentResult: jsonrlts,
          trafficSplit: traffic,
          haveAdvancedStatistics: this.haveAdvancedStatistics(),
          haveCriteriaComparison: this.haveCriteriaComparison()
        })
        if (this.state.haveCriteriaComparison) {
          this.getChartData()
        }
        if (this.state.haveAdvancedStatistics) {
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
    this.setState({ notifyTime: time, notifyUser: true, currentSplit: this.state.trafficSplit })
  }

  // Handle closing toast notification
  private handleCloseNotif() {
    this.setState({ notifyUser: false })
  }

  // handle end of experiment
  private endExperiment() {
    let winner = ''
    const baseline = this.state.experimentResult.baseline_assessment.id
    if (this.state.experimentDecision === 'rollback') {
      winner = baseline
    } else if (this.state.experimentDecision === 'rollforward') {
      winner = this.state.experimentResult.winner_assessment.winning_version_found
        ? this.state.experimentResult.winner_assessment.current_winner
        : baseline
    }
    const temporarySplit = this.state.trafficSplit
    for (let i = 0; i < temporarySplit.length; i++) {
      if (temporarySplit[i]['version'] === winner) {
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
      <Form className="formProps" style={{ display: 'block' }}>
        <FormGroup className="borderstyle" legendText="">
          <InlineLoading
            description={
              !this.state.experimentCreated ? 'Waiting for iter8 Experiment to be created...' : 'Experiment Created: '
            }
            iconDescription="Active loading indicator"
            status={this.state.experimentCreated ? 'finished' : 'active'}
            style={{ width: 350 }}
          />
        </FormGroup>
        {this.state.haveResults ? (
          <div>
            <FormGroup legendText="">
              <h4 className="titletexts"> Winner Assessments </h4>
              {this.state.experimentResult.winner_assessment.winning_version_found ? (
                <div>
                  <h4 className="green">
                    {' '}
                    Winner Found! <FaceCool20 />{' '}
                  </h4>
                  <h5> {this.winner} </h5>
                </div>
              ) : (
                <h5>
                  {' '}
                  {this.winner} <FaceNeutral20 />{' '}
                </h5>
              )}
            </FormGroup>
            <FormGroup legendText="Win Probabilities" className="borderstyle formGroupProps">
              <Chart type="pie" options={this.winProbLabels} series={this.winProbData} width="350" />
            </FormGroup>
            <FormGroup legendText="">
              <h4 className="titletexts"> Traffic Assessments </h4>
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
              <div>
                <Button
                  style={{ backgroundColor: '#e65c00' }}
                  size="default"
                  kind="primary"
                  renderIcon={Undo32}
                  onClick={this.handleReset}
                >
                  Reset Traffic
                </Button>
                <Button
                  size="default"
                  kind="primary"
                  renderIcon={Export32}
                  onClick={this.handleApply}
                  disabled={this.state.trafficErr || this.state.hasExperimentEnded}
                >
                  Apply Traffic Split
                </Button>
              </div>
              {this.state.notifyUser ? (
                <ToastNotification
                  key={this.notifKey}
                  caption={this.state.notifyTime}
                  kind="success"
                  title="Virtual Service & Destination Rule Created"
                  subtitle="Traffic is being re-routed. Allow a few seconds for changes to be implemented."
                  onCloseButtonClick={this.handleCloseNotif}
                />
              ) : null}
            </FormGroup>
            {this.state.currentSplit.length > 0 ? (
              <FormGroup className="currenttraffic" legendText="">
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

            <FormGroup className="borderstyle" legendText="">
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
            <FormGroup className="borderstyle" legendText="">
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
            <FormGroup legendText="">
              <h4 className="titletexts"> Advanced Statistics </h4>
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
                  titleText=""
                  helperText="Choose a statistic to compare"
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
                <h4> No Advanced Statistics to show</h4>
              </FormGroup>
            ) : null}
          </div>
        ) : null}
        <FormGroup className="borderstyle" legendText="">
          <Button
            size="default"
            kind="primary"
            renderIcon={ChartLineData32}
            disabled={!this.state.experimentCreated || this.state.hasExperimentEnded}
            onClick={this.handleGetAssessment}
          >
            Get Assessment
          </Button>
        </FormGroup>
        {this.state.haveResults ? (
          <div>
            <FormGroup legendText="">
              <h4 className="titletexts"> End Experiment </h4>
            </FormGroup>
            <FormGroup
              invalid={false}
              legendText="End the Experiment by choosing to roll back traffic to baseline or roll forward traffic to winner"
              message={false}
              messageText=""
            >
              <RadioButtonGroup
                defaultSelected="rollback"
                labelPosition="right"
                legend="Group Legend"
                name="end-experiment"
                onChange={value => this.setState({ experimentDecision: value })}
                orientation="horizontal"
                valueSelected="rollback"
                style={{ padding: 10 }}
              >
                <RadioButton id="rollback" labelText="Roll Back to Baseline" value="rollback" />
                <RadioButton id="rollforward" labelText="Roll Forward to Winner" value="rollforward" />
              </RadioButtonGroup>
            </FormGroup>
            <FormGroup legendText="" className="endexpbtn">
              <Button
                size="default"
                kind="primary"
                renderIcon={Stop32}
                onClick={this.endExperiment}
                disabled={this.state.hasExperimentEnded}
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

export function renderDecisionTab() {
  return {
    react: function renderComponent() {
      return <DecisionBase />
    }
  }
}
