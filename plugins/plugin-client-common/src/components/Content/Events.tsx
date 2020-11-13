/*
 * Copyright 2020 IBM Corporation
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
import prettyPrintDuration from 'pretty-ms'
import Debug from 'debug'

import { Tab, Abortable, Streamable, i18n, TreeItem } from '@kui-shell/core'
import Markdown from '../Content/Markdown'

const debug = Debug('plugin-client-common/events')
const strings = i18n('plugin-client-common') // TODO: i18n('plugin-client-common', 'events')

interface Props {
  tab: Tab
  command: string
  schema: TreeItem['eventArgs']['schema']
  involvedObjects: TreeItem['extends']
}

type Streams = {
  involvedObjects?: {
    name?: string
    kind?: string
    apiVersion?: string
  }
  message: string
}

interface State {
  job?: Abortable /** The underlying PTY streaming job */
  streams?: Streams[]
  involvedObjects: Props['involvedObjects']
  eventsRef: React.RefObject<HTMLDivElement>
}

/**
 * NOTE: This file has a bunch of duplicated function with
 * plugin-kubectl/get-watch, plugin-kubectl/modes/Events, and PaginatedTable/Toolbar
 *
 */

/** @duplicated with plugin-kubectl/get-watch */
interface Pair {
  key: string
  value: string
}

/**
 * Find the column splits
 * @duplicated with plugin-kubectl/get-watch
 */
function preprocessTable(raw: string, nCols: number): { rows: Pair[][]; leftover: string } {
  const rows = raw.split(/\n/).map(line => {
    const cells = line.split(/\|/)
    return cells.slice(0, cells.length - 1) // we have a trailing |
  })

  let lastFullRowIdx = rows.length
  while (--lastFullRowIdx >= 0) {
    if (rows[lastFullRowIdx].length === nCols) {
      break
    }
  }

  if (lastFullRowIdx < 0) {
    return {
      leftover: raw,
      rows: []
    }
  } else if (lastFullRowIdx === rows.length - 1) {
    return {
      leftover: undefined,
      rows: rows.map(line => line.map(value => ({ key: value, value }))).filter(_ => _.length > 0)
    }
  } else {
    let lastNewlineIdx = raw.length
    while (--lastNewlineIdx >= 0) {
      if (raw.charAt(lastNewlineIdx) === '\n') {
        break
      }
    }

    const leftover = raw.slice(lastNewlineIdx)
    return {
      leftover,
      rows: rows
        .slice(0, lastFullRowIdx + 1)
        .map(line => line.map(value => ({ key: value, value })))
        .filter(_ => _.length > 0)
    }
  }
}

