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
import {
  Table,
  Arguments,
  CodedError,
  Streamable,
  Abortable,
  Watchable,
  Watcher,
  WatchPusher,
  flatten
} from '@kui-shell/core'

import { kindPart } from '../fqn'
import { formatOf, KubeOptions, KubeExecOptions } from '../options'

import { Pair } from '../../../lib/view/formatTable'
import { getCommandFromArgs } from '../../../lib/util/util'

const debug = Debug('plugin-kubectl/controller/watch/watcher')

function preprocessTable(raw: string, nCols): { rows: Pair[][]; leftover: string } {
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

    return {
      leftover: raw.slice(lastNewlineIdx),
      rows: rows
        .slice(0, lastFullRowIdx + 1)
        .map(line => line.map(value => ({ key: value, value })))
        .filter(_ => _.length > 0)
    }
  }
}

function notEmpty<TValue>(value: TValue | void | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

class KubectlWatcher implements Abortable, Watcher {
  /**
   * We expect k columns; see the custom-columns below.
   * !! Keep this in sync with that !!
   */
  private readonly nCols = 4

  /**
   * We may get partial rows back from the underlying PTY; this is due
   * to our use of a streaming byte channel. We need to remember this
   * in-between callbacks for streaming chunks.
   *
   */
  private leftover: string

  /** the pty job we spawned to capture --watch output */
  private ptyJob: Abortable

  /** the table push API */
  private pusher: WatchPusher

  /**
   * @param output This is the output format that the user desired. Below, we
   * formulate a watch query to the apiserver with a different
   * schema. We will need sufficient discriminants to index a row
   * update into an existing table. We cannot be certain that the
   * schema the *user* requested satisfies this requirement.
   */
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly args: Arguments<KubeOptions>, private readonly output = formatOf(args)) {}

  /**
   * Our impl of `Abortable` for use by the table view
   *
   */
  public abort() {
    // we abort the associated pty, if we have one
    if (this.ptyJob) {
      this.ptyJob.abort()
      this.ptyJob = undefined
    }
  }

  private groupByNamespace(rows: Pair[][]) {
    return rows.reduce((groups, row) => {
      const namespace = row[3].value || 'default'

      const group = groups[namespace] || []
      if (!groups[namespace]) {
        groups[namespace] = group
      }

      group.push(row)
      return groups
    }, {} as Record<string, Pair[][]>)
  }

  /**
   * Fetch the user-formatted rows for the so-named resources in the
   * given namespace.
   *
   */
  private getRowsForNamespace(
    apiVersion: string,
    kind: string,
    namespace: string,
    rowNames: string[]
  ): Promise<Table | void> {
    const getCommand = `${getCommandFromArgs(this.args)} get ${kindPart(apiVersion, kind)} ${rowNames.join(
      ' '
    )} -n ${namespace} ${this.output ? `-o ${this.output}` : ''}`

    return this.args.REPL.qexec<Table>(getCommand).catch((err: CodedError) => {
      if (err.code !== 404) {
        console.error(err)
      }
      // mark as all offline, if we got a 404 for the bulk get
      if (typeof rowNames === 'string') {
        this.pusher.offline(rowNames)
      } else {
        rowNames.forEach(name => this.pusher.offline(name))
      }
    })
  }

  /** Get rows as specified by user's -o */
  private async getRowsForUser(rows: Pair[][]): Promise<void | Table> {
    const kind = rows[0][1].value
    const apiVersion = rows[0][2].value

    const groups = this.groupByNamespace(rows)

    const tables = (
      await Promise.all(
        Object.keys(groups).map(namespace => {
          const rowNames = groups[namespace].map(group => group[0].value)
          return this.getRowsForNamespace(apiVersion, kind, namespace, rowNames)
        })
      )
    ).filter(notEmpty)

    return {
      title: tables[0].title,
      header: tables[0].header,
      body: flatten(tables.map(_ => _.body))
    }
  }

  /**
   * Our impl of the `onInit` streaming PTY API: the PTY calls us with
   * the PTY job (so that we can abort it, if we want). In return, we
   * give it a stream into which it pump data.
   *
   */
  private onPTYInit(ptyJob: Abortable) {
    // in response, we return a consumer of Streamable output; we only
    // handle string data types in this case
    debug('onPTYInit')
    this.ptyJob = ptyJob

    return async (_: Streamable) => {
      if (typeof _ === 'string') {
        // <-- strings flowing out of the PTY
        // debug('streaming pty output', _)
        if (/not found/.test(_)) {
          this.pusher.allOffline()
          return
        }

        // rawData: what we will attempt to parse into a table; make
        // sure to use any residual leftover bits from previous
        // iterations
        const rawData = this.leftover ? this.leftover + _ : _

        // as a failsafe, since we just read this.leftover, clear it
        // out (read-once); we will then reestablish any residual
        // leftover immediately below
        this.leftover = undefined

        // here is where we turn the raw data into tabular data
        const preprocessed = preprocessTable(rawData, this.nCols)
        this.leftover = preprocessed.leftover === '\n' ? undefined : preprocessed.leftover
        const { rows } = preprocessed

        // now process the full rows into table view updates
        const table = await this.getRowsForUser(rows)

        if (table) {
          // in case the initial get was empty, we add the header to the
          // table; see https://github.com/kui-shell/plugin-kubeui/issues/219
          if (table.header) {
            // yup, we have a header; push it to the view
            this.pusher.header(table.header)
          }

          // based on the information we got back, 1) we push updates to
          // the table model; and 2) we may be able to discern that we
          // can stop watching
          table.body.forEach(row => {
            // push an update to the table model
            // true means we want to do a batch update
            if (row.isDeleted) {
              this.pusher.offline(row.name)
            } else {
              this.pusher.update(row, true)
            }
          })

          // batch update done!
          this.pusher.batchUpdateDone()
        }
      } else {
        console.error('unknown streamable type', _)
      }
    }
  }

  /**
   * Our impl of the `Watcher` API. This is the callback we will
   * receive from the table UI when it is ready for us to start
   * injecting updates to the table.
   *
   * We handle it by firing off a PTY to watch for subsequent changes
   * via `kubectl get --watch`.
   *
   */
  public async init(pusher: WatchPusher) {
    this.pusher = pusher

    // here, we initiate a kubectl watch, using a schema of our
    // choosing; we ask the PTY to stream output back to us, by using
    // the `onInit` API
    const command =
      this.args.command
        .replace(/^k(\s)/, 'kubectl$1')
        .replace(/--watch=true|-w=true|--watch-only=true|--watch|-w|--watch-only/g, '--watch') // force --watch
        .replace(new RegExp(`(-o|--output)(\\s+|=)${this.output}`), '') +
      ` -o jsonpath='{.metadata.name}{"|"}{.kind}{"|"}{.apiVersion}{"|"}{.metadata.namespace}{"|\\n"}'`
    // ^^^^^ keep these in sync with nCols above !!

    this.args.REPL.qexec(`sendtopty ${command}`, this.args.block, undefined, {
      quiet: true,
      replSilence: true,
      echo: false,
      onInit: this.onPTYInit.bind(this) // <-- the PTY will call us back when it's ready to stream
    }).catch(err => {
      debug('pty error', err)
    })
  }
}

