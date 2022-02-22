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

import SplitInjector, { InjectorOptions } from './SplitInjector'

import {
  Events,
  i18n,
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
  isNewSplitRequest,
  isExecutableClient,
  isWatchable,
  isCommentaryResponse
} from '@kui-shell/core'

import ScrollbackState, { ScrollbackOptions, Cleaner } from './ScrollbackState'
import Block from './Block'
import getSize from './getSize'
import { snapshot } from './Snapshot'
import SplitHeader from './SplitHeader'
import SplitPosition, { SplitPositionProps } from './SplitPosition'
import KuiConfiguration from '../../Client/KuiConfiguration'
import SessionInitStatus from '../../Client/SessionInitStatus'
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
  Processing,
  isActive,
  isAnnouncement,
  isFinished,
  isWithCompleteEvent,
  isOk,
  isOutputOnly,
  isMaximized,
  isProcessing,
  hasStartEvent,
  hasCommand,
  hasUUID,
  hasOriginalUUID,
  BlockModel
} from './Block/BlockModel'

import isInViewport from './visible'
import '../../../../web/scss/components/Terminal/_index.scss'

const strings = i18n('plugin-client-common')

/** Hard limit on the number of Terminal splits */
const MAX_TERMINALS = 6

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

type Props = TerminalOptions &
  SplitPositionProps & {
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

    /** Toggle attribute on Tab DOM */
    toggleAttribute(attr: string): void

    /** Status of the proxy session (for client-server architectures of Kui) */
    sessionInit: SessionInitStatus

    /** Reset any notion of left strip etc. */
    resetSplitLayout(): void

    /** Toggle whether we have a left strip split */
    willToggleLeftStripMode(): void

    /** Toggle whether we have a bottom strip split */
    willToggleBottomStripMode(): void
  }

interface State {
  /** Index of the focused split (index into State.splits) */
  focusedIdx: number

