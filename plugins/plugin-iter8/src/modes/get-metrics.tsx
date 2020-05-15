import * as React from 'react'
import { ToolbarProps } from '@kui-shell/core'
import { TrashCan20, Reset20, Add20, Edit20 } from '@carbon/icons-react'
import { Button, DataTable } from 'carbon-components-react'
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
import { CounterMetric, CounterMetrics, RatioMetric, RatioMetrics } from '../components/metric-config-types'

const { Table, TableBody, TableCell, TableRow, TableContainer, TableExpandRow, TableExpandedRow } = DataTable

enum MetricTypes {
  'counter',
  'ratio'
}

function getInitialRows(metricObject) {
  return Object.entries(metricObject).map(m => {return { id: m[0] }})
}

function metricDetails(details) {
  return (
    <DataTable
      rows={getInitialRows(details)}
      headers={[]}
      render={({ rows, getTableProps }) => (
        <TableContainer>
          <Table {...getTableProps()}>
            <TableBody className="innertable">
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{details[row.id]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  )
}

class Display extends React.Component<any, any> {
  public output = ''
  private ratioMetrics = {}
  private counterMetrics = {}

  public constructor(props) {
    super(props)

    this.ratioMetrics = props['params']['rM']
    this.counterMetrics = props['params']['cM']
    this.state = { ratio: this.ratioMetrics, counter: this.counterMetrics }
  }

  public updateIsDeleted(metric, type: MetricTypes) {
    if (type === MetricTypes.counter) {
      if (ITER8_METRIC_NAMES.counter.includes(metric)) {
        return
      }

      if (deleteMetric(metric, type).success === metric) {
        this.counterMetrics[metric].isDeleted = true
        console.log('Deleted: ' + metric)
        const alsoDelete = this.counterMetrics[metric].alsoDelete
        for (let j = 0; j < alsoDelete.length; j++) {
          if (deleteMetric(alsoDelete[j], MetricTypes.ratio).success === alsoDelete[j]) {
            this.ratioMetrics[alsoDelete[j]].isDeleted = true
            console.log('Deleted: ' + alsoDelete[j])
          }
        }
      }

    } else {
      if (ITER8_METRIC_NAMES.ratio.includes(metric)) {
        return
      }

      if (deleteMetric(metric, type).success === metric) {
        this.ratioMetrics[metric].isDeleted = true
        console.log('Deleted: ' + metric)
      }
    }

    this.setState({ counter: this.counterMetrics, ratio: this.ratioMetrics })
  }

  public restore(metric, type: MetricTypes) {
    if (type === MetricTypes.counter) {
      if (restoreMetric(metric, this.counterMetrics[metric].details, type).success === metric) {
        this.counterMetrics[metric].isDeleted = false
        console.log('Restored: ' + metric)
      }

    } else {
      const alsoRestore = this.ratioMetrics[metric].alsoRestore
      const deleted = []

      alsoRestore.forEach(restoreMetric => {
        if (this.counterMetrics[restoreMetric].isDeleted) {
          if (restoreMetric(metric, this.counterMetrics[restoreMetric].details, MetricTypes.counter).success === metric) {
            this.counterMetrics[restoreMetric].isDeleted = false
            console.log('Restored: ' + restoreMetric)
            deleted.push(restoreMetric)
          }
        } else {
          deleted.push(restoreMetric)
        }
      })

      if (alsoRestore.length === deleted.length) {
        if (restoreMetric(metric, this.ratioMetrics[metric].details, type).success === metric) {
          this.ratioMetrics[metric].isDeleted = false
          console.log('Restored: ' + metric)
        }
      }
    }
    this.setState({ counter: this.counterMetrics, ratio: this.ratioMetrics })
  }

  public renderOnDelete(metric, type) {
    return (
      <div>
        <div className="deletedtext">Deleted</div>
        <div className="clickableicon" onClick={() => this.restore(metric, type)}>
          <Reset20 />
          {type === MetricTypes.ratio && this.ratioMetrics[metric].custom && this.ratioMetrics[metric].alsoRestore.length ? (
            <div className="warningtext">
              Warning: Will also restore {this.ratioMetrics[metric].alsoRestore.join(', ')}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  public addMetric(type) {
    console.log(type)
  }

  public modifyIter8Metric(mode) {
    return <div className="warningtext">Warning: Cannot {mode} iter8 metrics</div>
  }

  public renderTableTitle(title, type) {
    return (
      <div>
        {title} <Add20 onClick={() => this.addMetric(type)} className="clickableicon" />
      </div>
    )
  }

  public renderMetricTable(metrics, type, title) {
    return (
      <div className="metricTable">
        <DataTable
          rows={getInitialRows(metrics)}
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
                          <div className="clickableicon">
                            <Edit20 />
                            {!metrics[row.id].custom ? this.modifyIter8Metric('edit') : null}
                          </div>
                        </TableCell>
                        <TableCell className="width20">
                          <div>
                            {metrics[row.id].isDeleted ? (
                              <div>{this.renderOnDelete(row.id, type)}</div>
                            ) : (
                              <div className="clickableicon" onClick={() => this.updateIsDeleted(row.id, type)}>
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
                          <div>{metricDetails(metrics[row.id].details)}</div>
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

  public render() {
    return (
      <div className="pageStyle">
        <h3> Currently Available Metrics</h3>
        {this.renderMetricTable(this.counterMetrics, MetricTypes.counter, 'Counter Metrics')}
        {this.renderMetricTable(this.ratioMetrics, MetricTypes.ratio, 'Ratio Metrics')}
        <div className="center">
          <div className="inner">
            <Button size="default" kind="primary">
              Refresh
            </Button>
          </div>
        </div>
      </div>
    )
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

export class MetricDetailsMode {
  public ob: GetMetricConfig
  public ratioMetricOutput: MetricsState
  public counterMetricOutput: MetricsState

  public constructor() {
    this.ob = new GetMetricConfig()

    // TODO: Set up ratioMetricOutput and counterMetricOutput
  }

  // TODO: rename to generateMetricState
  public generateObject(metrics: CounterMetrics | RatioMetrics, type: MetricTypes): MetricsState {
    // TODO: rename to metricsState
    const m: MetricsState = {}

    metrics.forEach(metric => {
      m[metric.name] = {
        name: metric.name,
        isDeleted: false,
        alsoDelete: [],
        alsoRestore: [],
        details: metric,
        custom: !ITER8_METRIC_NAMES.counter.includes(metric.name)
      }

      if (type === MetricTypes.ratio) {
        // Add alsoRestore
        m[metric.name].alsoRestore = [metric.numerator, metric.denominator]

        // Add alsoDelete
        if ({}.hasOwnProperty.call(this.counterMetricOutput, metric.numerator)) {
          this.counterMetricOutput[metric.numerator].alsoDelete.push(metric.name)
        }
        if ({}.hasOwnProperty.call(this.counterMetricOutput, metric.denominator)) {
          this.counterMetricOutput[metric.denominator].alsoDelete.push(metric.name)
        }
      }
    })

    return m
  }

  public MetricList() {
    const ratioMetrics = this.ob.getRatioMetrics()
    const counterMetrics = this.ob.getCounterMetrics()
    
    if ('error' in ratioMetrics) {
      return ReactErrorDisplay(ratioMetrics.error)
    } else if ('error' in counterMetrics) {
      return ReactErrorDisplay(counterMetrics.error)
    } else {
      // TODO: Shouldn't this be done in the constructor?
      this.counterMetricOutput = this.generateObject(counterMetrics, MetricTypes.counter)
      this.ratioMetricOutput = this.generateObject(ratioMetrics, MetricTypes.ratio)

      const counterMetricsState = this.counterMetricOutput
      const ratioMetricsState = this.ratioMetricOutput

      return function GetMetricList(props: ToolbarProps) {
        return <Display params={{ ...props, rM: ratioMetricsState, cM: counterMetricsState }} />
      }
    }
  }

  public MetricYaml(): string {
    const yamlOutput = this.ob.getMetricsConfigMap()
    
    // // TODO: handle error
    // if ('error' in yamlOutput) {
    //   return yamlOutput.error
    // } else {
    //   return yamlOutput
    // }

    if (typeof yamlOutput === 'string') {
      return yamlOutput
    }
  }

  public MetricDeleteCommand(metricList): string {
    const ratioMetrics = this.ob.getRatioMetrics()
    const counterMetrics = this.ob.getCounterMetrics()

    // TODO: Resolve following errors by configuring metric output in constructor
    if ('error' in ratioMetrics) {
      // return ReactErrorDisplay(ratioMetrics.error)
    } else if ('error' in counterMetrics) {
      // return ReactErrorDisplay(counterMetrics.error)
    } else {
      this.counterMetricOutput = this.generateObject(counterMetrics, MetricTypes.counter)
      this.ratioMetricOutput = this.generateObject(ratioMetrics, MetricTypes.ratio)
    }

    for (let i = 0; i < metricList.length; i++) {
      const metric = metricList[i]

      if (metric in this.counterMetricOutput) {
        if (!this.counterMetricOutput[metric].custom) {
          return `Cannot delete iter8 counter metric: ${metric}`

        } else if (this.counterMetricOutput[metric].alsoDelete.length) {
          // TODO: Please delete dependent metrics?
          return `Please delete dependency metrics: 
            ${this.counterMetricOutput[metric].alsoDelete.join(', ')} 
            before deleting ${metric}`
        }
      } else {
        if (!this.ratioMetricOutput[metric].custom) {
          return `Cannot delete iter8 ratio metric: ${metric}`
        }
      }

      if (deleteMetric(metric).success === metric) {
        return `Deleted: ${metric}`
      } else {
        return `Could not delete: ${metric}`
      }
    }
  }
}
