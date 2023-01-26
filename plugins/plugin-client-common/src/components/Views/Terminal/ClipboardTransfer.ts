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

import { v4 } from 'uuid'

import { getTabId } from '@kui-shell/core/mdist/api/Tab'
import { eventBus } from '@kui-shell/core/mdist/api/Events'
import type { CommandCompleteEvent, ScalarResponse } from '@kui-shell/core'

import ScrollableTerminal, { getSelectionText } from './ScrollableTerminal'
import { FinishedBlock, isFinished, hasStartEvent, isWithCompleteEvent } from './Block/BlockModel'

interface ClipboardTransfer {
  apiVersion: 'kui-shell/v1'
  kind: 'ClipboardTransfer'
  blocks: FinishedBlock[]
}

function isClipboardTransfer(transfer: Record<string, any>): transfer is ClipboardTransfer {
  return (
    transfer.apiVersion === 'kui-shell/v1' &&
    transfer.kind === 'ClipboardTransfer' &&
    Array.isArray(transfer.blocks) &&
    transfer.blocks.length > 0
  )
}

export function isClipboardTransferString(data: string): boolean {
  try {
    return isClipboardTransfer(JSON.parse(data))
  } catch (err) {
    return false
  }
}

/** The target of a clipboard operation */
interface Target {
  insertionIdx: number
  scrollbackIdx: number
  execUUID: string
}

/** Is this clipboard operation for me? */
function confirmTarget(me: ScrollableTerminal): Target {
  if (getSelectionText().length > 0) {
    // abort if there is text selected
    return
  }

  const isBlock = document.activeElement.classList.contains('repl-block')
  const isInput = document.activeElement.classList.contains('repl-input-element')
  if (isInput || isBlock) {
    // idx will be the insertion index
    const idx = parseInt(document.activeElement.getAttribute('data-input-count'), 10)
    const sbuuid = document.activeElement.getAttribute('data-scrollback-uuid')

    // make sure that this paste is for "us", i.e. for this Kui Tab.
    const scrollbackIdx = me.findSplit(me.state, sbuuid)
    if (scrollbackIdx >= 0) {
      // yup
      return {
        insertionIdx: idx,
        scrollbackIdx,
        execUUID: document.activeElement.getAttribute('data-uuid')
      }
    }
  }
}

/**
 * User has initiated a paste. First, we check that a block is
 * focused. We use this block to determine the insertion index. In
 * the future, we probably need to generalize this, so that we can
 * support pasting in the active block as well. Second, we make sure that
 *
 */
export function onPaste(this: ScrollableTerminal, evt: ClipboardEvent) {
  const target = confirmTarget(this)
  if (target) {
    // Yes, this event targets this Terminal. Now make sure that the
    // clipboard payload is a ClipboardTransfer
    try {
      const data = evt.clipboardData.getData('text')
      const transfer = JSON.parse(data)
      if (isClipboardTransfer(transfer)) {
        evt.preventDefault()

        // the target split
        const { uuid, facade } = this.state.splits[target.scrollbackIdx]

        // update the events to retarget them to our target split
        const execUUID = v4()
        const retarget = { execUUID, tab: facade }

        // finally, fire the events off
        if (hasStartEvent(transfer.blocks[0])) {
          const { startEvent } = transfer.blocks[0]
          const start = Object.assign(startEvent, retarget)
          this.onExecStart(uuid, false, start, target.insertionIdx)
        }

        if (isWithCompleteEvent(transfer.blocks[0])) {
          const { completeEvent } = transfer.blocks[0]
          const complete = Object.assign(completeEvent, retarget) as CommandCompleteEvent<ScalarResponse>
          this.onExecEnd(uuid, false, complete, target.insertionIdx)
        }
      }
    } catch (err) {
      // console.error(err)
      // ok! this just means the user pasted something that isn't JSON
      // see https://github.com/IBM/kui/issues/5836
    }
  }
}

/**
 * User has initiated a clipboard copy. As with paste, we confirm
 * first that this event is relevant to `this` Terminal. If so, we
 * collect the relevant blocks, and then write a `ClipboardTransfer`
 * object to the clipboard.
 *
 */
export function onCopy(this: ScrollableTerminal, evt: ClipboardEvent, onSuccess?: (target: Target) => void) {
  const target = confirmTarget(this)
  if (target) {
    eventBus.emitSnapshotRequest(
      {
        execUUID: target.execUUID,
        cb: async (snapshotBuffer: Buffer) => {
          if (!snapshotBuffer) {
            console.error('Could not find the target block to copy')
            return
          }

          const block = JSON.parse(snapshotBuffer.toString())
          if (!isFinished(block)) {
            console.error('invalid snapshot', block)
            throw new Error('Invalid snapshot')
          } else {
            const blocks = [block]
            const transfer: ClipboardTransfer = {
              apiVersion: 'kui-shell/v1',
              kind: 'ClipboardTransfer',
              blocks
            }

            navigator.clipboard.writeText(JSON.stringify(transfer))

            if (typeof onSuccess === 'function') {
              onSuccess(target)
            }
          }
        }
      },
      getTabId(this.props.tab)
    )
  }
}

/**
 * User has initated a cut. First copy. If that succeeded, the remove
 * the block.
 *
 */
export function onCut(this: ScrollableTerminal, evt: ClipboardEvent) {
  onCopy.bind(this)(evt, target => {
    this.state.splits[target.scrollbackIdx].willRemoveBlock(undefined, target.insertionIdx)
  })
}
