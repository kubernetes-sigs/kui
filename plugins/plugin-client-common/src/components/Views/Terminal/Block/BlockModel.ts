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
  KResponse,
  ScalarResponse,
  UsageError,
  isXtermErrorResponse,
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
type WithStartTime = { startTime: number }
type WithState<S extends BlockState> = { state: S }
type WithResponse<R extends KResponse> = { response: R } & WithStartTime
type WithValue = { value: string }
type WithAnnouncement = { isAnnouncement: boolean }
type WithPreferences = { outputOnly?: boolean }
type WithCommandStart = { startEvent: CommandStartEvent }
type WithCommandComplete = { completeEvent: CommandCompleteEvent }
type WithRerun = { isRerun: boolean }
type WithReplay = { isReplay: boolean }

/** The canonical types of Blocks, which mix up the Traits as needed */
type ActiveBlock = WithState<BlockState.Active> & WithCWD & Partial<WithValue>
export type AnnouncementBlock = WithState<BlockState.ValidResponse> &
  WithResponse<ScalarResponse> &
  WithCWD &
  WithAnnouncement
type EmptyBlock = WithState<BlockState.Empty> & WithCWD & Partial<WithCommand>
type ErrorBlock = WithState<BlockState.Error> &
  WithCommand &
  WithResponse<Error> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  WithReplay &
  WithCommandComplete
type OkBlock = WithState<BlockState.ValidResponse> &
  WithCommand &
  WithResponse<KResponse> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  WithCommandComplete &
  WithReplay &
  WithPreferences
export type ProcessingBlock = WithState<BlockState.Processing> &
  WithCommand &
  WithUUID &
  WithStartTime &
  WithRerun &
  WithReplay &
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

export function isError(response: KResponse): response is Error {
  return response.constructor === Error || response.constructor === UsageError || isXtermErrorResponse(response)
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
  return !isActive(block) && (!isEmpty(block) || block.command !== undefined)
}

export function isAnnouncement(block: BlockModel): block is AnnouncementBlock {
  const blockModel = block as AnnouncementBlock
  return blockModel.state === BlockState.ValidResponse && blockModel.isAnnouncement === true
}

export function hasUUID(block: BlockModel & Partial<WithUUID>): block is BlockModel & Required<WithUUID> {
  return block && !isActive(block) && !isEmpty(block) && !isAnnouncement(block)
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
    startTime: Date.now(),
    cwd: cwd(),
    state: BlockState.ValidResponse
  }
}

/** Transform to Processing */
export function Processing(
  block: BlockModel,
  startEvent: CommandStartEvent,
  isExperimental = false,
  isRerun = false,
  isReplay = false
): ProcessingBlock {
  return {
    command: startEvent.command,
    isExperimental,
    cwd: block.cwd,
    execUUID: startEvent.execUUID,
    isReplay,
    isRerun,
    startEvent,
    startTime: startEvent.startTime,
    state: BlockState.Processing
  }
}

/** Transform to Empty */
export function Empty(block: BlockModel, typedSoFar?: string): EmptyBlock {
  return {
    cwd: block.cwd,
    command: typedSoFar,
    state: BlockState.Empty
  }
}

/** Transform to Cancelled */
export function Cancelled(block: BlockModel, typedSoFar?: string): CancelledBlock | EmptyBlock {
  if (isProcessing(block)) {
    return {
      cwd: block.cwd,
      command: block.command,
      execUUID: block.execUUID,
      startTime: block.startTime,
      state: BlockState.Cancelled
    }
  } else {
    return Empty(block, typedSoFar)
  }
}

/** Transform to Finished */
export function Finished(
  block: ProcessingBlock,
  event: CommandCompleteEvent,
  outputOnly = false,
  isReplay = false
): FinishedBlock {
  const response = event.response // event.responseType === 'ScalarResponse' ? (event.response as ScalarResponse) : true
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
      isReplay,
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
      isReplay,
      execUUID: block.execUUID,
      startTime: block.startTime,
      outputOnly,
      state: BlockState.ValidResponse
    }
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

/** @return whether the block as a startEvent trait */
export function hasStartEvent(block: BlockModel): block is BlockModel & WithCommandStart {
  return !isAnnouncement(block) && (isProcessing(block) || isOk(block) || isOops(block))
}

/** @return whether the block has a completeEvent trait */
export function isWithCompleteEvent(block: BlockModel): block is CompleteBlock {
  return (isOk(block) || isOops(block)) && block.completeEvent !== undefined
}

/** @return whether the block is from replay */
export function isReplay(block: BlockModel): boolean {
  return (isProcessing(block) || isWithCompleteEvent(block)) && block.isReplay
}
