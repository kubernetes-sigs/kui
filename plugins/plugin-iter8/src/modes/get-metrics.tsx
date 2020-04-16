/*
 * Copyright 2019 IBM Corporation
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
import * as React from 'react'
import { ToolbarProps } from '@kui-shell/core'
// import PropTypes from 'prop-types'
import Collapsible from 'react-collapsible'
import { ListItem, UnorderedList } from 'carbon-components-react'
import 'carbon-components/scss/components/list/_list.scss'
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
                    {' '}
                    <CaretRight16 className="metrictext" /> {rM.name.toUpperCase()}
                  </p>
                }
              >
                <UnorderedList nested className="listinner">
                  <ListItem className="ratio-metric-table">
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
                      {{}.hasOwnProperty.call(rM, 'between_zero_and_one') ? (
                        <tr>
                          <td>Zero to One</td>
                          <td>{rM.zero_to_one}</td>
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
                    {' '}
                    <CaretRight16 className="metrictext" /> {cM.name.toUpperCase()}
                  </p>
                }
              >
                <UnorderedList nested className="listinner">
                  <ListItem className="infotext">
                    <div className="infotext">
                      QueryTemplate:{' '}
                      <p className="box">
                        <kbd>{cM.query_template}</kbd>
                      </p>
                    </div>
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
    console.log(props)
    console.log(this.ratioMetrics)
    console.log(this.counterMetrics)
  }

  public render() {
    return (
      <div className="pageStyle">
        <h3> Currently Available Metrics</h3>
        <RatioMetrics params={{ ...this.props, rM: this.ratioMetrics }} />
        <CounterMetrics params={{ ...this.props, cM: this.counterMetrics }} />
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
