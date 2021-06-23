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
  Notebook,
  isNotebook,
  isWatchable,
  eventBus,
  Tab,
  Table,
  isTable,
  isScalarContent,
  isMultiModalResponse
} from '@kui-shell/core'

import {
  FinishedBlock,
  hasStartEvent,
  isAnnouncement,
  isCancelled,
  isEmpty,
  isOk,
  isOops,
  isWithCompleteEvent
} from './Block/BlockModel'

/**
 * Split: captures the split uuid and blocks in a split
 *
 */
export type Split = {
  uuid: string
  blocks: FinishedBlock[]
  inverseColors?: boolean
}

type NotebookSpec = {
  spec: {
    splits: Split[]
  }
}

export type NotebookImpl = Notebook & NotebookSpec

export function isNotebookImpl(raw: Record<string, any>): raw is NotebookImpl {
  const model = raw as NotebookImpl
  return isNotebook(model) && model.spec && Array.isArray(model.spec.splits)
}

export function snapshot(block: FinishedBlock): FinishedBlock {
  if (!isAnnouncement(block) && (isOops(block) || isOk(block))) {
    const execOptions = Object.assign(
      {},
      block.completeEvent.execOptions,
      { block: undefined },
      { tab: block.completeEvent.execOptions.tab ? block.completeEvent.execOptions.tab.uuid : undefined }
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
    const excludeWatchable = (response: CommandCompleteEvent['response']) => {
      if (response && isWatchable(response)) {
        return Object.assign({}, response, { watch: undefined })
      } else {
        return response
      }
    }

    const tab = block.startEvent.tab
      ? block.startEvent.tab.uuid
      : block.completeEvent.tab
      ? block.completeEvent.tab.uuid
      : undefined
    const startEvent = Object.assign({}, block.startEvent, { tab })

    const completeEvent = Object.assign(
      {},
      block.completeEvent,
      { execOptions, evaluatorOptions },
      { tab },
      { response: excludeWatchable(block.completeEvent.response) }
    )

    return Object.assign(block, {
      isReplay: true,
      response: excludeWatchable(block.response),
      startEvent,
      completeEvent
    })
  } else if (isEmpty(block)) {
    const execOptions = Object.assign(
      {},
      block.completeEvent.execOptions,
      { block: undefined },
      {
        tab:
          block.completeEvent.execOptions && block.completeEvent.execOptions.tab
            ? block.completeEvent.execOptions.tab.uuid
            : undefined
      }
    )

    const evaluatorOptions = Object.assign({}, block.completeEvent.evaluatorOptions, {
      usage: undefined,
      flags: undefined
    })

    const tab = block.completeEvent.tab ? block.completeEvent.tab.uuid : undefined

    const completeEvent = Object.assign({}, block.completeEvent, { execOptions, evaluatorOptions }, { tab })

    return Object.assign(block, {
      isReplay: true,
      completeEvent
    })
  } else if (isCancelled(block)) {
    return Object.assign(block, { isReplay: true })
  }
}

export function allocateTab(target: CommandStartEvent | CommandCompleteEvent, tab: Tab) {
  Object.assign(target, { tab })
}

/** assign tab to the block */
export function tabAlignment(block: FinishedBlock, tab: Tab): FinishedBlock {
  const allocateTabForTable = (table: Table) => {
    table.body.forEach(row => {
      const onclickHome = row.onclick ? row : row.attributes.find(_ => _.onclick && _.key === 'NAME')
      if (onclickHome && onclickHome.onclick && onclickHome.onclick.startEvent && onclickHome.onclick.completeEvent) {
        allocateTab(onclickHome.onclick.startEvent, tab)
        allocateTab(onclickHome.onclick.completeEvent, tab)
      }
    })
  }

  if (isWithCompleteEvent(block)) {
    if (isMultiModalResponse(block.completeEvent.response)) {
      block.completeEvent.response.modes.forEach(mode => {
        if (isScalarContent(mode)) {
          if (isTable(mode.content)) {
            allocateTabForTable(mode.content)
          }
        }
      })

      block.response = block.completeEvent.response
    } else if (isTable(block.completeEvent.response)) {
      allocateTabForTable(block.completeEvent.response)
      block.response = block.completeEvent.response
    }

    allocateTab(block.completeEvent, tab)
  }

  if (hasStartEvent(block)) {
    allocateTab(block.startEvent, tab)
  }

  return block
}

export class FlightRecorder {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly tab: Tab, private readonly splits: Split[]) {}

  private async recordTable(table: Table) {
    await Promise.all(
      table.body.map(async row => {
        if (row.onclickIdempotent) {
          // look for onclicks in either the row, or a cell NAME
          const onclickHome =
            typeof row.onclick === 'string' ? row : row.attributes.find(_ => _.onclick && /Name/i.test(_.key))
          if (onclickHome && typeof onclickHome.onclick === 'string') {
            const fakeTab = Object.assign({}, this.tab, { uuid: uuid() })
            const command = onclickHome.onclick
            onclickHome.onclick = {}

            const onCommandStart = (startEvent: CommandStartEvent) => {
              Object.assign(onclickHome.onclick, { startEvent })
            }
            const onCommandComplete = (completeEvent: CommandCompleteEvent) => {
              Object.assign(onclickHome.onclick, { completeEvent })
            }

            eventBus.onCommandStart(fakeTab.uuid, onCommandStart)
            eventBus.onCommandComplete(fakeTab.uuid, onCommandComplete)

            try {
              await fakeTab.REPL.pexec(command, { tab: fakeTab })
            } catch (err) {
              console.error('Error recording click', command, err)
            } finally {
              eventBus.offCommandStart(fakeTab.uuid, onCommandStart)
              eventBus.offCommandComplete(fakeTab.uuid, onCommandComplete)
            }
          }
        }
      })
    )
  }

  /**
   * Run through the rows of a Table response, issue the onclick
   * handler, and store the (start,complete) event pairs, indexed by
   * row of the table; that's a ClickSnapshot.
   *
   */
  public async record() {
    await Promise.all(
      this.splits.map(split =>
        Promise.all(
          split.blocks.map(async _ => {
            if (isWithCompleteEvent(_)) {
              if (isMultiModalResponse(_.completeEvent.response)) {
                await Promise.all(
                  _.completeEvent.response.modes.map(async mode => {
                    if (isScalarContent(mode)) {
                      if (isTable(mode.content)) {
                        await this.recordTable(mode.content)
                      }
                    }
                  })
                )
              } else if (isTable(_.completeEvent.response)) {
                await this.recordTable(_.completeEvent.response)
              }
            }
          })
        )
      )
    )
  }
}
