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

import { i18n } from '@kui-shell/core/mdist/api/i18n'
import { isSuspendable } from '@kui-shell/core/mdist/api/Job'
import { Watchable, WatchPusher } from '@kui-shell/core/mdist/api/Watch'
import { Table as KuiTable, Row as KuiRow, sameRow } from '@kui-shell/core/mdist/api/Table'

import Icons from '../../spi/Icons'
import kuiHeaderFromBody from './kuiHeaderFromBody'
import PaginatedTable, { Props, State } from './PaginatedTable'

const strings = i18n('plugin-client-common')

type LiveProps = Props<KuiTable & Watchable> & { onRender: (hasContent: boolean) => void }

interface LiveState extends State {
  isWatching: boolean
}

export default class LivePaginatedTable extends PaginatedTable<LiveProps, LiveState> {
  /** To allow for batch updates, the setState can be deferred until a call to updateDone() */
  private _deferredUpdate: KuiRow[]
  // keep track of the header we received, so we don't continually re-render
  private previouslyReceivedHeader: KuiTable['header']

  public constructor(props: LiveProps) {
    super(props)
    this.state = Object.assign(this.state, {
      isWatching: true,
      lastUpdatedMillis: Date.now(),
      progress: {},
      progressVersion: 1
    })
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
    // initiate the pusher watch
    const update = this.update.bind(this)
    const progress = this.progress.bind(this)
    const batchUpdateDone = this.batchUpdateDone.bind(this)
    const offline = this.offline.bind(this)
    const done = this.done.bind(this)
    const allOffline = this.allOffline.bind(this)
    const header = this.header.bind(this)
    const footer = this.footer.bind(this)
    const setBody = this.setBody.bind(this)
    this.props.response.watch.init({
      update,
      progress,
      setBody,
      batchUpdateDone,
      offline,
      done,
      allOffline,
      header,
      footer
    })
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
    let doOffline = false
    let doUpdate = false
    const lookup = (rows: KuiRow[], row: KuiRow) =>
      rows.findIndex(({ rowKey, name }) => (rowKey && row.rowKey ? rowKey === row.rowKey : name === row.name))

    this.props.response.body.forEach((old, originalIdx) => {
      const foundIndex = lookup(rows, old)
      if (foundIndex === -1) {
        doOffline = true
        this.props.response.body.splice(originalIdx, 1)
      }
    })

    rows.forEach(newKuiRow => {
      const foundIndex = lookup(this.props.response.body, newKuiRow)
      if (foundIndex === -1 || !sameRow(newKuiRow, this.props.response.body[foundIndex])) {
        doUpdate = true
        this.update(newKuiRow, true, undefined, foundIndex)
      }
    })

    if (doUpdate) {
      this.batchUpdateDone()
    } else if (doOffline) {
      this.setState({ lastUpdatedMillis: Date.now() })
    }
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

  /** Incremental progress for a given row */
  private progress(...parameters: Parameters<WatchPusher['progress']>) {
    this.setState(curState => {
      const progress = parameters[0]
      if (this.props.response.body[progress.rowIdx]) {
        const rowKey = this.props.response.body[progress.rowIdx].rowKey
        curState.progress[rowKey] = progress
      }
      return {
        progressVersion: curState.progressVersion + 1
      }
    })
  }

  /**
   * update consumes the update notification and apply it to the table view
   *
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  private update(newKuiRow: KuiRow, batch = false, justUpdated = true, idxToUpdate?: number) {
    if (!this.props.response.header) {
      const header = kuiHeaderFromBody([newKuiRow])
      if (header) {
        this.header(header)
      }
    }

    // the _.rowKey existence check here is important
    // because we didn't ask rowKey to be a required field
    // if both of the rowKey are undefined, we will get a wrong foundIndex
    const lookup = (rows: KuiRow[]) =>
      rows.findIndex(_ => (_.rowKey && newKuiRow.rowKey ? _.rowKey === newKuiRow.rowKey : _.name === newKuiRow.name))

    // update props model
    const foundIndex = idxToUpdate !== undefined ? idxToUpdate : lookup(this.props.response.body)
    if (foundIndex === -1) {
      this.props.response.body.push(newKuiRow)
    } else {
      this.props.response.body[foundIndex] = newKuiRow
    }

    // deferred/batch update in progress?
    if (batch) {
      if (!this._deferredUpdate) {
        this._deferredUpdate = []
      }
      const foundIndex = lookup(this._deferredUpdate)
      if (foundIndex >= 0) {
        this._deferredUpdate[foundIndex] = newKuiRow
      } else {
        this._deferredUpdate.push(newKuiRow)
      }
    } else {
      this.setState({ lastUpdatedMillis: Date.now() })
    }
  }

  /** End of a deferred batch of updates */
  private batchUpdateDone() {
    if (this._deferredUpdate) {
      this._deferredUpdate = undefined
      this.setState(curState => ({
        body: curState.body.slice(), // force render
        lastUpdatedMillis: Date.now()
      }))
    }
  }

  /**
   * Update to reflect new header model
   *
   */
  private header(newKuiHeader: KuiRow) {
    if (!sameRow(newKuiHeader, this.previouslyReceivedHeader)) {
      this.previouslyReceivedHeader = newKuiHeader
      this.props.response.header = newKuiHeader
      this.setState({ header: newKuiHeader, lastUpdatedMillis: Date.now() })
    }
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
