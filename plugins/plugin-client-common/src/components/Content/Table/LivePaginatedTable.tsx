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
import { i18n, Table as KuiTable, Row as KuiRow, Watchable, isSuspendable } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import kuiHeaderFromBody from './kuiHeaderFromBody'
import PaginatedTable, { Props, State } from './PaginatedTable'

const strings = i18n('plugin-client-common')

type LiveProps = Props<KuiTable & Watchable> & { onRender: (hasContent: boolean) => void }

interface LiveState extends State {
  isWatching: boolean
  lastUpdatedMillis: number
}

export default class LivePaginatedTable extends PaginatedTable<LiveProps, LiveState> {
  /** To allow for batch updates, the setState can be deferred until a call to updateDone() */
  private _deferredUpdate: KuiRow[]

  public constructor(props: LiveProps) {
    super(props)
    this.state = Object.assign(this.state, { isWatching: true, lastUpdatedMillis: Date.now() })
  }

  /**
   * Only after the dom is attached can we initialize the watcher,
   * because it may otherwise trigger render() calls before we have
   * been attached.
   *
   */
  public componentDidMount() {
    this.initWatch()
  }

  /** @return whether the table is currently "live", and responding to updates from the controller */
  protected isWatching(): boolean {
    return this.state.isWatching
  }

  protected dataAttrs() {
    return {
      'data-table-watching': this.isWatching(),
      'data-table-as-grid': this.state.asGrid
    }
  }

  /** Render the component */
  public render() {
    if (this.props.onRender) {
      setTimeout(() => this.props.onRender(true))
    }
    return super.render()
  }

  /**
   * Initialize watcher channel to the provider, and attach the job so
   * that it can be managed w.r.t. UI contexts (such as tabs) coming
   * and going.
   *
   */
  private initWatch() {
    // attach job to tab; TODO figure out the proper ownership context
    // for the job
    this.props.tab.state.captureJob(this.props.response.watch)

    // initiate the pusher watch
    const update = this.update.bind(this)
    const batchUpdateDone = this.batchUpdateDone.bind(this)
    const offline = this.offline.bind(this)
    const done = this.done.bind(this)
    const allOffline = this.allOffline.bind(this)
    const header = this.header.bind(this)
    const footer = this.footer.bind(this)
    const setBody = this.setBody.bind(this)
    this.props.response.watch.init({ update, setBody, batchUpdateDone, offline, done, allOffline, header, footer })
  }

  private pauseWatch() {
    if (this.props.response.watch.xoff) {
      this.props.response.watch.xoff()
    } else {
      this.props.response.watch.abort()
    }

    this.setState({ isWatching: false })
  }

  private resumeWatch() {
    if (this.props.response.watch.xon) {
      this.props.response.watch.xon()
      this.setState({ isWatching: true })
    }
  }

  protected watchControll() {
    if (this.state.isWatching) {
      this.pauseWatch()
    } else {
      this.resumeWatch()
    }
  }

  /** E.g. last updated time for live tables */
  protected caption() {
    if (this.state.lastUpdatedMillis) {
      const icon = this.state.isWatching ? 'Eye' : 'EyeSlash'
      const iconColor = this.state.isWatching ? 'green-text' : 'sub-text'
      const watchControlDescription = isSuspendable(this.props.response.watch)
        ? this.state.isWatching
          ? strings('Abort watcher')
          : ''
        : this.state.isWatching
        ? strings('Pause watcher')
        : strings('Resume watcher')

      return (
        <React.Fragment>
          <a
            href="#"
            className="kui--toolbar-button-watch"
            data-online={this.state.isWatching}
            onClick={this.watchControll.bind(this)}
            onMouseDown={evt => evt.preventDefault()}
            title={watchControlDescription}
            aria-label={watchControlDescription}
          >
            <Icons icon={icon} className={'small-right-pad ' + iconColor} />
          </a>
          {strings('Last updated', new Date(this.state.lastUpdatedMillis).toLocaleTimeString())}
        </React.Fragment>
      )
    }
  }

  private setBody(rows: KuiRow[]) {
    this.props.response.body = rows
    this.setState({
      lastUpdatedMillis: Date.now(),
      body: rows
    })
  }

