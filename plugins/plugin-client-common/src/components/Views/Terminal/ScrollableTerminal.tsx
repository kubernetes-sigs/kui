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

import { v5 } from 'uuid'
import React from 'react'

import {
  i18n,
  eventBus,
  eventChannelUnsafe,
  ScalarResponse,
  Tab as KuiTab,
  ExecOptions,
  ExecType,
  isPopup,
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

import Block from './Block'
import getSize from './getSize'
import Width from '../Sidecar/width'
import { NotebookImpl, isNotebookImpl, snapshot, FlightRecorder, tabAlignment } from './Snapshot'
import KuiConfiguration from '../../Client/KuiConfiguration'
import { onCopy, onCut, onPaste } from './ClipboardTransfer'
import {
  Active,
  Finished,
  Announcement,
  Cancelled,
  Processing,
  isActive,
  isHidden,
  isOk,
  isOutputOnly,
  isProcessing,
  isPresentedElsewhere,
  hasStartEvent,
  hasCommand,
  hasUUID,
  BlockModel
} from './Block/BlockModel'

import isInViewport from './visible'
import '../../../../web/scss/components/Terminal/_index.scss'

const strings = i18n('plugin-client-common')

type Cleaner = () => void

/** Hard limit on the number of Terminal splits */
const MAX_TERMINALS = 5

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

  sidecarWidth: Width
  closeSidecar: () => void
}

interface ScrollbackOptions {
  /** use inverse colors in this split? */
  inverseColors?: boolean
}

