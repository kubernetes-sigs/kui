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

import Debug from 'debug'
import { Abortable, Arguments, FlowControllable, Table, Watchable, Watcher, WatchPusher } from '@kui-shell/core'

import { toKuiTable } from '../../../lib/view/formatTable'
import { fetchFile, openStream } from '../../../lib/util/fetch-file'
import { KubeOptions, withKubeconfigFrom } from '../../kubectl/options'

import URLFormatter from './url'
import { headersForTableRequest } from './headers'
import { MetaTable, isMetaTable } from '../../../lib/model/resource'

const debug = Debug('plugin-kubectl/client/direct/watch')

interface WatchUpdate {
  type: 'MODIFIED' | 'ADDED' | 'DELETED'
  object: MetaTable
}

class DirectWatcher implements Abortable, Watcher {
  /** the table push API */
  private pusher: WatchPusher

  /** the current stream job */
  private jobs: (Abortable & FlowControllable)[] = []

  /** We only seem to get these once */
  private bodyColumnDefinitions: MetaTable['columnDefinitions']
  private footerColumnDefinitions: {
    lastSeenColumnIdx: number
    objectColumnIdx: number
    messageColumnIdx: number
    nameColumnIdx: number
  }

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly args: Arguments<KubeOptions>,
    private readonly kind: string | Promise<string>,
    private readonly resourceVersion: Table['resourceVersion'],
    private readonly formatUrl: URLFormatter
  ) {}

  /** This will be called by the view when it wants the underlying streamer to resume flowing updates */
  public xon() {
    this.jobs.forEach(job => job.xon())
  }

  /** This will be called by the view when it wants the underlying streamer to stop flowing updates */
  public xoff() {
    this.jobs.forEach(job => job.xoff())
  }

  /** This will be called by the view when it wants the underlying streamer to die */
  public abort() {
    debug('abort requested', this.jobs.length)
    this.jobs.forEach(job => job.abort())
  }

  /** This will be called by the view when it is ready to accept push updates */
  public async init(pusher: WatchPusher) {
    this.pusher = pusher
    await Promise.all([this.initBodyUpdates(), this.initFooterUpdates()])
  }

  /** Initialize the streamer for main body updates; i.e. for the rows of the table */
  private initBodyUpdates() {
    const url = this.formatUrl(true) + `?watch=true&resourceVersion=${this.resourceVersion.toString()}`
    const onInit = this.onInitForBodyUpdates.bind(this)
    return openStream<WatchUpdate>(this.args, url, this.mgmt(onInit), headersForTableRequest)
  }

  private formatEventUrl(watchOpts?: { resourceVersion: Table['resourceVersion'] }) {
    const fieldSelector = `fieldSelector=involvedObject.kind=${this.kind}`
    return (
      this.formatUrl() +
      `/events?${fieldSelector}` +
      (!watchOpts ? '' : `&watch=true&resourceVersion=${watchOpts.resourceVersion.toString()}`)
    )
  }

  private lastFooterEvents: Record<string, boolean>
  private filterFooterRows(table: MetaTable, nameColumnIdx: number): MetaTable['rows'] {
    const last = this.lastFooterEvents
    this.lastFooterEvents = table.rows.reduce((M, row) => {
      M[row.cells[nameColumnIdx]] = true
      return M
    }, {})

    if (!last) {
      return table.rows
    } else {
      return table.rows.filter(row => !last[row.cells[nameColumnIdx]])
    }
  }

  /** Format a MetaTable of events into a string[] */
  private formatFooter(table: MetaTable): string[] {
    if (!this.footerColumnDefinitions) {
      console.error('Dropping footer update, due to missing column definitions')
    } else {
      const { lastSeenColumnIdx, objectColumnIdx, messageColumnIdx, nameColumnIdx } = this.footerColumnDefinitions

      return this.filterFooterRows(table, nameColumnIdx).map(_ => {
        const lastSeen = _.cells[lastSeenColumnIdx]
        const involvedObjectName = _.cells[objectColumnIdx]
        const message = _.cells[messageColumnIdx]
        const eventName = _.cells[nameColumnIdx]

        const onClick = `#kuiexec?command=${encodeURIComponent(
          withKubeconfigFrom(this.args, `kubectl get event ${eventName} -o yaml`)
        )}`
        return `[[${lastSeen}]](${onClick})` + ` **${involvedObjectName}**: ${message}`
      })
    }
  }

  /** We pre-process the columnDefinitions for the events, to pick out the column indices of interest. */
  private initFooterColumnDefinitions(columnDefinitions: MetaTable['columnDefinitions']) {
    const indices = columnDefinitions.reduce(
      (indices, _, idx) => {
        if (_.name === 'Last Seen') {
          indices.lastSeenColumnIdx = idx
        } else if (_.name === 'Object') {
          indices.objectColumnIdx = idx
        } else if (_.name === 'Message') {
          indices.messageColumnIdx = idx
        } else if (_.name === 'Name') {
          indices.nameColumnIdx = idx
        }
        return indices
      },
      { lastSeenColumnIdx: -1, objectColumnIdx: -1, messageColumnIdx: -1, nameColumnIdx: -1 }
    )

    const { lastSeenColumnIdx, objectColumnIdx, messageColumnIdx, nameColumnIdx } = indices
    if (lastSeenColumnIdx < 0) {
      console.error('Unable to process footer column definitions, due to missing Last Seen column', columnDefinitions)
    } else if (objectColumnIdx < 0) {
      console.error('Unable to process footer column definitions, due to missing Object column', columnDefinitions)
    } else if (messageColumnIdx < 0) {
      console.error('Unable to process footer column definitions, due to missing Message column', columnDefinitions)
    } else if (nameColumnIdx < 0) {
      console.error('Unable to process footer column definitions, due to missing Name column', columnDefinitions)
    } else {
      this.footerColumnDefinitions = indices
    }
  }

  /** This will be called by the event streamer when it has new data */
  private onEventData(update: Pick<WatchUpdate, 'object'>) {
    if (!this.footerColumnDefinitions && update.object.columnDefinitions) {
      this.initFooterColumnDefinitions(update.object.columnDefinitions)
    }

    this.pusher.footer(this.formatFooter(update.object))
  }

  /** Initialize the streamer for table footer updates */
  private async initFooterUpdates() {
    // first: we need to fetch the initial table (so that we have a resourceVersion)
    const events = (
      await fetchFile(this.args.REPL, this.formatEventUrl(), { headers: headersForTableRequest })
    )[0] as MetaTable
    if (isMetaTable(events)) {
      this.onEventData({ object: events })

      // second: now we can start the streamer against that resourceVersion
      const watchUrl = this.formatEventUrl({ resourceVersion: events.metadata.resourceVersion })
      return openStream<WatchUpdate>(
        this.args,
        watchUrl,
        {
          onInit: job => {
            this.jobs.push(job)
            return this.onEventData.bind(this)
          }
        },
        headersForTableRequest
      )
    } else {
      console.error('Unexpected response from event query', events)
    }
  }

  /** This is the stream management bits for the body */
  private mgmt(onInit: Arguments['execOptions']['onInit']) {
    return {
      onInit,
      onReady: this.onReady.bind(this),
      onExit: this.onExit.bind(this)
    }
  }

  /** This will be called by the streamer when the underlying job has exited */
  public onExit(exitCode: number) {
    debug('job exited', exitCode)
    // for now, we don't have much to do here
  }

  /** This will be called by the streamer when it is ready to start flowing data. */
  public onReady() {
    // for now, we don't have much to do here
    debug('job is ready')
  }

  /** The streamer is almost ready. We give it back a stream to push data to */
  public onInitForBodyUpdates(job: Abortable & FlowControllable) {
    this.jobs.push(job)
    return this.onData.bind(this)
  }

  /** This will be called whenever the streamer has data for us. */
  private onData(update: WatchUpdate) {
    if (!update.object.columnDefinitions && this.bodyColumnDefinitions) {
      update.object.columnDefinitions = this.bodyColumnDefinitions
    }

    if (!update.object.columnDefinitions) {
      console.error('Missing column definitions in update', update)
      return
    }

    let sendHeaders = false
    if (!this.bodyColumnDefinitions) {
      sendHeaders = true
      this.bodyColumnDefinitions = update.object.columnDefinitions
    }

    setTimeout(async () => {
      const table = await toKuiTable(update.object, this.kind, this.args)

      if (sendHeaders) {
        this.pusher.header(table.header)
      }

      table.body.forEach(row => {
        if (update.type === 'ADDED' || update.type === 'MODIFIED') {
          this.pusher.update(row, true)
        } else {
          this.pusher.offline(row.rowKey)
        }
      })

      this.pusher.batchUpdateDone()
    })
  }
}

/**
 * If possible, turn a table into a Table & Watchable. If the given
 * `table` does not have a `resourceVersion` attribute, this mapping
 * will not be possible.
 *
 */
export default async function makeWatchable(
  args: Arguments<KubeOptions>,
  kind: string | Promise<string>,
  table: Table,
  formatUrl: URLFormatter
): Promise<Table | (Table & Watchable)> {
  if (!table.resourceVersion) {
    // we need a cursor to start watching
    console.error('Cannot start watching, due to missing resourceVersion')
    return table
  }

  return Object.assign(table, { watch: new DirectWatcher(args, kind, table.resourceVersion, formatUrl) })
}