  /** Splits model */
  splits: ScrollbackState[]
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
    this.state = this.initialState()
    this.initSnapshotEvents()
  }

  private initialState() {
    const splits = [this.scrollbackWithWelcome()]

    return {
      focusedIdx: 0,
      splits
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
    const onSnapshot = async (evt: Events.SnapshotRequestEvent) => {
      if (evt.execUUID && evt.cb) {
        // capture just one block
        this.state.splits.forEach(split => {
          const block = split.blocks.find(_ => hasUUID(_) && _.execUUID === evt.execUUID)
          if (block && isFinished(block)) {
            const replacer = (key: string, value: any) => {
              if (key === 'tab') {
                return undefined
              } else if (key === 'block') {
                return undefined
              } else {
                return value
              }
            }
            evt.cb(Buffer.from(JSON.stringify(snapshot(block), replacer)))
          } else {
            evt.cb(null)
          }
        })
      } else {
        // request that all commentary in this tab save themselves
        await Promise.all(
          this.state.splits.map(async ({ blocks }) => {
            await Promise.all(
              blocks.map(async block => {
                if (isWithCompleteEvent(block) && isCommentaryResponse(block.completeEvent.response)) {
                  await Events.eventChannelUnsafe.emit(`/kui/snapshot/request/${block.execUUID}`)
                }
              })
            )
          })
        )
      }
    }

    Events.eventBus.onSnapshotRequest(onSnapshot, getTabId(this.props.tab))
    this.cleaners.push(() => Events.eventBus.offSnapshotRequest(onSnapshot, getTabId(this.props.tab)))
  }

  /** add welcome blocks at the top of scrollback */
  private scrollbackWithWelcome() {
    const scrollback = this.scrollback(undefined, { createdBy: 'default' })
    const welcomeMax = this.props.config.showWelcomeMax

    if (this.props.sessionInit === 'Done' && this.props.config.loadingDone && welcomeMax !== undefined) {
      const welcomed = parseInt(localStorage.getItem(NUM_WELCOMED)) || 0

      if ((welcomeMax === -1 || welcomed < welcomeMax) && this.props.config.loadingDone) {
        const announcement = this.props.config.loadingDone(this.props.tab.REPL)
        if (announcement) {
          Events.eventBus.emitCommandComplete({
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

  /** Create a split with the given position and coloration */
  private makePositionedSplit(
    position: SplitPosition,
    opts: ScrollbackOptions = {},
    inverseColors = position === 'left-strip'
  ) {
    const split = this.scrollback(undefined, Object.assign({}, opts, { position, inverseColors }))

    this.setState(curState => ({
      splits: curState.splits.concat([split])
    }))

    if (position === 'left-strip') {
      this.props.willToggleLeftStripMode()
    } else if (position === 'bottom-strip') {
      this.props.willToggleBottomStripMode()
    }

    return split
  }

  /**
   * This is the `inject` handler for the `SplitInjector`
   * interface. Injects the given React `node` into the given
   * `position`. Uses `uuid` to determine whether the a prior version
   * of the node already exists in that position.
   */
  public readonly inject = (
    uuid: string,
    node: React.ReactNode,
    position: SplitPosition,
    count: number,
    { maximized, hasActiveInput, inverseColors }: InjectorOptions
  ) => {
    const split =
      (position !== 'default'
        ? this.state.splits.find(_ => _.position === position)
        : this.state.splits.filter(_ => _.position === 'default')[count]) ||
      this.makePositionedSplit(position, { createdBy: 'kui', hasActiveInput })

    if (split) {
      this.splice(
        split.uuid,
        curState => {
          // have we already inserted the given node?
          const execUUID = `${uuid}-${position}`
          const alreadyIdx = curState.blocks.findIndex(_ => isAnnouncement(_) && _.execUUID === execUUID)

          // in either case, we will use this new BlockModel
          const newBlock = Announcement({ react: node }, execUUID, maximized)

          if (alreadyIdx >= 0) {
            // yup! so splice out with the old, and in with the new!
            return {
              blocks: [
                ...curState.blocks.slice(0, alreadyIdx),
                newBlock,
                ...curState.blocks.slice(alreadyIdx + 1) // skip over the existing version...
              ]
            }
          } else {
            // then we splice in the new
            const insertIdx = isActive(split.blocks[split.blocks.length - 1])
              ? split.blocks.length - 1
              : split.blocks.length

            return {
              inverseColors: inverseColors === true || curState.inverseColors,
              blocks: [...curState.blocks.slice(0, insertIdx), newBlock, ...curState.blocks.slice(insertIdx)]
            }
          }
        },
        { focus: !!hasActiveInput }
      )
    }
  }

  /** This is the `modify` handler for the `SplitInjector`
   * interface. Modifies the properties of an existing split as
   * specified by `sbuuid`, and then returns the given `node`
   * unchanged. */
  public readonly modify = (
    sbuuid: string,
    node: React.ReactNode,
    { hasActiveInput, inverseColors }: InjectorOptions
  ): React.ReactNode => {
    this.setState(curState => {
      const sbidx = this.findSplit(this.state, sbuuid)
      if (sbidx < 0) {
        return null
      } else {
        const splits = curState.splits.slice()

        if (typeof inverseColors === 'boolean') {
          splits[sbidx].inverseColors = inverseColors
        }

        if (typeof hasActiveInput === 'boolean') {
          splits[sbidx].hasActiveInput = hasActiveInput
        }
        return {
          splits
        }
      }
    })

    return node
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

  /** @return the number of splits with `position=default` */
  private numDefaultSplits() {
    return this.state.splits.reduce((N, _) => (N += _.position === 'default' ? 1 : 0), 0)
  }

  private scrollback(sbuuid = this.allocateUUIDForScrollback(), opts: ScrollbackOptions = {}): ScrollbackState {
    const state: ScrollbackState = {
      uuid: sbuuid,
      cleaners: [],
      inverseColors: opts.inverseColors,
      blocks: this.restoreBlocks(sbuuid).concat([Active()]),
      remove: undefined,
      clear: undefined,
      invert: undefined,
      onClick: undefined,
      onMouseDown: undefined,
      onFocus: undefined,
      onOutputRender: undefined,
      setActiveBlock: undefined,
      willFocusBlock: undefined,
      willRemoveBlock: undefined,
      willUpdateCommand: undefined,
      tabRefFor: undefined,
      scrollableRef: undefined,
      hasActiveInput: opts.hasActiveInput,

      createdBy: opts.createdBy || 'user',
      position: opts.position || 'default',
      willToggleSplitPosition: undefined
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
    state.invert = () => this.invert(sbuuid)

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
        // problematic, see https://github.com/kubernetes-sigs/kui/issues/8174
        // setTimeout(() => state.facade.scrollToBottom())
      }
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

    /** Reference for the scrollable part of the Split; helpful for scrollToTop/Bottom */
    state.scrollableRef = (ref: HTMLElement) => {
      if (ref) {
        state.facade.scrollToTop = () => (ref.scrollTop = 0)

        /**
         * If given the optional parameter, only scroll into view if the
         * specified block (identified by its execUUID) is the last block in
         * this tab
         *
         */
        state.facade.scrollToBottom = (execUUID?: string) => {
          const sbidx = this.findSplit(this.state, sbuuid)
          if (sbidx >= 0) {
            const { blocks } = this.state.splits[sbidx]
            const lastBlock = blocks[blocks.length - 1]
            if (!execUUID || (hasUUID(lastBlock) && lastBlock.execUUID === execUUID)) {
              ref.scrollTop = ref.scrollHeight
            }
          }
        }

        state.facade.show = (sel: string) => {
          const elt = this.props.tab.querySelector(sel)
          if (elt) {
            return elt.scrollIntoView()
          }
        }
      }
    }

    /** Reference for the entire Split */
    state.tabRefFor = (ref: HTMLElement) => {
      const scrollback = state
      if (ref) {
        ref['facade'] = scrollback.facade
        scrollback.facade.getSize = getSize.bind(ref)

        scrollback.facade.splitCount = () => this.state.splits.length
        scrollback.facade.hasSideBySideTerminals = () => this.numDefaultSplits() > 1

        scrollback.facade.addClass = (cls: string) => {
          ref.classList.add(cls)
        }
        scrollback.facade.removeClass = (cls: string) => {
          ref.classList.remove(cls)
        }
      }
    }

    state.willToggleSplitPosition = () => {
      const sbidx = this.findSplit(this.state, sbuuid)
      if (sbidx >= 0) {
        const scrollback = this.state.splits[sbidx]
        if (scrollback.position === 'default') {
          if (this.props.hasBottomStrip) {
            // this split is default, and we have a bottom split; make this a left split
            scrollback.position = 'left-strip'
            this.props.willToggleLeftStripMode()
          } else {
            // this split is default, and we don't have a bottom split; make this a bottom split
            scrollback.position = 'bottom-strip'
            this.props.willToggleBottomStripMode()
          }
        } else if (scrollback.position === 'bottom-strip') {
          if (this.props.hasLeftStrip) {
            // this split is bottom, and we have a left split; revert this to default
            scrollback.position = 'default'
            this.props.willToggleBottomStripMode()
          } else {
            // this split is bottom, and we don't have a left split; make this a left split
            scrollback.position = 'left-strip'
            this.props.willToggleLeftStripMode()
            this.props.willToggleBottomStripMode()
          }
        } else {
          // this split is left; always return to default
          this.props.willToggleLeftStripMode()
          scrollback.position = 'default'
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
    Events.eventBus.onceWithTabId('/tab/close/request', sbuuid, onTabCloseRequest)
    state.cleaners.push(() => Events.eventBus.offWithTabId('/tab/close/request', sbuuid, onTabCloseRequest))

    if (opts.cmdline) {
      setTimeout(() => {
        state.facade.REPL.pexec(opts.cmdline, { masquerade: opts.masquerade, data: opts.data })
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
          this.isOkSplitForContent(originalIdx) &&
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

  /** Invert colors of the given Scrollback uuid */
  private invert(uuid: string) {
    return this.splice(uuid, sbState => Object.assign({}, sbState, { inverseColors: !sbState.inverseColors }))
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

  /** Some splits may not be ideal receptacles for arbitrary content */
  private isOkSplitForContent(idx: number): boolean {
    return this.state.splits[idx].position === 'default'
  }

  /**
   * We want to direct the command execution UI to a default-position
   * terminal.
   *
   * @return the sbuuid of a default-position split
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
      if (idx >= 0 && !this.isOkSplitForContent(idx)) {
        // then this is not a preferred target for displaying content
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
  public onExecStart(uuid = this.currentUUID, asReplay: boolean, event: CommandStartEvent, _insertIdx?: number) {
    if (event.execOptions && event.execOptions.echo === false) {
      return
    }

    const processing = (block: BlockModel) => {
      return [Processing(block, event, event.evaluatorOptions.isExperimental, asReplay || undefined)]
    }

    // uuid might be undefined if the split is going away
    if (uuid) {
      uuid = this.redirectToPlainSplitIfNeeded(uuid, event)

      this.splice(uuid, curState => {
        const idx = curState.blocks.length - 1
        const insertIdx = typeof _insertIdx === 'number' ? _insertIdx : event.execOptions && event.execOptions.insertIdx

        if (insertIdx !== undefined) {
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

    // note: even if the command registration asked for
    // `outputOnly`, we ignore that if the response is a plain
    // `true`; e.g. the `commentary` controller uses this to
    // indicate an empty comment
    const outputOnly = event.evaluatorOptions && event.evaluatorOptions.outputOnly && event.response !== true

    const findBlock = (blocks: ScrollbackState['blocks']) => {
      return blocks.findIndex(_ => {
        return (
          (isBeingRerun(_) && _.originalExecUUID === event.execUUID) ||
          ((isBeingRerun(_) || isProcessing(_)) && _.execUUID === event.execUUID)
        )
      })
    }

    // special case: replace all current content?
    const replace = event.response && isCommentaryResponse(event.response) && event.response.props.replace
    if (replace && !event.cancelled) {
      const state = this.initialState()
      const split = this.state.splits[this.findSplit(this.state, uuid)]
      const inProcess = split.blocks[findBlock(split.blocks)]
      if (isProcessing(inProcess) || isBeingRerun(inProcess)) {
        const finishedBlock = Finished(inProcess, event, outputOnly, asReplay || undefined)
        state.splits[0].blocks.splice(0, 0, finishedBlock)
        this.setState(state)
        this.props.resetSplitLayout()
        return
      }
    }

    this.splice(uuid, curState => {
      const inProcessIdx = findBlock(curState.blocks)

      if (inProcessIdx >= 0) {
        const inProcess = curState.blocks[inProcessIdx]
        if (isProcessing(inProcess) || isBeingRerun(inProcess)) {
          const finishedBlock = Finished(inProcess, event, outputOnly, asReplay || undefined)
          try {
            const blocks = (replace
              ? [finishedBlock]
              : curState.blocks
                  .slice(0, inProcessIdx) // everything before
                  .concat([finishedBlock]) // mark as finished
                  .concat(curState.blocks.slice(inProcessIdx + 1))
            ) // everything after
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
      Events.eventBus.emitSplitSwitch(scrollback.facade)
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

    Events.eventBus.onCommandStart(state.uuid, onStartForSplitFromUser)
    Events.eventBus.onCommandStart(state.uuid, onStartForSplitFromReplay, true)

    Events.eventBus.onCommandComplete(state.uuid, onCompleteForSplitFromUser)
    Events.eventBus.onCommandComplete(state.uuid, onCompleteForSplitFromReplay, true)

    state.cleaners.push(() => Events.eventBus.offCommandStart(state.uuid, onStartForSplitFromUser))
    state.cleaners.push(() => Events.eventBus.offCommandStart(state.uuid, onStartForSplitFromReplay))
    state.cleaners.push(() => Events.eventBus.offCommandComplete(state.uuid, onCompleteForSplitFromUser))
    state.cleaners.push(() => Events.eventBus.offCommandComplete(state.uuid, onCompleteForSplitFromReplay))
  }

  /**
   * Handle events directed at the given scrollback region.
   *
   */
  private initEvents(state: ScrollbackState) {
    this.hookIntoREPL(state)

    const clear = this.clear.bind(this, state.uuid)
    Events.eventChannelUnsafe.on(`/terminal/clear/${state.uuid}`, clear)
    state.cleaners.push(() => {
      Events.eventChannelUnsafe.off(`/terminal/clear/${state.uuid}`, clear)
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

  /** Swap the position of the two splits; a and b are 1-indexed from the controller */
  private swapSplits(a: number, b: number) {
    const aIdx = a - 1 // 1-indexed from the controller
    const bIdx = b - 1 // 1-indexed from the controller

    if (!this.state.splits[aIdx]) {
      console.error(`Cannot find split index ${a}`, aIdx, this.state.splits)
      return new Error(`Cannot find split index ${a}`)
    } else if (!this.state.splits[bIdx]) {
      console.error(`Cannot find split index ${b}`, bIdx, this.state.splits)
      return new Error(`Cannot find split index ${b}`)
    } else {
      const firstIdx = Math.min(aIdx, bIdx)
      const secondIdx = Math.max(aIdx, bIdx)
      const splits = this.state.splits
        .slice(0, firstIdx)
        .concat([this.state.splits[secondIdx]])
        .concat(this.state.splits.slice(firstIdx + 1, secondIdx))
        .concat([this.state.splits[firstIdx]])
        .concat(this.state.splits.slice(secondIdx + 1))

      this.setState({
        splits,
        focusedIdx:
          this.state.focusedIdx === aIdx ? bIdx : this.state.focusedIdx === bIdx ? aIdx : this.state.focusedIdx
      })

      return true
    }
  }

  /** Split the view */
  private async onSplit(request: TabLayoutModificationResponse<NewSplitRequest>, sbuuid: string) {
    const nTerminals = this.state.splits.length

    if (request.spec.options.swap) {
      // swap to splits
      return this.swapSplits(request.spec.options.swap[0], request.spec.options.swap[1])
    } else if (request.spec.options.cmdline && (request.spec.options.if || request.spec.options.ifnot)) {
      const thisSplitIdx = this.findSplit(this.state, sbuuid)
      const thisSplit = this.state.splits[thisSplitIdx]

      const respIf = !request.spec.options.if
        ? true
        : await thisSplit.facade.REPL.qexec<boolean>(request.spec.options.if).catch(() => false)

      const respIfNot = !request.spec.options.ifnot
        ? true
        : !(await thisSplit.facade.REPL.qexec<boolean>(request.spec.options.ifnot).catch(() => true))

      if (!respIf || !respIfNot) {
        const { cmdline, data, masquerade } = request.spec.options
        const mainSplit = this.findMainSplit(thisSplitIdx) || thisSplit
        request.spec.options.cmdline = undefined // null this out, since we got it!
        mainSplit.facade.REPL.pexec(cmdline, { data, masquerade })

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

        const opts = {
          isSidecarNowHidden: false,
          isWidthConstrained: this.isWidthConstrained(newScrollback)
        }
        Events.eventBus.emitTabLayoutChange(sbuuid, opts)
        Events.eventBus.emitTabLayoutChange(this.props.tab.uuid, opts)

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
        if (typeof block.response.watch.abort === 'function') {
          // safe-guarding here
          block.response.watch.abort()
        }
      } else if (isAbortableResponse(block.response)) {
        if (typeof block.response.abort === 'function') {
          // safe-guarding here
          block.response.abort()
        }
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
      const idx = this.findSplit(this.state, sbuuid)
      if (idx >= 0) {
        // if the user typed exit/ctrl+D in a 2-split scenario where
        // the split being closed is a default split, and the other is
        // a bottom strip... we have a choice: either turn the bottom
        // strip into a default split, or refuse the request to
        // close. For now, we opt for the former
        if (
          (this.props.hasBottomStrip || this.props.hasLeftStrip) &&
          curState.splits.length === 2 &&
          curState.splits[idx].position === 'default'
        ) {
          const otherSplit = curState.splits[1 - idx]
          otherSplit.position = 'default'
          setTimeout(() => {
            if (this.props.hasBottomStrip) {
              this.props.willToggleBottomStripMode()
            } else {
              this.props.willToggleLeftStripMode()
            }
          })
        }

        Events.eventBus.emitTabLayoutChange(sbuuid)
        Events.eventBus.emitTabLayoutChange(this.props.tab.uuid)

        if (idx === curState.splits.length - 1) {
          // If we are removing the last split, we can safely
          // decrement the running counter. The reordering problem
          // described in the `scrollbackCounter` comment above does
          // not occur when removing the last split
          this.scrollbackCounter--
        }

        if (curState.splits[idx].position === 'left-strip') {
          // then we are closing the left strip
          setTimeout(() => this.props.willToggleLeftStripMode())
        } else if (curState.splits[idx].position === 'bottom-strip') {
          // then we are closing the bottom strip
          setTimeout(() => this.props.willToggleBottomStripMode())
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
          Events.eventBus.emitWithTabId('/tab/close/request', parent.uuid, parent)
        }

        const focusedIdx = idx === 0 ? 0 : idx - 1

        if (splits.length === 1) {
          const opts = {
            isSidecarNowHidden: false,
            isWidthConstrained: false
          }
          Events.eventBus.emitTabLayoutChange(splits[focusedIdx].uuid, opts)
          Events.eventBus.emitTabLayoutChange(this.props.tab.uuid, opts)
        }

        return { splits, focusedIdx }
      }
    })

    setTimeout(() => Events.eventChannelUnsafe.emit('/zoom'))
  }

  /**
   * Splice in an update to the given split (identified by `sbuuid`),
   * using the giving ScrollbackState mutator.
   *
   */
  private splice(
    sbuuid: string,
    mutator: (
      state: ScrollbackState
    ) => Pick<ScrollbackState, 'blocks'> & Partial<Pick<ScrollbackState, 'inverseColors'>>,
    opts: { focus?: boolean } = {}
  ) {
    this.setState(curState => this.spliceMutate(curState, sbuuid, mutator, opts))
  }

  /** Helper for splice; i.e. splice() does the setState, while this method does them mutate */
  private spliceMutate(
    curState: State,
    sbuuid: string,
    mutator: (state: ScrollbackState) => Pick<ScrollbackState, 'blocks'>,
    opts: { focus?: boolean } = {}
  ): Pick<State, 'splits' | 'focusedIdx'> {
    const focusedIdx = this.findAvailableSplit(curState, sbuuid)
    const splits = curState.splits
      .slice(0, focusedIdx)
      .concat([Object.assign({}, curState.splits[focusedIdx], mutator(curState.splits[focusedIdx]))])
      .concat(curState.splits.slice(focusedIdx + 1))

    return {
      focusedIdx: opts.focus ? focusedIdx : curState.focusedIdx,
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

  /** Is this scrollback not-100% width? */
  private isWidthConstrained(scrollback: ScrollbackState) {
    return (
      this.props.config.isPopup ||
      scrollback.position === 'left-strip' ||
      (scrollback.position === 'default' && this.numDefaultSplits() > 1)
    )
  }

  /** Render the blocks in one split */
  private blocks(tab: KuiTab, scrollback: ScrollbackState, sbidx: number) {
    const blocks = scrollback.blocks
    const isWidthConstrained = this.isWidthConstrained(scrollback)

    // running tally for In[_idx_]
    let displayedIdx = 0

    return blocks.map((_, idx) => {
      if (!isAnnouncement(_) && !isOutputOnly(_)) {
        displayedIdx++
      }

      /** To find the focused block, we check:
       *  1. the block is in a focused scrollback
       *  2. the block idx matches scrollback.focusedBlockIdx (considering blocks that were hidden)
       *  3. return the active block if there's no scrollback.focusedBlockIdx */
      const isFocused =
        sbidx === this.state.focusedIdx &&
        (idx === scrollback.focusedBlockIdx ||
          (scrollback.focusedBlockIdx === undefined && idx === this.findActiveBlock(scrollback)))

      const isExecutable = isExecutableClient()

      return (
        <Block
          key={
            hasOriginalUUID(_)
              ? _.originalExecUUID
              : hasUUID(_)
              ? _.execUUID
              : `${idx}-${isActive(_)}-${isCancelled(_)}`
          }
          idx={idx}
          isExecutable={isExecutable}
          displayedIdx={displayedIdx}
          model={_}
          uuid={scrollback.uuid}
          tab={tab}
          splitPosition={scrollback.position}
          nSplits={this.state.splits.length}
          noActiveInput={
            scrollback.hasActiveInput === false || (scrollback.hasActiveInput !== true && this.props.noActiveInput)
          }
          onFocus={scrollback.onFocus}
          willRemove={scrollback.willRemoveBlock}
          willFocusBlock={scrollback.willFocusBlock}
          willUpdateCommand={scrollback.willUpdateCommand}
          isExperimental={hasCommand(_) && _.isExperimental}
          isFocused={isFocused}
          isWidthConstrained={isWidthConstrained}
          onOutputRender={scrollback.onOutputRender}
          ref={scrollback.setActiveBlock}
        />
      )
    })
  }

  /** Render one split */
  private split(scrollback: ScrollbackState, sbidx: number) {
    const tab = this.tabFor(scrollback)
    const isWidthConstrained = this.isWidthConstrained(scrollback)

    const props = {
      className: 'kui--scrollback' + (scrollback.inverseColors ? ' kui--inverted-color-context' : ''),
      'data-is-width-constrained': isWidthConstrained || undefined,
      'data-is-focused': sbidx === this.state.focusedIdx || undefined,
      'data-position': scrollback.position,
      key: tab.uuid,
      'data-scrollback-id': tab.uuid,
      'data-has-maximized-block': !!scrollback.blocks.find(isMaximized) || undefined,
      ref: scrollback.tabRefFor,
      onClick: scrollback.onClick, // fancier for bottom input (just below, too)? !this.props.noActiveInput ? scrollback.onClick : undefined,
      onMouseDown:
        scrollback.position === 'bottom-strip' /* || this.props.noActiveInput */ ? scrollback.onMouseDown : undefined
    }

    const children = (
      <React.Fragment>
        {this.state.splits.length > 1 && (
          <SplitHeader
            position={scrollback.position}
            onRemove={scrollback.remove}
            onClear={scrollback.clear}
            onInvert={scrollback.invert}
            createdBy={scrollback.createdBy}
            hasLeftStrip={this.props.hasLeftStrip}
            hasBottomStrip={this.props.hasBottomStrip}
            willToggleSplitPosition={
              this.props.hasLeftStrip && this.props.hasBottomStrip && scrollback.position === 'default'
                ? undefined // have both strips already and this is a default split? no toggle for you!
                : (this.props.hasLeftStrip || this.props.hasBottomStrip) &&
                  this.state.splits.length === 2 &&
                  scrollback.position === 'default'
                ? undefined // have 2 splits, and one of them is non-default, and this is a default? also no toggler for you
                : scrollback.willToggleSplitPosition
            }
          />
        )}
        <div className="kui--scrollback-block-list">
          <ul className="kui--scrollback-block-list-for-sizing" ref={scrollback.scrollableRef}>
            {this.blocks(tab, scrollback, sbidx)}
          </ul>
        </div>
      </React.Fragment>
    )

    return React.createElement(scrollback.position === 'default' ? 'div' : 'span', props, children)
  }

  public render() {
    return (
      <SplitInjector.Provider value={this}>
        <div className="repl" id="main-repl" data-session-init-status={this.props.sessionInit}>
          <div
            className="repl-inner zoomable kui--terminal-split-container"
            data-split-count={this.state.splits.length}
          >
            {this.state.splits.map((scrollback, sbidx) => this.split(scrollback, sbidx))}
          </div>
        </div>
      </SplitInjector.Provider>
    )
  }
}
