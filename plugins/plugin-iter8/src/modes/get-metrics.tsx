import * as React from 'react'
import { ToolbarProps } from '@kui-shell/core'
import { TrashCan20, Reset20, Add20, Edit20 } from '@carbon/icons-react'
import { 
  Button, 
  DataTable,
  Form,
  FormGroup, 
  Select,
  SelectItem,
  TextInput
} from 'carbon-components-react'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/data-table/_data-table-expandable.scss'
import 'carbon-components/scss/components/data-table/_data-table.scss'
import 'carbon-components/scss/components/data-table/_data-table-action.scss'
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/data-table/_data-table-skeleton.scss'

import '../../src/web/scss/static/metrics.scss'

import ReactErrorDisplay from './error-react'
import deleteMetric from '../components/delete-metric'
import restoreMetric from '../components/restore-metric'
import { GetMetricConfig, ITER8_METRIC_NAMES } from '../components/metric-config'
import { CounterMetric, CounterMetrics, RatioMetric, RatioMetrics, MetricConfigMap } from '../components/metric-config-types'

import { safeLoad, safeDump } from 'js-yaml'
import { execSync } from 'child_process'

const { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  TableContainer, 
  TableExpandRow, 
  TableExpandedRow,
} = DataTable

let configMap: MetricConfigMap

let counterMetrics: CounterMetrics
let ratioMetrics: RatioMetrics
let counterMetricNames: string[]
let ratioMetricNames: string[]

const newCounterMetricConfig: Partial<CounterMetric> = {}
const newRatioMetricConfig: Partial<RatioMetric> = {}

let COUNTER_METRIC_REQUIRED_ATTRIBUTES
let RATIO_METRIC_REQUIRED_ATTRIBUTES

export enum MetricTypes {
  'counter',
  'ratio'
}

enum AttributeTypes {
  'input',
  'dropdown'
}

type MetricAttributesData = AttributeData[]

type AttributeData = InputAttributeData | DropdownAttributeData

type InputAttributeData = {
  // The name used in the config map
  name: string

  // A pretty version of the name used in the form
  printableName: string

  // Used to display helper text
  description: string

  // A text input should have the text input type
  type: AttributeTypes.input

  // If this is a required attribute to create a metric
  required: boolean

  // Assorted data to set up a validation check
  invalidCheck?: InvalidCheck
}

type DropdownAttributeData = {
  // The name used in the config map
  name: string

  // A pretty version of the name used in the form
  printableName: string

  // Used to display helper text
  description: string

  // A dropdown menu should have the dropdown menu type
  type: AttributeTypes.dropdown

  // If this is a required attribute to create a metric
  required: boolean

  // A list of the options in the dropdown menu
  dropdownOptions: DropdownOptions

  /**
   * The option that will be selected on render. If not set, then the first
   * element of dropdown options will be selected.
   */
  noDefaultDropdownOptionPlaceholder?: string
}

type InvalidCheck = {
  // The text to be displayed if the validation check is not successful
  invalidText: string

  // Given the event, return whether the input is valid or not
  check: (e: any) => boolean
}

type DropdownOptions = {
  // The value of the option that should be used in the metric config
  value: any

  // A pretty version of the value used in the form
  printableOption: string
}[]

const ratioDefaultDropdownOption = 'Please select a counter metric'
const ratioDescription = 'Counter metric ID used to calculate ratio metric'
const noneSelected = 'None selected'

/**
 * A list of all attributes that can be used to created a counter metric
 *
 * Easily extendable to add new attributes
 */
const COUNTER_METRIC_ATTRIBUTES_DATA: MetricAttributesData = [
  {
    name: 'name',
    printableName: 'Name',
    description: 'Unique identifier for counter metric',
    type: AttributeTypes.input,
    required: true,
    invalidCheck: {
      invalidText: 'Another counter metric already has this name',
      check: e => {
        return counterMetricNames.includes(e.target.value)
      }
    }
  },
  {
    name: 'query_template',
    printableName: 'Query template',
    description: 'Prometheus query used to populate counter metric',
    type: AttributeTypes.input,
    required: true
  },
  {
    name: 'preferred_direction',
    printableName: 'Preferred direction',
    description: 'Whether a higher or lower counter metric is preferred. Default: lower',
    type: AttributeTypes.dropdown,
    required: true,
    dropdownOptions: [
      { printableOption: 'Lower', value: 'lower' },
      { printableOption: 'Higher', value: 'higher' }
    ]
  },
  {
    name: 'units',
    printableName: 'Units',
    description: 'Optional: units of the counter metric',
    type: AttributeTypes.input,
    required: false
  }
]

