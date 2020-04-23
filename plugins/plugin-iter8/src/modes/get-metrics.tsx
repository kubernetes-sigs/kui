import * as React from 'react'
import { ToolbarProps } from '@kui-shell/core'

import Collapsible from 'react-collapsible'
import { ListItem, UnorderedList, Button } from 'carbon-components-react'
import 'carbon-components/scss/components/list/_list.scss'
import 'carbon-components/scss/components/button/_button.scss'
import '../../src/web/scss/static/metrics.scss'

import { CaretRight16 } from '@carbon/icons-react'
import GetMetricConfig from '../components/metric-config'
import ReactErrorDisplay from './error-react'

class RatioMetrics extends React.Component<any, any> {
  private ratioMetrics = []
  public constructor(props) {
    super(props)
    this.ratioMetrics = props['params']['rM']
  }

  public render() {
    return (
      <div style={{ padding: '10px' }}>
        <h4> Ratio Metrics </h4>
        <UnorderedList className="listouter">
          {this.ratioMetrics.map(rM => (
            <ListItem className="metrictext" key={rM.name}>
              <Collapsible
                trigger={
                  <p>
                    <CaretRight16 className="metrictext" /> {rM.name.toUpperCase()}
                  </p>
                }
              >
                <UnorderedList nested className="listinner">
                  <ListItem className="metric-table">
                    <table>
                      <tr>
                        <td>Numerator</td>
                        <td>{rM.numerator}</td>
                      </tr>
                      <tr>
                        <td>Denominator</td>
                        <td>{rM.denominator}</td>
                      </tr>
                      {{}.hasOwnProperty.call(rM, 'preferred_direction') ? (
                        <tr>
                          <td>Preferred Direction</td>
                          <td>{rM.preferred_direction}</td>
                        </tr>
                      ) : null}
                      {{}.hasOwnProperty.call(rM, 'zero_and_one') ? (
                        <tr>
                          <td>Zero to One</td>
                          <td>{rM.zero_to_one}</td>
                        </tr>
                      ) : null}
                      {{}.hasOwnProperty.call(rM, 'units') ? (
                        <tr>
                          <td>Units</td>
                          <td>{rM.units}</td>
                        </tr>
                      ) : null}
                    </table>
                  </ListItem>
                </UnorderedList>
              </Collapsible>
            </ListItem>
          ))}
        </UnorderedList>
      </div>
    )
  }
}

class CounterMetrics extends React.Component<any, any> {
  private counterMetrics = []
  public constructor(props) {
    super(props)
    this.counterMetrics = props['params']['cM']
  }

  public render() {
    return (
      <div style={{ padding: '10px' }}>
        <h4> Counter Metrics </h4>
        <UnorderedList className="listouter">
          {this.counterMetrics.map(cM => (
            <ListItem className="metrictext" key={cM.name}>
              <Collapsible
                trigger={
                  <p>
                    <CaretRight16 className="metrictext" /> {cM.name.toUpperCase()}
                  </p>
                }
              >
                <UnorderedList nested className="listinner">
                  <ListItem className="metric-table">
                    <table>
                      <tr>
                        <td>Query Template</td>
                        <td>{cM.query_template}</td>
                      </tr>
                      {{}.hasOwnProperty.call(cM, 'preferred_direction') ? (
                        <tr>
                          <td>Preferred Direction</td>
                          <td>{cM.preferred_direction}</td>
                        </tr>
                      ) : null}
                      {{}.hasOwnProperty.call(cM, 'units') ? (
                        <tr>
                          <td>Units</td>
                          <td>{cM.units}</td>
                        </tr>
                      ) : null}
                    </table>
                  </ListItem>
                </UnorderedList>
              </Collapsible>
            </ListItem>
          ))}
        </UnorderedList>
      </div>
    )
  }
}

class DisplayMetrics extends React.Component<any, any> {
  public output = ''
  private ratioMetrics = []
  private counterMetrics = []
  public constructor(props) {
    super(props)
    this.ratioMetrics = props['params']['rM']
    this.counterMetrics = props['params']['cM']
  }

  public render() {
    return (
      <div className="pageStyle">
        <h3> Currently Available Metrics</h3>
        <CounterMetrics params={{ ...this.props, cM: this.counterMetrics }} />
        <RatioMetrics params={{ ...this.props, rM: this.ratioMetrics }} />
        <div className="center">
          <div className="inner">
            <Button size="default" kind="primary">
              {' '}
              Add Metric{' '}
            </Button>
          </div>
          <div className="inner">
            <Button size="default" kind="primary">
              {' '}
              Delete Metric{' '}
            </Button>
          </div>
          <div className="inner">
            <Button size="default" kind="primary">
              {' '}
              Edit Metric{' '}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export class MetricDetailsMode {
  public ob
  public constructor() {
    this.ob = new GetMetricConfig()
  }

  public MetricList() {
    const ratioMetricOutput = this.ob.getRatioMetrics()
    const counterMetricOutput = this.ob.getCounterMetrics()
    if ({}.hasOwnProperty.call(ratioMetricOutput, 'error')) {
      return ReactErrorDisplay(ratioMetricOutput.error)
    } else if ({}.hasOwnProperty.call(counterMetricOutput, 'error')) {
      return ReactErrorDisplay(counterMetricOutput.error)
    } else {
      return function GetMetricList(props: ToolbarProps) {
        return <DisplayMetrics params={{ ...props, rM: ratioMetricOutput, cM: counterMetricOutput }} />
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
}
