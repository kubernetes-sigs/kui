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

import { basename } from 'path'
import { ScalarResponse, UsageError, inBrowser } from '@kui-shell/core'

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
type WithCommand = { command: string } & WithCWD
type WithStartTime = { startTime: Date }
type WithState<S extends BlockState> = { state: S }
type WithResponse<R extends ScalarResponse> = { response: R } & WithStartTime
type WithValue = { value: string }

/** The canonical types of Blocks, which mix up the Traits as needed */
type ActiveBlock = WithState<BlockState.Active> & WithCWD & Partial<WithValue>
type EmptyBlock = WithState<BlockState.Empty> & WithCWD
type ErrorBlock = WithState<BlockState.Error> & WithCommand & WithResponse<Error> & WithUUID
type OkBlock = WithState<BlockState.ValidResponse> & WithCommand & WithResponse<ScalarResponse> & WithUUID
export type ProcessingBlock = WithState<BlockState.Processing> & WithCommand & WithUUID & WithStartTime
type CancelledBlock = WithState<BlockState.Cancelled> & WithCWD & WithCommand & WithUUID & WithStartTime

/** FinishedBlocks are either ok, error, or cancelled */
export type FinishedBlock = OkBlock | ErrorBlock | CancelledBlock | EmptyBlock

// A Block is one of the canonical types
export type BlockModel = ProcessingBlock | FinishedBlock | CancelledBlock | ActiveBlock
export default BlockModel

/** Capture the current working directory */
function cwd() {
  if (inBrowser()) {
    return process.env.PWD
  } else {
    return process.cwd() === process.env.HOME ? '~' : basename(process.cwd())
  }
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
  return !isActive(block)
}

export function hasUUID(block: BlockModel & Partial<WithUUID>): block is BlockModel & Required<WithUUID> {
  return !isActive(block) && !isEmpty(block)
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

/** Transform to Processing */
export function Processing(block: BlockModel, command: string, execUUID: string): ProcessingBlock {
  return {
    command,
    cwd: block.cwd,
    execUUID: execUUID,
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
export function Finished(block: ProcessingBlock, response: ScalarResponse, cancelled: boolean): FinishedBlock {
  if (cancelled) {
    return Cancelled(block)
  } else if (isError(response)) {
    return {
      response,
      cwd: block.cwd,
      command: block.command,
      state: BlockState.Error,
      execUUID: block.execUUID,
      startTime: block.startTime
    }
  } else {
    return {
      response,
      cwd: block.cwd,
      command: block.command,
      execUUID: block.execUUID,
      startTime: block.startTime,
      state: BlockState.ValidResponse
    }
  }
}