/**
 * A list of all attributes that can be used to created a ratio metric
 *
 * Easily extendable to add new attributes
 */
const RATIO_METRIC_ATTRIBUTES_DATA: MetricAttributesData = [
  {
    name: 'name',
    printableName: 'Name',
    description: 'Unique identifier for ratio metric',
    type: AttributeTypes.input,
    required: true,
    invalidCheck: {
      invalidText: 'Another ratio metric already has this name',
      check: e => {
        return ratioMetricNames.includes(e.target.value)
      }
    }
  },
  {
    name: 'numerator',
    printableName: 'Numerator',
    description: ratioDescription,
    type: AttributeTypes.dropdown,
    required: true,
    dropdownOptions: [], // Added dynamically in updateMetricAttributesData()
    noDefaultDropdownOptionPlaceholder: ratioDefaultDropdownOption
  },
  {
    name: 'denominator',
    printableName: 'Denominator',
    description: ratioDescription,
    type: AttributeTypes.dropdown,
    required: true,
    dropdownOptions: [], // Added dynamically in updateMetricAttributesData()
    noDefaultDropdownOptionPlaceholder: ratioDefaultDropdownOption
  },
  {
    name: 'preferred_direction',
    printableName: 'Preferred direction',
    description: 'Whether a higher or lower ratio metric is preferred. Default: lower',
    type: AttributeTypes.dropdown,
    required: true,
    dropdownOptions: [
      { printableOption: 'Lower', value: 'lower' },
      { printableOption: 'Higher', value: 'higher' }
    ]
  },
  {
    name: 'zero_to_one',
    printableName: 'Zero to one',
    description: 'Optional: whether the ratio metric is between 0 and 1, inclusive',
    type: AttributeTypes.dropdown,
    required: false,
    dropdownOptions: [
      { printableOption: 'True', value: true },
      { printableOption: 'False', value: false }
    ],
    noDefaultDropdownOptionPlaceholder: noneSelected
  }
]

/**
 * Given some metric type, get all default values
 */
function getDefaultConfig(metricAttributesData: MetricAttributesData): Partial<CounterMetric | RatioMetric> {
  const rs = {}

  Object.values(metricAttributesData).forEach(attribute => {
    // TODO: extend for other attribute types
    if (attribute.type === AttributeTypes.dropdown) {
      /**
       * If there is no default dropdown option placeholder, then that means
       * the default option should be the first entry among the dropdown
       * options
       */
      if (!attribute.noDefaultDropdownOptionPlaceholder) {
        if (attribute.dropdownOptions.length > 0) {
          rs[attribute.name] = attribute.dropdownOptions[0].value
        } else {
          throw new Error(`No known dropdown options for attribute '${attribute.name}'`)
        }
      }
    }
  })

  return rs
}

const DEFAULT_COUNTER_METRIC_CONFIG = getDefaultConfig(COUNTER_METRIC_ATTRIBUTES_DATA)

const DEFAULT_RATIO_METRIC_CONFIG = getDefaultConfig(RATIO_METRIC_ATTRIBUTES_DATA)

enum MetricDetailsModeDisplay {
  'getMetrics',
  'addMetrics',
  'editMetrics'
}

type MetricDetailsProps = {}

type MetricDetailsState = {
  counterMetricsState: MetricsState
  ratioMetricsState: MetricsState
  display: MetricDetailsModeDisplay

  selectedType?: MetricTypes
  selectedMetricName?: string
  editedMetric?: Partial<CounterMetric | RatioMetric>
}

// Apply the given config to Kubernetes
function kubectlApplyConfig(config: string): string {
  const command = `cat <<"EOF" | kubectl apply -f -\n${config}\nEOF`

  return execSync(command, { encoding: 'utf-8' })
}