/** @duplicated with plugin-kubectl/get-watch */
function notEmpty<TValue>(value: TValue | void | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export default class Events extends React.PureComponent<Props, State> {
  private eventLeftover: string
  /** Timestamp when we started up */
  private now = Date.now()

  public constructor(props) {
    super(props)

    this.initStream()

    this.state = {
      eventsRef: React.createRef<HTMLDivElement>(),
      involvedObjects: props.involvedObjects
    }
  }

  public static getDerivedStateFromProps(props: Props) {
    return {
      involvedObjects: props.involvedObjects
    }
  }

  private onPTYInitDone(job: State['job']) {
    this.setState({ job })
  }

  private onPTYEventInit() {
    return async (_: Streamable) => {
      if (typeof _ === 'string') {
        const rawData = this.eventLeftover ? this.eventLeftover + _ : _
        this.eventLeftover = undefined

        const { nCol, nameCol, kindCol, messageCol, timestampCol } = this.props.schema
        // here is where we turn the raw data into tabular data
        const preprocessed = preprocessTable(rawData, nCol)
        this.eventLeftover = preprocessed.leftover === '\n' ? undefined : preprocessed.leftover

        // filter and format the row as `[ago] involvedObject.name: message`
        const sortedRows = preprocessed.rows.filter(notEmpty)

        if (timestampCol !== undefined) {
          sortedRows.sort((rowA, rowB) => {
            const lastSeenA = new Date(rowA[timestampCol].value).getTime()
            const lastSeenB = new Date(rowB[timestampCol].value).getTime()
            return lastSeenA - lastSeenB
          })
        }

        const agos =
          timestampCol !== undefined
            ? sortedRows.map(row => {
                const ts = new Date(row[timestampCol].value).getTime()
                const ago = this.now - ts

                if (isNaN(ago)) {
                  // kubectl displays "<unknown>"
                  return strings('<unknown>')
                } else if (ago <= 0) {
                  // < 0 is probably due to clock skew
                  return strings('ago', prettyPrintDuration(0))
                } else {
                  return strings('ago', prettyPrintDuration(ago >= 0 ? ago : 0, { compact: true }).toString())
                }
              })
            : undefined

        const rows = sortedRows.map((row, idx) => {
          const name = nameCol !== undefined ? ` **${row[nameCol].value}**:` : ''

          const message = messageCol !== undefined ? row[messageCol].value : row

          const kind = kindCol !== undefined ? row[kindCol].value : ''

          const ago = agos ? `[[${agos[idx]}]]()` : ''

          return {
            message: `${ago}${name} ${message}`,
            involvedObjects: {
              name: row[nameCol].value,
              kind
            }
          }
        })

        if (rows) {
          // concat with all streams
          this.setState(curState => {
            const streams = curState.streams ? curState.streams.concat(rows) : rows

            return {
              streams
            }
          })
        }
      }
    }
  }

  private onPTYEventExit(exitCode: number) {
    console.error('event stream exited with code', exitCode)
  }

  /** Initialize the event stream */
  private initStream() {
    debug('init', this.props.command)
    this.props.tab.REPL.qexec(`sendtopty ${this.props.command}`, undefined, undefined, {
      quiet: true,
      replSilence: true,
      echo: false,
      onReady: this.onPTYInitDone.bind(this),
      onInit: this.onPTYEventInit.bind(this), // <-- the PTY will call us back when it's ready to stream
      onExit: this.onPTYEventExit.bind(this)
    })
  }

  public componentWillUnmount() {
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  public componentDidUpdate() {
    const div = this.state.eventsRef.current
    if (div && this._lastScroll === undefined) {
      div.scrollTop = div.scrollHeight
    }
  }

  private _lastScroll: number = undefined
  private onScroll() {
    const div = this.state.eventsRef.current
    if (div) {
      if (div.scrollHeight - div.scrollTop > 200) {
        this._lastScroll = div.scrollTop
      } else {
        this._lastScroll = undefined
      }
    }
  }

  private readonly _onScroll = this.onScroll.bind(this)

  // TODO: add streams back to tree response for replay
  private messageStream() {
    if (this.state.streams) {
      const streams = this.state.streams.filter(({ involvedObjects }) => {
        if (!involvedObjects || !this.state.involvedObjects || Object.keys(this.state.involvedObjects).length === 0) {
          return true
        } else {
          return Object.entries(involvedObjects).every(([key, value]) => {
            return this.state.involvedObjects[key].includes(value)
          })
        }
      })

      if (streams.length === 0) {
        return this.nothingToShow()
      } else {
        return streams.map(({ message }, idx) => (
          <div key={`${message}-${idx}`} className="kui--tree-event-messages">
            <div className="kui--tree-event-message">
              <Markdown tab={this.props.tab} source={message} noExternalLinks repl={this.props.tab.REPL} />
            </div>
          </div>
        ))
      }
    }
  }

  /** Render the events in the case we no logs to show. */
  private nothingToShow() {
    return <div className="kui--tree-event-messages">{strings('No events')}</div>
  }

  public render() {
    return (
      <div className="kui--tree-events" onScroll={this._onScroll} ref={this.state.eventsRef}>
        {!this.state.streams ? this.nothingToShow() : this.messageStream()}
      </div>
    )
  }
}
