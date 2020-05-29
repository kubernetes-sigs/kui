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

import * as React from 'react'
import { v4 as uuid } from 'uuid'

import {
  eventChannelUnsafe,
  ExecOptions,
  i18n,
  isWatchable,
  ScalarResponse,
  Tab,
  Table,
  isTable,
  Watchable,
  ParsedOptions,
  CommandOptions
} from '@kui-shell/core'

import CardSpi from '../spi/Card'
import sameCommand from './util/same'
import { cwd as getCwd } from './Sidecar/BaseSidecar'
import LivePaginatedTable from '../Content/Table/LivePaginatedTable'
import { getBreadcrumbsFromTable } from '../Content/Table/PaginatedTable'
import CircularBuffer, { BaseHistoryEntry } from './util/CircularBuffer'
import Breadcrumb from '../spi/Breadcrumb'

const strings = i18n('plugin-client-common')

/*
 * Height defines the primary height of
 * a horizontal splitted pane
 *
 */
export const enum Height {
  Split = 'calc(100% - 8em - 2 * 0.5em)', // remember to add 2 * $pane-gap
  NotSplit = '100%'
}

interface Props {
  uuid: string
  tab: Tab
  openWatchPane: () => void
  closeWatchPane: () => void
}

interface HistoryEntry extends BaseHistoryEntry {
  command: string
  key: string // helps react distinguish similar Table
  response: Table & Watchable
}

interface State {
  current: HistoryEntry
  history: CircularBuffer<HistoryEntry>
}

export default class WatchPane extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const channel = `/command/complete/fromuser/ScalarResponse/${this.props.uuid}`
    const onResponse = this.onResponse.bind(this)
    eventChannelUnsafe.on(channel, onResponse)

    this.state = {
      current: undefined,
      history: undefined
    }
  }

  private onResponse(
    tab: Tab,
    response: ScalarResponse,
    _,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions,
    __,
    evaluatorOptions: CommandOptions,
    execOptions: ExecOptions,
    command: string
  ) {
    if (
      isTable(response) &&
      isWatchable(response) &&
      evaluatorOptions.alwaysViewIn !== 'Terminal' &&
      execOptions.alwaysViewIn !== 'Terminal'
    ) {
      this.setState(curState => {
        const cwd = getCwd()

        const existingIdx = curState.history
          ? curState.history.findIndex(sameCommand(argvNoOptions, parsedOptions, cwd))
          : -1

        const current: HistoryEntry = {
          key: uuid(), // helps react distinguish similar Table
          response,
          argvNoOptions,
          parsedOptions,
          command,
          cwd
        }

        if (current) {
          this.props.openWatchPane()

          if (!curState.history) {
            return {
              current,
              history: new CircularBuffer(current, this.capacity())
            }
          } else {
            if (existingIdx === -1) {
              curState.history.push(current)
            } else {
              curState.history.update(existingIdx, current)
            }

            return {
              current,
              history: curState.history
            }
          }
        }
      })
    }
  }

  /** Keep this in sync with WatchPane.scss $num-columns */
  private capacity() {
    return 4
  }

  /** re-execute the command, but display the watch result in terminal */
  private watchInTerminal(command: string) {
    this.props.tab.REPL.pexec(command, { alwaysViewIn: 'Terminal' })
  }

  /** `Card Actions`, will be rendred as `Dropdown` */
  private actions(history: HistoryEntry, watcherIdx: number) {
    const watchInTerminal = {
      label: strings('Show as table'),
      handler: this.watchInTerminal.bind(this, history.command)
    }
    const stopWatching = {
      label: strings('Stop watching'),
      handler: this.clearSubPane.bind(this, history.response, watcherIdx)
    }
    return [watchInTerminal, stopWatching]
  }

  /** render subpane header as Breadcrumb */
  private header(response: Table, idx: number) {
    const prefixBreadcrumbs = [{ label: `Watcher ${idx + 1}` }]
    const breadcrumbs = getBreadcrumbsFromTable(response, prefixBreadcrumbs)
    return <Breadcrumb repl={this.props.tab.REPL} breadcrumbs={breadcrumbs.length > 0 && breadcrumbs} />
  }

  /** abort the watchable job and clear the watch pane */
  private clearSubPane(response: Watchable, idx: number) {
    // abort the watchable job
    response.watch.abort()

    // remove the history entry from circular buffer
    this.state.history.popAt(idx)

    // force re-rendering
    this.forceUpdate()

    // remove the watch pane if there's no watcher
    if (!this.state.history || this.state.history.length === 0) {
      this.props.closeWatchPane()
    }
  }

  public render() {
    return (
      <div className="kui--watch-pane">
        {this.state.history &&
          this.state.history.length !== 0 &&
          Array(this.capacity())
            .fill(undefined)
            .map((_, idx) => {
              const history = this.state.history.peekAt(idx)
              return (
                <CardSpi
                  className={`kui--card kui--screenshotable kui--card-${idx + 1}`}
                  actions={history && this.actions(history, idx)}
                  header={history && this.header(history.response, idx)}
                  key={history ? history.key : idx}
                >
                  {history && (
                    <div className="kui--sub-card">
                      <LivePaginatedTable
                        tab={this.props.tab}
                        repl={this.props.tab.REPL}
                        response={history.response}
                        asGrid
                        title={false}
                        toolbars={false}
                        paginate={false}
                      />
                    </div>
                  )}
                </CardSpi>
              )
            })}
      </div>
    )
  }
}
