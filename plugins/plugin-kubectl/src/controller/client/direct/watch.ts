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

import Debug from 'debug'
import { Abortable, Arguments, Row, Suspendable, Table, Watchable, Watcher, WatchPusher } from '@kui-shell/core'

import { Group, isObjectInGroup } from './group'
import columnsOf from './columns'
import URLFormatter from './url'
import { headersForPlainRequest, headersForTableRequest } from './headers'

import { FinalState } from '../../../lib/model/states'
import { toKuiTable } from '../../../lib/view/formatTable'
import { fetchFile, openStream } from '../../../lib/util/fetch-file'
import { KubeResource, MetaTable, isMetaTable } from '../../../lib/model/resource'

import { isResourceReady } from '../../kubectl/status'
import { emitKubectlConfigChangeEvent } from '../../kubectl/config'
import { KubeOptions, withKubeconfigFrom, isCustomColumns, formatOf } from '../../kubectl/options'

const debug = Debug('plugin-kubectl/client/direct/watch')

/** The apiServer will emit a stream of these messages */
interface WatchUpdate {
  /** The nature of the change covered by the rows of the associated table */
  type: 'MODIFIED' | 'ADDED' | 'DELETED'

  /** The rows of this table indicate the resources modified/added/deleted */
  object: MetaTable
}

export abstract class DirectWatcher implements Watcher, Abortable, Suspendable {
  /** The table push API */
  protected pusher: WatchPusher

  /** The current stream jobs. These will be aborted/flow-controlled as directed by the associated view. */
  protected jobs: (Abortable & Suspendable)[] = []

  abstract init(pusher: WatchPusher): void

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
    debug('abort requested', this.jobs.length, this.jobs)
    this.jobs.forEach(job => job.abort())
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
}

/**
 * This class provides an implementation of a Watcher extension of a
 * Kui Table. It establishes a stream to the apiServer, and hooks the emitted stream of WatchUpdate events into the WatchPusher API of the table: i.e. the this.pusher.offline(), update(), header(), and footer() calls.
 *
 */
export class SingleKindDirectWatcher extends DirectWatcher implements Abortable, Watcher {
  /** Debouncer: the apiServer may send us DELETED or ADDED events multiple times for a given resource :( */
  private readonly readyDebouncer: Record<string, boolean>

  private alreadySentHeaders = false

  /** We only seem to get these once, so we need to remember them */
  private bodyColumnDefinitions: MetaTable['columnDefinitions']
  private footerColumnDefinitions: {
    lastSeenColumnIdx: number
    objectColumnIdx: number
    messageColumnIdx: number
    nameColumnIdx: number
  }

  public constructor(
    private readonly drilldownCommand: string,
    private readonly args: Pick<Arguments<KubeOptions>, 'REPL' | 'execOptions' | 'parsedOptions'>,
    private readonly kind: string,
    private readonly resourceVersion: Table['resourceVersion'],
    private readonly formatUrl: URLFormatter,
    private readonly group: Group,
    private readonly finalState?: FinalState,
    initialRowKeys?: { rowKey: string; isReady: boolean }[],
    private nNotReady?: number, // number of resources to wait on
    private readonly monitorEvents = true,
    private readonly needsStatusColumn = false
  ) {
    super()
    if (finalState) {
      // populate the readyDebouncer using the initial set of rows
      this.readyDebouncer = initialRowKeys
        ? initialRowKeys.reduce((M, { rowKey, isReady }) => {
            M[rowKey] = isReady
            return M
          }, {} as Record<string, boolean>)
        : undefined
    }
  }

  /** This will be called by the view when it is ready to accept push updates */
  public async init(pusher: WatchPusher) {
    this.pusher = pusher

    await Promise.all([
      this.initBodyUpdates(),
      this.monitorEvents && this.kind !== 'Event' ? this.initFooterUpdates() : Promise.resolve()
    ])
  }

  private isCustomColumns() {
    return isCustomColumns(formatOf(this.args))
  }

  /** Initialize the streamer for main body updates; i.e. for the rows of the table */
  private initBodyUpdates() {
    const url = this.formatUrl(true) + `?watch=true&resourceVersion=${this.resourceVersion.toString()}`
    const onInit = this.onInitForBodyUpdates.bind(this)
    return openStream<WatchUpdate>(
      this.args,
      url,
      this.mgmt(onInit),
      this.isCustomColumns() ? headersForPlainRequest : headersForTableRequest
    )
  }

  private formatEventUrl(watchOpts?: { resourceVersion: Table['resourceVersion'] }) {
    const fieldSelector = `fieldSelector=involvedObject.kind=${this.kind}`

    return (
      this.formatUrl(true, undefined, undefined, { version: 'v1', kind: 'Event' }) +
      `?${fieldSelector}` +
      (!watchOpts ? '' : `&watch=true&resourceVersion=${watchOpts.resourceVersion.toString()}`)
    )
  }

  private lastFooterEvents: Record<string, boolean>
  private filterFooterRows(table: MetaTable, nameColumnIdx: number, objectColumnIdx: number): MetaTable['rows'] {
    const rows = table.rows.filter(row => {
      const kindAndName = row.cells[objectColumnIdx]
      if (typeof kindAndName === 'string') {
        const kind = kindAndName.split('/')[0]
        const name = kindAndName.split('/')[1]
        return isObjectInGroup(this.group, kind, name)
      }
    })

    const last = this.lastFooterEvents
    this.lastFooterEvents = rows.reduce((M, row) => {
      M[row.cells[nameColumnIdx]] = true
      return M
    }, {})

    if (!last) {
      return rows
    } else {
      return rows.filter(row => !last[row.cells[nameColumnIdx]])
    }
  }

