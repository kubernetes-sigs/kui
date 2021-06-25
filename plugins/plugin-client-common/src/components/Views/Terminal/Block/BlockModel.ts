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

import { v4 as uuid } from 'uuid'

import {
  CommandStartEvent,
  CommandCompleteEvent,
  KResponse,
  ScalarResponse,
  UsageError,
  hideReplayOutput,
  isCommentaryResponse,
  isCommentarySectionBreak,
  isXtermErrorResponse,
  cwd as kuiCwd
} from '@kui-shell/core'

export const enum BlockState {
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
type WithOriginalExecUUID = { originalExecUUID: string } // for rerun/rexec in place, we need to remember the first execUUID
type WithCommand = { command: string; isExperimental?: boolean } & WithCWD
type WithStartTime = { startTime: number }
type WithState<S extends BlockState> = { state: S }
type WithResponse<R extends KResponse> = { response: R } & WithStartTime
type WithValue = { value: string }
type WithAnnouncement = { isAnnouncement: boolean }
type WithPreferences = { outputOnly?: boolean }
type WithCommandStart = { startEvent: CommandStartEvent }
type WithCommandComplete = { completeEvent: CommandCompleteEvent }
type WithRerun = { isRerun: true; newExecUUID: string } & WithOriginalExecUUID
type WithReplay = { isReplay: boolean }
type WithSectionBreak = { isSectionBreak: boolean }
type WithLink = { link: string }

/** The canonical types of Blocks, which mix up the Traits as needed */
type ActiveBlock = WithState<BlockState.Active> & WithCWD & Partial<WithValue>
export type AnnouncementBlock = WithState<BlockState.ValidResponse> &
  WithResponse<ScalarResponse> &
  WithCWD &
  WithAnnouncement
type EmptyBlock = WithState<BlockState.Empty> &
  WithCWD &
  Partial<WithCommand> &
  Partial<WithCommandComplete> &
  Partial<WithLink>
type ErrorBlock = WithState<BlockState.Error> &
  WithCommand &
  WithResponse<Error> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  Partial<WithRerun> &
  Partial<WithLink> &
  WithReplay &
  WithCommandComplete
type OkBlock = WithState<BlockState.ValidResponse> &
  WithCommand &
  WithResponse<KResponse> &
  WithUUID &
  WithHistoryIndex &
  WithCommandStart &
  WithCommandComplete &
  Partial<WithRerun> &
  Partial<WithSectionBreak> &
  Partial<WithLink> &
  WithReplay &
  WithPreferences
export type ProcessingBlock = WithState<BlockState.Processing> &
  WithCommand &
  WithUUID &
  WithStartTime &
  Partial<WithOriginalExecUUID> &
  Partial<WithLink> &
  WithReplay &
  WithCommandStart
type CancelledBlock = WithState<BlockState.Cancelled> &
  WithCWD &
  WithCommand &
  WithUUID &
  WithStartTime &
  Partial<WithLink>
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
  const dir = kuiCwd()
  return dir ? dir.replace(process.env.HOME, '~') : undefined
}

type CustomError = { name: string; message: string }
type ErrorLike = Error | CustomError

function isCustomError(response: KResponse): response is CustomError {
  const err = response as CustomError
  return err && typeof err === 'object' && typeof err.name === 'string' && typeof err.message === 'string'
}

export function isError(response: KResponse): response is ErrorLike {
  return (
    response &&
    (response.constructor === Error ||
      response.constructor === UsageError ||
      isXtermErrorResponse(response) ||
      Object.getPrototypeOf(response).constructor === Error ||
      isCustomError(response))
  )
}

export function isProcessing(block: BlockModel): block is ProcessingBlock {
  return block.state === BlockState.Processing
}

export function isActive(block: BlockModel): block is ActiveBlock {
  return block.state === BlockState.Active
}