/**
 * Create a simple DropdownOptions from a string array
 *
 * The keys and the values of the elements of DropdownOptions are from the array
 */
function createBasicStringDropdownOptions(values: string[]): DropdownOptions {
  const rs: DropdownOptions = []

  values.forEach(value => {
    rs.push({ printableOption: value, value })
  })

  return rs
}

/**
 * Query for the iter8 metric config map and update COUNTER_METRIC_ATTRIBUTES_DATA
 * and RATIO_METRIC_ATTRIBUTES_DATA
 *
 * TODO: remove and replace using centralized data store
 */
function updateMetricAttributesData() {
  const metricConfig = new GetMetricConfig()

  configMap = safeLoad(execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', { encoding: 'utf-8' }))
  // configMap = SAMPLE_METRICS
    
  // TODO: Add proper error handling
  counterMetrics = (metricConfig.getCounterMetrics() as CounterMetrics)
  counterMetricNames = counterMetrics.map(counterMetric => {
    return counterMetric.name
  })

  ratioMetrics = (metricConfig.getRatioMetrics() as RatioMetrics)
  ratioMetricNames = ratioMetrics.map(ratioMetric => {
    return ratioMetric.name
  })

  // ratioMetrics = safeLoad(configMap.data['ratio_metrics.yaml']) as RatioMetrics
  ratioMetricNames = ratioMetrics.map(ratioMetric => {
    return ratioMetric.name
  })

  // Update the numerators and denominator
  const counterMetricDropdownOptions = createBasicStringDropdownOptions(counterMetricNames)
  const numeratorAttribute = RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => {
    return attribute.name === 'numerator'
  })
  const denominatorAttribute = RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => {
    return attribute.name === 'denominator'
  })
  ;(numeratorAttribute as DropdownAttributeData).dropdownOptions = counterMetricDropdownOptions
  ;(denominatorAttribute as DropdownAttributeData).dropdownOptions = counterMetricDropdownOptions

  // Required attributes to create counter and ratio metrics
  COUNTER_METRIC_REQUIRED_ATTRIBUTES = COUNTER_METRIC_ATTRIBUTES_DATA.filter(attribute => {
    return attribute.required
  }).map(attribute => {
    return attribute.name
  })

  RATIO_METRIC_REQUIRED_ATTRIBUTES = RATIO_METRIC_ATTRIBUTES_DATA.filter(attribute => {
    return attribute.required
  }).map(attribute => {
    return attribute.name
  })
}

class MetricDetailsMode extends React.Component<MetricDetailsProps, MetricDetailsState> {
  public output = ''

  public constructor(props: MetricDetailsProps) {
    super(props)

    const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

    this.state = { 
      ratioMetricsState: ratioMetricsState,
      counterMetricsState: counterMetricsState,

      display: MetricDetailsModeDisplay.getMetrics
    }
  }

  public generateMetricsStates(counterMetrics: CounterMetrics, ratioMetrics: RatioMetrics): { counterMetricsState: MetricsState, ratioMetricsState: MetricsState} {
    const counterMetricsState: MetricsState = {}
    const ratioMetricsState: MetricsState = {}

    counterMetrics.forEach(metric => {
      counterMetricsState[metric.name] = {
        name: metric.name,
        isDeleted: false,
        alsoDelete: [],
        alsoRestore: [],
        details: metric,
        custom: !ITER8_METRIC_NAMES.counter.includes(metric.name)
      }
    })

    ratioMetrics.forEach(metric => {
      ratioMetricsState[metric.name] = {
        name: metric.name,
        isDeleted: false,
        alsoDelete: [],
        alsoRestore: [metric.numerator, metric.denominator],
        details: metric,
        custom: !ITER8_METRIC_NAMES.ratio.includes(metric.name)
      }

      try {
        counterMetricsState[metric.numerator].alsoDelete.push(metric.name)
      } catch (e) {
        throw new Error(`Ratio metric '${metric.name}' has numerator metric 
          '${metric.numerator}' which is not defined.`)
      }

      try {
        counterMetricsState[metric.denominator].alsoDelete.push(metric.name)
      } catch (e) {
        throw new Error(`Ratio metric '${metric.name}' has denominator metric 
          '${metric.denominator}' which is not defined.`)
      }
    })

    return { counterMetricsState, ratioMetricsState}
  }

