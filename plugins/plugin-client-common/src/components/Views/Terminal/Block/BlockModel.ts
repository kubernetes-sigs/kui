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

import {
  CommandStartEvent,
  CommandCompleteEvent,
  ScalarResponse,
  SnapshotBlock,
  UsageError,
  ExecType,
  isWatchable,
  inBrowser
} from '@kui-shell/core'

const enum BlockState {
  Active = 'repl-active',
  Cancelled = 'cancelled',
  Empty = 'empty',
  Error = 'error',
  Processing = 'processing',
  ValidResponse = 'valid-response'
}

/** Traits that Blocks might have */
type WithCWD = { cwd: string }
type WithUUID = { execUUID: string }
type WithCommand = { command: string; isExperimental?: boolean } & WithCWD
type WithStartTime = { startTime: Date }
type WithState<S extends BlockState> = { state: S }
type WithResponse<R extends ScalarResponse> = { response: R } & WithStartTime
type WithValue = { value: string }
type WithAnnouncement = { isAnnouncement: boolean }
type WithPreferences = { prefersTerminalPresentation: boolean; outputOnly?: boolean }
type WithCommandStart = { startEvent: CommandStartEvent }
type WithCommandComplete = { completeEvent: CommandCompleteEvent }
type WithRerun = { isRerun: boolean }

/** The canonical types of Blocks, which mix up the Traits as needed */
type ActiveBlock = WithState<BlockState.Active> & WithCWD & Partial<WithValue>
export type AnnouncementBlock = WithState<BlockState.ValidResponse> &
  WithResponse<ScalarResponse> &
  WithCWD &
  WithAnnouncement
type EmptyBlock = WithState<BlockState.Empty> & WithCWD
type ErrorBlock = WithState<BlockState.Error> &
  WithCommand &
  WithResponse<Error> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  WithCommandComplete
type OkBlock = WithState<BlockState.ValidResponse> &
  WithCommand &
  WithResponse<ScalarResponse> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  WithCommandComplete &
  WithPreferences
export type ProcessingBlock = WithState<BlockState.Processing> &
  WithCommand &
  WithUUID &
  WithStartTime &
  WithRerun &
  WithCommandStart
type CancelledBlock = WithState<BlockState.Cancelled> & WithCWD & WithCommand & WithUUID & WithStartTime
export type CompleteBlock = OkBlock | ErrorBlock

/** Blocks with an association to the History model */
type WithHistoryIndex = { historyIdx: number }

/** FinishedBlocks are either ok, error, or cancelled */
export type FinishedBlock = OkBlock | ErrorBlock | CancelledBlock | EmptyBlock

// A Block is one of the canonical types
export type BlockModel = ProcessingBlock | FinishedBlock | CancelledBlock | ActiveBlock | AnnouncementBlock
export default BlockModel

/** Capture the current working directory */
function cwd() {
  const dir = inBrowser() ? process.env.PWD : process.cwd()
  return dir ? dir.replace(process.env.HOME, '~') : undefined
}

export function isError(response: ScalarResponse): response is Error {
  return response.constructor === Error || response.constructor === UsageError
}

export function isProcessing(block: BlockModel): block is ProcessingBlock {
  return block.state === BlockState.Processing
}

export function isActive(block: BlockModel): block is ActiveBlock {
  return block.state === BlockState.Active
}

export function isCancelled(block: BlockModel): block is CancelledBlock {
  return block.state === BlockState.Cancelled
}

export function isEmpty(block: BlockModel): block is EmptyBlock {
  return block.state === BlockState.Empty
}

export function isOk(block: BlockModel): block is OkBlock {
  return block.state === BlockState.ValidResponse
}

export function isOops(block: BlockModel): block is ErrorBlock {
  return block.state === BlockState.Error
}

export function isFinished(block: BlockModel): block is FinishedBlock {
  return isOops(block) || isCancelled(block) || isOk(block) || isEmpty(block)
}

export function hasCommand(block: BlockModel & Partial<WithCommand>): block is BlockModel & Required<WithCommand> {
  return !isActive(block) && !isEmpty(block)
}

export function isAnnouncement(block: BlockModel): block is AnnouncementBlock {
  const blockModel = block as AnnouncementBlock
  return blockModel.state === BlockState.ValidResponse && blockModel.isAnnouncement === true
}

export function hasUUID(block: BlockModel & Partial<WithUUID>): block is BlockModel & Required<WithUUID> {
  return !isActive(block) && !isEmpty(block) && !isAnnouncement(block)
}

export function hasValue(block: BlockModel): block is BlockModel & Required<WithValue> {
  return typeof (block as WithValue).value === 'string'
}

/** Transform to Active */
export function Active(initialValue?: string): ActiveBlock {
  return {
    cwd: cwd(),
    state: BlockState.Active,
    value: initialValue
  }
}

/** Transform to AnnouncementBlock */
export function Announcement(response: ScalarResponse): AnnouncementBlock {
  return {
    response,
    isAnnouncement: true,
    startTime: new Date(),
    cwd: cwd(),
    state: BlockState.ValidResponse
  }
}

