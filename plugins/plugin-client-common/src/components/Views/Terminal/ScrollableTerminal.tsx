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
import { Accordion } from 'carbon-components-react'
import {
  eventChannelUnsafe,
  ExecOptions,
  ScalarResponse,
  Tab as KuiTab,
  isPopup,
  CommandOptions,
  isWatchable
} from '@kui-shell/core'

import Block from './Block'
import { Active, Finished, Cancelled, Processing, isActive, isProcessing, BlockModel } from './Block/BlockModel'

import 'carbon-components/scss/components/accordion/_accordion.scss'

type Cleaner = () => void

export interface TerminalOptions {
  noActiveInput?: boolean
}

type Props = TerminalOptions & {
  /** tab UUID */
  uuid: string

  /** tab model */
  tab: KuiTab

  sidecarIsVisible?: boolean
  closeSidecar: () => void
}

interface State {
  blocks: BlockModel[]
}

export default class ScrollableTerminal extends React.PureComponent<Props, State> {
  private readonly cleaners: Cleaner[] = []
  private _scrollRegion: HTMLDivElement

  /** grab a ref to the active block, to help us maintain focus */
  private _activeBlock: Block

  public constructor(props: Props) {
    super(props)

    this.initEvents()

    this.state = {
      blocks: [Active()] // <-- TODO: restore from localStorage for a given tab UUID?
    }
  }

  /** Clear Terminal; TODO: also clear persisted state, when we have it */
  private clear() {
    this.setState(() => {
      // capture the value of the last input
      const capturedValue = this._activeBlock ? this._activeBlock.inputValue() : ''
      return {
        blocks: [Active(capturedValue)]
      }
    })
  }

  /** Output.tsx finished rendering something */
  private onOutputRender() {
    setTimeout(() => {
      if (this._scrollRegion) {
        this._scrollRegion.scrollTop = this._scrollRegion.scrollHeight
      }
    }, 0)
  }

  /** the REPL started executing a command */
  private onExecStart({ execUUID, command, echo }: { execUUID: string; command: string; echo: boolean }) {
    if (echo === false) {
      // then the command wants to be incognito; e.g. onclickSilence for tables
      return
    }

    if (isPopup() && this.props.sidecarIsVisible) {
      // see https://github.com/IBM/kui/issues/4183
      this.props.closeSidecar()
    }

    this.setState(curState => {
      const idx = curState.blocks.length - 1

      // Transform the last block to Processing
      return {
        blocks: curState.blocks.slice(0, idx).concat([Processing(curState.blocks[idx], command, execUUID)])
      }
    })
  }

  /** the REPL finished executing a command */
  private onExecEnd(
    {
      response,
      cancelled,
      echo,
      evaluatorOptions,
      execOptions
    }: {
      response: ScalarResponse
      cancelled: boolean
      echo: boolean
      evaluatorOptions: CommandOptions
      execOptions: ExecOptions
    },
    execUUID: string,
    responseType: string
  ) {
    if (echo === false) {
      // then the command wants to be incognito; e.g. onclickSilence for tables
      return
    }

    this.setState(curState => {
      const inProcessIdx = curState.blocks.findIndex(_ => isProcessing(_) && _.execUUID === execUUID)

      // response `showInTerminal` is either non-watchable response, or watch response that's forced to show in terminal
      const showInTerminal =
        !isWatchable(response) ||
        (isWatchable(response) &&
          (evaluatorOptions.alwaysViewIn === 'Terminal' || execOptions.alwaysViewIn === 'Terminal'))

      if (inProcessIdx >= 0) {
        const inProcess = curState.blocks[inProcessIdx]
        if (isProcessing(inProcess)) {
          try {
            const blocks = curState.blocks
              .slice(0, inProcessIdx) // everything before
              .concat([
                Finished(inProcess, responseType === 'ScalarResponse' && showInTerminal ? response : true, cancelled)
              ]) // mark as finished
              .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
              .concat([Active()]) // plus a new block!
            return {
              blocks
            }
          } catch (err) {
            console.error('error updating state', err)
          }
        } else {
          console.error('invalid state: got a command completion event for a block that is not processing', execUUID)
        }
      } else if (cancelled) {
        // we get here if the user just types ctrl+c without having executed any command. add a new block!
        const inProcessIdx = curState.blocks.length - 1
        const inProcess = curState.blocks[inProcessIdx]
        const blocks = curState.blocks
          .slice(0, inProcessIdx)
          .concat([Cancelled(inProcess)]) // mark as cancelled
          .concat([Active()]) // plus a new block!
        return {
          blocks
        }
      } else {
        console.error('invalid state: got a command completion event, but never got command start event', execUUID)
      }
    })
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus() {
    if (this._activeBlock) {
      this._activeBlock.doFocus()
    } else {
      // a bit of a data abstraction violation; we should figure out how to solve this better
      // see https://github.com/IBM/kui/issues/3945
      const xterm = document.querySelector('textarea.xterm-helper-textarea') as HTMLTextAreaElement
      if (xterm) {
        xterm.focus()
      }
    }
  }

  /** Hook into the core's read-eval-print loop */
  private hookIntoREPL() {
    const channel1 = `/command/start/fromuser/${this.props.uuid}`
    const onExecStart = this.onExecStart.bind(this)
    this.cleaners.push(() => {
      eventChannelUnsafe.off(channel1, onExecStart)
    })
    eventChannelUnsafe.on(channel1, onExecStart)

    const channel2 = `/command/complete/fromuser/${this.props.uuid}`
    const onExecEnd = this.onExecEnd.bind(this)
    this.cleaners.push(() => {
      eventChannelUnsafe.off(channel2, onExecEnd)
    })
    eventChannelUnsafe.on(channel2, onExecEnd)
  }

  private initEvents() {
    this.hookIntoREPL()

    const clear = this.clear.bind(this)
    eventChannelUnsafe.on(`/terminal/clear/${this.props.uuid}`, clear)
    this.cleaners.push(() => {
      eventChannelUnsafe.off(`/terminal/clear/${this.props.uuid}`, clear)
    })
  }

  /** Detach hooks the core's eventChannelUnsafe */
  private uninitEvents() {
    this.cleaners.forEach(cleaner => cleaner())
  }

  public componentWillUnmount() {
    this.uninitEvents()
  }

  private onClick() {
    if (document.activeElement === document.body) {
      this.doFocus()
    }
  }

  public render() {
    return (
      <div className={'repl' + (this.props.sidecarIsVisible ? ' sidecar-visible' : '')} id="main-repl">
        <div className="repl-inner zoomable" ref={c => (this._scrollRegion = c)} onClick={this.onClick.bind(this)}>
          <Accordion>
            {this.state.blocks.map((_, idx) => (
              <Block
                key={idx}
                idx={idx}
                model={_}
                uuid={this.props.uuid}
                tab={this.props.tab}
                noActiveInput={this.props.noActiveInput}
                onOutputRender={this.onOutputRender.bind(this)}
                ref={c => {
                  if (isActive(_)) {
                    // grab a ref to the active block, to help us maintain focus
                    this._activeBlock = c
                  }
                }}
              />
            ))}
          </Accordion>
        </div>
      </div>
    )
  }
}
