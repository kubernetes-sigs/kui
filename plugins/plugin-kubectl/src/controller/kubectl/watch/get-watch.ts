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
import prettyPrintDuration from 'pretty-ms'
import { TrafficLight } from '@kui-shell/plugin-kubectl-core'

import {
  Row,
  Table,
  Arguments,
  CodedError,
  Streamable,
  Abortable,
  Watchable,
  Watcher,
  WatchPusher,
  i18n,
  Util
} from '@kui-shell/core'

import { kindPart } from '../fqn'
import { getKind } from '../explain'
import {
  formatOf,
  isForAllNamespaces,
  getLabel,
  getNamespace,
  getResourceNamesForArgv,
  withKubeconfigFrom,
  withKubeconfigAndCommandFrom,
  KubeOptions,
  KubeExecOptions
} from '../options'

import { getCommandFromArgs } from '../../../lib/util/util'
import {
  Pair,
  getNamespaceBreadcrumbs,
  preprocessTable as preFormatTables,
  formatTable
} from '../../../lib/view/formatTable'

const strings = i18n('plugin-kubectl', 'events')
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

function notEmpty<TValue>(value: TValue | void | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export class EventWatcher implements Abortable, Watcher {
  /**
   * We may get an `abort()` call before we've finished initializing
   * the PTY. This bit protects against that race. https://github.com/IBM/kui/issues/5149
   */
  private shouldAbort = false

  private ptyJob: Abortable[] = [] /** the pty job we spawned to capture --watch output */
  private eventLeftover: string

  /** Timestamp when we started up */
  private now = Date.now()

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly args: Arguments,
    private readonly command: string,
    private readonly kindByUser: string,
    private readonly name: string[],
    private readonly namespace: string,
    private readonly watchOnly: boolean,
    private readonly pusher: WatchPusher
  ) {}

  public abort() {
    // A condition variable to guard for the case we were asked to
    // abort very early on, before the PTY has even called us back
    // ("abort-before-init"). See `onPTYInitDone` for the matching
    // check on this variable:
    this.shouldAbort = true

    if (this.ptyJob) {
      this.ptyJob.forEach(job => job.abort())
    }
  }

  private onPTYEventInit(ptyJob: Abortable) {
    debug('onPTYEventInit')
    this.ptyJob.push(ptyJob)

    return async (_: Streamable) => {
      if (typeof _ === 'string') {
        const rawData = this.eventLeftover ? this.eventLeftover + _ : _
        this.eventLeftover = undefined

        // here is where we turn the raw data into tabular data
        const preprocessed = preprocessTable(rawData, 4)
        debug('rawData', rawData)
        this.eventLeftover = preprocessed.leftover === '\n' ? undefined : preprocessed.leftover

        // filter and format the row as `[ago] involvedObject.name: message`
        const sortedRows = preprocessed.rows
          .filter(notEmpty)
          .filter(row => row[1] && (!this.name || this.name.length === 0 || this.name.includes(row[1].value))) // filter the rows with `involvedObject.name` specified by `this.name`
          .sort((rowA, rowB) => {
            const lastSeenA = new Date(rowA[0].value).getTime()
            const lastSeenB = new Date(rowB[0].value).getTime()
            return lastSeenA - lastSeenB
          })

        const agos = sortedRows.map(row => {
          const ts = new Date(row[0].value).getTime()
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

        const rows = sortedRows.map((row, idx) => {
          const involvedObjectName = row[1].value
          const message = row[2].value
          const eventName = row[3].value
          const onClick = `#kuiexec?command=${encodeURIComponent(
            withKubeconfigFrom(this.args, `kubectl get event ${eventName} -o yaml`)
          )}`
          return `[[${agos[idx]}]](${onClick})` + ` **${involvedObjectName}**: ${message}`
        })

        if (rows) {
          this.pusher.footer(rows)
        }
      }
    }
  }

  private onPTYInitDone() {
    if (this.shouldAbort) {
      // protecting against abort-before-init race
      this.abort()
    }
  }

  public async init() {
    const fullKind = await getKind(this.command, this.args, this.kindByUser)
    const filter = `--field-selector=involvedObject.kind=${fullKind}`

    const output = `--no-headers -o jsonpath='{.lastTimestamp}{"|"}{.involvedObject.name}{"|"}{.message}{"|"}{.metadata.name}{"|\\n"}'`
    const watch = this.watchOnly ? '--watch-only' : '-w'

    const getEventCommand = withKubeconfigFrom(
      this.args,
      `${this.command} get events ${watch} -n ${this.namespace} ${filter} ${output}`.replace(/^k(\s)/, 'kubectl$1')
    )

    // debug('getEventCommand', getEventCommand)
    this.args.REPL.qexec(`sendtopty ${getEventCommand}`, this.args.block, undefined, {
      quiet: true,
      replSilence: true,
      echo: false,
      onReady: this.onPTYInitDone.bind(this),
      onInit: this.onPTYEventInit.bind(this) // <-- the PTY will call us back when it's ready to stream
    }).catch(err => {
      debug('pty event error', err)
    })
  }
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

  private eventLeftover: string

  /** In order to distinguish pty exit due to our abort request, from
   * a spontaneous pty exit (kubectl get --watch may exit on its own,
   * depending on the provider) */
  private weRequestedAbort = false

  /** In order to avoid a catastrophic tight look of pty re-inits, we
   * keep track of how many times we have re-initialized the PTY due
   * to a premature abort */
  private nPTYReinits = 0
  private static maxPTYReinits = 1000

  /** the pty job we spawned to capture --watch output */
  private ptyJob: Abortable[] = []

  /** the table push API */
  private pusher: WatchPusher

  /**
   * We may have been given a "limit" argument, which tells us how
   * many Completed/Succeeded/Done rows to expect. We will
   * auto-terminate the push notification channel upon reaching this
   * limit.
   *
   */
  private readonly limit: number

  /**
   * @param output This is the output format that the user desired. Below, we
   * formulate a watch query to the apiserver with a different
   * schema. We will need sufficient discriminants to index a row
   * update into an existing table. We cannot be certain that the
   * schema the *user* requested satisfies this requirement.
   */
  public constructor(private readonly args: Arguments<KubeOptions>, private readonly output = formatOf(args)) {
    this.limit =
      args.parsedOptions.limit ||
      (args.execOptions.data &&
      typeof args.execOptions.data === 'object' &&
      !Buffer.isBuffer(args.execOptions.data) &&
      typeof args.execOptions.data.limit === 'number'
        ? args.execOptions.data.limit
        : undefined)
  }

  /**
   * Our impl of `Abortable` for use by the table view
   *
   */
  public abort() {
    this.weRequestedAbort = true

    // we abort the associated pty, if we have one
    if (this.ptyJob) {
      this.ptyJob.forEach(job => job.abort())
      this.ptyJob = []
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
   * a resource cannot be retrieved by name across all namespaces,
   * so we need to append the namespace column to match the inital
   * all-namespaces table
   * see issue: https://github.com/IBM/kui/issues/5169
   *
   */
  private async allNamespaceOverride(namespace: string, getCommand: string, kind: string) {
    const rawData = await this.args.REPL.qexec<string>(`sendtopty ${getCommand.replace(/^k(\s)/, 'kubectl$1')}`)
    const preTables = preFormatTables(rawData.split(/^(?=LAST SEEN|NAMESPACE|NAME\s+)/m))
    const allNamespacesTable = preTables[0].map((pairs, idx) => {
      if (idx === 0) {
        return [{ key: 'NAMESPACE', value: 'NAMESPACE' }].concat(pairs)
      } else {
        return [{ key: 'NAMESPACE', value: namespace }].concat(pairs)
      }
    })

    const cmd = getCommandFromArgs(this.args)
    const cmdForDrilldown = cmd === 'k' ? 'kubectl' : cmd
    return formatTable(cmdForDrilldown, 'get', kind, this.args, allNamespacesTable)
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
    const getCommand = withKubeconfigAndCommandFrom(
      this.args,
      `get ${kindPart(apiVersion, kind)} ${rowNames.join(' ')} -n ${namespace} ${
        this.output ? `-o ${this.output}` : ''
      }`
    )

    if (isForAllNamespaces(this.args.parsedOptions)) {
      return this.allNamespaceOverride(namespace, getCommand, kind)
    } else {
      return this.args.REPL.qexec<Table>(getCommand).catch((err: CodedError) => {
        // mark as all offline, if we got a 404 for the bulk get
        if (err.code !== 404) {
          console.error(err)
        } else if (typeof rowNames === 'string') {
          this.pusher.offline(rowNames)
        } else {
          // mark as all offline, if we got a 404 for the bulk get
          rowNames.forEach(name => this.pusher.offline(name))
        }
      })
    }
  }

  /** Get rows as specified by user's -o */
  private async getRowsForUser(rows: Pair[][]): Promise<void | Table> {
    if (rows.length === 0) {
      return
    }

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

    if (tables.length > 0) {
      return {
        title: tables[0].title,
        header: tables[0].header,
        body: Util.flatten(tables.map(_ => _.body))
      }
    }
  }

  /** Does this row signify a completed state? */
  private isDone(row: Row) {
    const statusAttr = row.attributes.find(_ => /STATUS/i.test(_.key))
    return statusAttr && statusAttr.css && statusAttr.css === TrafficLight.Blue
  }

  /**
   * The underlying PTY has exited. If this wasn't at our request,
   * then we need to restart the PTY.
   *
   */
  private onPTYExit() {
    if (!this.weRequestedAbort) {
      if (this.nPTYReinits++ < KubectlWatcher.maxPTYReinits) {
        debug('premature termination of the pty; refiring the pty', this.nPTYReinits)
        this.init(this.pusher)
      } else {
        debug('premature termination of the pty; however, maximum reinit count exceeded!')
      }
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
    debug('onPTYInit', this.limit)
    this.ptyJob.push(ptyJob)

    // These help us with managing the countdown latch. See the comments for this.limit.
    let remaining = this.limit
    const markedAsDone: Record<string, boolean> = {}

    // collect a flurry of batch updates
    let outstandingBatchUpdate: ReturnType<typeof setTimeout>

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
          const apiVersion = rows[0][2].value
          const kind = rows[0][1].value
          const isEvent = apiVersion === 'v1' && kind === 'Event'
          table.body.forEach(row => {
            // push an update to the table model
            // true means we want to do a batch update
            if (row.isDeleted) {
              this.pusher.offline(row.name)
            } else {
              this.pusher.update(row, true, !isEvent)

              const nameAttr = row.attributes.find(_ => /NAME/i.test(_.key))
              const name = nameAttr ? nameAttr.value : row.name
              if (this.limit && !markedAsDone[name] && this.isDone(row)) {
                // we were asked to look for this.limit completions; we just saw one, so count down the latch
                markedAsDone[name] = true
                remaining--
              }
            }
          })

          // batch update done! we sometimes get a flurry of push
          // updates from the apiServer... batch up the batch updates
          if (outstandingBatchUpdate) {
            clearTimeout(outstandingBatchUpdate)
          }
          outstandingBatchUpdate = setTimeout(() => {
            outstandingBatchUpdate = undefined
            this.pusher.batchUpdateDone()
          }, 200)

          if (this.limit && remaining <= 0) {
            debug('Aborting PTY channel, due to having observed the expected number of completions')
            this.abort()
            this.pusher.done()
          }
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

    const jsonpathByVersion = `'{.metadata.name}{"|"}{.kind}{"|"}{.apiVersion}{"|"}{.metadata.namespace}{"|\\n"}'`

    // here, we initiate a kubectl watch, using a schema of our
    // choosing; we ask the PTY to stream output back to us, by using
    // the `onInit` API
    const command = withKubeconfigFrom(
      this.args,
      this.args.command
        .replace(/^k(\s)/, 'kubectl$1')
        .replace(/--limit \d+/g, '')
        .replace(/--sort-by=\S+/g, '')
        .replace(/--watch=true|-w=true|--watch-only=true|--watch|-w|--watch-only/g, '--watch') // force --watch
        .replace(new RegExp(`(-o|--output)(\\s+|=)${this.output}`), '') + ` -o jsonpath=${jsonpathByVersion}`
    )
    // ^^^^^ keep these in sync with nCols above !!

    this.args.REPL.qexec(`sendtopty ${command}`, this.args.block, undefined, {
      quiet: true,
      replSilence: true,
      echo: false,
      onExit: this.onPTYExit.bind(this),
      onInit: this.onPTYInit.bind(this) // <-- the PTY will call us back when it's ready to stream
    }).catch(err => {
      debug('pty error', err)
    })

    // here, we initiate a kubectl event watch, using a schema of our
    // choosing; we ask the PTY to stream output back to us, by using
    // the `onInit` API
    const cmd = getCommandFromArgs(this.args)
    const namespace = await getNamespace(this.args)
    const kindByUser = this.args.argvNoOptions[this.args.argvNoOptions.indexOf('get') + 1]

    if (getLabel(this.args) || this.args.parsedOptions['field-selector']) {
      debug('event watcher does not support label and field selector')
    } else {
      const eventWatcher = new EventWatcher(
        this.args,
        cmd,
        kindByUser,
        getResourceNamesForArgv(kindByUser, this.args),
        namespace,
        false,
        this.pusher
      )
      eventWatcher.init()
      this.ptyJob.push(eventWatcher)
    }
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
    const cmd = withKubeconfigFrom(
      args,
      args.command
        .replace(/^k(\s)/, 'kubectl$1')
        .replace(/--watch=true|-w=true|--watch-only=true|--watch|-w|--watch-only/g, '')
    ) // strip --watch

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
      return Object.assign({}, initialTable, {
        breadcrumbs: initialTable.breadcrumbs || (await getNamespaceBreadcrumbs(initialTable.title, args)),
        title:
          initialTable.title ||
          (await getKind(getCommandFromArgs(args), args, args.argvNoOptions[args.argvNoOptions.indexOf('get') + 1])),
        watch: new KubectlWatcher(args, undefined) // <-- our watcher
      })
    }
  } catch (err) {
    const message = ((args.execOptions as KubeExecOptions).initialResponse as string) || err.message
    err.message = message
    throw err
  }
}
