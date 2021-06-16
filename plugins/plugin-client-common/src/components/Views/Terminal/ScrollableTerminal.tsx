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

import { v5 } from 'uuid'
import React from 'react'

import {
  i18n,
  eventBus,
  eventChannelUnsafe,
  isAbortableResponse,
  ScalarResponse,
  Tab as KuiTab,
  ExecOptions,
  ExecOptionsWithUUID,
  ExecType,
  History,
  CommandStartEvent,
  CommandCompleteEvent,
  TabLayoutModificationResponse,
  isTabLayoutModificationResponse,
  getTabId,
  NewSplitRequest,
  isOfflineClient,
  isNewSplitRequest,
  isWatchable,
  promiseEach,
  Notebook,
  SnapshotRequestEvent
} from '@kui-shell/core'

import ScrollbackState, { ScrollbackOptions, Cleaner } from './ScrollbackState'
import Block from './Block'
import getSize from './getSize'
import SplitHeader from './SplitHeader'
import { NotebookImpl, isNotebookImpl, snapshot, FlightRecorder, tabAlignment } from './Snapshot'
import KuiConfiguration from '../../Client/KuiConfiguration'
import { onCopy, onCut, onPaste } from './ClipboardTransfer'
import {
  Active,
  Finished,
  Announcement,
  Cancelled,
  isCancelled,
  Rerun,
  isRerunable,
  isBeingRerun,
  hasOriginalUUID,
  Processing,
  isActive,
  isAnnouncement,
  isWithCompleteEvent,
  isOk,
  isOutputOnly,
  isProcessing,
  hasStartEvent,
  hasCommand,
  hasUUID,
  BlockModel
} from './Block/BlockModel'

import isInViewport from './visible'
import '../../../../web/scss/components/Terminal/_index.scss'

const strings = i18n('plugin-client-common')

/** Hard limit on the number of Terminal splits */
const MAX_TERMINALS = 8

/** Remember the welcomed count in localStorage, using this key */
const NUM_WELCOMED = 'kui-shell.org/ScrollableTerminal/NumWelcomed'

/**
 * Seed UUID for v5 sequences. THe particular value here does not
 * matter, but if you change this, you will invalidate scrollback
 * history for all users. Only change this if that is what you
 * intended.
 */
const UUID_NAMESPACE = '5a04bbd1-fb7e-44f7-a5ea-16c0331772e3'

export interface TerminalOptions {
  noActiveInput?: boolean
}

type Props = TerminalOptions & {
  /** tab UUID */
  uuid: string

  /** tab model */
  tab: KuiTab

  snapshot?: Buffer

  tabTitle?: string

  /** handler for terminal clear */
  onClear?: () => void

  /** KuiConfiguration */
  config: KuiConfiguration
}

interface State {
  focusedIdx: number
  splits: ScrollbackState[]
  notebookMetadata?: Notebook['metadata']
}

/** get the selected texts in window */
export function getSelectionText() {
  let text = ''
  if (window.getSelection) {
    text = window.getSelection().toString()
  }
  return text
}

/** Type guard that the given evt.relatedTarget is an HTML Element */
function isElement(target: EventTarget): target is Element {
  return target && (target as Element).tagName !== undefined
}

export default class ScrollableTerminal extends React.PureComponent<Props, State> {
  /**
   * For UUID generation, keep a running counter of the total number
   * of scrollbacks created. This index will be fed to the uuid.v5()
   * generator. Note: we can't use the scrollback's index in the
   * current split array, because the user might reorder them, e.g. by
   * creating two splits, then deleting the *first*, then creating
   * (again) a second split. What was the second split is now in the
   * first position, and the new split will have the same ID as the
   * (now) first-ordinal split. Thus, instead we keep a running
   * counter. This will preserve cross-session UUID sequence equality,
   * while avoiding the reordering dilemma.
   */
  private scrollbackCounter = 0

  private cleaners: Cleaner[] = []

  public constructor(props: Props) {
    super(props)

    this.initClipboardEvents()

    const { notebookMetadata, splits } = this.props.snapshot
      ? this.replaySnapshot()
      : {
          notebookMetadata: {
            name: this.props.tabTitle
          },
          splits: [this.scrollbackWithWelcome()]
        }

    this.state = {
      focusedIdx: 0,
      splits,
      notebookMetadata
    }

    this.initSnapshotEvents()
  }

  /** replay the splits and blocks from snapshot */
  private replaySnapshot() {
    const model = JSON.parse(Buffer.from(this.props.snapshot).toString())

    if (!isNotebookImpl(model)) {
      console.error('invalid notebook', model)
      throw new Error('Invalid notebook')
    } else {
      const splits = model.spec.splits.map(split => {
        const newScrollback = this.scrollback(undefined, { inverseColors: split.inverseColors })

        if (model.metadata.preferReExecute) {
          promiseEach(split.blocks, async _ => {
            if (hasStartEvent(_)) {
              await newScrollback.facade.REPL.reexec(_.startEvent.command, { execUUID: _.startEvent.execUUID })
            }
          })
        } else {
          const restoreBlocks = split.blocks.map(_ => tabAlignment(_, newScrollback.facade))
          const insertIdx = this.findActiveBlock(newScrollback)

          newScrollback.blocks = newScrollback.blocks
            .slice(0, insertIdx)
            .concat(restoreBlocks)
            .concat(newScrollback.blocks.slice(insertIdx))
        }

        setTimeout(() => newScrollback.facade.scrollToTop())
        return newScrollback
      })

      return {
        splits,
        notebookMetadata: model.metadata
      }
    }
  }