/**
 * Start watching for changes to the resources of the given table.
 *
 */
export default async function doGetWatchTable(args: Arguments<KubeOptions>): Promise<string | (Table & Watchable)> {
  try {
    // we do a get, then (above) a --watch; this is the get part;
    // observe how we strip off any --watch requests from the user's
    // command line
    const cmd = args.command
      .replace(/^k(\s)/, 'kubectl$1')
      .replace(/--watch=true|-w=true|--watch-only=true|--watch|-w|--watch-only/g, '') // strip --watch
    const initialTable = await args.REPL.qexec<Table>(cmd).catch((err: CodedError) => {
      if (err.code !== 404) {
        throw err
      } else {
        // otherwise, we want parity with the (admittedly kinda odd) kubectl behavior:
        //
        // a) kubectl get <kind> <name> -w -> then <name> does not exist; fail fast
        // b) kubectl get <kind> -w -n <ns> -> then <ns> does not exist; enter poll mode
        // c) kubectl get <kind> -w -> then <kind> does not exist; fail fast
        //
        const argv = args.argvNoOptions
        const idx = argv.indexOf('get') + 1
        const kind = argv[idx] // <-- <kind>
        const name = argv[idx + 1] // <-- <name>

        if (/doesn't have a resource type/i.test(err.message)) {
          // case c, e.g. error: the server doesn't have a resource type "foo"
          throw err
        } else if (kind && name) {
          // case a
          throw err
        } else {
          // case b
          return {
            body: []
          } as Table
        }
      }
    })

    if (typeof initialTable === 'string') {
      // then this clearly is not watchable... this could happen if
      // kubectl decides to return something non-tabular in response
      // to a get command
      return ((args.execOptions as KubeExecOptions).initialResponse as string) || initialTable
    } else {
      // otherwise, we got a table back; now splice in our watcher
      return {
        header: initialTable.header,
        body: initialTable.body,
        breadcrumbs: initialTable.breadcrumbs,
        title: initialTable.title,
        watch: new KubectlWatcher(args) // <-- our watcher
      }
    }
  } catch (err) {
    const message = ((args.execOptions as KubeExecOptions).initialResponse as string) || err.message
    err.message = message
    throw err
  }
}