type ScrollbackState = ScrollbackOptions & {
  uuid: string
  blocks: BlockModel[]
  nAnnouncements: number
  forceMiniSplit: boolean

  /** tab facade */
  facade?: KuiTab

  /** grab a ref to the active block, to help us maintain focus */
  _activeBlock?: Block

  /** Has the user clicked to focus on a block? */
  focusedBlockIdx?: number

  /** cleanup routines for this split */
  cleaners: Cleaner[]

  /**
   * Block index (into this.blocks) to show in a MiniSplit. Must be a
   * negative number, interpreted as an index from the end.
   */
  showThisIdxInMiniSplit: number
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

    const { name, description, splits } = this.props.snapshot
      ? this.replaySnapshot()
      : { name: this.props.tabTitle, description: '', splits: [this.scrollbackWithWelcome()] }

    this.state = {
      focusedIdx: -1,
      splits,
      notebookMetadata: { name, description }
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

        if (model.spec.preferReExecute) {
          promiseEach(split.blocks, async _ => {
            if (hasStartEvent(_)) {
              await newScrollback.facade.REPL.pexec(_.startEvent.command)
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
        name: model.metadata.name,
        description: model.metadata.description
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

      const serializedSnapshot: NotebookImpl = {
        apiVersion: 'kui-shell/v1',
        kind: 'Notebook',
        metadata: {
          name: opts.name || this.state.notebookMetadata.name,
          description: opts.description || this.state.notebookMetadata.description
        },
        spec: {
          splits,
          preferReExecute: opts.preferReExecute
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

          scrollback.nAnnouncements++
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
    if (this.props.config.splitTerminals && !isPopup()) {
      // this.props.uuid is the uuid for the whole tab
      // on top of that, we allocate a "v5" uuid for this scrollback
      const sbidx = this.scrollbackCounter++
      const tabPart = this.props.uuid
      const scrollbackPart = v5(sbidx.toString(), UUID_NAMESPACE)
      return `${tabPart}_${scrollbackPart}`
    } else {
      return this.props.uuid
    }
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

  /** is there any block before the given block index */
  private hasBlockBefore(idx: number): boolean {
    return idx > 0
  }

  /** is there any block (except the active input block) after the given block index */
  private hasBlockAfter(blocks: BlockModel[], idx: number): boolean {
    return idx < blocks.length - 2
  }

  private scrollback(sbuuid = this.allocateUUIDForScrollback(), opts: ScrollbackOptions = {}): ScrollbackState {
    const state: ScrollbackState = {
      uuid: sbuuid,
      cleaners: [],
      forceMiniSplit: false,
      nAnnouncements: 0,
      inverseColors: opts.inverseColors,
      showThisIdxInMiniSplit: -2,
      blocks: this.restoreBlocks(sbuuid).concat([Active()])
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

    return this.initEvents(state)
  }

  /** @return a reasonable default split */
  private get current() {
    return this.state.splits.find((split, idx) => split && !this.isMiniSplit(split, idx))
  }

  /** @return the uuid of a reasonable default split */
  private get currentUUID() {
    const cur = this.current
    return cur ? cur.uuid : undefined
  }

  /** Clear Terminal; TODO: also clear persisted state, when we have it */
  private clear(uuid: string) {
    if (this.props.onClear) {
      this.props.onClear()
    }

    // if we want to close the sidecar, too:
    /* if (this.props.closeSidecar) {
      this.props.closeSidecar()
    } */

    this.splice(uuid, scrollback => {
      const residualBlocks = scrollback.blocks
        .filter(_ => {
          // rule 1: when clearing, we want to keep the last active block
          // const isLastActiveBlock = isActive(_) && idx === scrollback.blocks.length - 1

          // rule 2: when clearing, we want to keep any "created split"
          // blocks for splits that are still around!
          const isPertainingToLiveSplit =
            isOk(_) &&
            isTabLayoutModificationResponse(_.response) &&
            isNewSplitRequest(_.response) &&
            this.findSplit(this.state, _.response.spec.ok.props.tabUUID) >= 0

          const keepIt = /* isLastActiveBlock || */ isPertainingToLiveSplit

          if (!keepIt) {
            this.removeWatchableBlock(_)
          }

          return keepIt
        })
        .concat([Active(scrollback._activeBlock ? scrollback._activeBlock.inputValue() : '')])

      return Object.assign(scrollback, {
        blocks: residualBlocks,
        focusedBlockIdx: residualBlocks.length - 1
      })
    })
  }

  /** is the block presented as a breadcrumb? */
  private isBreadcrumb(block: BlockModel) {
    return isOk(block) && (isTabLayoutModificationResponse(block.response) || isPresentedElsewhere(block))
  }

  /** Output.tsx finished rendering something */
  private onOutputRender(scrollback: ScrollbackState, idx) {
    const block = scrollback.blocks[idx]
    if (this.isBreadcrumb(block)) {
      // no scroll to bottom for these responses
    } else {
      setTimeout(() => scrollback.facade.scrollToBottom())
    }
  }

  /** the REPL started executing a command */
  public onExecStart(uuid = this.currentUUID, asReplay: boolean, event: CommandStartEvent, insertIdx?: number) {
    if (event.echo !== false && isPopup() && this.isSidecarVisible()) {
      // see https://github.com/IBM/kui/issues/4183
      this.props.closeSidecar()
    }

    const processing = (block: BlockModel, asRerun = false) => {
      return [Processing(block, event, event.evaluatorOptions.isExperimental, asRerun, asReplay)]
    }

    // uuid might be undefined if the split is going away
    if (uuid) {
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
        } else if (isProcessing(curState.blocks[idx])) {
          // the last block is Processing; this can handle if the user
          // causes a pexec to be sent to a split that is already
          // processing
          return {
            blocks: curState.blocks.concat(processing(Active()))
          }
        }

        const rerunIdx = curState.blocks.findIndex(_ => hasUUID(_) && _.execUUID === event.execUUID)

        if (rerunIdx >= 0) {
          // The use case here is that the user clicked the Rerun
          // button in the UI or clicked on an Input and hit Enter. In
          // either case, the command execution will reuse the
          // execUUID, hence the `findIndex` logic just above, which
          // scans the blocks for an existing execUUID. So: we
          // Transform the rerun block to Processing
          return {
            blocks: curState.blocks
              .slice(0, rerunIdx) // everything before
              .concat(processing(curState.blocks[rerunIdx], true))
              .concat(curState.blocks.slice(rerunIdx + 1)) // everything after
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
  public onExecEnd(
    uuid = this.currentUUID,
    asReplay: boolean,
    event: CommandCompleteEvent<ScalarResponse>,
    insertIdx?: number
  ) {
    if (!uuid) return

    if (isTabLayoutModificationResponse(event.response)) {
      const updatedResponse = this.onTabLayoutModificationRequest(event.response)
      if (updatedResponse) {
        event.response = updatedResponse
      }
    }

    this.splice(uuid, curState => {
      const inProcessIdx = curState.blocks.findIndex(_ => isProcessing(_) && _.execUUID === event.execUUID)

      if (inProcessIdx >= 0) {
        const inProcess = curState.blocks[inProcessIdx]
        if (isProcessing(inProcess)) {
          try {
            const prefersTerminalPresentation =
              (event.evaluatorOptions && event.evaluatorOptions.alwaysViewIn === 'Terminal') ||
              (event.execOptions && event.execOptions.alwaysViewIn === 'Terminal')

            // note: even if the command registration asked for
            // `outputOnly`, we ignore that if the response is a plain
            // `true`; e.g. the `commentary` controller uses this to
            // indicate an empty comment
            const outputOnly = event.evaluatorOptions && event.evaluatorOptions.outputOnly && event.response !== true

            const blocks = curState.blocks
              .slice(0, inProcessIdx) // everything before
              .concat([Finished(inProcess, event, prefersTerminalPresentation, outputOnly, asReplay)]) // mark as finished
              .concat(curState.blocks.slice(inProcessIdx + 1)) // everything after
              .concat(!inProcess.isRerun && inProcessIdx === curState.blocks.length - 1 ? [Active()] : []) // plus a new block!

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
          .concat([Cancelled(inProcess, event.command)]) // mark as cancelled
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

  /** Owner wants us to focus on the current prompt */
  private _focusDebouncer: NodeJS.Timeout
  public doFocus(scrollback = this.current, idx = this.state.focusedIdx) {
    if (this.state.focusedIdx >= 0 && idx === this.state.focusedIdx) {
      return
    }

    if (this._focusDebouncer) {
      clearTimeout(this._focusDebouncer)
      this._focusDebouncer = undefined
    }

    const ourDebouncer = setTimeout(() => {
      if (this._focusDebouncer !== ourDebouncer || (this.state.focusedIdx >= 0 && idx === this.state.focusedIdx)) {
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

  /**
   * User clicked to focus a block.
   *
   * @param uuid scrollback UUID
   * @param focusedBlockIdx index into the ScrollbackState of that scrollback
   *
   */
  private doFocusBlock(evt: React.SyntheticEvent, sbuuid: string | ScrollbackState, focusedBlockIdx: number) {
    evt.stopPropagation()

    const split = typeof sbuuid === 'string' ? this.state.splits[this.findSplit(this.state, sbuuid)] : sbuuid
    this.setFocusOnScrollback(split, focusedBlockIdx)
  }

  private setFocusOnScrollback(scrollback: ScrollbackState, focusedBlockIdx?: number) {
    this.setState(curState => {
      const focusedIdx = this.findSplit(curState, scrollback.uuid)
      if (curState.focusedIdx !== focusedIdx) {
        const currentSplit = curState.splits[curState.focusedIdx]
        if (currentSplit && currentSplit.facade) {
          currentSplit.facade.state.capture()
        }
        scrollback.facade.state.restore()
        eventBus.emitSplitSwitch(scrollback.facade)
      }

      return Object.assign(
        this.spliceMutate(curState, scrollback.uuid, ({ blocks }) => ({
          blocks,
          focusedBlockIdx: focusedBlockIdx !== undefined ? focusedBlockIdx : blocks.length - 1
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

    return state
  }

  /** A controller has requested a tab layout modification */
  private onTabLayoutModificationRequest(request: TabLayoutModificationResponse) {
    if (isNewSplitRequest(request)) {
      return this.onSplit(request)
    }
  }

  /** Split the view */
  private onSplit(request: TabLayoutModificationResponse<NewSplitRequest>) {
    const nTerminals = this.state.splits.length

    if (nTerminals === MAX_TERMINALS) {
      return new Error(strings('No more splits allowed'))
    } else {
      const newScrollback = this.scrollback(undefined, request.spec.options)
      request.spec.ok.props.tab = () => newScrollback.facade
      request.spec.ok.props.tabUUID = newScrollback.uuid

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

        eventBus.emitTabLayoutChange(this.props.tab.uuid)

        return {
          focusedIdx: newFocusedIdx,
          splits: newSplits
        }
      })
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
  }

  private onClick(scrollback: ScrollbackState) {
    /* if (document.activeElement === document.body && !getSelection().toString()) {
      this.doFocus(scrollback)
    } else */ if (
      getSelectionText().length === 0
    ) {
      this.setFocusOnScrollback(scrollback)
    }
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
      eventBus.emitTabLayoutChange(this.props.tab.uuid)

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
        const splits1 = curState.splits.slice(0, idx).concat(curState.splits.slice(idx + 1))

        // update other splits to remove any "created split" messages
        // that pertain to the split that we are about to remove
        const splits = splits1.map(scrollback => {
          // filter out the relevant "created split" blocks
          const blocks = scrollback.blocks.filter(_ => {
            const isPertainingToThisSplit =
              isOk(_) &&
              isTabLayoutModificationResponse(_.response) &&
              isNewSplitRequest(_.response) &&
              _.response.spec.ok.props.tabUUID === sbuuid

            return !isPertainingToThisSplit
          })

          // did we filter any blocks out?
          const removedSomething = blocks.length !== scrollback.blocks.length

          return Object.assign({}, scrollback, {
            blocks,
            focusedBlockIdx: removedSomething ? blocks.length - 1 : scrollback.focusedBlockIdx
          })
        })

        if (splits.length === 0) {
          // the last split was removed; notify parent
          const parent = this.props.tab
          eventBus.emitWithTabId('/tab/close/request', parent.uuid, parent)
        }

        return { splits, focusedIdx: idx === 0 ? 0 : idx - 1 }
      }
    })
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

  /** insert an active block before the given idx */
  private willInsertBlock(uuid: string, idx: number) {
    this.splice(uuid, curState => {
      return {
        blocks: curState.blocks
          .slice(0, idx)
          .concat([Active()])
          .concat(curState.blocks.slice(idx))
      }
    })
  }

  /** remove the block at the given index */
  public willRemoveBlock(uuid: string, idx: number) {
    this.splice(uuid, curState => {
      this.removeWatchableBlock(curState.blocks[idx])

      return {
        blocks: curState.blocks
          .slice(0, idx)
          .concat(curState.blocks.slice(idx + 1))
          .concat(this.hasActiveBlock(curState) ? [] : [Active()]) // plus a new block, if needed
      }
    })
  }

  /** whether the given scrollback has Active Block */
  private hasActiveBlock(scrollback: ScrollbackState) {
    return scrollback.blocks.findIndex(b => isActive(b)) > -1
  }

  /** return the index of the Active Block from a scrollback */
  private findActiveBlock(scrollback: ScrollbackState) {
    return scrollback.blocks.findIndex(b => isActive(b))
  }

  private tabRefFor(scrollback: ScrollbackState, ref: HTMLElement) {
    if (ref) {
      ref['facade'] = scrollback.facade
      scrollback.facade.getSize = getSize.bind(ref)

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

  /** Present the given scrollback as a minisplit? */
  private isMiniSplit(scrollback: ScrollbackState, sbidx: number) {
    return (
      scrollback.forceMiniSplit || (this.state.splits.length > 2 && sbidx < this.state.splits.length - 1) || undefined
    )
  }

  /** Is the sidecar currently visible? */
  private isSidecarVisible() {
    return this.props.sidecarWidth !== Width.Closed
  }

  /** Render sidecar */
  private sidecar() {
    return (
      <span className="kui--full-height kui--sidecar-container" data-visible={this.isSidecarVisible() || undefined}>
        {this.props.children}
      </span>
    )
  }

  /** Update the viewport to show a particular entry */
  private navigateTo(scrollback: ScrollbackState, dir: 'first' | 'last' | 'previous' | 'next') {
    this.splice(scrollback.uuid, ({ blocks, showThisIdxInMiniSplit }) => {
      const newIdx =
        dir === 'first'
          ? 0
          : dir === 'last'
          ? -2
          : dir === 'previous'
          ? Math.max(-scrollback.blocks.length, showThisIdxInMiniSplit - 1)
          : Math.min(-2, showThisIdxInMiniSplit + 1)

      return {
        blocks,
        showThisIdxInMiniSplit: newIdx
      }
    })
  }

  public render() {
    const nTerminals = this.state.splits.length

    return (
      <div className={'repl' + (this.isSidecarVisible() ? ' sidecar-visible' : '')} id="main-repl">
        <div
          className="repl-inner zoomable kui--terminal-split-container"
          data-split-count={nTerminals}
          data-sidecar={!this.isSidecarVisible() ? undefined : this.props.sidecarWidth}
        >
          {this.state.splits.map((scrollback, sbidx) => {
            const tab = this.tabFor(scrollback)
            const isMiniSplit = this.isMiniSplit(scrollback, sbidx)
            const isWidthConstrained = isMiniSplit || this.isSidecarVisible() || this.state.splits.length > 1

            const blocks = scrollback.blocks.filter(_ => !isHidden(_) && !(isMiniSplit && this.isBreadcrumb(_)))
            const nBlocks = blocks.length
            const showThisIdxInMiniSplit =
              scrollback.showThisIdxInMiniSplit < 0
                ? nBlocks + scrollback.showThisIdxInMiniSplit
                : scrollback.showThisIdxInMiniSplit

            // nOutputOnlyBlocks records the indices of commentary blocks
            const nOutputOnlyBlocks = blocks
              .map((_, idx) => {
                if (isOutputOnly(_)) {
                  return idx
                }
              })
              .filter(_ => _ !== undefined)

            const findDisplayedIdx = (idx: number) => {
              const idxWithAnnouncements = idx - scrollback.nAnnouncements + 1
              const nOutputOnlyBlocksSofar = nOutputOnlyBlocks.filter(x => x < idx).length
              return idxWithAnnouncements - nOutputOnlyBlocksSofar
            }

            return React.createElement(
              'ul',
              {
                className:
                  'kui--scrollback scrollable scrollable-auto' +
                  (scrollback.inverseColors ? ' kui--inverted-color-context' : ''),
                'data-is-minisplit': isMiniSplit,
                'data-is-width-constrained': isWidthConstrained || undefined,
                key: tab.uuid,
                'data-scrollback-id': tab.uuid,
                ref: ref => this.tabRefFor(scrollback, ref),
                onClick: this.onClick.bind(this, scrollback)
              },

              blocks.map((_, idx) => {
                const isFocused =
                  sbidx === this.state.focusedIdx &&
                  (idx === scrollback.focusedBlockIdx ||
                    (scrollback.focusedBlockIdx === undefined && idx === this.findActiveBlock(scrollback)))

                /** Interior view wants to focus this block based on non-browser activity */
                const willFocusBlock = (evt: React.SyntheticEvent) => {
                  this.doFocusBlock(evt, scrollback, idx)
                }

                /** Similar, but in this case, the event is coming
                 * from the browser, e.g. when the user hits tab to
                 * navigate between the <li> of each block */
                const userHitTabToChangeBlockFocus = (evt: React.FocusEvent) => {
                  if (
                    isElement(evt.relatedTarget) &&
                    /li/i.test(evt.relatedTarget.tagName) &&
                    /li/i.test(evt.target.tagName) &&
                    scrollback.focusedBlockIdx !== idx
                  ) {
                    willFocusBlock(evt)
                  }
                }

                return (
                  <Block
                    key={(hasUUID(_) ? _.execUUID : _.state) + `-${idx}-isPartOfMiniSplit=${isMiniSplit}`}
                    idx={idx}
                    displayedIdx={findDisplayedIdx(idx)}
                    model={_}
                    uuid={scrollback.uuid}
                    tab={tab}
                    noActiveInput={this.props.noActiveInput || isOfflineClient()}
                    onOutputRender={this.onOutputRender.bind(this, scrollback, idx)}
                    onFocus={userHitTabToChangeBlockFocus}
                    willInsertBlock={this.willInsertBlock.bind(this, scrollback.uuid, idx)}
                    willRemove={this.willRemoveBlock.bind(this, scrollback.uuid, idx)}
                    hasBlockAfter={this.hasBlockAfter(scrollback.blocks, idx)}
                    hasBlockBefore={this.hasBlockBefore(idx)}
                    willLoseFocus={() => this.doFocus(scrollback, idx)}
                    willFocusBlock={willFocusBlock}
                    isExperimental={hasCommand(_) && _.isExperimental}
                    isFocused={isFocused}
                    prefersTerminalPresentation={isOk(_) && _.prefersTerminalPresentation}
                    isPartOfMiniSplit={isMiniSplit}
                    isVisibleInMiniSplit={idx === showThisIdxInMiniSplit || idx === nBlocks - 1}
                    isWidthConstrained={isWidthConstrained}
                    navigateTo={this.navigateTo.bind(this, scrollback)}
                    ref={c => {
                      if (idx === this.findActiveBlock(scrollback)) {
                        // grab a ref to the active block, to help us maintain focus
                        scrollback._activeBlock = c
                      }
                    }}
                  />
                )
              })
            )
          })}

          {this.sidecar()}
        </div>
      </div>
    )
  }
}