  /**
   * offline takes the rowKey of the row to be deleted and applies this to the table view
   *
   */
  private offline(rowKey: string) {
    const existingRows = this.state.body

    const foundIndex = existingRows.findIndex(_ => (_.rowKey ? _.rowKey === rowKey : _.name === rowKey))
    if (foundIndex === -1) {
      console.error('table row went offline, but not found in view model', rowKey, existingRows)
    } else {
      // change the status badge to `offline`
      const kuiRow = this.props.response.body[foundIndex]
      kuiRow.attributes.forEach(attr => {
        if (/STATUS/i.test(attr.key)) {
          attr.value = 'Offline'
          attr.css = 'red-background'
        }
      })

      const newRow = kuiRow // TODO Missing justUpdated: true kuiRow2carbonRow(this.state.header, true)(kuiRow, foundIndex)
      const newRows = existingRows
        .slice(0, foundIndex)
        .concat([newRow])
        .concat(existingRows.slice(foundIndex + 1))

      this.setState({
        lastUpdatedMillis: Date.now(),
        body: newRows
      })
    }
  }

  /**
   * allOffline allows pollers to indicate that all resources are not to be found
   *
   */
  private allOffline() {
    this.props.response.body = []
    this.setState({ isWatching: false, body: [], lastUpdatedMillis: Date.now() })
  }

  /**
   * update consumes the update notification and apply it to the table view
   *
   */
  private update(newKuiRow: KuiRow, batch = false /*, justUpdated = true */) {
    if (!this.props.response.header) {
      const header = kuiHeaderFromBody([newKuiRow])
      if (header) {
        this.header(header)
      }
    }

    const existingRows = this._deferredUpdate || this.state.body
    // const nRowsBefore = existingRows.length

    // the _.rowKey existence check here is important
    // because we didn't ask rowKey to be a required field
    // if both of the rowKey are undefined, we will get a wrong foundIndex
    const foundIndex = existingRows.findIndex(_ =>
      _.rowKey && newKuiRow.rowKey ? _.rowKey === newKuiRow.rowKey : _.name === newKuiRow.name
    )

    // const insertionIndex = foundIndex === -1 ? nRowsBefore : foundIndex

    const newRow = newKuiRow // TODO missing justUpdated kuiRow2carbonRow(this.state.headers, justUpdated)(newKuiRow, insertionIndex)

    // Notes: since PaginatedTable is a React.PureComponent, we will
    // need to create a new array, rather than mutating the existing
    // array
    const newRows =
      foundIndex === -1
        ? existingRows.concat([newRow])
        : existingRows
            .slice(0, foundIndex)
            .concat([newRow])
            .concat(existingRows.slice(foundIndex + 1))

    // we also need to update the Kui model
    if (foundIndex === -1) {
      this.props.response.body.push(newKuiRow)
    } else {
      this.props.response.body[foundIndex] = newKuiRow
    }

    if (!batch) {
      this.setState({ body: newRows, lastUpdatedMillis: Date.now() })
    } else {
      this._deferredUpdate = newRows
    }
  }

  /** End of a deferred batch of updates */
  private batchUpdateDone() {
    if (this._deferredUpdate) {
      const body = this._deferredUpdate
      this._deferredUpdate = undefined
      this.setState({ body, lastUpdatedMillis: Date.now() })
    }
  }

  /**
   * Update to reflect new header model
   *
   */
  private header(newKuiHeader: KuiRow) {
    this.props.response.header = newKuiHeader
    this.setState({ header: newKuiHeader, lastUpdatedMillis: Date.now() })
  }

  /**
   * Update to reflect new footer message
   *
   */
  private footer(streams: string[]) {
    this.props.response.footer = this.props.response.footer ? this.props.response.footer.concat(streams) : streams

    this.setState(curState => {
      return {
        lastUpdatedMillis: Date.now(),
        footer: curState.footer ? curState.footer.concat(streams) : streams
      }
    })
  }

  /**
   * Done watching!
   *
   */
  private done() {
    this.setState({ isWatching: false, lastUpdatedMillis: Date.now() })
    // TODO uncapture job-tab connection?
  }
}