  public getInitialRowsFromObjectKeys(object: object) {
    return Object.keys(object).map(propertyName => { return { id: propertyName } })
  }

  public updateIsDeleted(metricName: string, type: MetricTypes): void {
    if (type === MetricTypes.counter) {
      if (ITER8_METRIC_NAMES.counter.includes(metricName)) {
        return
      }

      if (deleteMetric(metricName, type).success === metricName) {
        this.state.counterMetricsState[metricName].isDeleted = true
        console.log('Deleted: ' + metricName)
        const alsoDelete = this.state.counterMetricsState[metricName].alsoDelete
        for (let j = 0; j < alsoDelete.length; j++) {
          if (deleteMetric(alsoDelete[j], MetricTypes.ratio).success === alsoDelete[j]) {
            this.state.ratioMetricsState[alsoDelete[j]].isDeleted = true
            console.log('Deleted: ' + alsoDelete[j])
          }
        }
      }

    } else {
      if (ITER8_METRIC_NAMES.ratio.includes(metricName)) {
        return
      }

      if (deleteMetric(metricName, type).success === metricName) {
        this.state.ratioMetricsState[metricName].isDeleted = true
        console.log('Deleted: ' + metricName)
      }
    }

    this.setState({ counterMetricsState: this.state.counterMetricsState, ratioMetricsState: this.state.ratioMetricsState })
  }

  public restore(metric: string, type: MetricTypes) {

    const { counterMetricsState, ratioMetricsState } = this.state

    if (type === MetricTypes.counter) {
      if (restoreMetric(metric, counterMetricsState[metric].details, type).success === metric) {
        counterMetricsState[metric].isDeleted = false
        console.log('Restored: ' + metric)
      }

    } else {
      const alsoRestore = ratioMetricsState[metric].alsoRestore
      const deleted = []

      alsoRestore.forEach(metric => {
        if (counterMetricsState[metric].isDeleted) {
          if (restoreMetric(metric, counterMetricsState[metric].details, MetricTypes.counter).success === metric) {
            counterMetricsState[metric].isDeleted = false
            console.log('Restored: ' + metric)
            deleted.push(metric)
          }
        } else {
          deleted.push(metric)
        }
      })

      if (alsoRestore.length === deleted.length) {
        if (restoreMetric(metric, ratioMetricsState[metric].details, type).success === metric) {
          ratioMetricsState[metric].isDeleted = false
          console.log('Restored: ' + metric)
        }
      }
    }

    this.setState({ counterMetricsState: counterMetricsState, ratioMetricsState: ratioMetricsState })
  }

  public modifyIter8Metric(mode) {
    return <div className="warningtext">Warning: Cannot {mode} iter8 metrics</div>
  }

