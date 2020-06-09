import * as React from 'react'
import { TrashCan20, Reset20, Add20, Edit20 } from '@carbon/icons-react'
import { Button, DataTable, Form, FormGroup, Select, SelectItem, TextInput } from 'carbon-components-react'
import 'carbon-components/scss/components/button/_button.scss'
import 'carbon-components/scss/components/data-table/_data-table-expandable.scss'
import 'carbon-components/scss/components/data-table/_data-table.scss'
import 'carbon-components/scss/components/data-table/_data-table-action.scss'
import 'carbon-components/scss/components/data-table/_data-table-core.scss'
import 'carbon-components/scss/components/data-table/_data-table-skeleton.scss'

import '../../src/web/scss/static/metrics.scss'

import deleteMetric from '../components/delete-metric'
import restoreMetric from '../components/restore-metric'
import { getMetricConfig, removeExtraneousMetaData, ITER8_METRIC_NAMES } from '../components/metric-config'
import {
  CounterMetric,
  CounterMetrics,
  RatioMetric,
  RatioMetrics,
  MetricConfigMap
} from '../components/metric-config-types'
import { kubectlApplyRule } from '../components/traffic-split'

import { safeDump } from 'js-yaml'

const { Table, TableBody, TableCell, TableRow, TableContainer, TableExpandRow, TableExpandedRow } = DataTable

let COUNTER_METRIC_REQUIRED_ATTRIBUTES
let RATIO_METRIC_REQUIRED_ATTRIBUTES

export enum FormTypes {
  add = 'add',
  edit = 'edit'
}

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
  invalidChecks?: { [key in FormTypes]?: InvalidCheck }
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

  // Given the value, return whether the input is valid or not
  check: (value: any, state: any) => boolean
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
    invalidChecks: {
      add: {
        invalidText: 'Another counter metric already has this name',
        check: (value: string, state: MetricDetailsState) => {
          return state.counterMetricNames.includes(value)
        }
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
    invalidChecks: {
      add: {
        invalidText: 'Another ratio metric already has this name',
        check: (value: string, state: MetricDetailsState) => {
          return state.ratioMetricNames.includes(value)
        }
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
  const result = {}

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
          result[attribute.name] = attribute.dropdownOptions[0].value
        } else {
          throw new Error(`No known dropdown options for attribute '${attribute.name}'`)
        }
      }
    }
  })

  return result
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
  configMap: MetricConfigMap
  counterMetrics: CounterMetrics
  ratioMetrics: RatioMetrics
  counterMetricNames: string[]
  ratioMetricNames: string[]

  counterMetricsState: MetricsState
  ratioMetricsState: MetricsState
  display: MetricDetailsModeDisplay

  selectedType?: MetricTypes
  selectedMetricName?: string
  editedMetric?: Partial<CounterMetric | RatioMetric>
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