  /** Format a MetaTable of events into a string[] */
  private formatFooter(table: MetaTable): string[] {
    if (!this.footerColumnDefinitions) {
      console.error('Dropping footer update, due to missing column definitions')
    } else {
      const { lastSeenColumnIdx, objectColumnIdx, messageColumnIdx, nameColumnIdx } = this.footerColumnDefinitions

      return this.filterFooterRows(table, nameColumnIdx, objectColumnIdx).map(_ => {
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
      await fetchFile(this.args, this.formatEventUrl(), { headers: headersForTableRequest })
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
      console.error('Unexpected response from event query', this.formatEventUrl(), events)
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

  /** The streamer is almost ready. We give it back a stream to push data to */
  public onInitForBodyUpdates(job: Abortable & Suspendable) {
    this.jobs.push(job)
    return this.onData.bind(this)
  }

  /** This will be called whenever the streamer has data for us. */
  private async onData(update: WatchUpdate) {
    if (!update.object.columnDefinitions && this.bodyColumnDefinitions) {
      update.object.columnDefinitions = this.bodyColumnDefinitions
    }

    if (!update.object.columnDefinitions && !this.isCustomColumns()) {
      console.error('Missing column definitions in update', update)
      return
    }

    const custo = isCustomColumns(formatOf(this.args))

    let sendHeaders = !this.alreadySentHeaders
    if (!custo) {
      if (!this.bodyColumnDefinitions) {
        sendHeaders = true
        this.bodyColumnDefinitions = update.object.columnDefinitions
      }

      update.object.rows = update.object.rows.filter(row =>
        isObjectInGroup(this.group, this.kind, row.object.metadata.name)
      )
    }

    const table = custo
      ? (await import('./custom-columns')).toKuiTableForUpdateFromCustomColumns(
          (update.object as any) as KubeResource,
          this.args,
          this.drilldownCommand,
          this.kind,
          formatOf(this.args)
        )
      : toKuiTable(
          update.object,
          this.kind,
          this.args,
          this.drilldownCommand,
          this.needsStatusColumn,
          columnsOf(this.kind, this.args)
        )

    if (sendHeaders) {
      this.alreadySentHeaders = true
      this.pusher.header(table.header)
    }

    table.body.forEach((row, idx) => {
      const rowNeverSeenBefore = this.readyDebouncer && this.readyDebouncer[row.rowKey] === undefined
      if (rowNeverSeenBefore) {
        debug('dropping untracked row', row.rowKey)
        return
      }

      if (update.type === 'ADDED' || update.type === 'MODIFIED') {
        this.pusher.update(row, true)
      } else {
        this.pusher.offline(row.rowKey)
      }

      if (this.kind === 'Namespace') {
        if (update.type === 'ADDED') {
          emitKubectlConfigChangeEvent('CreateOrDeleteNamespace', row.name)
        } else if (update.type === 'DELETED') {
          emitKubectlConfigChangeEvent('CreateOrDeleteNamespace', row.name)
        }
      }

      this.checkIfReady(row, idx, update)
    })

    this.pusher.batchUpdateDone()
  }

  /**
   * If we were asked to watch for resources reaching a given
   * `this.finalState`, then check the resource represented by the
   * given Row against the desired final state.
   *
   */
  private checkIfReady(row: Row, idx: number, update: WatchUpdate) {
    if (this.finalState && this.nNotReady > 0) {
      const isReady =
        // NOPE: could be added and still not ready (update.type === 'ADDED' && this.finalState === FinalState.OnlineLike) ||
        (update.type === 'DELETED' && this.finalState === FinalState.OfflineLike) ||
        ((update.type === 'ADDED' || update.type === 'MODIFIED') && isResourceReady(row, this.finalState))

      debug(
        'checking if resource is ready',
        isReady,
        this.finalState,
        this.nNotReady,
        row,
        update.type,
        update.object.rows[idx]
      )

      if (this.readyDebouncer && isReady && !this.readyDebouncer[row.rowKey]) {
        debug('A resource is in its final state', row.name, this.nNotReady)
        this.readyDebouncer[row.rowKey] = true
        if (--this.nNotReady <= 0) {
          debug('All resources are in their final state')
          this.abort()
          this.pusher.done()
        }
      }
    }
  }
}

/**
 * If possible, turn a table into a Table & Watchable. If the given
 * `table` does not have a `resourceVersion` attribute, this mapping
 * will not be possible.
 *
 */
export default async function makeWatchable(
  drilldownCommand: string,
  args: Pick<Arguments<KubeOptions>, 'REPL' | 'execOptions' | 'parsedOptions'>,
  kind: string,
  group: Group,
  table: Table,
  formatUrl: URLFormatter,
  finalState?: FinalState,
  initialRowKeys?: { rowKey: string; isReady: boolean }[],
  nNotReady?: number,
  monitorEvents = true,
  needsStatusColumn = false
): Promise<Table | (Table & Watchable)> {
  if (!table.resourceVersion) {
    // we need a cursor to start watching
    console.error('Cannot start watching, due to missing resourceVersion')
    return table
  }

  return Object.assign(table, {
    watch: new SingleKindDirectWatcher(
      drilldownCommand,
      args,
      kind,
      table.resourceVersion,
      formatUrl,
      group,
      finalState,
      initialRowKeys,
      nNotReady,
      monitorEvents,
      needsStatusColumn
    )
  })
}