/** @return true if the given `block` is `Active` and differs from the other `oblock` */
export function isActiveAndDifferent(block: BlockModel, oblock: BlockModel): block is ActiveBlock {
  return isActive(block) && (!isActive(oblock) || block.cwd !== oblock.cwd || block.value !== oblock.value)
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

/** is the block with link */
export function isLinkified(model: BlockModel): model is BlockModel & WithLink {
  return !isActive(model) && !isAnnouncement(model) && model.link !== undefined
}

/** Transform to Active */
export function Active(initialValue?: string): ActiveBlock {
  return {
    cwd: cwd(),
    state: BlockState.Active,
    value: initialValue || ''
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

export function isRerunable(block: BlockModel): block is RerunableBlock {
  return isOk(block) || isOops(block)
}

export function isBeingRerun(block: BlockModel): block is BlockBeingRerun {
  return (block as WithRerun).isRerun === true
}

export function hasOriginalUUID(block: BlockModel | WithOriginalExecUUID): block is WithOriginalExecUUID {
  return typeof (block as WithOriginalExecUUID).originalExecUUID === 'string'
}

/** Transform to Processing */
export function Processing(
  block: BlockModel,
  startEvent: CommandStartEvent,
  isExperimental = false,
  isReplay = false
): ProcessingBlock {
  return {
    command: startEvent.command,
    isExperimental,
    cwd: block.cwd,
    execUUID: startEvent.execUUID,
    originalExecUUID: (hasOriginalUUID(block) && block.originalExecUUID) || startEvent.execUUID,
    isReplay,
    startEvent,
    startTime: startEvent.startTime,
    state: BlockState.Processing
  }
}

/** Transform to Empty */
export function Empty(block: BlockModel, typedSoFar?: string, completeEvent?: CommandCompleteEvent): EmptyBlock {
  return {
    cwd: block.cwd,
    link: isLinkified(block) && block.link,
    command: typedSoFar,
    completeEvent,
    state: BlockState.Empty
  }
}

/** Transform to Cancelled */
export function Cancelled(
  block: BlockModel,
  typedSoFar?: string,
  completeEvent?: CommandCompleteEvent
): CancelledBlock | EmptyBlock {
  if (isProcessing(block)) {
    return {
      cwd: block.cwd,
      command: block.command,
      link: block.link,
      execUUID: block.execUUID,
      startTime: block.startTime,
      state: BlockState.Cancelled
    }
  } else {
    return Empty(block, typedSoFar, completeEvent)
  }
}

/** Transform to Finished */
export function Finished(
  block: ProcessingBlock | BlockBeingRerun,
  event: CommandCompleteEvent,
  outputOnly = false,
  isReplay = false
): FinishedBlock {
  const response = event.response // event.responseType === 'ScalarResponse' ? (event.response as ScalarResponse) : true
  const { historyIdx } = event
  const { startEvent } = block

  // see Rerun() below; when re-executing a block (which means we
  // re-evaluate a potentially changed command, and want to splice the
  // updated response into an existing block --- in this scenario, we
  // still need a new execUUID so that the view components can know
  // whether or not a re-render is needed; Rerun() which is called
  // onExecStart allocates the execUUID, and then when we get here,
  // onExecEnd, we can swap that new execUUID into place
  if (isBeingRerun(block)) {
    block.execUUID = block.newExecUUID
  }

  if (event.cancelled) {
    if (!event.command) {
      return Empty(block)
    } else {
      return Cancelled(block, event.command)
    }
  } else if (isError(response)) {
    return {
      response,
      historyIdx,
      cwd: block.cwd,
      link: block.link,
      command: block.command,
      startEvent,
      completeEvent: event,
      isExperimental: block.isExperimental,
      isReplay,
      state: BlockState.Error,
      execUUID: block.execUUID,
      originalExecUUID: (hasOriginalUUID(block) && block.originalExecUUID) || block.execUUID,
      startTime: block.startTime
    }
  } else {
    return {
      response,
      historyIdx,
      cwd: block.cwd,
      link: block.link,
      command: block.command,
      startEvent,
      completeEvent: event,
      isExperimental: block.isExperimental,
      isReplay,
      execUUID: block.execUUID,
      isSectionBreak: isCommentarySectionBreak(response),
      originalExecUUID: (hasOriginalUUID(block) && block.originalExecUUID) || block.execUUID,
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
  return (isOk(block) || isOops(block) || isEmpty(block)) && block.completeEvent !== undefined
}

export function hasBeenRerun(block: BlockModel): boolean {
  return (
    hasOriginalUUID(block) && hasUUID(block) && block.originalExecUUID !== block.execUUID && isWithCompleteEvent(block)
  )
}

/** @return whether the block is from replay */
export function isReplay(block: BlockModel): boolean {
  return (isProcessing(block) || isWithCompleteEvent(block)) && block.isReplay
}

/** @return whether the block is section break */
export function isSectionBreak(block: BlockModel): block is CompleteBlock & WithSectionBreak {
  return isOk(block) && block.isSectionBreak
}

/** A Block may be Rerunable. If so, then it can be transitioned to the BlockBeingRerun state. */
type RerunableBlock = CompleteBlock
type BlockBeingRerun = RerunableBlock & WithRerun

/** Transform a RerunableBlock to one in the BlockBeingRerun state */
export function Rerun(
  block: RerunableBlock,
  newStartEvent = block.startEvent,
  newCommand = newStartEvent.command,
  newStartTime = newStartEvent.startTime
): RerunableBlock & Required<WithRerun> {
  return Object.assign(block, {
    isRerun: true as const,
    startEvent: newStartEvent,
    command: newCommand,
    newExecUUID: uuid(),
    originalExecUUID: (hasOriginalUUID(block) && block.originalExecUUID) || block.execUUID,
    startTime: newStartTime
  })
}

/** this implements support for not showing the Output blocks when replaying a notebook */
export function hideOutput(model: BlockModel): boolean {
  return (
    hideReplayOutput() && // client asked us not to show replay output in notebooks
    isReplay(model) && // we are showing a notebook
    !hasBeenRerun(model) && // user has yet to re-execute the block in this notebook
    isFinished(model) &&
    !isCancelled(model) &&
    !isEmpty(model) &&
    !isCommentaryResponse(model.response)
  )
}