/** Transform to Processing */
export function Processing(
  block: BlockModel,
  startEvent: CommandStartEvent,
  isExperimental = false,
  isRerun = false
): ProcessingBlock {
  return {
    command: startEvent.command,
    isExperimental,
    cwd: block.cwd,
    execUUID: startEvent.execUUID,
    isRerun,
    startEvent,
    startTime: new Date(),
    state: BlockState.Processing
  }
}

/** Transform to Empty */
export function Empty(block: BlockModel): EmptyBlock {
  return {
    cwd: block.cwd,
    state: BlockState.Empty
  }
}

/** Transform to Cancelled */
export function Cancelled(block: BlockModel): CancelledBlock | EmptyBlock {
  if (isProcessing(block)) {
    return {
      cwd: block.cwd,
      command: block.command,
      execUUID: block.execUUID,
      startTime: block.startTime,
      state: BlockState.Cancelled
    }
  } else {
    return Empty(block)
  }
}

/** Transform to Finished */
export function Finished(
  block: ProcessingBlock,
  event: CommandCompleteEvent,
  prefersTerminalPresentation = false,
  outputOnly = false
): FinishedBlock {
  const response = event.responseType === 'ScalarResponse' ? (event.response as ScalarResponse) : true
  const { historyIdx } = event
  const { startEvent } = block

  if (event.cancelled) {
    return Cancelled(block)
  } else if (isError(response)) {
    return {
      response,
      historyIdx,
      cwd: block.cwd,
      command: block.command,
      startEvent,
      completeEvent: event,
      isExperimental: block.isExperimental,
      state: BlockState.Error,
      execUUID: block.execUUID,
      startTime: block.startTime
    }
  } else {
    return {
      response,
      historyIdx,
      cwd: block.cwd,
      command: block.command,
      startEvent,
      completeEvent: event,
      isExperimental: block.isExperimental,
      execUUID: block.execUUID,
      startTime: block.startTime,
      prefersTerminalPresentation,
      outputOnly,
      state: BlockState.ValidResponse
    }
  }
}

export function snapshot(block: BlockModel): SnapshotBlock {
  if (!isAnnouncement(block) && (isOops(block) || isOk(block))) {
    const execOptions = Object.assign(
      {},
      block.completeEvent.execOptions,
      { block: undefined },
      { tab: block.completeEvent.execOptions.tab.uuid }
    )
    const evaluatorOptions = Object.assign({}, block.completeEvent.evaluatorOptions, {
      usage: undefined,
      flags: undefined
    })

    /**
     * We excluded watch for now since a `Watchable` instance is not serializable
     * see issue: https://github.com/IBM/kui/issues/5399
     * and issue: https://github.com/IBM/kui/issues/5452
     *
     */
    const response =
      block.completeEvent.response && isWatchable(block.completeEvent.response)
        ? Object.assign({}, block.completeEvent.response, { watch: undefined })
        : block.completeEvent.response

    return {
      startTime: new Date(block.startTime).getTime(),
      startEvent: Object.assign({}, block.startEvent, { tab: block.startEvent.tab.uuid }),
      completeEvent: Object.assign(
        {},
        block.completeEvent,
        { execOptions, evaluatorOptions },
        { tab: block.completeEvent.tab.uuid },
        { response }
      )
    }
  }
}

export function isHidden(block: BlockModel) {
  if (isActive(block) || isAnnouncement(block) || isCancelled(block) || isEmpty(block)) {
    return false
  }
}

export function isOutputOnly(block: BlockModel) {
  if (isProcessing(block)) {
    return block.startEvent.echo === false
  } else if (isOk(block)) {
    return (
      (block.completeEvent && block.completeEvent.echo === false) ||
      (block.startEvent && block.startEvent.echo === false) ||
      block.outputOnly
    )
  }
}

/**
 * If the `responseType` of the `completeEvent` is not 'ScalarResponse',
 * it's not presented in `ScrollableTerminal`
 *
 */
export function isPresentedElsewhere(block: BlockModel) {
  return isOk(block) && block.completeEvent && block.completeEvent.responseType !== 'ScalarResponse'
}

/** @return whether the block has a completeEvent trait */
export function isWithCompleteEvent(block: BlockModel): block is CompleteBlock {
  return isOk(block) || isOops(block)
}

/**
 * Same as `isPresentedElsewhere`, but also for commands that ask not
 * to echo their execution.
 */
export function isQuietlyPresentedElsewhere(block: BlockModel) {
  return isPresentedElsewhere(block) && isWithCompleteEvent(block) && block.completeEvent.echo === false
}

/**
 * Is this block the result of the user clicking somewhere? (i.e. in
 * contrast to the user typing a command in a terminal and hitting
 * enter)
 *
 */
export function isResultOfClick(block: BlockModel) {
  return isWithCompleteEvent(block) && block.completeEvent.execOptions.type === ExecType.ClickHandler
}