class MetricDetailsMode extends React.Component<MetricDetailsProps, MetricDetailsState> {
  public constructor(props: MetricDetailsProps) {
    super(props)

    const { configMap, counterMetrics, ratioMetrics } = getMetricConfig()

    const cleanConfigMap = removeExtraneousMetaData(configMap)

    // TODO: Add proper error handling
    const counterMetricNames = counterMetrics.map(counterMetric => {
      return counterMetric.name
    })

    const ratioMetricNames = ratioMetrics.map(ratioMetric => {
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

    const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

    this.state = {
      configMap: cleanConfigMap,
      counterMetrics,
      ratioMetrics,
      counterMetricNames,
      ratioMetricNames,

      ratioMetricsState: ratioMetricsState,
      counterMetricsState: counterMetricsState,

      display: MetricDetailsModeDisplay.getMetrics
    }
  }

  public generateMetricsStates(
    counterMetrics: CounterMetrics,
    ratioMetrics: RatioMetrics
  ): { counterMetricsState: MetricsState; ratioMetricsState: MetricsState } {
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

    return { counterMetricsState, ratioMetricsState }
  }

  public getInitialRowsFromObjectKeys(object: object) {
    return Object.keys(object).map(propertyName => {
      return { id: propertyName }
    })
  }

  public renderIter8ImmutableMetricWarning(mode) {
    return <div className="warningtext">Warning: Cannot {mode} iter8 metrics</div>
  }

  public renderDeleteWarning(metricName: string, type: MetricTypes) {
    return (
      <div>
        <div className="deletedtext">Deleted</div>
        <div className="clickableicon" onClick={() => this.restoreMetricHandler(metricName, type)}>
          <Reset20 />
          {type === MetricTypes.ratio &&
          this.state.ratioMetricsState[metricName].custom &&
          this.state.ratioMetricsState[metricName].alsoRestore.length ? (
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
    const { counterMetrics, ratioMetrics } = this.state

    const selectedMetric =
      type === MetricTypes.counter
        ? counterMetrics.find(counterMetric => {
            return counterMetric.name === metricName
          })
        : ratioMetrics.find(ratioMetric => {
            return ratioMetric.name === metricName
          })

    const selectedMetricCopy = JSON.parse(JSON.stringify(selectedMetric))
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

  private addMetricHandler = e => {
    console.log('click submitted')

    const { configMap, counterMetrics, ratioMetrics, selectedType, editedMetric } = this.state

    if (selectedType === MetricTypes.counter) {
      console.log('new counter metric config:', editedMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !counterMetrics.some(metric => {
        return metric.name === editedMetric.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = COUNTER_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return editedMetric[id]
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
        counterMetrics.push(editedMetric as CounterMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = safeDump(counterMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        console.log(kubectlApplyRule(configMap))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    } else {
      console.log('new ratio metric config:', editedMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !ratioMetrics.some(metric => {
        return metric.name === editedMetric.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = RATIO_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return editedMetric[id]
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
        ratioMetrics.push(editedMetric as RatioMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = safeDump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['ratio_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        console.log(kubectlApplyRule(configMap))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    }

    e.preventDefault()
  }

  private editMetricHandler = e => {
    console.log('click submitted')

    const { selectedType } = this.state
    let { configMap, counterMetrics, ratioMetrics } = this.state

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
        ratioMetrics.forEach(metric => {
          if (metric.numerator === this.state.selectedMetricName) {
            metric.numerator = this.state.editedMetric.name
          }

          if (metric.denominator === this.state.selectedMetricName) {
            metric.denominator = this.state.editedMetric.name
          }
        })

        // Convert new metric config to stringified YAML
        const stringifiedCounterMetrics = safeDump(counterMetrics)
        const stringifiedRatioMetrics = safeDump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedCounterMetrics
        configMap.data['ratio_metrics.yaml'] = stringifiedRatioMetrics

        // Apply new config map
        console.log(kubectlApplyRule(configMap))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState
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
        console.log(kubectlApplyRule(configMap))

        const { counterMetricsState, ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          display: MetricDetailsModeDisplay.getMetrics,
          counterMetricsState: counterMetricsState,
          ratioMetricsState: ratioMetricsState
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    }

    e.preventDefault()
  }

  public deleteMetricHandler(metricName: string, type: MetricTypes): void {
    const newState = { ...this.state }

    if (type === MetricTypes.counter) {
      // Do not delete iter8 metrics
      if (ITER8_METRIC_NAMES.counter.includes(metricName)) {
        return
      }

      // Delete counter metric
      if (deleteMetric(metricName, type)) {
        newState.counterMetricsState[metricName].isDeleted = true

        // Delete associated ratio metrics that utilize the counter metric
        this.state.counterMetricsState[metricName].alsoDelete.forEach(ratioMetricName => {
          if (deleteMetric(ratioMetricName, MetricTypes.ratio)) {
            newState.ratioMetricsState[ratioMetricName].isDeleted = true
          }
        })
      }
    } else {
      // Do not delete iter8 metrics
      if (ITER8_METRIC_NAMES.ratio.includes(metricName)) {
        return
      }

      // Delete ratio metric
      if (deleteMetric(metricName, type)) {
        newState.ratioMetricsState[metricName].isDeleted = true
      }
    }

    this.setState(newState)
  }

  public restoreMetricHandler(metricName: string, type: MetricTypes) {
    const { counterMetricsState, ratioMetricsState } = this.state

    const newState = { ...this.state }

    if (type === MetricTypes.counter) {
      // Restore counter metric
      if (restoreMetric(counterMetricsState[metricName].details, type)) {
        newState.counterMetricsState[metricName].isDeleted = false
      }
    } else {
      // Restore ratio metric
      if (restoreMetric(ratioMetricsState[metricName].details, type)) {
        newState.ratioMetricsState[metricName].isDeleted = false

        // Restore related counter
        ratioMetricsState[metricName].alsoRestore.forEach(counterMetricName => {
          if (counterMetricsState[counterMetricName].isDeleted) {
            if (restoreMetric(counterMetricsState[counterMetricName].details, MetricTypes.counter)) {
              newState.counterMetricsState[counterMetricName].isDeleted = true
            }
          }
        })
      }
    }

    this.setState(newState)
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
        {title} <Add20 onClick={() => this.displayAddMetric(type)} className="clickableicon" />
      </div>
    )
  }

  // Displays the details of a metric (all of its properties and its values)
  public renderMetricDetails(metric: CounterMetric | RatioMetric, type: MetricTypes) {
    return (
      <DataTable
        rows={this.getInitialRowsFromObjectKeys(metric)}
        headers={[]}
        render={({ rows, getTableProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableBody className="innertable">
                {rows.map(row => {
                  const attributeData = type === MetricTypes.counter ? 
                    COUNTER_METRIC_ATTRIBUTES_DATA.find(attribute => {
                      return attribute.name === row.id
                    }) : 
                    RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => {
                      return attribute.name === row.id
                    })

                  // Dropdown options should use the printable version
                  if (attributeData.type === AttributeTypes.dropdown) {

                    const dropdownOption = attributeData.dropdownOptions.find(option => {
                      return option.value === metric[row.id]
                    })

                    return <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{dropdownOption.printableOption}</TableCell>
                    </TableRow>
                  }

                  return <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{metric[row.id]}</TableCell>
                  </TableRow>
                })}
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
                          <div className="clickableicon" onClick={() => this.displayEditMetric(row.id, type)}>
                            <Edit20 />
                            {!metrics[row.id].custom ? this.renderIter8ImmutableMetricWarning('edit') : null}
                          </div>
                        </TableCell>
                        <TableCell className="width20">
                          <div>
                            {metrics[row.id].isDeleted ? (
                              <div>{this.renderDeleteWarning(row.id, type)}</div>
                            ) : (
                              <div className="clickableicon" onClick={() => this.deleteMetricHandler(row.id, type)}>
                                <TrashCan20 />
                                {type === MetricTypes.counter &&
                                metrics[row.id].custom &&
                                metrics[row.id].alsoDelete.length ? (
                                  <div className="warningtext">
                                    Warning: Will also delete {metrics[row.id].alsoDelete.join(', ')}
                                  </div>
                                ) : null}
                                {!metrics[row.id].custom ? this.renderIter8ImmutableMetricWarning('delete') : null}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableExpandRow>
                      {row.isExpanded && (
                        <TableExpandedRow colSpan={4}>
                          <div>{this.renderMetricDetails(metrics[row.id].details, type)}</div>
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

  private renderAttributeForm(
    attribute: AttributeData,
    values: any,
    updateMetricConfig: (e, attribute: AttributeData) => void,
    formType: FormTypes
  ) {
    if (attribute.type === AttributeTypes.input) {
      const invalid =
        attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].check
          ? attribute.invalidChecks[formType].check(values[attribute.name], this.state)
          : false

      const invalidText =
        attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].invalidText
          ? attribute.invalidChecks[formType].invalidText
          : ''

      return (
        <FormGroup legendText="">
          <TextInput
            id={name}
            labelText={attribute.printableName}
            helperText={attribute.description}
            value={values[attribute.name]}
            invalid={invalid}
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

  private renderMetricForm(selectedType: MetricTypes, submitCallback: (e) => void, formType: FormTypes) {
    return (
      <Form style={{ display: 'block' }} onSubmit={submitCallback}>
        {(() => {
          if (selectedType === MetricTypes.counter) {
            return COUNTER_METRIC_ATTRIBUTES_DATA.map(attribute =>
              this.renderAttributeForm(attribute, this.state.editedMetric, this.updateAttribute, formType)
            )
          } else {
            return RATIO_METRIC_ATTRIBUTES_DATA.map(attribute =>
              this.renderAttributeForm(attribute, this.state.editedMetric, this.updateAttribute, formType)
            )
          }
        })()}
        <Button kind="primary" tabIndex={0} type="submit">
          {(() => {
            if (formType === FormTypes.add) {
              if (selectedType === MetricTypes.counter) {
                return 'Create counter metric'
              } else {
                return 'Create ratio metric'
              }
            } else {
              if (selectedType === MetricTypes.counter) {
                return 'Edit counter metric'
              } else {
                return 'Edit ratio metric'
              }
            }
          })()}
        </Button>
      </Form>
    )
  }

  public render() {
    const { display, selectedType } = this.state

    switch (display) {
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
            {(() => {
              return this.renderMetricForm(selectedType, this.addMetricHandler, FormTypes.add)
            })()}
          </div>
        )

      case MetricDetailsModeDisplay.editMetrics:
        return (
          <div style={{ padding: '10px' }}>
            {(() => {
              return this.renderMetricForm(selectedType, this.editMetricHandler, FormTypes.edit)
            })()}
          </div>
        )

      default:
        return <div>Cannot determine proper display mode</div>
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
  const { configMap } = getMetricConfig()

  return safeDump(configMap)
}

// Delete the specified metrics
export function deleteMetrics(metricNames: string[]) {
  const { counterMetrics, ratioMetrics } = getMetricConfig()

  const counterMetricNames = counterMetrics.map(counterMetric => {
    return counterMetric.name
  })

  const ratioMetricNames = ratioMetrics.map(ratioMetric => {
    return ratioMetric.name
  })

  // Error checking
  metricNames.forEach(metricName => {
    if (counterMetricNames.includes(metricName)) {
      if (ITER8_METRIC_NAMES.counter.includes(metricName)) {
        throw new Error(`Cannot delete iter8 counter metric '${metricName}'`)
      }
    } else if (ratioMetricNames.includes(metricName)) {
      if (ITER8_METRIC_NAMES.ratio.includes(metricName)) {
        throw new Error(`Cannot delete iter8 ratio metric '${metricName}'`)
      }
    } else {
      throw new Error(`Invalid metric name '${metricName}'`)
    }
  })

  // Execute deletion
  metricNames.forEach(metricName => {
    const type = counterMetricNames.includes(metricName)
      ? MetricTypes.counter
      : ratioMetricNames.includes(metricName)
      ? MetricTypes.ratio
      : undefined

    deleteMetric(metricName, type)
  })
}

export function getMetricDetailsMode() {
  return <MetricDetailsMode></MetricDetailsMode>
}
