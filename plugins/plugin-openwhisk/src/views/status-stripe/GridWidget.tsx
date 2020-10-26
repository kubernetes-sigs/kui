/*
 * Copyright 2019-2020 IBM Corporation
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
import {
  eventChannelUnsafe,
  pexecInCurrentTab,
  getCurrentTab,
  wireToStandardEvents,
  unwireToStandardEvents
} from '@kui-shell/core'

import { Activation } from '../../models/resource'

/** number of activations to display in the widget */
const nCells = 10

const enum Colors {
  empty = 'var(--color-ui-02)'
}

export const nLatencyBuckets = 6
const n100 = 2
const n1000 = 2
const n7000 = 2
export const latencyBuckets = [50, 100, 500, 1000, 3500, 3500]
export const latencyBucket = (value: number) => {
  const nBuckets = latencyBuckets.length
  // return Math.min(nBuckets - 1, value < 100 ? ~~(value / (100/6)) : value < 1000 ? 6 + ~~(value / (1000/5)) : value < 7000 ? 11 + ~~(value / (6000/5)) : nBuckets - 1)
  return Math.min(
    nBuckets - 1,
    value < 100
      ? ~~(value / (100 / n100))
      : value < 1000
      ? n100 + ~~(value / (900 / n1000))
      : value < 7000
      ? n100 + n1000 + ~~(value / (6000 / n7000))
      : nBuckets - 1
  )
}

type Props = {}

interface State {
  status: 'unknown' | 'offline' | 'ready'
  onReady?: () => void // for listener cleanup
  cells: { color: string; activationId: string }[]
}

/**
 * @return our fragment spec: an icon, a text container, and onclick
 * handlers
 *
 */
export default class GridWidget extends React.PureComponent<Props, State> {
  private readonly handler = this.update.bind(this)

  public constructor(props: Props) {
    super(props)

    this.state = {
      status: 'unknown',
      cells: []
    }
  }

  private dispose(state = this.state) {
    if (state.onReady) {
      eventChannelUnsafe.off('/openwhisk/auth/change', state.onReady)
      eventChannelUnsafe.off('/openwhisk/host/change', state.onReady)
    }
  }

  /** Avoid recomputation for a flurry of events */
  private last: number
  private debounce(): boolean {
    const now = Date.now()
    const last = this.last
    this.last = now

    return last && now - last < 250
  }

  /** Transition to ready status */
  private ready() {
    this.setState(curState => {
      this.dispose(curState)

      return {
        status: 'ready'
      }
    })
  }

  /**
   * On default events (new tab, tab switch, command execution), we
   * will update the text element.
   *
   */
  private update() {
    if (this.state.status === 'offline') {
      return
    }

    const tab = getCurrentTab()
    if (!tab || !tab.REPL) {
      return
    } else if (this.debounce()) {
      return
    }

    setTimeout(async () => {
      try {
        // fetch both the current context name, and the list of KubeContext objects */
        const activations = (await tab.REPL.rexec<Activation[]>(`wsk activation list --limit ${nCells}`)).content

        this.setState({
          cells: activations.map(activation => ({
            activationId: activation.activationId,
            color:
              activation.statusCode === 0
                ? `var(--color-latency-${latencyBucket(activation.duration)})`
                : `var(--color-error)`
          }))
        })
      } catch (err) {
        const onReady = this.ready.bind(this)
        eventChannelUnsafe.on('/openwhisk/auth/change', onReady)
        eventChannelUnsafe.on('/openwhisk/host/change', onReady)

        this.setState({
          onReady,
          cells: [],
          status: 'offline'
        })
      }
    }, 2000)
  }

  public componentDidMount() {
    this.handler()
    wireToStandardEvents(this.handler)
  }

  public componentWillUnmount() {
    this.dispose()
    unwireToStandardEvents(this.handler)
  }

  private cells() {
    return (
      <React.Fragment>
        {this.state.cells.map((cell, idx) => (
          <div
            key={idx}
            className="clickable kui--grid-cell"
            style={{ width: '1em', height: '1em', backgroundColor: cell.color }}
            onClick={() => pexecInCurrentTab(`wsk activation get ${cell.activationId}`)}
          />
        ))}
        {Array(nCells - this.state.cells.length)
          .fill(0)
          .map((_, idx) => (
            <div key={idx} style={{ width: '1em', height: '1em', backgroundColor: Colors.empty }} />
          ))}
      </React.Fragment>
    )
  }

  public render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '0 1rem',
      width: `calc(${nCells} * (1em + 1px) - 1px)`
    }

    return this.state.cells.length === 0 ? (
      <React.Fragment />
    ) : (
      <div className="kui--plugin-openwhisk--grid-widget" style={style}>
        {this.cells()}
      </div>
    )
  }
}
