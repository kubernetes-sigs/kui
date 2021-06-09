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
import { load, dump } from 'js-yaml'
import { Button, Icons } from '@kui-shell/plugin-client-common'
import { Caption, TableComposable, Tbody, Tr, Td } from '@patternfly/react-table'
import {
  ActionGroup,
  Form,
  FormGroup,
  FormSelect as Select,
  FormSelectOption as SelectItem,
  TextInput
} from '@patternfly/react-core'

import '../../src/web/scss/static/metrics.scss'

import { ErrorDisplay } from './error-react'
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

let COUNTER_METRIC_REQUIRED_ATTRIBUTES
let RATIO_METRIC_REQUIRED_ATTRIBUTES

export enum FormTypes {
  add = 'add',
  edit = 'edit'
}

export enum MetricTypes {
  counter = 'counter',
  ratio = 'ratio'
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

  // Assorted data to set up a validation check
  invalidChecks?: { [key in FormTypes]?: InvalidCheck }
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
    if (attribute.type === AttributeTypes.input) {
      result[attribute.name] = ''
    } else {
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

// Determines what page should be displayed
enum DisplayMode {
  'getMetrics', // Metric details tables
  'addMetric', // Add metric form
  'editMetric', // Edit metric form
  'error'
}

type MetricDetailsState = {
  configMap: MetricConfigMap
  rawConfigMap: any
  counterMetrics: CounterMetrics
  ratioMetrics: RatioMetrics

  counterMetricNames: string[]
  ratioMetricNames: string[]

  counterMetricsState: MetricsState
  ratioMetricsState: MetricsState

  display: DisplayMode // Controls the page that should be displayed

  selectedMetricName?: string // Selected metric to be edited
  selectedType?: MetricTypes // Selected type of metric to be added/edited
  newMetric?: Partial<CounterMetric | RatioMetric> // Metric to be added/replaced (edited)
  formSubmitted?: boolean // Whether the add/edit form has been submitted (used for reporting errors)

  errorString?: string
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

export default class MetricDetailsMode extends React.Component<{}, MetricDetailsState> {
  private args
  public constructor(props) {
    super(props)
    this.args = props
    try {
      this.state = {
        configMap: null,
        rawConfigMap: {},
        counterMetrics: [],
        ratioMetrics: [],
        counterMetricNames: [],
        ratioMetricNames: [],
        counterMetricsState: {},
        ratioMetricsState: {},
        display: DisplayMode.getMetrics,
        formSubmitted: false,
        errorString: 'None'
      }
      this.getConfigMap()
    } catch (error) {
      this.state = {
        configMap: undefined,
        rawConfigMap: undefined,
        counterMetrics: undefined,
        ratioMetrics: undefined,
        counterMetricNames: undefined,
        ratioMetricNames: undefined,
        counterMetricsState: undefined,
        ratioMetricsState: undefined,
        formSubmitted: undefined,
        display: DisplayMode.getMetrics,
        errorString: error
      }
    }
  }

  private getConfigMap() {
    setTimeout(async () => {
      const [rawConfigMap] = await Promise.all([getMetricConfig(this.args)])
      this.setState({
        rawConfigMap: rawConfigMap
      })
      this.constructorHelper()
    })
  }

  private constructorHelper = () => {
    try {
      // const { configMap, counterMetrics, ratioMetrics } = getMetricConfig()
      const counterMetrics = load(this.state.rawConfigMap.data['counter_metrics.yaml']) as CounterMetrics
      const ratioMetrics = load(this.state.rawConfigMap.data['ratio_metrics.yaml']) as RatioMetrics
      const cleanConfigMap = removeExtraneousMetaData(this.state.rawConfigMap)

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

      this.setState({
        configMap: cleanConfigMap,
        counterMetrics: counterMetrics,
        ratioMetrics: ratioMetrics,
        counterMetricNames: counterMetricNames,
        ratioMetricNames: ratioMetricNames,
        ratioMetricsState: ratioMetricsState,
        counterMetricsState: counterMetricsState
      })
    } catch (error) {
      console.log(error)
      throw new Error('Could not obtain metric config')
    }
  }

  private refreshState = () => {
    console.log('Refreshed state')

    try {
      this.setState({
        configMap: null,
        rawConfigMap: {},
        counterMetrics: [],
        ratioMetrics: [],
        counterMetricNames: [],
        ratioMetricNames: [],
        counterMetricsState: {},
        ratioMetricsState: {},
        display: DisplayMode.getMetrics,
        formSubmitted: false,
        errorString: 'None'
      })
      this.getConfigMap()
    } catch (error) {
      this.setState({
        configMap: undefined,
        counterMetrics: undefined,
        ratioMetrics: undefined,
        counterMetricNames: undefined,
        ratioMetricNames: undefined,
        counterMetricsState: undefined,
        ratioMetricsState: undefined,
        formSubmitted: undefined,
        display: DisplayMode.getMetrics,
        errorString: error
      })
    }
  }

  private generateMetricsStates = (
    counterMetrics: CounterMetrics,
    ratioMetrics: RatioMetrics
  ): { counterMetricsState: MetricsState; ratioMetricsState: MetricsState } => {
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

  private getInitialRowsFromObjectKeys = (object: object) => {
    return Object.keys(object).map(propertyName => {
      return { id: propertyName, isExpanded: false }
    })
  }

  private renderIter8ImmutableMetricWarning = (mode: string) => {
    return <div className="warningtext">Warning: Cannot {mode} iter8 metrics</div>
  }

  private renderDeleteWarning = (metricName: string, type: MetricTypes) => {
    return (
      <div>
        <div className="deletedtext">Deleted</div>
        <div className="clickableicon" onClick={() => this.restoreMetricHandler(metricName, type)}>
          <Icons icon="Retry" />
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

  // Display the metric details tables
  private displayGetMetrics = () => {
    this.setState({
      display: DisplayMode.getMetrics,
      selectedMetricName: undefined,
      selectedType: undefined,
      newMetric: undefined,
      formSubmitted: undefined
    })
  }

  // Display the add metric form
  private displayAddMetric = (type: MetricTypes) => {
    const defaultConfig = type === MetricTypes.counter ? DEFAULT_COUNTER_METRIC_CONFIG : DEFAULT_RATIO_METRIC_CONFIG

    this.setState({
      display: DisplayMode.addMetric,
      selectedType: type,
      newMetric: defaultConfig,
      formSubmitted: false
    })
  }

  // Display the edit metric form
  private displayEditMetric = (metricName: string, type: MetricTypes) => {
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
      display: DisplayMode.editMetric,
      selectedMetricName: metricName,
      selectedType: type,
      newMetric: editedMetric,
      formSubmitted: false
    })
  }

  private addMetricHandler = e => {
    console.log('click submitted')

    this.setState({
      formSubmitted: true
    })

    const { configMap, counterMetrics, ratioMetrics, selectedType, newMetric } = this.state

    if (selectedType === MetricTypes.counter) {
      console.log('new counter metric config:', newMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !counterMetrics.some(metric => {
        return metric.name === newMetric.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = COUNTER_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        const cleanNewMetric: Partial<CounterMetric> = {}

        Object.entries(newMetric).forEach(([attributeName, attributeValue]) => {
          const attribute = COUNTER_METRIC_ATTRIBUTES_DATA.find(attribute => attribute.name === attributeName)

          if (attribute.type === AttributeTypes.input) {
            if ((attributeValue as string).length > 0) {
              cleanNewMetric[attributeName] = attributeValue
            }
          } else {
            cleanNewMetric[attributeName] = attributeValue
          }
        })

        /**
         * TS ignore because writing with proper typing would result in lots of
         * code duplication and greatly enhance complexity.
         *
         * This should be of the correct data type and safe to push at this point
         * with the final checks.
         */
        counterMetrics.push(cleanNewMetric as CounterMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = dump(counterMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        kubectlApplyRule(configMap, this.args)

        // TODO: Add proper error handling
        const counterMetricNames = counterMetrics.map(counterMetric => {
          return counterMetric.name
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

        const { counterMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          configMap,
          counterMetrics,
          display: DisplayMode.getMetrics,
          counterMetricsState: counterMetricsState,
          selectedType: undefined,
          newMetric: undefined,
          formSubmitted: undefined
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    } else {
      console.log('new ratio metric config:', newMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !ratioMetrics.some(metric => {
        return metric.name === newMetric.name
      })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = RATIO_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        const cleanNewMetric: Partial<CounterMetric> = {}

        Object.entries(newMetric).forEach(([attributeName, attributeValue]) => {
          const attribute = RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => attribute.name === attributeName)

          if (attribute.type === AttributeTypes.input) {
            if ((attributeValue as string).length > 0) {
              cleanNewMetric[attributeName] = attributeValue
            }
          } else {
            cleanNewMetric[attributeName] = attributeValue
          }
        })

        /**
         * TS ignore because writing with proper typing would result in lots of
         * code duplication and greatly enhance complexity.
         *
         * This should be of the correct data type and safe to push at this point
         * with the final checks.
         */
        ratioMetrics.push(cleanNewMetric as RatioMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = dump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['ratio_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        kubectlApplyRule(configMap, this.args)

        // TODO: Add proper error handling
        const counterMetricNames = counterMetrics.map(counterMetric => {
          return counterMetric.name
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

        const { ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          configMap,
          ratioMetrics,
          display: DisplayMode.getMetrics,
          ratioMetricsState: ratioMetricsState,
          selectedType: undefined,
          newMetric: undefined,
          formSubmitted: undefined
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

    this.setState({
      formSubmitted: true
    })

    const { selectedType } = this.state
    let { configMap, counterMetrics, ratioMetrics, selectedMetricName, newMetric } = this.state

    if (selectedType === MetricTypes.counter) {
      console.log('edited counter metric config:', newMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !counterMetrics
        .filter(metric => {
          return metric.name !== selectedMetricName
        })
        .some(metric => {
          return metric.name === newMetric.name
        })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = COUNTER_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        const cleanNewMetric: Partial<CounterMetric> = {}

        Object.entries(newMetric).forEach(([attributeName, attributeValue]) => {
          const attribute = COUNTER_METRIC_ATTRIBUTES_DATA.find(attribute => attribute.name === attributeName)

          if (attribute.type === AttributeTypes.input) {
            if ((attributeValue as string).length > 0) {
              cleanNewMetric[attributeName] = attributeValue
            }
          } else {
            cleanNewMetric[attributeName] = attributeValue
          }
        })

        // Remove metric corresponding to edit
        counterMetrics = counterMetrics.filter(metric => {
          return metric.name !== selectedMetricName
        })

        // Add edited metric
        counterMetrics.push(cleanNewMetric as CounterMetric)

        // Propagate name change to ratio metrics
        ratioMetrics.forEach(metric => {
          if (metric.numerator === selectedMetricName) {
            metric.numerator = newMetric.name
          }

          if (metric.denominator === selectedMetricName) {
            metric.denominator = newMetric.name
          }
        })

        // Convert new metric config to stringified YAML
        const stringifiedCounterMetrics = dump(counterMetrics)
        const stringifiedRatioMetrics = dump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['counter_metrics.yaml'] = stringifiedCounterMetrics
        configMap.data['ratio_metrics.yaml'] = stringifiedRatioMetrics

        // Apply new config map
        kubectlApplyRule(configMap, this.args)

        // TODO: Add proper error handling
        const counterMetricNames = counterMetrics.map(counterMetric => {
          return counterMetric.name
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

        const { counterMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          configMap,
          counterMetrics,
          display: DisplayMode.getMetrics,
          counterMetricsState: counterMetricsState,
          selectedMetricName: undefined,
          selectedType: undefined,
          newMetric: undefined,
          formSubmitted: undefined
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    } else {
      console.log('edited ratio metric config:', newMetric)

      /**
       * Ensure that there are no name collisions
       *
       * This is separate from the invalid check in the form
       */
      const uniqueName = !ratioMetrics
        .filter(metric => {
          return metric.name !== selectedMetricName
        })
        .some(metric => {
          return metric.name === newMetric.name
        })

      // Ensure all required fields are present
      const allRequiredFieldsPresent = RATIO_METRIC_REQUIRED_ATTRIBUTES.every(id => {
        return newMetric[id]
      })

      // Final checks
      if (allRequiredFieldsPresent && uniqueName) {
        const cleanNewMetric: Partial<CounterMetric> = {}

        Object.entries(newMetric).forEach(([attributeName, attributeValue]) => {
          const attribute = RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => attribute.name === attributeName)

          if (attribute.type === AttributeTypes.input) {
            if ((attributeValue as string).length > 0) {
              cleanNewMetric[attributeName] = attributeValue
            }
          } else {
            cleanNewMetric[attributeName] = attributeValue
          }
        })

        // Remove metric corresponding to edit
        ratioMetrics = ratioMetrics.filter(metric => {
          return metric.name !== selectedMetricName
        })

        // Add edited metric
        ratioMetrics.push(cleanNewMetric as RatioMetric)

        // Convert new metric config to stringified YAML
        const stringifiedMetrics = dump(ratioMetrics)

        // Add new metric config to config map
        configMap.data['ratio_metrics.yaml'] = stringifiedMetrics

        // Apply new config map
        kubectlApplyRule(configMap, this.args)

        // TODO: Add proper error handling
        const counterMetricNames = counterMetrics.map(counterMetric => {
          return counterMetric.name
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

        const { ratioMetricsState } = this.generateMetricsStates(counterMetrics, ratioMetrics)

        this.setState({
          configMap,
          ratioMetrics,
          display: DisplayMode.getMetrics,
          ratioMetricsState: ratioMetricsState,
          selectedMetricName: undefined,
          selectedType: undefined,
          newMetric: undefined,
          formSubmitted: undefined
        })
      } else {
        // TODO: inform user of problems
        console.log('uniqueName:', uniqueName)
        console.log('allRequiredFieldsPresent:', allRequiredFieldsPresent)
      }
    }

    e.preventDefault()
  }

  private deleteMetricHandler = (metricName: string, type: MetricTypes): void => {
    const newState = { ...this.state }
    if (type === MetricTypes.counter) {
      // Delete counter metric
      if (deleteMetric(this.state.rawConfigMap, metricName, type, this.args)) {
        newState.counterMetricsState[metricName].isDeleted = true

        // Delete associated ratio metrics that utilize the counter metric
        this.state.counterMetricsState[metricName].alsoDelete.forEach(ratioMetricName => {
          if (deleteMetric(this.state.rawConfigMap, ratioMetricName, MetricTypes.ratio, this.args)) {
            newState.ratioMetricsState[ratioMetricName].isDeleted = true
          }
        })
      }
    } else {
      // Delete ratio metric
      if (deleteMetric(this.state.rawConfigMap, metricName, type, this.args)) {
        newState.ratioMetricsState[metricName].isDeleted = true
      }
    }

    this.setState(newState)
  }

  private restoreMetricHandler = (metricName: string, type: MetricTypes) => {
    const { counterMetricsState, ratioMetricsState } = this.state

    const newState = { ...this.state }

    if (type === MetricTypes.counter) {
      // Restore counter metric
      if (restoreMetric(this.state.rawConfigMap, counterMetricsState[metricName].details, type, this.args)) {
        newState.counterMetricsState[metricName].isDeleted = false
      }
    } else {
      // Restore ratio metric
      if (restoreMetric(this.state.rawConfigMap, ratioMetricsState[metricName].details, type, this.args)) {
        newState.ratioMetricsState[metricName].isDeleted = false

        // Restore related counter
        ratioMetricsState[metricName].alsoRestore.forEach(counterMetricName => {
          if (counterMetricsState[counterMetricName].isDeleted) {
            if (
              restoreMetric(
                this.state.rawConfigMap,
                counterMetricsState[counterMetricName].details,
                MetricTypes.counter,
                this.args
              )
            ) {
              newState.counterMetricsState[counterMetricName].isDeleted = false
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

    this.setState({ newMetric: { ...this.state.newMetric, ...tempMetric } })
  }

  private renderTableTitle = (title: string, type: MetricTypes) => {
    return (
      <div>
        {title} <Icons icon="Add" onClick={() => this.displayAddMetric(type)} className="clickableicon" />
      </div>
    )
  }

  // Displays the details of a metric (all of its properties and its values)
  private renderMetricDetails = (metric: CounterMetric | RatioMetric, type: MetricTypes) => {
    const rows = this.getInitialRowsFromObjectKeys(metric)

    return (
      <TableComposable className="kui--table-like-wrapper">
        <Tbody className="innertable">
          {rows.map(row => {
            const attributeData =
              type === MetricTypes.counter
                ? COUNTER_METRIC_ATTRIBUTES_DATA.find(attribute => {
                    return attribute.name === row.id
                  })
                : RATIO_METRIC_ATTRIBUTES_DATA.find(attribute => {
                    return attribute.name === row.id
                  })

            // Dropdown options should use the printable version
            if (attributeData.type === AttributeTypes.dropdown) {
              const dropdownOption = attributeData.dropdownOptions.find(option => {
                return option.value === metric[row.id]
              })

              return (
                <Tr key={row.id}>
                  <Td>{row.id}</Td>
                  <Td>{dropdownOption.printableOption}</Td>
                </Tr>
              )
            }

            return (
              <Tr key={row.id}>
                <Td>{row.id}</Td>
                <Td>{metric[row.id]}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </TableComposable>
    )
  }

  private renderMetricTable = (metrics: MetricsState, type: MetricTypes, title: string) => {
    const rows = this.getInitialRowsFromObjectKeys(metrics)
    return (
      <TableComposable className="kui--table-like-wrapper">
        <Caption>{this.renderTableTitle(title, type)}</Caption>
        <Tbody isExpanded>
          {rows.map(row => (
            <React.Fragment key={row.id}>
              <Tr aria-label="Information Unavailable" isExpanded>
                <Td>{row.id}</Td>
                <Td>
                  <div
                    className="clickableicon"
                    onClick={() => {
                      // Only allow editing if the metric is custom (not part of iter8)
                      if (metrics[row.id].custom) {
                        this.displayEditMetric(row.id, type)
                      }
                    }}
                  >
                    <Icons icon="Edit" />
                    {!metrics[row.id].custom ? this.renderIter8ImmutableMetricWarning('edit') : null}
                  </div>
                </Td>
                <Td className="width20">
                  <div>
                    {metrics[row.id].isDeleted ? (
                      <div>{this.renderDeleteWarning(row.id, type)}</div>
                    ) : (
                      <div
                        className="clickableicon"
                        onClick={() => {
                          // Only allow deletion if the metric is custom (not part of iter8)
                          if (metrics[row.id].custom) {
                            this.deleteMetricHandler(row.id, type)
                          }
                        }}
                      >
                        <Icons icon="Trash" />
                        {type === MetricTypes.counter &&
                        metrics[row.id].custom &&
                        metrics[row.id].alsoDelete.length > 0 ? (
                          <div className="warningtext">
                            Warning: Will also delete {metrics[row.id].alsoDelete.join(', ')}
                          </div>
                        ) : null}
                        {!metrics[row.id].custom ? this.renderIter8ImmutableMetricWarning('delete') : null}
                      </div>
                    )}
                  </div>
                </Td>
              </Tr>
              {row.isExpanded && (
                <Tr colSpan={4} isExpanded>
                  <div>{this.renderMetricDetails(metrics[row.id].details, type)}</div>
                </Tr>
              )}
            </React.Fragment>
          ))}
        </Tbody>
      </TableComposable>
    )
  }

  private renderAttributeForm = (attribute: AttributeData, formType: FormTypes) => {
    const { newMetric, formSubmitted } = this.state

    if (attribute.type === AttributeTypes.input) {
      const invalid =
        // Check if the form has been submitted and if this attribute is required
        !newMetric[attribute.name] && formSubmitted && attribute.required
          ? true
          : // Run the invalid check, if applicable
          attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].check
          ? attribute.invalidChecks[formType].check(newMetric[attribute.name], this.state)
          : false

      const invalidText = !newMetric[attribute.name]
        ? 'This is a required attribute'
        : attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].invalidText
        ? attribute.invalidChecks[formType].invalidText
        : ''

      const id = attribute.name
      const label = attribute.printableName
      return (
        <FormGroup
          key={attribute.name}
          label={label}
          fieldId={`get-metrics-${label}-${id}`}
          helperText={attribute.description}
          helperTextInvalid={invalidText}
          validated={invalid ? 'error' : 'default'}
          isRequired={attribute.required}
        >
          <TextInput
            id={id}
            value={newMetric[attribute.name]}
            onChange={e => {
              return this.updateAttribute(e, attribute)
            }}
          ></TextInput>
        </FormGroup>
      )
    } else {
      const dropdownOption = attribute.dropdownOptions.find(option => {
        return option.value === newMetric[attribute.name]
      })

      const printableValue = dropdownOption ? dropdownOption.printableOption : newMetric[attribute.name]

      const invalid =
        // Check if the form has been submitted and if this attribute is required
        !newMetric[attribute.name] && formSubmitted && attribute.required
          ? true
          : // Run the invalid check, if applicable
          attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].check
          ? attribute.invalidChecks[formType].check(newMetric[attribute.name], this.state)
          : false

      const invalidText = !newMetric[attribute.name]
        ? 'This is a required attribute. An option must be selected.'
        : attribute.invalidChecks && attribute.invalidChecks[formType] && attribute.invalidChecks[formType].invalidText
        ? attribute.invalidChecks[formType].invalidText
        : ''

      // Dropdown menu
      const id = attribute.name
      const label = attribute.printableName
      return (
        <FormGroup
          key={attribute.name}
          label={label}
          fieldId={`get-metrics-select-${label}-${id}`}
          helperText={attribute.description}
          helperTextInvalid={invalidText}
          validated={invalid ? 'error' : 'default'}
          isRequired={attribute.required}
        >
          <Select
            id={id}
            value={printableValue}
            onChange={e => {
              return this.updateAttribute(e, attribute)
            }}
          >
            {// Adding the default dropdown option if applicable
            (() => {
              if (attribute.noDefaultDropdownOptionPlaceholder) {
                return (
                  <SelectItem
                    key="default"
                    label={attribute.noDefaultDropdownOptionPlaceholder}
                    value={attribute.noDefaultDropdownOptionPlaceholder}
                  />
                )
              }
            })()}
            {// Adding the dropdown options
            attribute.dropdownOptions.map(option => {
              return (
                <SelectItem
                  key={option.printableOption}
                  label={option.printableOption}
                  value={option.printableOption}
                />
              )
            })}
          </Select>
        </FormGroup>
      )
    }
  }

  private renderMetricForm = (selectedType: MetricTypes, submitCallback: (e) => void, formType: FormTypes) => {
    return (
      <div>
        <Form onSubmit={submitCallback}>
          {(() => {
            if (selectedType === MetricTypes.counter) {
              return COUNTER_METRIC_ATTRIBUTES_DATA.map(attribute => this.renderAttributeForm(attribute, formType))
            } else {
              return RATIO_METRIC_ATTRIBUTES_DATA.map(attribute => this.renderAttributeForm(attribute, formType))
            }
          })()}
          <ActionGroup>
            <Button kind="primary" type="submit">
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
            <Button className="small-left-pad" kind="link" type="button" onClick={this.displayGetMetrics}>
              Cancel
            </Button>
          </ActionGroup>
        </Form>
      </div>
    )
  }

  public render = () => {
    const { display, selectedType, counterMetricsState, ratioMetricsState, errorString } = this.state

    switch (display) {
      case DisplayMode.getMetrics:
        return (
          <div className="pageStyle">
            {this.renderMetricTable(counterMetricsState, MetricTypes.counter, 'Counter Metrics')}
            {this.renderMetricTable(ratioMetricsState, MetricTypes.ratio, 'Ratio Metrics')}

            <div className="padding-content">
              <Button kind="primary" onClick={this.refreshState}>
                Refresh
              </Button>
            </div>
          </div>
        )

      case DisplayMode.addMetric:
        return (
          <div className="padding-content">
            {(() => {
              return this.renderMetricForm(selectedType, this.addMetricHandler, FormTypes.add)
            })()}
          </div>
        )

      case DisplayMode.editMetric:
        return (
          <div className="padding-content">
            {(() => {
              return this.renderMetricForm(selectedType, this.editMetricHandler, FormTypes.edit)
            })()}
          </div>
        )

      case DisplayMode.error:
        return <ErrorDisplay errorString={errorString}></ErrorDisplay>

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

// Delete the specified metrics
// export function deleteMetrics(metricNames: string[]) {
//   try {
//     const { counterMetrics, ratioMetrics } = getMetricConfig(metricNames)
//
//     const counterMetricNames = counterMetrics.map(counterMetric => {
//       return counterMetric.name
//     })
//
//     const ratioMetricNames = ratioMetrics.map(ratioMetric => {
//       return ratioMetric.name
//     })
//
//     // Error checking
//     metricNames.forEach(metricName => {
//       if (counterMetricNames.includes(metricName)) {
//         if (ITER8_METRIC_NAMES.counter.includes(metricName)) {
//           throw new Error(`Cannot delete iter8 counter metric '${metricName}'`)
//         }
//       } else if (ratioMetricNames.includes(metricName)) {
//         if (ITER8_METRIC_NAMES.ratio.includes(metricName)) {
//           throw new Error(`Cannot delete iter8 ratio metric '${metricName}'`)
//         }
//       } else {
//         throw new Error(`Invalid metric name '${metricName}'`)
//       }
//     })
//
//     // Execute deletion
//     metricNames.forEach(metricName => {
//       const type = counterMetricNames.includes(metricName)
//         ? MetricTypes.counter
//         : ratioMetricNames.includes(metricName)
//         ? MetricTypes.ratio
//         : undefined
//       deleteMetric(metricName, type, args)
//     })
//   } catch (error) {
//     return 'Could not obtain metric config map'
//   }
// }
