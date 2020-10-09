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

import { Table as KuiTable, Row as KuiRow, Watchable } from '@kui-shell/core'

import PaginatedTable, { Props, State } from './PaginatedTable'
import { kuiHeader2carbonHeader, kuiRow2carbonRow, NamedDataTableRow } from './kui2carbon'

type LiveProps = Props<KuiTable & Watchable> & { onRender: (hasContent: boolean) => void }

interface LiveState extends State {
  isWatching: boolean
}

export default class LivePaginatedTable extends PaginatedTable<LiveProps, LiveState> {
  /** To allow for batch updates, the setState can be deferred until a call to updateDone() */
  private _deferredUpdate: NamedDataTableRow[]

  public constructor(props: LiveProps) {
    super(props)
    this.state = Object.assign(this.state, { isWatching: true })
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

  protected dataAttrs() {
    return {
      'data-table-watching': this.state.isWatching,
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
    this.props.response.watch.init({ update, batchUpdateDone, offline, done, allOffline, header, footer })
  }

  /**
   * offline takes the rowKey of the row to be deleted and applies this to the table view
   *
   */
  private offline(rowKey: string) {
    const existingRows = this.state.rows

    const foundIndex = existingRows.findIndex(_ => _.NAME === rowKey)
    if (foundIndex === -1) {
      console.error('table row went offline, but not found in view model', rowKey, existingRows)
    } else {
      // change the status badge to `offline`
      const kuiRow = this.props.response.body[foundIndex]
      kuiRow.attributes.forEach(attr => {
        if (attr.key === 'STATUS') {
          attr.value = 'Offline'
          attr.css = 'red-background'
        }
      })

      const newRow = kuiRow2carbonRow(this.state.headers, true)(kuiRow, foundIndex)
      const newRows = existingRows
        .slice(0, foundIndex)
        .concat([newRow])
        .concat(existingRows.slice(foundIndex + 1))

      this.setState({
        rows: newRows
      })
    }
  }

  /**
   * allOffline allows pollers to indicate that all resources are not to be found
   *
   */
  private allOffline() {
    this.props.response.body = []
    this.setState({ isWatching: false, rows: [] })
  }

  /**
   * update consumes the update notification and apply it to the table view
   *
   */
  private update(newKuiRow: KuiRow, batch = false, justUpdated = true) {
    const existingRows = this._deferredUpdate || this.state.rows
    const nRowsBefore = existingRows.length

    const foundIndex = existingRows.findIndex(
      _ => (_.rowKey && _.rowKey === newKuiRow.rowKey) || _.NAME === newKuiRow.name
      // the _.rowKey existence check here is important
      // because we didn't ask rowKey to be a required field
      // if both of the rowKey are undefined, we will get a wrong foundIndex
    )

    const insertionIndex = foundIndex === -1 ? nRowsBefore : foundIndex

    const newRow = kuiRow2carbonRow(this.state.headers, justUpdated)(newKuiRow, insertionIndex)

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
      this.setState({ rows: newRows })
    } else {
      this._deferredUpdate = newRows
    }
  }

  /** End of a deferred batch of updates */
  private batchUpdateDone() {
    if (this._deferredUpdate) {
      const rows = this._deferredUpdate
      this._deferredUpdate = undefined
      this.setState({ rows })
    }
  }

  /**
   * Update to reflect new header model
   *
   */
  private header(newKuiHeader: KuiRow) {
    this.props.response.header = newKuiHeader
    this.setState({ headers: kuiHeader2carbonHeader(newKuiHeader) })
  }

  /**
   * Update to reflect new footer message
   *
   */
  private footer(streams: string[]) {
    this.props.response.footer = this.props.response.footer ? this.props.response.footer.concat(streams) : streams

    this.setState(curState => {
      return {
        footer: curState.footer ? curState.footer.concat(streams) : streams
      }
    })
  }

  /**
   * Done watching!
   *
   */
  private done() {
    this.setState({ isWatching: false })
    // TODO uncapture job-tab connection?
  }
}
