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
  SnapshottedEvent,
  isWatchable,
  eventBus,
  flatten,
  Tab,
  isTable
} from '@kui-shell/core'

import { CompleteBlock, isAnnouncement, isWithCompleteEvent, isOk, isOops } from './Block/BlockModel'

/**
 * Split: captures the split uuid and blocks in a split
 *
 */
export type Split = {
  uuid: string
  blocks: CompleteBlock[]
  inverseColors?: boolean
}

/** Schema for a record of onclick (startEvent, completeEvent) pairs */
export interface PreRecordedClicks {
  startEvents: Record<string, SnapshottedEvent<CommandStartEvent>[]>
  completeEvents: Record<string, SnapshottedEvent<CommandCompleteEvent>[]>
}

type NotebookSpec = {
  spec: {
    splits: Split[]
    preferReExecute?: boolean
    clicks?: PreRecordedClicks
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

    return Object.assign(block, { response: excludeWatchable(block.response), startEvent, completeEvent })
  }
}

/**
 * Record clicks
 *
 */
type Click = {
  completeEvent: CompleteBlock['completeEvent']
  onClicks: { rowIdx: number; onClick: string; echo: boolean }[]
}

/**
 * The command name we use to replay the click in a given block
 * (`execUUID`) and table row (`rowIdx`).
 *
 */
function replayClickFor(execUUID: string, rowIdx: number) {
  return `replay-click-${execUUID}-${rowIdx}`
}

export class FlightRecorder {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly tab: Tab, private readonly splits: Split[]) {}

  /** Find onclick handlers that we should crawl */
  private collectOnClicks(): Click[] {
    return flatten(
      this.splits.map(split => {
        return split.blocks
          .map(_ =>
            isWithCompleteEvent(_) && _.completeEvent && isTable(_.completeEvent.response)
              ? {
                  completeEvent: _.completeEvent,
                  onClicks: _.completeEvent.response.body
                    .map((row, rowIdx) =>
                      row.onclickIdempotent && typeof row.onclick === 'string'
                        ? { rowIdx, onClick: row.onclick, echo: !row.onclickSilence }
                        : undefined
                    )
                    .filter(_ => _)
                }
              : undefined
          )
          .filter(_ => _)
      })
    )
  }

  /**
   * Transform a E=Command*Event into the matching
   * SnapshottedEvent<E>, by splicing in the tab uuid in place of the
   * tab object. This allows us to replay in a repeatible way, since
   * tab uuids are a v5 sequence. See ScrollableTerminal for the
   * origin of the v5 sequence.
   *
   * Note: That we have to place this an a separate function is due to
   * typescript
   * limitations. https://github.com/microsoft/TypeScript/issues/35858
   *
   */
  private static xform<E extends CommandStartEvent | CommandCompleteEvent>(
    this: Pick<Click, 'completeEvent'>,
    evt: E
  ): SnapshottedEvent<E> {
    return Object.assign(Object.assign({}, evt, { tab: undefined }), { tab: this.completeEvent.tab })
  }

  /**
   * Accept a Command*Event pass it through `xform` (just above) and
   * store the resulting SnapshottedEvent in the given `this`
   * record. We should have an array of these, one per click handler
   * in a table; this is where the T[] comes from: that array is
   * parallel to the rows of the table being crawled.
   *
   */
  private static handler<E extends CommandStartEvent | CommandCompleteEvent, T extends SnapshottedEvent<E>>(
    this: Record<string, T[]>,
    click: Pick<Click, 'completeEvent'>,
    rowIdx: number,
    xform: (evt: E) => T,
    event: E
  ) {
    const events = this[click.completeEvent.execUUID] || []
    if (events.length === 0) {
      this[click.completeEvent.execUUID] = events
    }

    if (isTable(click.completeEvent.response)) {
      const row = click.completeEvent.response.body[rowIdx]
      row.onclick = replayClickFor(click.completeEvent.execUUID, rowIdx)
      row.onclickExec = 'qexec'
    }

    events[rowIdx] = xform(event)
  }

  /**
   * Run through the rows of a Table response, issue the onclick
   * handler, and store the (start,complete) event pairs, indexed by
   * row of the table; that's a ClickSnapshot.
   *
   */
  public async record(): Promise<PreRecordedClicks> {
    const fakeTab = Object.assign({}, this.tab, { uuid: uuid() })
    const startEvents: Record<string, SnapshottedEvent<CommandStartEvent>[]> = {}
    const completeEvents: Record<string, SnapshottedEvent<CommandCompleteEvent>[]> = {}

    const onclicks = this.collectOnClicks()

    await Promise.all(
      onclicks.map(async click => {
        await Promise.all(
          click.onClicks.map(async _ => {
            const xform = FlightRecorder.xform.bind(click)
            const onCommandStart = FlightRecorder.handler.bind(startEvents, click, _.rowIdx, xform)
            const onCommandComplete = FlightRecorder.handler.bind(completeEvents, click, _.rowIdx, xform)
            eventBus.onCommandStart(fakeTab.uuid, onCommandStart)
            eventBus.onCommandComplete(fakeTab.uuid, onCommandComplete)

            try {
              await fakeTab.REPL.pexec(_.onClick, { tab: fakeTab, echo: _.echo })
            } finally {
              eventBus.offCommandStart(fakeTab.uuid, onCommandStart)
              eventBus.offCommandComplete(fakeTab.uuid, onCommandComplete)
            }
          })
        )
      })
    )

    return { startEvents, completeEvents }
  }
}
