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
import { basename } from 'path'
import { Abortable, Arguments, CodedError, Row, Table, Watchable, Watcher, WatchPusher, Util } from '@kui-shell/core'

import { Group } from './group'
import { getTable } from './get'
import columnsOf from './columns'
import fabricate404Table from './404'
import URLFormatter, { urlFormatterFor } from './url'
import { unifyRow, unifyRows } from './unify'
import makeWatchable, { DirectWatcher, SingleKindDirectWatcher } from './watch'

import { Explained } from '../../kubectl/explain'
import { KubeOptions } from '../../kubectl/options'
import { isResourceReady } from '../../kubectl/status'
import { emitKubectlConfigChangeEvent } from '../../kubectl/config'

import { FinalState } from '../../../lib/model/states'
import { getCommandFromArgs } from '../../../lib/util/util'

const debug = Debug('plugin-kubectl/controller/client/direct/status')

function countNotReady(table: Table, finalState?: FinalState) {
  return finalState
    ? table.body.reduce((N, row) => (isResourceReady(row, finalState) ? N : N + 1), 0)
    : table.body.length
}

// this is still TODO; for now, we only handle the homogeneous case
class MultiKindWatcher implements Abortable, Watcher {
  /** The table push API */
  private pusher: WatchPusher

  /** The current watchers, one per explainedKind */
  private watchers: DirectWatcher[]

  /** Number of sub-tables not done */
  private nNotDone = 0

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly drilldownCommand: string,
    private readonly args: Pick<Arguments<KubeOptions>, 'REPL' | 'execOptions' | 'parsedOptions'>,
    private readonly kind: Explained[],
    private readonly resourceVersion: Table['resourceVersion'][],
    private readonly formatUrl: URLFormatter[],
    private readonly groups: Group[],
    private readonly finalState: FinalState,
    private readonly initialRowKeys: { rowKey: string; isReady: boolean }[][],
    private readonly nNotReady: number[], // number of resources to wait on
    private readonly monitorEvents = false
  ) {}

  public abort() {
    debug('abort requested', this.watchers.length)
    this.watchers.forEach(watcher => {
      if (watcher) {
        watcher.abort()
      }
    })
  }

  public init(pusher: WatchPusher) {
    this.pusher = pusher

    this.watchers = this.resourceVersion.map((resourceVersion, idx) => {
      if (!resourceVersion || this.nNotReady[idx] === 0) {
        return undefined
      } else {
        const watcher = new SingleKindDirectWatcher(
          this.drilldownCommand,
          this.args,
          this.kind[idx].kind,
          resourceVersion,
          this.formatUrl[idx],
          this.groups[idx],
          this.finalState,
          this.initialRowKeys[idx],
          this.nNotReady[idx],
          this.monitorEvents,
          true // yes, make sure there is a status column
        )

        if (this.nNotReady[idx] > 0) {
          this.nNotDone++
        }
        return watcher
      }
    })

    this.watchers.forEach((watcher, idx) => {
      if (watcher) {
        watcher.init(this.myPusher(idx))
      }
    })
  }

  private myPusher(idx: number): WatchPusher {
    const overrides: Pick<WatchPusher, 'header' | 'update' | 'done'> = {
      header: () => {
        // instead: have the view infer headers from the body; this
        // allows for more schema flexibility across rows
        // this.pusher.header(unifyHeaders([header]))
      },
      update: (row: Row, batch?: boolean, changed?: boolean) => {
        debug('update of unified row', row.rowKey, this.kind[idx].kind, row.attributes[1].value)
        this.pusher.update(unifyRow(row, this.kind[idx].kind), batch, changed)
      },
      done: () => {
        debug('one sub-table is done', this.kind[idx], this.nNotDone)
        if (--this.nNotDone <= 0) {
          debug('all sub-tables are done')
          this.pusher.done()
        }
      }
    }
    return Object.assign({}, this.pusher, overrides)
  }
}

interface WithIndex<T extends string | Table> {
  idx: number
  table: T
}

/**
 * If at least one resource is not in the given `finalState`, return a
 * single unified `Table & Watchable` that will monitor the given
 * `groups` of resources until they have all reached the given
 * `FinalState`.
 *
 * If the desired final state is `OfflineLike`, and all of the
 * resources are already offline, return a plain `Table` with all rows
 * marked as Offline.
 *
 * If none of the groups is valid (e.g. by specifying a bogus Kind),
 * return a `string[]` that conveys the error messages.
 *
 * Finally, this function may refuse to handle the request, in which case
 * it will retur `void`.
 *
 */
