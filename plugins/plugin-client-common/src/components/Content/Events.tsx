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
import Loading from '../spi/Loading'

const debug = Debug('plugin-client-common/events')
const strings = i18n('plugin-client-common') // TODO: i18n('plugin-client-common', 'events')

/**
 * We will wait this many milliseconds after the PTY is ready for log
 * data to arrive before proclaiming No log data.
 *
 */
const HYSTERESIS = 1500

/** Interval in milliseconds with which we update the "ago" timestamps */
const UPDATE_INTERVAL = 60 * 1000

interface Props {
  tab: Tab
  command: string
  schema: TreeItem['eventArgs']['schema']
  involvedObjects: TreeItem['extends']
}

type Streams = {
  lastTimestamp: number
  name?: string
  kind?: string
  apiVersion?: string
  message: string
}

interface State {
  /** The "now" used to compute the "ago" properties */
  now: number

  /** Timer used to update now */
  timer: ReturnType<typeof setInterval>

  /** The underlying PTY streaming job */
  job?: Abortable

  /** List of events. */
  streams: Streams[]

  /** Filter the events based on involvedObjects. */
  involvedObjects: Props['involvedObjects']

  eventsRef: React.RefObject<HTMLDivElement>

  /** It may take a second or two between establishing the PTY stream
   * and receiving the first log record. */
  waitingForHysteresis: boolean
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

  public constructor(props) {
    super(props)

    this.state = {
      streams: [],
      eventsRef: React.createRef<HTMLDivElement>(),
      involvedObjects: props.involvedObjects,
      now: this.now(),
      timer: setInterval(this.updateNow.bind(this), UPDATE_INTERVAL),
      waitingForHysteresis: false
    }

    this.initStream()
  }

  private now() {
    return new Date().getTime()
  }

  private updateNow() {
    this.setState({ now: this.now() })
  }

  public static getDerivedStateFromProps(props: Props) {
    return {
      involvedObjects: props.involvedObjects
    }
  }

  private onPTYInitDone(job: State['job']) {
    setTimeout(() => this.setState({ waitingForHysteresis: false }), HYSTERESIS)
    this.setState({ job, waitingForHysteresis: true })
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

        const rows = preprocessed.rows.filter(notEmpty).map(row => {
          return {
            message: messageCol !== undefined ? row[messageCol].value : '',
            lastTimestamp: timestampCol !== undefined ? new Date(row[timestampCol].value).getTime() : undefined,
            name: nameCol !== undefined ? row[nameCol].value : undefined,
            kind: kindCol !== undefined ? row[kindCol].value : undefined
          }
        })

        if (rows && rows.length !== 0) {
          this.setState(curState => {
            return {
              streams: curState.streams.concat(rows).sort((a, b) => {
                if (isNaN(a.lastTimestamp) || isNaN(b.lastTimestamp)) {
                  return -1
                } else {
                  return a.lastTimestamp - b.lastTimestamp
                }
              })
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
    clearInterval(this.state.timer)
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

  private age(lastTimestamp: number) {
    const delta = this.state.now - lastTimestamp

    if (isNaN(lastTimestamp)) {
      return strings('<unknown>')
    } else if (delta <= 0) {
      // < 0 is probably due to clock skew
      return strings('just now')
    } else {
      return strings('ago', prettyPrintDuration(delta, { compact: true }))
    }
  }

  private readonly _onScroll = this.onScroll.bind(this)

  // TODO: add streams back to tree response for replay
  private messageStream() {
    const filteredStreams = this.state.streams.filter(({ name, kind }) => {
      const hasName =
        !this.state.involvedObjects ||
        !this.state.involvedObjects.name ||
        !name ||
        this.state.involvedObjects.name.includes(name)

      const hasKind =
        !this.state.involvedObjects ||
        !this.state.involvedObjects.kind ||
        !kind ||
        this.state.involvedObjects.kind.includes(kind)

      return hasName && hasKind
    })

    if (filteredStreams.length === 0) {
      return this.nothingToShow()
    } else {
      return filteredStreams.map(({ name, message, lastTimestamp }, idx) => {
        const ago = `[[${this.age(lastTimestamp)}]]()`
        const _name = !name ? '' : ` **${name}**`
        const _message = !message ? '' : ` ${message}`

        const source = `${ago}${_name}${_message}`

        return (
          <div key={`${message}-${idx}`} className="kui--tree-event-messages">
            <div className="kui--tree-event-message">
              <Markdown tab={this.props.tab} source={source} noExternalLinks repl={this.props.tab.REPL} />
            </div>
          </div>
        )
      })
    }
  }

  /** Render the events in the case we no logs to show. */
  private nothingToShow() {
    return <div className="kui--tree-event-messages kui--hero-text">{strings('No events')}</div>
  }

  /** Render the events in the case we not yet finished initializing. */
  private notDoneLoading() {
    return <Loading />
  }

  public render() {
    return (
      <div className="kui--tree-events" onScroll={this._onScroll} ref={this.state.eventsRef}>
        {!this.state.job || this.state.waitingForHysteresis
          ? this.notDoneLoading()
          : !this.state.streams || this.state.streams.length === 0
          ? this.nothingToShow()
          : this.messageStream()}
      </div>
    )
  }
}
