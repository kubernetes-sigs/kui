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
import { Abortable, Arguments, CodedError, FlowControllable, Table, Watcher, WatchPusher } from '@kui-shell/core'

import { getTable } from './get'
import makeWatchable from './watch'
import { kindPart } from '../../kubectl/fqn'
import { Explained } from '../../kubectl/explain'
import { KubeOptions } from '../../kubectl/options'
import URLFormatter, { urlFormatterFor } from './url'
import { FinalState } from '../../../lib/model/states'
import { isResourceReady } from '../../kubectl/status'
import { getCommandFromArgs } from '../../../lib/util/util'

const debug = Debug('plugin-kubectl/controller/client/direct/status')

interface Group {
  names: string[]
  namespace: string
  explainedKind: Explained
}

// this is still TODO; for now, we only handle the homogeneous case
class MultiKindWatcher implements Abortable, Watcher {
  /** The table push API */
  private pusher: WatchPusher

  /** The current stream jobs. These will be aborted/flow-controlled as directed by the associated view. */
  private jobs: (Abortable & FlowControllable)[] = []

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly drilldownCommand: string,
    private readonly args: Pick<Arguments<KubeOptions>, 'REPL' | 'execOptions' | 'parsedOptions'>,
    private readonly resourceVersion: Table['resourceVersion'][],
    private readonly formatUrl: URLFormatter[],
    private readonly finalState: FinalState,
    private nNotReady: number, // number of resources to wait on
    private readonly monitorEvents = true
  ) {}

  public abort() {
    debug('abort requested', this.jobs.length)
    this.jobs.forEach(job => job.abort())
  }

  public init(pusher: WatchPusher) {
    this.pusher = pusher
  }
}

interface WithIndex<T extends string | Table> {
  idx: number
  table: T
}

function isString(response: WithIndex<string | Table>): response is WithIndex<string> {
  return typeof response.table === 'string'
}

function isTable(response: WithIndex<string | Table>): response is WithIndex<Table> {
  return !isString(response)
}

/** for apply/delete use cases, the caller may identify a FinalState and a countdown goal */
export default async function watchMulti(args: Arguments<KubeOptions>, groups: Group[], finalState: FinalState) {
  const myArgs = { REPL: args.REPL, execOptions: { type: args.execOptions.type }, parsedOptions: {} }
  const drilldownCommand = getCommandFromArgs(args)
  const nResources = groups.reduce((N, group) => N + group.names.length, 0)

  const tables: WithIndex<string | Table>[] = await Promise.all(
    groups.map(async (_, idx) => ({
      idx,
      table: await getTable(drilldownCommand, _.namespace, _.names, _.explainedKind, 'default', myArgs).catch(
        (err: CodedError) => {
          if (err.code === 404) {
            // This means every single name in _.names is missing
            if (finalState === FinalState.OfflineLike) {
              // Then that's what we want! we are done!
              return _.names
                .map(name => `${kindPart(_.explainedKind.version, _.explainedKind.kind)} "${name}" deleted`)
                .join('\n')
            } else {
              // Otherwise, we are waiting till they are online, so
              // return an empty table. This table will subsequently
              // be filled in by the watcher (makeWatchable, below)
              return {
                body: []
              } as Table
            }
          }
        }
      )
    }))
  )

  const { stringParts, tableParts } = tables.reduce(
    (pair, response) => {
      if (isString(response)) {
        pair.stringParts.push(response)
      } else if (isTable(response)) {
        pair.tableParts.push(response)
      }
      return pair
    },
    { stringParts: [] as WithIndex<string>[], tableParts: [] as WithIndex<Table>[] }
  )

  if (tableParts.length > 0) {
    if (groups.length === 1 && tableParts.length === 1) {
      // HOMOGENEOUS CASE
      const nNotReady = tableParts[0].table.body.reduce((N, row) => (isResourceReady(row, finalState) ? N : N + 1), 0)
      if (nNotReady === 0) {
        // sub-case 1: nothing to watch, as everything is already "ready"
        debug('special case: single-group watching, all-ready all ready!', nNotReady, groups[0])
        return tableParts[0].table
      } else {
        // sub-case 2: a subset may be done, but we need to fire up a
        // watcher to monitor the rest
        debug('special case: single-group watching with some not yet ready', nNotReady, groups[0])
        return makeWatchable(
          drilldownCommand,
          myArgs,
          groups[0].explainedKind.kind,
          tableParts[0].table,
          urlFormatterFor(groups[0].namespace, myArgs, groups[0].explainedKind),
          finalState,
          nNotReady
        )
      }
    }

    // HETEROGENEOUS CASE
    // we need to assemble a unifiedTable facade
    // NOT YET DONE. for now, we handle only the single-kind/homogeneous cases
    const firstTableWithHeader = tableParts.find(_ => _.table.header)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unifiedTable = {
      header: firstTableWithHeader ? firstTableWithHeader.table.header : undefined,
      body: [].concat(...tableParts.map(_ => _.table.body)),
      watcher: new MultiKindWatcher(
        drilldownCommand,
        args,
        tableParts.map(_ => _.table.resourceVersion),
        await Promise.all(
          tableParts.map(_ => {
            const group = groups[_.idx]
            return urlFormatterFor(group.namespace, myArgs, group.explainedKind)
          })
        ),
        finalState,
        nResources
      )
    }
    throw new Error('Unsupported use case')
  } else if (stringParts.length > 0) {
    // all strings, which will be the messages from the apiServer, e.g. conveying the state "this resource that you asked to watch until it was deleted... well it is already deleted"
    return stringParts.map(_ => _.table)
  } else {
    throw new Error('nothing to watch')
  }
}