  public renderOnDelete(metricName: string, type: MetricTypes) {
    return (
      <div>
        <div className="deletedtext">Deleted</div>
        <div className="clickableicon" onClick={() => this.restore(metricName, type)}>
          <Reset20 />
          {type === MetricTypes.ratio && this.state.ratioMetricsState[metricName].custom && this.state.ratioMetricsState[metricName].alsoRestore.length ? (
            <div className="warningtext">
              Warning: Will also restore {this.state.ratioMetricsState[metricName].alsoRestore.join(', ')}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  // Display the add metric form
  public displayAddMetric(type: MetricTypes) {
    const defaultConfig = type === MetricTypes.counter ? DEFAULT_COUNTER_METRIC_CONFIG : DEFAULT_RATIO_METRIC_CONFIG

    this.setState({ 
      display: MetricDetailsModeDisplay.addMetrics,
      selectedType: type,
      editedMetric: defaultConfig
    })
  }

  // Display the edit metric form
  public displayEditMetric(metricName: string, type: MetricTypes) {
    const selectedMetric2 = type === MetricTypes.counter
        ? counterMetrics.find(counterMetric => {
            return counterMetric.name === metricName
          })
        : ratioMetrics.find(ratioMetric => {
            return ratioMetric.name === metricName
          })

    const selectedMetricCopy = JSON.parse(JSON.stringify(selectedMetric2))
    const defaultConfig = type === MetricTypes.counter ? DEFAULT_COUNTER_METRIC_CONFIG : DEFAULT_RATIO_METRIC_CONFIG

    // Add default config attributes in case
    const editedMetric = { ...defaultConfig, ...selectedMetricCopy }

    this.setState({ 
      display: MetricDetailsModeDisplay.editMetrics,
      selectedType: type,
      selectedMetricName: metricName,
      editedMetric
    })
  }

  private addMetric = e => {
    console.log('click submitted')

    const { selectedType } = this.state

    if (selectedType === MetricTypes.counter) {
      console.log('new counter metric config:', newCounterMetricConfig)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !counterMetrics.some(metric => {
        return metric.name === newCounterMetricConfig.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = COUNTER_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newCounterMetricConfig[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        /**
         * TS ignore because writing with proper typing would result in lots of
         * code duplication and greatly enhance complexity.
         *
         * This should be of the correct data type and safe to push at this point
         * with the final checks.
         */
        counterMetrics.push(newCounterMetricConfig as CounterMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = safeDump(counterMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        console.log(kubectlApplyConfig(safeDump(configMap)))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)
        
        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState, 
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    } else {
      console.log('new ratio metric config:', newRatioMetricConfig)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !ratioMetrics.some(metric => {
        return metric.name === newRatioMetricConfig.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = RATIO_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newRatioMetricConfig[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        /**
         * TS ignore because writing with proper typing would result in lots of
         * code duplication and greatly enhance complexity.
         *
         * This should be of the correct data type and safe to push at this point
         * with the final checks.
         */
        ratioMetrics.push(newRatioMetricConfig as RatioMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = safeDump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['ratio_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        console.log(kubectlApplyConfig(safeDump(configMap)))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)
        
        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState, 
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    }

    e.preventDefault()
  }

  private editMetric = e => {
    console.log('click submitted')

    const { selectedType } = this.state

    if (selectedType === MetricTypes.counter) {
      console.log('edited counter metric config:', this.state.editedMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !counterMetrics
        .filter(metric => {
          return metric.name !== this.state.selectedMetricName
        })
        .some(metric => {
          return metric.name === this.state.editedMetric.name
        })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = COUNTER_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return this.state.editedMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        // Remove metric corresponding to edit
        counterMetrics = counterMetrics.filter(metric => {
          return metric.name !== this.state.selectedMetricName
        })

        // Add edited metric
        counterMetrics.push(this.state.editedMetric as CounterMetric)

        // Propagate name change to ratio metrics
        ratioMetrics = ratioMetrics.map(metric => {
          if (metric.numerator === this.state.selectedMetricName) {
            metric.numerator = this.state.editedMetric.name
          }

          if (metric.denominator === this.state.selectedMetricName) {
            metric.denominator = this.state.editedMetric.name
          }

          return metric
        })

        // Convert new metric config to stringified YAML
        const stringifiedCounterMetrics = safeDump(counterMetrics)
        const stringifiedRatioMetrics = safeDump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedCounterMetrics
        configMap.data['ratio_metrics.yaml'] = stringifiedRatioMetrics

        // Apply new config map
        console.log(kubectlApplyConfig(safeDump(configMap)))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)
        
        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState, 
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    } else {
      console.log('edited ratio metric config:', this.state.editedMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !ratioMetrics
        .filter(metric => {
          return metric.name !== this.state.selectedMetricName
        })
        .some(metric => {
          return metric.name === this.state.editedMetric.name
        })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = RATIO_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return this.state.editedMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        // Remove metric corresponding to edit
        ratioMetrics = ratioMetrics.filter(metric => {
          return metric.name === this.state.selectedMetricName
        })

        // Add edited metric
        ratioMetrics.push(this.state.editedMetric as RatioMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = safeDump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['ratio_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        console.log(kubectlApplyConfig(safeDump(configMap)))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)
        
        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState, 
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    }

    e.preventDefault()
  }

  // Callback when an attribute of the selected metric is edited
  private updateAttribute = (e, attribute: AttributeData) => {
    // Get the non-printable value, if applicable
    const editedAttributeValue =
      attribute.type === AttributeTypes.input
        ? e.target.value
        : attribute.dropdownOptions.find(option => {
            return option.printableOption === e.target.value
          }).value

    const tempMetric = {}
    tempMetric[attribute.name] = editedAttributeValue

    this.setState({ editedMetric: { ...this.state.editedMetric, ...tempMetric } })
  }

  public renderTableTitle(title: string, type: MetricTypes) {
    return (
      <div>
        {title} <Add20 onClick={ () => this.displayAddMetric(type) } className="clickableicon" />
      </div>
    )
  }

  // Displays the details of a metric (all of its properties and its values)
  public renderMetricDetails(metric: CounterMetric | RatioMetric) {
    return (
      <DataTable
        rows={this.getInitialRowsFromObjectKeys(metric)}
        headers={[]}
        render={({ rows, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableBody className="innertable">
                {rows.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{metric[row.id]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    )
  }

  public renderMetricTable(metrics: MetricsState, type: MetricTypes, title: string) {
    return (
      <div className="metricTable">
        <DataTable
          rows={this.getInitialRowsFromObjectKeys(metrics)}
          headers={[]}
          render={({ rows, getRowProps, getTableProps }) => (
            <TableContainer title={this.renderTableTitle(title, type)}>
              <Table {...getTableProps()}>
                <TableBody>
                  {rows.map(row => (
                    <React.Fragment key={row.id}>
                      <TableExpandRow {...getRowProps({ row })}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>
                          <div className="clickableicon" onClick={ () => this.displayEditMetric(row.id, type) }>
                            <Edit20 />
                            {!metrics[row.id].custom ? this.modifyIter8Metric('edit') : null}
                          </div>
                        </TableCell>
                        <TableCell className="width20">
                          <div>
                            {metrics[row.id].isDeleted ? (
                              <div>{this.renderOnDelete(row.id, type)}</div>
                            ) : (
                              <div className="clickableicon" onClick={ () => this.updateIsDeleted(row.id, type) }>
                                <TrashCan20 />
                                {type === MetricTypes.counter && metrics[row.id].custom && metrics[row.id].alsoDelete.length ? (
                                  <div className="warningtext">
                                    Warning: Will also delete {metrics[row.id].alsoDelete.join(', ')}
                                  </div>
                                ) : null}
                                {!metrics[row.id].custom ? this.modifyIter8Metric('delete') : null}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableExpandRow>
                      {row.isExpanded && (
                        <TableExpandedRow colSpan={4}>
                          <div>{this.renderMetricDetails(metrics[row.id].details)}</div>
                        </TableExpandedRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        />
      </div>
    )
  }

  private renderAttribute(
    attribute: AttributeData,
    values: any,
    updateMetricConfig: (e, attribute: AttributeData) => void
  ) {
    if (attribute.type === AttributeTypes.input) {
      // Text input
      const invalidText =
        attribute.invalidCheck && attribute.invalidCheck.invalidText ? attribute.invalidCheck.invalidText : ''
  
      return (
        <FormGroup legendText="">
          <TextInput
            id={name}
            labelText={attribute.printableName}
            helperText={attribute.description}
            value={values[attribute.name]}
            invalidText={invalidText}
            onChange={e => {
              return updateMetricConfig(e, attribute)
            }}
          ></TextInput>
        </FormGroup>
      )
    } else {
      const dropdownOption = attribute.dropdownOptions.find(option => {
        return option.value === values[attribute.name]
      })
  
      const printableValue = dropdownOption ? dropdownOption.printableOption : values[attribute.name]
  
      // Dropdown menu
      return (
        <FormGroup legendText="">
          <Select
            id={name}
            labelText={attribute.printableName}
            helperText={attribute.description}
            value={printableValue}
            onChange={e => {
              return updateMetricConfig(e, attribute)
            }}
          >
            {// Adding the default dropdown option if applicable
            (() => {
              if (attribute.noDefaultDropdownOptionPlaceholder) {
                return (
                  <SelectItem
                    key="default"
                    text={attribute.noDefaultDropdownOptionPlaceholder}
                    value={attribute.noDefaultDropdownOptionPlaceholder}
                  ></SelectItem>
                )
              }
            })()}
            {// Adding the dropdown options
            attribute.dropdownOptions.map(option => {
              return (
                <SelectItem
                  key={option.printableOption}
                  text={option.printableOption}
                  value={option.printableOption}
                ></SelectItem>
              )
            })}
          </Select>
        </FormGroup>
      )
    }
  }

  public render() {
    const { display, selectedType } = this.state

    switch(display) {
      case MetricDetailsModeDisplay.getMetrics:
        return (
          <div className="pageStyle">
            {this.renderMetricTable(this.state.counterMetricsState, MetricTypes.counter, 'Counter Metrics')}
            {this.renderMetricTable(this.state.ratioMetricsState, MetricTypes.ratio, 'Ratio Metrics')}
            <div className="center">
              <div className="inner">
                <Button size="default" kind="primary">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )

      case MetricDetailsModeDisplay.addMetrics:
        return (
          <div style={{ padding: '10px' }}>
            <Form style={{ display: 'block' }} onSubmit={this.addMetric}>
              {(() => {
                if (selectedType === MetricTypes.counter) {
                  return COUNTER_METRIC_ATTRIBUTES_DATA.map(attribute =>
                    this.renderAttribute(
                      attribute,
                      this.state.editedMetric,
                      this.updateAttribute
                    )
                  )
                } else {
                  return RATIO_METRIC_ATTRIBUTES_DATA.map(attribute =>
                    this.renderAttribute(
                      attribute,
                      this.state.editedMetric,
                      this.updateAttribute
                    )
                  )
                }
              })()}
              <Button kind="primary" tabIndex={0} type="submit">
                {(() => {
                  return selectedType === MetricTypes.counter ? 'Create counter metric' : 'Create ratio metric'
                })()}
              </Button>
            </Form>
          </div>
        )

      case MetricDetailsModeDisplay.editMetrics:
        return (
          <div style={{ padding: '10px' }}>
            <Form style={{ display: 'block' }} onSubmit={this.editMetric}>
              {(() => {
                if (selectedType === MetricTypes.counter) {
                  return COUNTER_METRIC_ATTRIBUTES_DATA.map(attribute =>
                    this.renderAttribute(
                      attribute,
                      this.state.editedMetric,
                      this.updateAttribute
                    )
                  )
                } else {
                  return RATIO_METRIC_ATTRIBUTES_DATA.map(attribute =>
                    this.renderAttribute(
                      attribute,
                      this.state.editedMetric,
                      this.updateAttribute
                    )
                  )
                }
              })()}
              <Button kind="primary" tabIndex={0} type="submit">
                {(() => {
                  return selectedType === MetricTypes.counter ? 'Edit counter metric' : 'Edit ratio metric'
                })()}
              </Button>
            </Form>
          </div>
        )

      default: 
        return (<div>Cannot determine proper display mode</div>)
    }
  }
}

type MetricsState = {
  [metricName: string]: MetricState
}

type MetricState = {
  name: string
  isDeleted: boolean
  alsoDelete: string[]
  alsoRestore: string[]

  // TODO: rename to config?
  details: CounterMetric | RatioMetric
  custom: boolean 
}

// Outputs the metric config map as a YAML string
export function getMetricsYaml(): string {
  return safeDump(configMap)
}

// Delete the specified metrics
export function deleteMetrics(metricNames: string[]): string {
  // Error checking
  for (let i = 0; i < metricNames.length; i++) {
    const metricName = metricNames[i]

    if (counterMetricNames.includes(metricName)) {
      if (ITER8_METRIC_NAMES.counter.includes(metricName)) {
        return `Cannot delete iter8 counter metric '${metricName}'`
      }
    } else if (ratioMetricNames.includes(metricName)) {
      if (ITER8_METRIC_NAMES.ratio.includes(metricName)) {
        return `Cannot delete iter8 counter metric '${metricName}'`
      }
    } else {
      return `Invalid metric name '${metricName}'`
    }
  }

  // Execute deletion
  metricNames.forEach((metricName) => {
    const type = counterMetricNames.includes(metricName) ?
      MetricTypes.counter :
      ratioMetricNames.includes(metricName) ?
        MetricTypes.ratio :
        undefined

    deleteMetric(metricName, type)
  })
}

export function getMetricDetailsMode() {
  return (
    <MetricDetailsMode></MetricDetailsMode>
  )
}

updateMetricAttributesData()