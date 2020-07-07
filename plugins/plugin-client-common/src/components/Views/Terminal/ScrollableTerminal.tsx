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
  i18n,
  eventBus,
  eventChannelUnsafe,
  ScalarResponse,
  Tab as KuiTab,
  ExecOptions,
  ExecType,
  isPopup,
  CommandStartEvent,
  CommandCompleteEvent,
  isWatchable
} from '@kui-shell/core'

import Block from './Block'
import getSize from './getSize'
import KuiConfiguration from '../../Client/KuiConfiguration'
import {
  Active,
  Finished,
  FinishedBlock,
  Announcement,
  Cancelled,
  Processing,
  isActive,
  isOk,
  isProcessing,
  hasUUID,
  BlockModel
} from './Block/BlockModel'

import '../../../../web/scss/components/Terminal/_index.scss'

const strings = i18n('plugin-client-common')

type Cleaner = () => void

/** Hard limit on the number of Terminal splits */
const MAX_TERMINALS = 2

/** Hard limit on the number of Pinned splits */
const MAX_PINNED = 3

/** Remember the welcomed count in localStorage, using this key */
const NUM_WELCOMED = 'kui-shell.org/ScrollableTerminal/NumWelcomed'

export interface TerminalOptions {
  noActiveInput?: boolean
}

type Props = TerminalOptions & {
  /** tab UUID */
  uuid: string

  /** tab model */
  tab: KuiTab

  /** handler for terminal clear */
  onClear?: () => void

  /** KuiConfiguration */
  config: KuiConfiguration

  sidecarIsVisible?: boolean
  closeSidecar: () => void
}

interface ScrollbackState {
  uuid: string
  blocks: BlockModel[]

  /** tab facade */
  facade?: KuiTab

  /** grab a ref to the active block, to help us maintain focus */
  _activeBlock?: Block

  /** cleanup routines for this split */
  cleaners: Cleaner[]
}

function isScrollback(tab: KuiTab): boolean {
  return /_/.test(tab.uuid)
}

interface State {
  focusedIdx: number
  splits: ScrollbackState[]
}

function doSplitViewViaId(uuid: string, focusBlock?: FinishedBlock) {
  const res = new Promise((resolve, reject) => {
    const requestChannel = `/kui-shell/TabContent/v1/tab/${uuid}`
    setTimeout(() => eventChannelUnsafe.emit(requestChannel, resolve, reject, focusBlock))
  }).catch(err => {
    console.error('doSplitViewViaId', err)
    throw err
  })
  return res
}

/** Split the given tab uuid */
export function doSplitView(tab: KuiTab) {
  const uuid = isScrollback(tab) ? tab.uuid : tab.querySelector('.kui--scrollback').getAttribute('data-scrollback-id')
  return doSplitViewViaId(uuid)
}

type SplitHandler = (resolve: (response: true) => void, reject: (err: Error) => void) => void

function onSplit(uuid: string, handler: SplitHandler) {
  const requestChannel = `/kui-shell/TabContent/v1/tab/${uuid}`
  eventChannelUnsafe.on(requestChannel, handler)
}

function offSplit(uuid: string, handler: () => void) {
  const requestChannel = `/kui-shell/TabContent/v1/tab/${uuid}`
  eventChannelUnsafe.off(requestChannel, handler)
}