export default async function watchMulti(
  args: Arguments<KubeOptions>,
  groups: Group[],
  finalState?: FinalState,
  drilldownCommand = getCommandFromArgs(args),
  file?: string | string[],
  isWatchRequest = true
): Promise<void | string[] | Table | (Table & Watchable)> {
  if (groups.length === 0) {
    return
  }

  const myArgs = { REPL: args.REPL, execOptions: { type: args.execOptions.type }, parsedOptions: {} }
  const tables: WithIndex<Table>[] = await Promise.all(
    groups.map(async (_, idx) => ({
      idx,
      table: await getTable(
        drilldownCommand,
        _.namespace,
        _.names,
        _.explainedKind,
        'default',
        myArgs,
        true,
        columnsOf(_.explainedKind.kind, args)
      )
        .then(response => {
          if (typeof response === 'string') {
            // turn the string parts into 404 tables
            return fabricate404Table(_.names, _.explainedKind.kind)
          } else {
            return response
          }
        })
        .catch((err: CodedError) => {
          if (err.code === 404) {
            // This means every single name in _.names is missing
            if (!isWatchRequest || finalState === FinalState.OfflineLike) {
              // Then that's what we want! we are done!
              return fabricate404Table(_.names, _.explainedKind.kind)
            } else {
              // Otherwise, we are waiting till they are online, so
              // return an empty table. This table will subsequently
              // be filled in by the watcher (makeWatchable, below)
              return {
                body: []
              } as Table
            }
          }
        })
    }))
  )

  if (tables.length > 0) {
    if (groups.length === 1 && tables.length === 1) {
      // HOMOGENEOUS CASE
      const nNotReady = !isWatchRequest ? 0 : countNotReady(tables[0].table, finalState)
      if (nNotReady === 0) {
        // sub-case 1: nothing to watch, as everything is already "ready"
        debug('special case: single-group watching, all-ready all ready!', nNotReady, groups[0])
        if (groups[0].explainedKind.kind === 'Namespace') {
          emitKubectlConfigChangeEvent('CreateOrDeleteNamespace')
        }
        return tables[0].table
      } else {
        // sub-case 2: a subset may be done, but we need to fire up a
        // watcher to monitor the rest
        debug('special case: single-group watching with some not yet ready', nNotReady, groups[0])
        return makeWatchable(
          drilldownCommand,
          myArgs,
          groups[0].explainedKind.kind,
          groups[0],
          tables[0].table,
          urlFormatterFor(drilldownCommand, groups[0].namespace, myArgs, groups[0].explainedKind),
          finalState,
          tables[0].table.body.map(row => ({ rowKey: row.rowKey, isReady: isResourceReady(row, finalState) })),
          nNotReady,
          true,
          true // yes, make sure there is a status column
        )
      }
    }

    // HETEROGENEOUS CASE
    // we need to assemble a unifiedTable facade
    const title = file ? (typeof file === 'string' ? basename(file) : file.map(_ => basename(_)).join(',')) : undefined
    const breadcrumbs = groups.every(_ => _.namespace === groups[0].namespace)
      ? [{ label: groups[0].namespace }]
      : undefined

    // header and body
    // re: header, have the view infer headers from the body; this
    // allows for more schema flexibility across rows
    const header = undefined // unifyHeaders([].concat(...tables.map(_ => _.table.header)))
    const body = unifyRows(
      [].concat(...tables.map(_ => _.table.body)),
      Util.flatten(
        groups.map(_ =>
          Array(_.names.length)
            .fill(0)
            .map(() => _.explainedKind.kind)
        )
      )
    )

    const unifiedTable: Table = {
      title,
      breadcrumbs: !isWatchRequest ? breadcrumbs : undefined,
      header,
      body
    }

    if (!isWatchRequest) {
      return unifiedTable
    } else {
      // watcher
      const watch = new MultiKindWatcher(
        drilldownCommand,
        args,
        tables.map(_ => groups[_.idx].explainedKind),
        tables.map(_ => _.table.resourceVersion),
        await Promise.all(
          tables.map(_ => {
            const group = groups[_.idx]
            return urlFormatterFor(drilldownCommand, group.namespace, myArgs, group.explainedKind)
          })
        ),
        groups,
        finalState,
        tables.map(_ => _.table.body.map(row => ({ rowKey: row.rowKey, isReady: isResourceReady(row, finalState) }))),
        tables.map(_ => countNotReady(_.table, finalState)),
        true // watch events
      )

      return Object.assign(unifiedTable, { watch })
    }
  } else {
    throw new Error('nothing to watch')
  }
}
