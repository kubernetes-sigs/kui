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
import GetMetricConfig, { iter8Metrics } from '../components/metric-config'

const { Table, TableBody, TableCell, TableRow, TableContainer, TableExpandRow, TableExpandedRow } = DataTable

function getInitialRows(metricObject) {
  const r = []
  Object.entries(metricObject).map(m => r.push({ id: m[0] }))
  return r
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

  public updateIsDeleted(metric, type) {
    if (type === 'counter') {
      if (iter8Metrics.counter.includes(metric)) {
        return
      }
      if (deleteMetric(metric, type).success === metric) {
        this.counterMetrics[metric].isDeleted = true
        console.log('Deleted: ' + metric)
        const alsoDelete = this.counterMetrics[metric].alsoDelete
        for (let j = 0; j < alsoDelete.length; j++) {
          if (deleteMetric(alsoDelete[j], 'ratio').success === alsoDelete[j]) {
            this.ratioMetrics[alsoDelete[j]].isDeleted = true
            console.log('Deleted: ' + alsoDelete[j])
          }
        }
      }
    } else {
      if (iter8Metrics.ratio.includes(metric)) {
        return
      }
      if (deleteMetric(metric, type).success === metric) {
        this.ratioMetrics[metric].isDeleted = true
        console.log('Deleted: ' + metric)
      }
    }
    this.setState({ counter: this.counterMetrics, ratio: this.ratioMetrics })
  }

  public restore(metric, type) {
    if (type === 'counter') {
      if (restoreMetric(metric, this.counterMetrics[metric].details, type).success === metric) {
        this.counterMetrics[metric].isDeleted = false
        console.log('Restored: ' + metric)
      }
    } else {
      const alsoRestore = this.ratioMetrics[metric].alsoRestore
      const deleted = []
      for (let i = 0; i < alsoRestore.length; i++) {
        if (this.counterMetrics[alsoRestore[i]].isDeleted) {
          if (restoreMetric(metric, this.counterMetrics[alsoRestore[i]].details, 'counter').success === metric) {
            this.counterMetrics[alsoRestore[i]].isDeleted = false
            console.log('Restored: ' + alsoRestore[i])
            deleted.push(alsoRestore[i])
          }
        } else {
          deleted.push(alsoRestore[i])
        }
      }
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
          {type === 'ratio' && this.ratioMetrics[metric].custom && this.ratioMetrics[metric].alsoRestore.length ? (
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
                                {type === 'counter' && metrics[row.id].custom && metrics[row.id].alsoDelete.length ? (
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
        {this.renderMetricTable(this.counterMetrics, 'counter', 'Counter Metrics')}
        {this.renderMetricTable(this.ratioMetrics, 'ratio', 'Ratio Metrics')}
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

export class MetricDetailsMode {
  public ob
  public ratioMetricOutput = {}
  public counterMetricOutput = {}
  public constructor() {
    this.ob = new GetMetricConfig()
  }

  public generateObject(metrics, type) {
    const m = {}
    for (let i = 0; i < metrics.length; i++) {
      m[metrics[i].name] = {
        name: metrics[i].name,
        isDeleted: false,
        alsoDelete: [],
        alsoRestore: [],
        details: metrics[i],
        custom: true
      }
      if (type === 'counter') {
        if (iter8Metrics.counter.includes(metrics[i].name)) {
          m[metrics[i].name].custom = false
        }
      }
      if (type === 'ratio') {
        if (iter8Metrics.ratio.includes(metrics[i].name)) {
          m[metrics[i].name].custom = false
        }
        m[metrics[i].name].alsoRestore = [metrics[i].numerator, metrics[i].denominator]
        if ({}.hasOwnProperty.call(this.counterMetricOutput, metrics[i].numerator)) {
          this.counterMetricOutput[metrics[i].numerator].alsoDelete.push(metrics[i].name)
        }
        if ({}.hasOwnProperty.call(this.counterMetricOutput, metrics[i].denominator)) {
          this.counterMetricOutput[metrics[i].denominator].alsoDelete.push(metrics[i].name)
        }
      }
    }
    return m
  }

  public MetricList() {
    let ratio = this.ob.getRatioMetrics()
    let counter = this.ob.getCounterMetrics()
    if ({}.hasOwnProperty.call(ratio, 'error')) {
      return ReactErrorDisplay(ratio.error)
    } else if ({}.hasOwnProperty.call(counter, 'error')) {
      return ReactErrorDisplay(counter.error)
    } else {
      this.counterMetricOutput = this.generateObject(counter, 'counter')
      this.ratioMetricOutput = this.generateObject(ratio, 'ratio')
      ratio = this.ratioMetricOutput
      counter = this.counterMetricOutput

      return function GetMetricList(props: ToolbarProps) {
        return <Display params={{ ...props, rM: ratio, cM: counter }} />
      }
    }
  }

  public MetricYaml() {
    const yamlOutput = this.ob.getMetricsConfigMap()
    if ({}.hasOwnProperty.call(yamlOutput, 'error')) {
      return yamlOutput.error
    } else {
      return yamlOutput
    }
  }

  public MetricDeleteCommand(metricList) {
    let response = ''
    let type = null
    const ratio = this.ob.getRatioMetrics()
    const counter = this.ob.getCounterMetrics()
    this.counterMetricOutput = this.generateObject(counter, 'counter')
    this.ratioMetricOutput = this.generateObject(ratio, 'ratio')

    for (let i = 0; i < metricList.length; i++) {
      if ({}.hasOwnProperty.call(this.counterMetricOutput, metricList[i])) {
        type = 'counter'
      } else if ({}.hasOwnProperty.call(this.ratioMetricOutput, metricList[i])) {
        type = 'ratio'
      } else {
        response = response + '\n' + 'Could not find: ' + metricList[i]
        continue
      }
      if (type) {
        if (type === 'counter') {
          if (!this.counterMetricOutput[metricList[i]].custom) {
            response = response + '\n' + 'Cannot delete iter8 counter metric: ' + metricList[i]
            continue
          } else if (this.counterMetricOutput[metricList[i]].alsoDelete.length) {
            response =
              response +
              '\n' +
              'Please delete dependency metrics: ' +
              this.counterMetricOutput[metricList[i]].alsoDelete.join(', ') +
              ' before deleting ' +
              metricList[i]
            continue
          }
        } else if (type === 'ratio') {
          if (!this.ratioMetricOutput[metricList[i]].custom) {
            response = response + '\n' + 'Cannot delete iter8 ratio metric: ' + metricList[i]
            continue
          }
        }
        if (deleteMetric(metricList[i]).success === metricList[i]) {
          response = response + '\n' + 'Deleted: ' + metricList[i]
        } else {
          response = response + '\n' + 'Could not delete: ' + metricList[i]
        }
      }
    }
    return response
  }
}