/** Is the given `elm` on visible in the current viewport? */
function isInViewport(elm: HTMLElement) {
  const rect = elm.getBoundingClientRect()
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

export default class ScrollableTerminal extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      focusedIdx: 0,
      splits: [this.scrollbackWithWelcome()]
    }
  }

  /** add welcome blocks at the top of scrollback */
  private scrollbackWithWelcome() {
    const scrollback = this.scrollback()
    const welcomeMax = this.props.config.showWelcomeMax

    if (this.props.config.loadingDone && welcomeMax !== undefined) {
      const welcomed = parseInt(localStorage.getItem(NUM_WELCOMED)) || 0

      if ((welcomeMax === -1 || welcomed < welcomeMax) && this.props.config.loadingDone) {
        const announcement = this.props.config.loadingDone(this.props.tab.REPL)
        if (announcement) {
          eventBus.emitCommandComplete({
            tab: this.props.tab,
            command: 'welcome',
            argvNoOptions: ['welcome'],
            parsedOptions: {},
            execOptions: {},
            execUUID: '',
            execType: ExecType.TopLevel,
            cancelled: false,
            echo: true,
            evaluatorOptions: {},
            response: { react: announcement },
            responseType: 'ScalarResponse'
          })
        }
        const welcomeBlocks: BlockModel[] = !announcement
          ? []
          : [
              Announcement({
                react: this.props.config.loadingDone && (
                  <div className="kui--repl-message kui--session-init-done">{announcement}</div>
                )
              })
            ]

        scrollback.blocks = welcomeBlocks.concat(scrollback.blocks)

        if (welcomeMax !== -1) {
          localStorage.setItem(NUM_WELCOMED, (welcomed + 1).toString())
        }
      }
    }

    return scrollback
  }

  private allocateUUIDForScrollback(forSplit = false) {
    if (forSplit || (this.props.config.splitTerminals && !isPopup())) {
      return `${this.props.uuid}_${uuid()}`
    } else {
      return this.props.uuid
    }
  }

  private scrollback(
    pinBlock?: FinishedBlock,
    capturedValue?: string,
    sbuuid = this.allocateUUIDForScrollback(!!pinBlock)
  ): ScrollbackState {
    const state = {
      uuid: sbuuid,
      cleaners: [],
      blocks: pinBlock ? [pinBlock] : [Active(capturedValue)] // <-- TODO: restore from localStorage for a given tab UUID?
    }

    eventBus.onceWithTabId('/tab/close/request', sbuuid, async () => {
      // async, to allow for e.g. command completion events to finish
      // propagating to the split before we remove it
      setTimeout(() => this.removeSplit(sbuuid))
    })

    return this.initEvents(state)
  }

  private get current() {
    return this.state.splits[0]
  }

  /** Clear Terminal; TODO: also clear persisted state, when we have it */
  private clear(uuid: string) {
    if (this.props.onClear) {
      this.props.onClear()
    }

    this.splice(uuid, ({ _activeBlock, cleaners }) => {
      cleaners.forEach(cleaner => cleaner())

      // capture the value of the last input
      const capturedValue = _activeBlock ? _activeBlock.inputValue() : ''
      return this.scrollback(undefined, capturedValue, uuid)
    })
  }

  /** Output.tsx finished rendering something */
  private onOutputRender(scrollback: ScrollbackState) {
    setTimeout(() => scrollback.facade.scrollToBottom())
  }

  /** the REPL started executing a command */
  private onExecStart(uuid = this.current ? this.current.uuid : undefined, event: CommandStartEvent) {
    if (event.echo === false) {
      // then the command wants to be incognito; e.g. onclickSilence for tables
      return
    }

    if (isPopup() && this.props.sidecarIsVisible) {
      // see https://github.com/IBM/kui/issues/4183
      this.props.closeSidecar()
    }

    // uuid might be undefined if the split is going away
    if (uuid) {
      this.splice(uuid, curState => {
        const idx = curState.blocks.length - 1

        // Transform the last block to Processing
        return {
          blocks: curState.blocks
            .slice(0, idx)
            .concat([Processing(curState.blocks[idx], event.command, event.execUUID)])
        }
      })
    }
  }

  /** Format a MarkdownResponse */
  private markdown(key: string) {
    return {
      content: strings(key),
      contentType: 'text/markdown' as const
    }
  }

  /** is the number of pinned views reached the max limit? */
  private hasReachedMaxPinnned() {
    return this.numPinnedSplits() === MAX_PINNED
  }

  /**
   * When the following requirements meet, auto-pin the command block:
   * 1. user has enabled the enableWatcherAutoPin feature flag
   * 2. not in popup mode
   * 3. the scalar response is watchable, e.g. watchable table,
   * 4. the command option or exec options doesn't say alwaysViewIn Terminal,
   * i.e. crud command may always want to be displayed in terminal even though it's watchable,
   *
   */
  private shouldPinTheBlock(event: CommandCompleteEvent<ScalarResponse>) {
    return (
      this.props.config.enableWatcherAutoPin &&
      !isPopup() &&
      isWatchable(event.response) &&
      event.evaluatorOptions.alwaysViewIn !== 'Terminal' &&
      event.execOptions.alwaysViewIn !== 'Terminal'
    )
  }

  /** the REPL finished executing a command */
  private onExecEnd(uuid = this.current ? this.current.uuid : undefined, event: CommandCompleteEvent<ScalarResponse>) {
    if (event.echo === false) {
      // then the command wants to be incognito; e.g. onclickSilence for tables
      return
    }

    if (!uuid) return

    this.splice(uuid, curState => {
      const inProcessIdx = curState.blocks.findIndex(_ => isProcessing(_) && _.execUUID === event.execUUID)

      if (inProcessIdx >= 0) {
        const inProcess = curState.blocks[inProcessIdx]
        if (isProcessing(inProcess)) {
          try {
            if (this.shouldPinTheBlock(event)) {
              if (this.hasReachedMaxPinnned()) {
                const blocks = curState.blocks
                  .slice(0, inProcessIdx) // everything before
                  .concat([Finished(inProcess, new Error(strings('No more pins allowed')), false)]) // tell the user that we didn't pinned the output
                  .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
                  .concat([Active()]) // plus a new block!

                return {
                  blocks
                }
              } else {
                const pinnedBlock = Object.assign(
                  {},
                  Finished(inProcess, event.responseType === 'ScalarResponse' ? event.response : true, event.cancelled),
                  {
                    isPinned: true
                  } /** <--- pin the block, and render the block accordingly e.g. not show timestamp, auto-gridify table */
                )

                // show the response in a split view
                doSplitViewViaId(uuid, pinnedBlock)

                // signify that the response has been pinned in the original block
                const blocks = curState.blocks
                  .slice(0, inProcessIdx) // everything before
                  .concat([Finished(inProcess, this.markdown('Output has been pinned to a watch pane'), false)]) // tell the user that we pinned the output
                  .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
                  .concat([Active()]) // plus a new block!

                return {
                  blocks
                }
              }
            } else {
              const blocks = curState.blocks
                .slice(0, inProcessIdx) // everything before
                .concat([
                  Finished(inProcess, event.responseType === 'ScalarResponse' ? event.response : true, event.cancelled)
                ]) // mark as finished
                .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
                .concat([Active()]) // plus a new block!
              return {
                blocks
              }
            }
          } catch (err) {
            console.error('error updating state', err)
            throw err
          }
        } else {
          console.error('invalid state: got a command completion event for a block that is not processing', event)
        }
      } else if (event.cancelled) {
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
        console.error('invalid state: got a command completion event, but never got command start event', event)
      }
    })
  }

  /** Owner wants us to focus on the current prompt */
  public doFocus(scrollback = this.current) {
    const { _activeBlock } = scrollback

    if (this.hasPinned(scrollback)) {
      return this.doFocus(this.state.splits.find(_ => !this.hasPinned(_)))
    } else if (_activeBlock) {
      if (_activeBlock.state._block && isInViewport(_activeBlock.state._block)) {
        // re: isInViewport, see https://github.com/IBM/kui/issues/4739
        _activeBlock.doFocus()
      }
    } else {
      // a bit of a data abstraction violation; we should figure out how to solve this better
      // see https://github.com/IBM/kui/issues/3945
      const xterm = document.querySelector('textarea.xterm-helper-textarea') as HTMLTextAreaElement
      if (xterm) {
        xterm.focus()
      }
    }
  }

  /**
   * Handle CommandStart/Complete events directed at the given
   * scrollback region.
   *
   */
  private hookIntoREPL(state: ScrollbackState) {
    const onStartForSplit = this.onExecStart.bind(this, state.uuid)
    const onCompleteForSplit = this.onExecEnd.bind(this, state.uuid)
    eventBus.onCommandStart(state.uuid, onStartForSplit)
    eventBus.onCommandComplete(state.uuid, onCompleteForSplit)
    state.cleaners.push(() => eventBus.offCommandStart(state.uuid, onStartForSplit))
    state.cleaners.push(() => eventBus.offCommandComplete(state.uuid, onCompleteForSplit))
  }

  /**
   * Handle events directed at the given scrollback region.
   *
   */
  private initEvents(state: ScrollbackState) {
    this.hookIntoREPL(state)

    const clear = this.clear.bind(this, state.uuid)
    eventChannelUnsafe.on(`/terminal/clear/${state.uuid}`, clear)
    state.cleaners.push(() => {
      eventChannelUnsafe.off(`/terminal/clear/${state.uuid}`, clear)
    })

    if ((this.props.config.splitTerminals || this.props.config.enableWatcherAutoPin) && !isPopup()) {
      const split = this.onSplit.bind(this)
      onSplit(state.uuid, split)
      state.cleaners.push(() => offSplit(state.uuid, split))
    }

    return state
  }

  private numPinnedSplits() {
    return this.state.splits.reduce((N, _) => (N += _.blocks.find(_ => _.isPinned) ? 1 : 0), 0)
  }

  /** Split the view */
  private onSplit(resolve: (response: true) => void, reject: (err: Error) => void, pinBlock?: FinishedBlock) {
    const nPinned = this.numPinnedSplits()
    const nTerminals = this.state.splits.length - nPinned

    if (!pinBlock && nTerminals === MAX_TERMINALS) {
      reject(new Error(strings('No more splits allowed')))
    } else if (pinBlock && this.hasReachedMaxPinnned()) {
      reject(new Error(strings('No more pins allowed')))
    } else {
      this.setState(({ splits, focusedIdx }) => {
        const newFocus = focusedIdx + 1
        const newSplits = splits
          .slice(0, newFocus)
          .concat(this.scrollback(pinBlock))
          .concat(splits.slice(newFocus))

        return {
          focusedIdx: newFocus,
          splits: newSplits
        }
      })
      resolve(true)
    }
  }

  /** Detach hooks that might have been registered */
  private uninitEvents() {
    // clean up per-split event handlers
    this.state.splits.forEach(({ cleaners }) => {
      cleaners.forEach(cleaner => cleaner())
    })
  }

  public componentWillUnmount() {
    this.uninitEvents()
  }

  private onClick(scrollback: ScrollbackState) {
    if (document.activeElement === document.body && !getSelection().toString()) {
      this.doFocus(scrollback)
    }
  }

  /**
   * @return the index of the given scrollback, in the context of the
   * current (given) state
   *
   */
  private findSplit(curState: State, uuid: string): number {
    return curState.splits.findIndex(_ => _.uuid === uuid)
  }

  /** does the scrollback has pinned blocks? */
  private hasPinned(scrollback: ScrollbackState) {
    return scrollback.blocks.findIndex(block => block.isPinned) !== -1
  }

  /**
   * @return the index of the given scrollback, in the context of the
   * current (given) state
   * Note: if theres's no unpinned scrollback matched the given state,
   * e.g. the scrollback has been removed, return 0
   *
   */
  private findAvailableSplit(curState: State, uuid: string): number {
    const focusedIdx = this.findSplit(curState, uuid)
    const availableSplit = focusedIdx !== -1 ? focusedIdx : 0

    return !this.hasPinned(curState.splits[availableSplit]) ? availableSplit : 0
  }

  // If the block has watchable response, abort the job
  private removeWatchableBlock(block: BlockModel) {
    if (isOk(block) && isWatchable(block.response)) {
      block.response.watch.abort()
    }
  }

  /**
   * Remove the given split (identified by `sbuuid`) from the state.
   *
   */
  private removeSplit(sbuuid: string) {
    this.setState(curState => {
      const idx = this.findSplit(this.state, sbuuid)
      if (idx >= 0) {
        curState.splits[idx].blocks.forEach(this.removeWatchableBlock)

        const splits = curState.splits.slice(0, idx).concat(curState.splits.slice(idx + 1))

        if (splits.length === 0) {
          // the last split was removed; notify parent
          const parent = this.props.tab
          eventBus.emitWithTabId('/tab/close/request', parent.uuid, parent)
        }

        // if there's no unpinned split remained, make a new split
        const nonPinnedSplits = splits.filter(_ => !this.hasPinned(_))
        return nonPinnedSplits.length !== 0 ? { splits } : { splits: [this.scrollback()].concat(splits) }
      }
    })
  }

  /**
   * Splice in an update to the given split (identified by `sbuuid`),
   * using the giving ScrollbackState mutator.
   *
   */
  private splice(sbuuid: string, mutator: (state: ScrollbackState) => Pick<ScrollbackState, 'blocks'>) {
    this.setState(curState => {
      const focusedIdx = this.findAvailableSplit(curState, sbuuid)
      const splits = curState.splits
        .slice(0, focusedIdx)
        .concat([Object.assign({}, curState.splits[focusedIdx], mutator(curState.splits[focusedIdx]))])
        .concat(curState.splits.slice(focusedIdx + 1))

      return {
        splits
      }
    })
  }

  /** remove the pinned block, and show the original response in a non-pinned scrollback */
  private unPinTheBlock(uuid: string, block: FinishedBlock) {
    // 1. remove the pin
    this.removeSplit(uuid)

    // 2. find an available block to show the unpinned response
    this.splice(uuid, curState => {
      const unPinnedBlock = Object.assign(block, { isPinned: false })
      const findOriginalBlock = curState.blocks.findIndex(
        _ => hasUUID(_) && hasUUID(block) && _.execUUID === block.execUUID
      )
      const activeBlockIdx = curState.blocks.findIndex(_ => isActive(_))

      if (findOriginalBlock !== -1) {
        return {
          blocks: curState.blocks
            .slice(0, findOriginalBlock) // everything before the original block
            .concat([unPinnedBlock]) // add the unpinned block
            .concat(curState.blocks.slice(findOriginalBlock + 1)) // everything after the original block
        }
      } else {
        return {
          blocks: curState.blocks
            .slice(0, activeBlockIdx) // everything before the active block
            .concat([unPinnedBlock]) // add the unpinned block
            .concat(curState.blocks.slice(activeBlockIdx)) // everything after
        }
      }
    })
  }

  /** remove the block at the given index */
  private willRemoveBlock(uuid: string, idx: number) {
    this.splice(uuid, curState => {
      this.removeWatchableBlock(curState.blocks[idx])

      return {
        blocks: curState.blocks
          .slice(0, idx)
          .concat(curState.blocks.slice(idx + 1))
          .concat(curState.blocks.find(_ => isActive(_)) ? [] : [Active()]) // plus a new block, if needed
      }
    })
  }

  private tabRefFor(scrollback: ScrollbackState, ref: HTMLElement) {
    if (ref) {
      ref['facade'] = scrollback.facade
      scrollback.facade.getSize = getSize.bind(ref)

      scrollback.facade.scrollToBottom = () => {
        ref.scrollTop = ref.scrollHeight
      }

      scrollback.facade.addClass = (cls: string) => {
        ref.classList.add(cls)
      }
      scrollback.facade.removeClass = (cls: string) => {
        ref.classList.remove(cls)
      }
    }
  }

  private tabFor(scrollback: ScrollbackState): KuiTab {
    if (!scrollback.facade) {
      const { uuid } = scrollback
      let facade: KuiTab // eslint-disable-line prefer-const
      const tabFacade = Object.assign({}, this.props.tab, {
        REPL: Object.assign({}, this.props.tab.REPL, {
          pexec: (command: string, execOptions?: ExecOptions) => {
            return this.props.tab.REPL.pexec(command, Object.assign({ tab: facade }, execOptions))
          },
          qexec: (
            command: string,
            b1?: HTMLElement | boolean,
            b2?: boolean,
            execOptions?: ExecOptions,
            b3?: HTMLElement
          ) => {
            return this.props.tab.REPL.qexec(command, b1, b2, Object.assign({ tab: facade }, execOptions), b3)
          }
        })
      })
      facade = Object.assign({}, tabFacade, { uuid })
      scrollback.facade = facade
    }

    return scrollback.facade
  }

  public render() {
    const nPinned = this.numPinnedSplits()
    const nTerminals = this.state.splits.length - nPinned

    return (
      <div className={'repl' + (this.props.sidecarIsVisible ? ' sidecar-visible' : '')} id="main-repl">
        <div
          className="repl-inner zoomable kui--terminal-split-container"
          data-split-count={nTerminals}
          data-pinned-count={nPinned === 0 ? undefined : nPinned}
        >
          {this.state.splits.map(scrollback => {
            const tab = this.tabFor(scrollback)
            const hasPinned = !!scrollback.blocks.find(_ => _.isPinned)
            return React.createElement(
              hasPinned ? 'span' : 'div',
              {
                className: 'kui--scrollback scrollable scrollable-auto',
                'data-has-pinned': hasPinned || undefined,
                key: tab.uuid,
                'data-scrollback-id': tab.uuid,
                ref: ref => this.tabRefFor(scrollback, ref),
                onClick: this.onClick.bind(this, scrollback)
              },
              scrollback.blocks.map((_, idx) => (
                <Block
                  key={hasUUID(_) ? _.execUUID : idx}
                  idx={idx}
                  model={_}
                  uuid={scrollback.uuid}
                  tab={tab}
                  noActiveInput={this.props.noActiveInput}
                  onOutputRender={this.onOutputRender.bind(this, scrollback)}
                  willRemove={
                    _.isPinned
                      ? this.removeSplit.bind(this, scrollback.uuid)
                      : this.willRemoveBlock.bind(this, scrollback.uuid, idx)
                  }
                  unPin={this.unPinTheBlock.bind(this, scrollback.uuid, _)}
                  willLoseFocus={() => this.doFocus(scrollback)}
                  isPinned={_.isPinned}
                  ref={c => {
                    if (isActive(_)) {
                      // grab a ref to the active block, to help us maintain focus
                      scrollback._activeBlock = c
                    }
                  }}
                />
              ))
            )
          })}
          {nPinned > 0 &&
            nPinned < MAX_PINNED &&
            Array(MAX_PINNED - nPinned)
              .fill(undefined)
              .map((_, idx) => (
                <span key={`kui--pinned-blank-${idx}`} data-has-pinned className="kui--scrollback kui--pinned-blank" />
              ))}
        </div>
      </div>
    )
  }
}
