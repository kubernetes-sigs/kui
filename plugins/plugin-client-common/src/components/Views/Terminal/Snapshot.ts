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

import { v4 as uuid } from 'uuid'

import {
  CommandStartEvent,
  CommandCompleteEvent,
  Notebook,
  isNotebook,
  isWatchable,
  eventBus,
  Tab,
  isTable
} from '@kui-shell/core'

import { CompleteBlock, isAnnouncement, isOk, isOops } from './Block/BlockModel'

/**
 * Split: captures the split uuid and blocks in a split
 *
 */
export type Split = {
  uuid: string
  blocks: CompleteBlock[]
  inverseColors?: boolean
}

type NotebookSpec = {
  spec: {
    splits: Split[]
    preferReExecute?: boolean
  }
}

export type NotebookImpl = Notebook & NotebookSpec

export function isNotebookImpl(raw: Record<string, any>): raw is NotebookImpl {
  const model = raw as NotebookImpl
  return isNotebook(model) && model.spec && Array.isArray(model.spec.splits)
}

export function snapshot(block: CompleteBlock): CompleteBlock {
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

    const startEvent = Object.assign({}, block.startEvent, { tab: block.startEvent.tab.uuid })

    const completeEvent = Object.assign(
      {},
      block.completeEvent,
      { execOptions, evaluatorOptions },
      { tab: block.completeEvent.tab.uuid },
      { response: excludeWatchable(block.completeEvent.response) }
    )

    return Object.assign(block, {
      isReplay: true,
      response: excludeWatchable(block.response),
      startEvent,
      completeEvent
    })
  }
}

export function allocateTab(target: CommandStartEvent | CommandCompleteEvent, tab: Tab) {
  Object.assign(target, { tab })
}

/** assign tab to the block */
export function tabAlignment(block: CompleteBlock, tab: Tab): CompleteBlock {
  if (isTable(block.completeEvent.response)) {
    block.completeEvent.response.body.forEach(row => {
      if (row.onclick && row.onclick.startEvent && row.onclick.completeEvent) {
        allocateTab(row.onclick.startEvent, tab)
        allocateTab(row.onclick.completeEvent, tab)
      }
    })

    block.response = block.completeEvent.response
  }

  allocateTab(block.completeEvent, tab)
  allocateTab(block.startEvent, tab)

  return block
}

export class FlightRecorder {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly tab: Tab, private readonly splits: Split[]) {}

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
            if (isTable(_.completeEvent.response)) {
              await Promise.all(
                _.completeEvent.response.body.map(async row => {
                  if (row.onclickIdempotent && typeof row.onclick === 'string') {
                    const fakeTab = Object.assign({}, this.tab, { uuid: uuid() })
                    const command = row.onclick
                    row.onclick = {}

                    const onCommandStart = (startEvent: CommandStartEvent) => {
                      Object.assign(row.onclick, { startEvent })
                    }
                    const onCommandComplete = (completeEvent: CommandCompleteEvent) => {
                      Object.assign(row.onclick, { completeEvent })
                    }

                    eventBus.onCommandStart(fakeTab.uuid, onCommandStart)
                    eventBus.onCommandComplete(fakeTab.uuid, onCommandComplete)

                    try {
                      await fakeTab.REPL.pexec(command, { tab: fakeTab, echo: !row.onclickSilence })
                    } finally {
                      eventBus.offCommandStart(fakeTab.uuid, onCommandStart)
                      eventBus.offCommandComplete(fakeTab.uuid, onCommandComplete)
                    }
                  }
                })
              )
            }
          })
        )
      )
    )
  }
}