  /** Listen for copy and paste (TODO: cut) events to facilitate moving blocks */
  private initClipboardEvents() {
    const paste = onPaste.bind(this)
    document.addEventListener('paste', paste)
    this.cleaners.push(() => document.removeEventListener('paste', paste))

    const copy = onCopy.bind(this)
    document.addEventListener('copy', copy)
    this.cleaners.push(() => document.removeEventListener('copy', copy))

    const cut = onCut.bind(this)
    document.addEventListener('cut', cut)
    this.cleaners.push(() => document.removeEventListener('cut', cut))
  }

  /** Listen for snapshot request events */
  private initSnapshotEvents() {
    const onSnapshot = async (evt: SnapshotRequestEvent) => {
      const splits = this.state.splits.map(({ inverseColors, blocks, uuid }) => {
        const { filter = () => true } = evt
        const snapshotBlocks = blocks
          .filter(_ => hasStartEvent(_) && filter(_.startEvent) && _.startEvent.route !== '/split')
          .map(snapshot)
          .filter(_ => _)

        return {
          uuid,
          inverseColors,
          blocks: snapshotBlocks
        }
      })

      const opts = evt.opts || {}

      if (!opts.shallow) {
        await new FlightRecorder(this.props.tab, splits).record()
      }

      const metadata = this.state.notebookMetadata
      // assign options to the snapshot metadata
      Object.keys(opts)
        .filter(_ => _ !== 'shallow' && opts[_] !== undefined)
        .forEach(_ => (metadata[_] = opts[_]))

      const serializedSnapshot: NotebookImpl = {
        apiVersion: 'kui-shell/v1',
        kind: 'Notebook',
        metadata,
        spec: {
          splits
        }
      }

      const replacer = (key: string, value: any) => {
        if (key === 'tab') {
          return undefined
        } else if (key === 'block') {
          return undefined
        } else {
          return value
        }
      }

      const data = JSON.stringify(serializedSnapshot, replacer, 2)
      evt.cb(Buffer.from(data))
    }

    eventBus.onSnapshotRequest(onSnapshot, getTabId(this.props.tab))
    this.cleaners.push(() => eventBus.offSnapshotRequest(onSnapshot, getTabId(this.props.tab)))
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
            historyIdx: -1,
            command: 'welcome',
            completeTime: Date.now(),
            argvNoOptions: ['welcome'],
            parsedOptions: {},
            execOptions: {},
            pipeStages: { stages: [['welcome']] },
            execUUID: '',
            execType: ExecType.TopLevel,
            cancelled: false,
            echo: true,
            evaluatorOptions: {},
            response: { react: announcement },
            responseType: 'ScalarResponse'
          })
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
    }

    return scrollback
  }

  private allocateUUIDForScrollback() {
    // this.props.uuid is the uuid for the whole tab
    // on top of that, we allocate a "v5" uuid for this scrollback
    const sbidx = this.scrollbackCounter++
    const tabPart = this.props.uuid
    const scrollbackPart = v5(sbidx.toString(), UUID_NAMESPACE)
    return `${tabPart}_${scrollbackPart}`
  }

  /** Restore from localStorage for a given tab UUID */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private restoreBlocks(sbuuid: string): BlockModel[] {
    // TODO:
    /* return History(sbuuid)
      .slice(-20)
      .filter(_ => _.execUUID !== undefined && isScalarResponse(_.response) && _.isCurrentlyShown)
      .map(_ => Finished(Processing(Active(), _.raw, _.execUUID), _.response as ScalarResponse, false, _.historyIdx)) */
    return []
  }

  private scrollback(sbuuid = this.allocateUUIDForScrollback(), opts: ScrollbackOptions = {}): ScrollbackState {
    const state: ScrollbackState = {
      uuid: sbuuid,
      cleaners: [],
      forceMiniSplit: false,
      inverseColors: opts.inverseColors,
      showThisIdxInMiniSplit: -2,
      blocks: this.restoreBlocks(sbuuid).concat([Active()]),
      remove: undefined,
      clear: undefined,
      onClick: undefined,
      onMouseDown: undefined,
      onFocus: undefined,
      onOutputRender: undefined,
      navigateTo: undefined,
      setActiveBlock: undefined,
      willFocusBlock: undefined,
      willRemoveBlock: undefined,
      willUpdateCommand: undefined,
      tabRefFor: undefined
    }

    const getBlockIndexFromEvent = (evt: React.SyntheticEvent, doNotComplain = false) => {
      const idxAttr = evt.currentTarget.getAttribute('data-input-count')
      if (!idxAttr) {
        if (!doNotComplain) {
          console.error('Failed to focus, due to missing data-input-count attribute', evt.currentTarget, evt.target)
        }
        return -1
      } else {
        return parseInt(idxAttr, 10)
      }
    }

    state.remove = () => this.removeSplit(sbuuid)
    state.clear = () => this.clear(sbuuid)

    /**
     * For inline-input clients, we want empty-space clicks to steal
     * focus away from the other split, if we are switching splits;
     * otherwise, we don't want empty-space clicks in the focused
     * split to steal focus away from that split's active input
     */
    state.onClick = () => {
      if (getSelectionText().length === 0) {
        this.doFocus(state)
      }
    }

    /**
     * For bottom-input clients, we don't want empty-space clicks to
     * steal focus away from the bottom input
     */
    state.onMouseDown = (evt: React.MouseEvent<HTMLElement>) => {
      evt.preventDefault()
    }

    /** Output.tsx finished rendering something */
    state.onOutputRender = () => {
      if (!this.props.noActiveInput) {
        // if we are using inline input, then scroll to the bottom
        // whenever an output is rendered in this split
        setTimeout(() => state.facade.scrollToBottom())
      }
    }

    /** Update the viewport to show a particular entry */
    state.navigateTo = (dir: 'first' | 'last' | 'previous' | 'next') => {
      this.splice(sbuuid, ({ blocks, showThisIdxInMiniSplit }) => {
        const newIdx =
          dir === 'first'
            ? 0
            : dir === 'last'
            ? -2
            : dir === 'previous'
            ? Math.max(-blocks.length, showThisIdxInMiniSplit - 1)
            : Math.min(-2, showThisIdxInMiniSplit + 1)

        return {
          blocks,
          showThisIdxInMiniSplit: newIdx
        }
      })
    }

    /** Update the active block */
    state.setActiveBlock = (c: Block) => {
      if (c && c.props && c.props.model && isActive(c.props.model)) {
        const split = this.state.splits[this.findSplit(this.state, sbuuid)]
        split._activeBlock = c
      }
    }

    /**
     * User clicked to focus a block.
     *
     * @param uuid scrollback UUID
     * @param focusedBlockIdx index into the ScrollbackState of that scrollback
     *
     */
    state.willFocusBlock = (evt: React.SyntheticEvent) => {
      const sbidx = this.findSplit(this.state, sbuuid)
      if (sbidx >= 0) {
        const idx = getBlockIndexFromEvent(evt)
        evt.stopPropagation()

        const split = typeof sbuuid === 'string' ? this.state.splits[this.findSplit(this.state, sbuuid)] : sbuuid
        this.setFocusOnScrollback(split, idx)
      }
    }

    state.willUpdateCommand = (idx: number, command: string) => {
      return this.splice(sbuuid, curState => {
        const block = Object.assign({}, curState.blocks[idx])
        if (hasCommand(block)) {
          block.command = command
        }
        if (hasStartEvent(block)) {
          block.startEvent.command = command
        }
        if (isWithCompleteEvent(block)) {
          block.completeEvent.command = command
        }

        return {
          blocks: curState.blocks
            .slice(0, idx)
            .concat([block])
            .concat(curState.blocks.slice(idx + 1))
        }
      })
    }

    /** The focus event is coming
     * from the browser, e.g. when the user hits tab to
     * navigate between the <li> of each block */
    state.onFocus = (evt: React.FocusEvent) => {
      const sbidx = this.findSplit(this.state, sbuuid)
      if (sbidx >= 0) {
        const scrollback = this.state.splits[sbidx]
        const idx = getBlockIndexFromEvent(evt)

        if (
          isElement(evt.relatedTarget) &&
          /li/i.test(evt.relatedTarget.tagName) &&
          /li/i.test(evt.target.tagName) &&
          scrollback.focusedBlockIdx !== idx
        ) {
          scrollback.willFocusBlock(evt)
        }
      }
    }

    /** remove the block at the given index */
    state.willRemoveBlock = (evt: React.SyntheticEvent, idx = getBlockIndexFromEvent(evt)) => {
      if (idx >= 0) {
        this.splice(sbuuid, curState => {
          this.removeWatchableBlock(curState.blocks[idx])

          const blocks = curState.blocks
            .slice(0, idx)
            .concat(curState.blocks.slice(idx + 1))
            .concat(this.hasActiveBlock(curState) ? [] : [Active()]) // plus a new block, if needed

          const focusedBlockIdx =
            curState.focusedBlockIdx >= idx ? this.findActiveBlock({ blocks }) : curState.focusedBlockIdx

          return {
            blocks,
            focusedBlockIdx
          }
        })
      }
    }

    state.tabRefFor = (ref: HTMLElement) => {
      const scrollback = state
      if (ref) {
        ref['facade'] = scrollback.facade
        scrollback.facade.getSize = getSize.bind(ref)

        scrollback.facade.splitCount = () => this.state.splits.length
        scrollback.facade.hasSideBySideTerminals = () => {
          return !!this.state.splits.find((_, sbidx) => this.isASideBySide(sbidx))
        }

        scrollback.facade.scrollToBottom = () => {
          ref.scrollTop = ref.scrollHeight
        }

        scrollback.facade.scrollToTop = () => {
          ref.scrollTop = 0
        }

        scrollback.facade.addClass = (cls: string) => {
          ref.classList.add(cls)
        }
        scrollback.facade.removeClass = (cls: string) => {
          ref.classList.remove(cls)
        }
      }
    }

    // prefetch command history; this helps with master history
    History(sbuuid)

    // associate a tab facade with the split
    this.tabFor(state)

    const onTabCloseRequest = async () => {
      // async, to allow for e.g. command completion events to finish
      // propagating to the split before we remove it
      setTimeout(() => this.removeSplit(sbuuid))
    }
    eventBus.onceWithTabId('/tab/close/request', sbuuid, onTabCloseRequest)
    state.cleaners.push(() => eventBus.offWithTabId('/tab/close/request', sbuuid, onTabCloseRequest))

    if (opts.cmdline) {
      setTimeout(() => {
        state.facade.REPL.pexec(opts.cmdline)
      })
    }

    return this.initEvents(state)
  }

  /** @return a reasonable default split */
  private findMainSplit(excludedIndex?: number) {
    return this.state.splits
      .slice()
      .reverse()
      .find((split, idx) => {
        const originalIdx = this.state.splits.length - idx - 1
        return (
          split &&
          !this.isMiniSplit(split, originalIdx) &&
          (excludedIndex === undefined || originalIdx !== excludedIndex)
        )
      })
  }

  /** @return a reasonable default split */
  private get current() {
    return this.findMainSplit()
  }

  /** @return the uuid of a reasonable default split */
  private get currentUUID() {
    const cur = this.current
    return cur ? cur.uuid : undefined
  }

  /** Clear Terminal; TODO: also clear persisted state, when we have it */
  private clear(uuid: string) {
    this.setState(curState => {
      const focusedIdx = this.findSplit(curState, uuid)

      return Object.assign(
        { focusedIdx: focusedIdx < 0 ? curState.focusedIdx : focusedIdx },
        this.spliceMutate(curState, uuid, scrollback => {
          const residualBlocks = scrollback.blocks
            .filter(_ => {
              this.removeWatchableBlock(_)
              return false
            })
            .concat([Active(scrollback._activeBlock ? scrollback._activeBlock.inputValue() : '')])

          return Object.assign(scrollback, {
            blocks: residualBlocks,
            focusedBlockIdx: residualBlocks.length - 1
          })
        })
      )
    })

    if (this.props.onClear) {
      setTimeout(() => this.props.onClear())
    }
  }

  /**
   * For click handlers in minisplits, we want to direct the command
   * execution UI to a plain terminal, if that is possible.
   *
   * @return the sbuuid of a plain split, if the given split is a minisplit, and for a ClickHandler event
   *
   */
  private redirectToPlainSplitIfNeeded(
    sbuuid: string,
    { execType }: Pick<CommandStartEvent | CommandCompleteEvent, 'execType'>
  ): string {
    if (execType === ExecType.ClickHandler) {
      // <-- this is a click handler event
      const idx = this.findSplit(this.state, sbuuid)
      // note: idx may be < 0 if we are executing a command in-flight,
      // e.g. executing a command in another split
      if (idx >= 0 && this.isMiniSplit(this.state.splits[idx], idx)) {
        // <-- this is a minisplit
        const plainSplit = this.findMainSplit()
        if (plainSplit) {
          // <-- we found a plain split!
          return plainSplit.uuid
        }
      }
    }

    // otherwise, we are stuck with what we have
    return sbuuid
  }

  /** the REPL started executing a command */
  public onExecStart(uuid = this.currentUUID, asReplay: boolean, event: CommandStartEvent, insertIdx?: number) {
    if (event.execOptions && event.execOptions.echo === false) {
      return
    }

    const processing = (block: BlockModel) => {
      return [Processing(block, event, event.evaluatorOptions.isExperimental, asReplay)]
    }

    // uuid might be undefined if the split is going away
    if (uuid) {
      uuid = this.redirectToPlainSplitIfNeeded(uuid, event)

      this.splice(uuid, curState => {
        const idx = curState.blocks.length - 1

        if (typeof insertIdx === 'number') {
          // we were asked to splice in the startEvent at a particular index
          return {
            focusedBlockIdx: insertIdx,
            blocks: (insertIdx === 0 ? [] : curState.blocks.slice(0, insertIdx))
              .concat([Processing(Active(), event, event.evaluatorOptions.isExperimental)])
              .concat(curState.blocks.slice(insertIdx))
          }
        }

        const rerunIdx =
          event.execType === ExecType.Rerun
            ? curState.blocks.findIndex(_ => {
                return (
                  (hasOriginalUUID(_) && _.originalExecUUID === event.execUUID) ||
                  (hasUUID(_) && _.execUUID === event.execUUID)
                )
              })
            : -1

        if (event.execType === ExecType.Rerun) {
          if (rerunIdx < 0) {
            console.error(
              'Cannot find block for rerun',
              event.execType === ExecType.Rerun,
              event,
              curState.blocks.map(_ => {
                return (hasOriginalUUID(_) && _.originalExecUUID) || (hasUUID(_) && _.execUUID)
              }),
              curState.blocks
            )
          } else if (isBeingRerun(curState.blocks[rerunIdx])) {
            console.error('Block already being rerun', event)
          }
        }

        if (rerunIdx >= 0) {
          const block = curState.blocks[rerunIdx]
          this.removeWatchableBlock(block)
          // The use case here is that the user clicked the Rerun
          // button in the UI or clicked on an Input and hit Enter. In
          // either case, the command execution will reuse the
          // execUUID, hence the `findIndex` logic just above, which
          // scans the blocks for an existing execUUID. So: we
          // Transform the rerun block to Processing
          return {
            blocks: curState.blocks
              .slice(0, rerunIdx) // everything before
              .concat(isRerunable(block) ? [Rerun(block, event)] : [])
              .concat(curState.blocks.slice(rerunIdx + 1)) // everything after
          }
        } else if (isProcessing(curState.blocks[idx])) {
          // the last block is Processing; this can handle if the user
          // causes a pexec to be sent to a split that is already
          // processing
          return {
            blocks: curState.blocks.concat(processing(Active()))
          }
        } else {
          // Transform the last block to Processing
          const blocks = curState.blocks.slice(0, idx).concat(processing(curState.blocks[idx]))
          return {
            blocks
          }
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

  /** the REPL finished executing a command */
  public async onExecEnd(
    uuid = this.currentUUID,
    asReplay: boolean,
    event: CommandCompleteEvent<ScalarResponse>,
    insertIdx?: number
  ) {
    if (!uuid) return
    else {
      uuid = this.redirectToPlainSplitIfNeeded(uuid, event)
    }

    if (isTabLayoutModificationResponse(event.response)) {
      const updatedResponse = await this.onTabLayoutModificationRequest(event.response, uuid)
      if (updatedResponse) {
        event.response = updatedResponse
      }
    }

    if (event.execOptions && event.execOptions.echo === false) return

    this.splice(uuid, curState => {
      const inProcessIdx = curState.blocks.findIndex(_ => {
        return (
          (isBeingRerun(_) && _.originalExecUUID === event.execUUID) ||
          ((isBeingRerun(_) || isProcessing(_)) && _.execUUID === event.execUUID)
        )
      })

      if (inProcessIdx >= 0) {
        const inProcess = curState.blocks[inProcessIdx]
        if (isProcessing(inProcess) || isBeingRerun(inProcess)) {
          try {
            // note: even if the command registration asked for
            // `outputOnly`, we ignore that if the response is a plain
            // `true`; e.g. the `commentary` controller uses this to
            // indicate an empty comment
            const outputOnly = event.evaluatorOptions && event.evaluatorOptions.outputOnly && event.response !== true

            const blocks = curState.blocks
              .slice(0, inProcessIdx) // everything before
              .concat([Finished(inProcess, event, outputOnly, asReplay)]) // mark as finished
              .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
              .concat(!isBeingRerun(inProcess) && inProcessIdx === curState.blocks.length - 1 ? [Active()] : []) // plus a new block!

            return {
              focusedBlockIdx: insertIdx === undefined ? blocks.length - 1 : insertIdx,
              blocks
            }
          } catch (err) {
            console.error('error updating state', err)
            throw err
          }
        } else {
          console.error('invalid state: got a command completion event for a block that is not processing', event)
        }
      } else if (event.cancelled) {
        // we get here if the user just types ctrl+c without having executed any command. add a new block if needed!
        const inProcessIdx = this.hasActiveBlock(curState) ? this.findActiveBlock(curState) : curState.blocks.length - 1
        const inProcess = curState.blocks[inProcessIdx]
        const blocks = curState.blocks
          .slice(0, inProcessIdx)
          .concat([Cancelled(inProcess, event.command, event)]) // mark as cancelled
          .concat(curState.blocks.slice(inProcessIdx + 1))
          .concat(inProcessIdx === curState.blocks.length - 1 ? [Active()] : []) // plus a new block if needed
        return {
          focusedBlockIdx: blocks.length - 1,
          blocks
        }
      } else {
        console.error('invalid state: got a command completion event, but never got command start event', event)
      }
    })
  }

  /** Only set focus if we haven't, yet */
  public doFocusIfNeeded() {
    if (this.state.focusedIdx < 0) {
      this.doFocus(this.current)
    } else {
      this.doFocus(this.state.splits[this.state.focusedIdx])
    }
  }

  /** Owner wants us to focus on the current prompt */
  private _focusDebouncer: NodeJS.Timeout
  private doFocus(scrollback: ScrollbackState) {
    if (this._focusDebouncer) {
      clearTimeout(this._focusDebouncer)
      this._focusDebouncer = undefined
    }

    const ourDebouncer = setTimeout(() => {
      if (this._focusDebouncer !== ourDebouncer) {
        return
      } else {
        this._focusDebouncer = undefined
      }

      const { _activeBlock } = scrollback

      if (_activeBlock) {
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

      this.setFocusOnScrollback(scrollback)
    }, 10)
    this._focusDebouncer = ourDebouncer
  }

  private async setFocusOnScrollback(scrollback: ScrollbackState, focusedBlockIdx?: number) {
    const focusedIdx = this.findSplit(this.state, scrollback.uuid)
    if (this.state.focusedIdx !== focusedIdx) {
      const currentSplit = this.state.splits[this.state.focusedIdx]
      if (currentSplit && currentSplit.facade) {
        await currentSplit.facade.state.switchTo(scrollback.facade.state)
      } else {
        scrollback.facade.state.restore()
      }
      eventBus.emitSplitSwitch(scrollback.facade)
    }

    this.setState(curState => {
      return Object.assign(
        this.spliceMutate(curState, scrollback.uuid, ({ blocks }) => ({
          blocks,
          focusedBlockIdx: focusedBlockIdx !== undefined && focusedBlockIdx >= 0 ? focusedBlockIdx : blocks.length - 1
        })),
        { focusedIdx }
      )
    })
  }

  /**
   * Handle CommandStart/Complete events directed at the given
   * scrollback region.
   *
   */
  private hookIntoREPL(state: ScrollbackState) {
    const onStartForSplitFromUser = this.onExecStart.bind(this, state.uuid, false)
    const onStartForSplitFromReplay = this.onExecStart.bind(this, state.uuid, true)

    const onCompleteForSplitFromUser = this.onExecEnd.bind(this, state.uuid, false)
    const onCompleteForSplitFromReplay = this.onExecEnd.bind(this, state.uuid, true)

    eventBus.onCommandStart(state.uuid, onStartForSplitFromUser)
    eventBus.onCommandStart(state.uuid, onStartForSplitFromReplay, true)

    eventBus.onCommandComplete(state.uuid, onCompleteForSplitFromUser)
    eventBus.onCommandComplete(state.uuid, onCompleteForSplitFromReplay, true)

    state.cleaners.push(() => eventBus.offCommandStart(state.uuid, onStartForSplitFromUser))
    state.cleaners.push(() => eventBus.offCommandStart(state.uuid, onStartForSplitFromReplay))
    state.cleaners.push(() => eventBus.offCommandComplete(state.uuid, onCompleteForSplitFromUser))
    state.cleaners.push(() => eventBus.offCommandComplete(state.uuid, onCompleteForSplitFromReplay))
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

    // terminate watchable jobs when the window is closed
    const termAll = this.terminateAllWatchables.bind(this)
    window.addEventListener('beforeunload', termAll)
    this.cleaners.push(() => window.removeEventListener('beforeunload', termAll))

    return state
  }

  /** A controller has requested a tab layout modification */
  private onTabLayoutModificationRequest(request: TabLayoutModificationResponse, sbuuid: string) {
    if (isNewSplitRequest(request)) {
      return this.onSplit(request, sbuuid)
    }
  }

  /** Split the view */
  private async onSplit(request: TabLayoutModificationResponse<NewSplitRequest>, sbuuid: string) {
    const nTerminals = this.state.splits.length

    if (request.spec.options.cmdline && (request.spec.options.if || request.spec.options.ifnot)) {
      const thisSplitIdx = this.findSplit(this.state, sbuuid)
      const thisSplit = this.state.splits[thisSplitIdx]

      const respIf = !request.spec.options.if
        ? true
        : await thisSplit.facade.REPL.qexec<boolean>(request.spec.options.if).catch(() => false)

      const respIfNot = !request.spec.options.ifnot
        ? true
        : !(await thisSplit.facade.REPL.qexec<boolean>(request.spec.options.ifnot).catch(() => true))

      if (!respIf || !respIfNot) {
        const { cmdline } = request.spec.options
        const mainSplit = this.findMainSplit(thisSplitIdx) || thisSplit
        request.spec.options.cmdline = undefined // null this out, since we got it!
        mainSplit.facade.REPL.pexec(cmdline)

        return
      }
    }

    if (nTerminals === MAX_TERMINALS) {
      return new Error(strings('No more splits allowed'))
    } else {
      const newScrollback = this.scrollback(undefined, request.spec.options)

      this.setState(({ splits }) => {
        // this says: 1) place the split at the end; and 2) focus the
        // new split
        const insertIdx =
          request.spec.options && request.spec.options.index !== undefined ? request.spec.options.index : splits.length
        const newFocusedIdx = insertIdx

        const newSplits = splits
          .slice(0, insertIdx)
          .concat(newScrollback)
          .concat(splits.slice(insertIdx))

        eventBus.emitTabLayoutChange(sbuuid, {
          isSidecarNowHidden: false,
          isWidthConstrained: this.isWidthConstrained(newScrollback, insertIdx)
        })

        return {
          focusedIdx: newFocusedIdx,
          splits: newSplits
        }
      })

      return request.spec.ok
    }
  }

  /** Detach hooks that might have been registered */
  private uninitEvents() {
    // clean up per-split event handlers
    this.state.splits.forEach(({ cleaners }) => {
      cleaners.forEach(cleaner => cleaner())
    })

    this.cleaners.forEach(cleaner => cleaner())
  }

  public componentWillUnmount() {
    this.uninitEvents()
    this.terminateAllWatchables()
  }

  /**
   * @return the index of the given scrollback, in the context of the
   * current (given) state
   *
   */
  public findSplit(curState: State, uuid: string): number {
    return curState.splits.findIndex(_ => _.uuid === uuid)
  }

  /**
   * @return the index of the given scrollback, in the context of the
   * current (given) state
   *
   */
  private findAvailableSplit(curState: State, uuid: string): number {
    const focusedIdx = this.findSplit(curState, uuid)
    const availableSplitIdx = focusedIdx !== -1 ? focusedIdx : 0

    return availableSplitIdx
  }

  /** If the block has watchable response, abort the job */
  private removeWatchableBlock(block: BlockModel) {
    if (isOk(block)) {
      if (isWatchable(block.response)) {
        block.response.watch.abort()
      } else if (isAbortableResponse(block.response)) {
        block.response.abort()
      }
    }
  }

  /** As per `removeWatchableBlock`, but for all blocks */
  private terminateAllWatchables() {
    this.state.splits.forEach(scrollback => {
      scrollback.blocks.forEach(_ => this.removeWatchableBlock(_))
    })
  }

  /**
   * Remove the given split (identified by `sbuuid`) from the state.
   *
   */
  private removeSplit(sbuuid: string) {
    this.setState(curState => {
      eventBus.emitTabLayoutChange(sbuuid)

      const idx = this.findSplit(this.state, sbuuid)
      if (idx >= 0) {
        if (idx === curState.splits.length - 1) {
          // If we are removing the last split, we can safely
          // decrement the running counter. The reordering problem
          // described in the `scrollbackCounter` comment above does
          // not occur when removing the last split
          this.scrollbackCounter--
        }

        // remove any watchers from the blocks of the split we are
        // about to remove
        curState.splits[idx].blocks.forEach(this.removeWatchableBlock)

        // clean up per-split event handlers
        curState.splits[idx].cleaners.forEach(cleaner => cleaner())

        // splice out this split from the list of all splits in this tab
        const splits = curState.splits.slice(0, idx).concat(curState.splits.slice(idx + 1))

        if (splits.length === 0) {
          // the last split was removed; notify parent
          const parent = this.props.tab
          eventBus.emitWithTabId('/tab/close/request', parent.uuid, parent)
        }

        const focusedIdx = idx === 0 ? 0 : idx - 1

        if (splits.length === 1) {
          eventBus.emitTabLayoutChange(splits[focusedIdx].uuid, {
            isSidecarNowHidden: false,
            isWidthConstrained: false
          })
        }

        return { splits, focusedIdx }
      }
    })

    setTimeout(() => eventChannelUnsafe.emit('/zoom'))
  }

  /**
   * Splice in an update to the given split (identified by `sbuuid`),
   * using the giving ScrollbackState mutator.
   *
   */
  private splice(sbuuid: string, mutator: (state: ScrollbackState) => Pick<ScrollbackState, 'blocks'>) {
    this.setState(curState => this.spliceMutate(curState, sbuuid, mutator))
  }

  /** Helper for splice; i.e. splice() does the setState, while this method does them mutate */
  private spliceMutate(
    curState: State,
    sbuuid: string,
    mutator: (state: ScrollbackState) => Pick<ScrollbackState, 'blocks'>
  ): Pick<State, 'splits'> {
    const focusedIdx = this.findAvailableSplit(curState, sbuuid)
    const splits = curState.splits
      .slice(0, focusedIdx)
      .concat([Object.assign({}, curState.splits[focusedIdx], mutator(curState.splits[focusedIdx]))])
      .concat(curState.splits.slice(focusedIdx + 1))

    return {
      splits
    }
  }

  /** whether the given scrollback has Active Block */
  private hasActiveBlock(scrollback: ScrollbackState) {
    return scrollback.blocks.findIndex(b => isActive(b)) > -1
  }

  /** return the index of the Active Block from a scrollback */
  private findActiveBlock({ blocks }: Pick<ScrollbackState, 'blocks'>) {
    return blocks.findIndex(b => isActive(b))
  }

  private isASideBySide(sbidx: number) {
    return this.theseAreSideBySide[this.state.splits.length][sbidx]
  }

  private tabFor(scrollback: ScrollbackState): KuiTab {
    if (!scrollback.facade) {
      const { uuid } = scrollback
      let facade: KuiTab // eslint-disable-line prefer-const

      const focusedSplit = this.state ? this.state.splits[this.state.focusedIdx] : undefined
      const focusedState = (focusedSplit && focusedSplit.facade && focusedSplit.facade.state) || this.props.tab.state

      const tabFacade = Object.assign({}, this.props.tab, {
        // clone tab state
        state: focusedState.cloneWithUUID(uuid),

        // create a REPL controller that uses our uuid
        REPL: Object.assign({}, this.props.tab.REPL, {
          pexec: (command: string, execOptions?: ExecOptions) => {
            return this.props.tab.REPL.pexec(command, Object.assign({ tab: facade }, execOptions))
          },
          reexec: (command: string, execOptions: ExecOptionsWithUUID) => {
            return this.props.tab.REPL.reexec(command, Object.assign({ tab: facade }, execOptions))
          },
          rexec: (command: string, execOptions?: ExecOptions) => {
            return this.props.tab.REPL.rexec(command, Object.assign({ tab: facade }, execOptions))
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

  /**
   * This map keeps track of which split indices are minisplits. The
   * primary index is the current split count. That gives an array
   * which indicates whether the given scrollback index is a
   * minisplit.
   *
   * NOTE: minsplits are disable for now; see: https://github.com/kubernetes-sigs/kui/issues/7307
   */
  private readonly theseAreMiniSplits = {
    1: [false], // 1 split, not-minisplit
    2: [false, false], // 2 splits, both not-minisplit
    3: [false, false, false], // etc.
    4: [false, false, false, false],
    5: [false, false, false, false, false],
    6: [false, false, false, false, false, false],
    7: [false, false, false, false, false, false, false],
    8: [false, false, false, false, false, false, false, false]
  }

  /**
   * Same, but keeping track of when we have two splits arranged
   * horizontally side-by-side.
   *
   */
  private readonly theseAreSideBySide = {
    1: [false], // 1 split, not-minisplit
    2: [true, true], // 2 splits, both not-minisplit
    3: [true, true, false], // etc.
    4: [true, true, true, true],
    5: [true, true, true, true, true],
    6: [true, true, true, true, true, true],
    7: [true, true, true, true, true, true, true],
    8: [true, true, true, true, true, true, true, true]
  }

  /** Present the given scrollback as a minisplit? */
  private isMiniSplit(scrollback: ScrollbackState, sbidx: number) {
    return scrollback.forceMiniSplit || this.theseAreMiniSplits[this.state.splits.length][sbidx] || undefined
  }

  /** Is this scrollback not-100% width? */
  private isWidthConstrained(scrollback: ScrollbackState, sbidx: number) {
    return this.props.config.isPopup || this.isMiniSplit(scrollback, sbidx) || this.isASideBySide(sbidx)
  }

  /** Render the blocks in one split */
  private blocks(tab: KuiTab, scrollback: ScrollbackState, sbidx: number) {
    const blocks = scrollback.blocks
    const nBlocks = blocks.length

    const isMiniSplit = this.isMiniSplit(scrollback, sbidx)
    const isWidthConstrained = this.isWidthConstrained(scrollback, sbidx)

    // running tally for In[_idx_]
    let displayedIdx = 0

    return blocks.map((_, idx) => {
      if (!isAnnouncement(_) && !isOutputOnly(_)) {
        displayedIdx++
      }

      if (isMiniSplit) {
        const isVisibleInMiniSplit =
          isActive(_) ||
          isProcessing(_) ||
          (scrollback.showThisIdxInMiniSplit >= 0
            ? idx === scrollback.showThisIdxInMiniSplit
            : idx === scrollback.showThisIdxInMiniSplit + nBlocks)

        if (!isVisibleInMiniSplit) {
          return
        }
      }

      /** To find the focused block, we check:
       *  1. the block is in a focused scrollback
       *  2. the block idx matches scrollback.focusedBlockIdx (considering blocks that were hidden)
       *  3. return the active block if there's no scrollback.focusedBlockIdx */
      const isFocused =
        sbidx === this.state.focusedIdx &&
        (idx === scrollback.focusedBlockIdx ||
          (scrollback.focusedBlockIdx === undefined && idx === this.findActiveBlock(scrollback)))

      return (
        <Block
          key={hasUUID(_) ? _.execUUID : `${idx}-${isActive(_)}-${isCancelled(_)}`}
          idx={idx}
          displayedIdx={displayedIdx}
          model={_}
          isBeingRerun={isBeingRerun(_)}
          uuid={scrollback.uuid}
          tab={tab}
          nSplits={this.state.splits.length}
          noActiveInput={this.props.noActiveInput || isOfflineClient()}
          onFocus={scrollback.onFocus}
          willRemove={scrollback.willRemoveBlock}
          willFocusBlock={scrollback.willFocusBlock}
          willUpdateCommand={scrollback.willUpdateCommand}
          isExperimental={hasCommand(_) && _.isExperimental}
          isFocused={isFocused}
          isPartOfMiniSplit={isMiniSplit}
          isVisibleInMiniSplit={true}
          isWidthConstrained={isWidthConstrained}
          onOutputRender={scrollback.onOutputRender}
          navigateTo={scrollback.navigateTo}
          ref={scrollback.setActiveBlock}
        />
      )
    })
  }

  /** Render one split */
  private split(scrollback: ScrollbackState, sbidx: number) {
    const tab = this.tabFor(scrollback)
    const isMiniSplit = this.isMiniSplit(scrollback, sbidx)
    const isWidthConstrained = this.isWidthConstrained(scrollback, sbidx)

    return (
      <div
        className={'kui--scrollback' + (scrollback.inverseColors ? ' kui--inverted-color-context' : '')}
        data-is-minisplit={isMiniSplit}
        data-is-width-constrained={isWidthConstrained || undefined}
        data-is-focused={sbidx === this.state.focusedIdx || undefined}
        key={tab.uuid}
        data-scrollback-id={tab.uuid}
        ref={scrollback.tabRefFor}
        onClick={!this.props.noActiveInput ? scrollback.onClick : undefined}
        onMouseDown={this.props.noActiveInput ? scrollback.onMouseDown : undefined}
      >
        <React.Fragment>
          {this.state.splits.length > 1 && <SplitHeader onRemove={scrollback.remove} onClear={scrollback.clear} />}
          <ul className="kui--scrollback-block-list">
            <div className="kui--scrollback-block-list-for-sizing">{this.blocks(tab, scrollback, sbidx)}</div>
          </ul>
        </React.Fragment>
      </div>
    )
  }

  public render() {
    return (
      <div className="repl" id="main-repl">
        <div className="repl-inner zoomable kui--terminal-split-container" data-split-count={this.state.splits.length}>
          {this.state.splits.map((scrollback, sbidx) => this.split(scrollback, sbidx))}
        </div>
      </div>
    )
  }
}
