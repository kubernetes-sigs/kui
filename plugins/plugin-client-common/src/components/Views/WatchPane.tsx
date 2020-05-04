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
import CircularBuffer, { BaseHistoryEntry } from './util/CircularBuffer'

/*
 * Height defines the primary height of
 * a horizontal splitted pane
 *
 */
export const enum Height {
  Split = 'calc(100% - 8em)',
  NotSplit = '100%'
}

interface Props {
  uuid: string
  tab: Tab
  openWatchPane: () => void
}

interface HistoryEntry extends BaseHistoryEntry {
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
    evaluatorOptions: CommandOptions
  ) {
    if (isTable(response) && isWatchable(response) && evaluatorOptions.alwaysViewIn !== 'Terminal') {
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

  private prefixBreadcrumbs(idx: number) {
    return [{ label: `Watcher ${idx + 1}` }]
  }

  public render() {
    return (
      <div className="kui--watch-pane">
        {this.state.history &&
          Array(this.capacity())
            .fill(undefined)
            .map((_, idx) => {
              const history = this.state.history.peekAt(idx)
              return (
                <CardSpi className="kui--card kui--screenshotable" key={history ? history.key : idx}>
                  {history ? (
                    <div className="kui--sub-pane" data-pane-index={idx + 1}>
                      <LivePaginatedTable
                        tab={this.props.tab}
                        repl={this.props.tab.REPL}
                        response={history.response}
                        asGrid
                        toolbars
                        paginate={false}
                        prefixBreadcrumbs={this.prefixBreadcrumbs(idx)}
                      />
                    </div>
                  ) : (
                    <div className="kui--sub-pane" data-pane-id={idx} />
                  )}
                </CardSpi>
              )
            })}
      </div>
    )
  }
}
