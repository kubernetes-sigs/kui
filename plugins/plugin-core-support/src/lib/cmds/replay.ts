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
import { basename, dirname, extname, join } from 'path'

import {
  eventBus,
  isTable,
  inElectron,
  Arguments,
  CodedError,
  CommandStartEvent,
  CommandCompleteEvent,
  TabLayoutModificationResponse,
  NewSplitRequest,
  KResponse,
  ParsedOptions,
  Registrar,
  Snapshot,
  SnapshotBlock,
  SnapshottedEvent,
  StatusStripeChangeEvent,
  Tab,
  getPrimaryTabId,
  promiseEach
} from '@kui-shell/core'

/** Schema for a record of onclick (startEvent, completeEvent) pairs */
interface ClickSnapshot {
  startEvents: Record<string, SnapshottedEvent<CommandStartEvent>[]>
  completeEvents: Record<string, SnapshottedEvent<CommandCompleteEvent>[]>
}

/**
 * Schema for a serialized snapshot of the Inputs and Outputs of
 * command executions.
 */
export interface SerializedSnapshot {
  apiVersion: 'kui-shell/v1'
  kind: 'Snapshot'
  spec: Snapshot & {
    clicks: ClickSnapshot
    title?: string
    description?: string
  }
}

/** @return wether or not the given `raw` json is an instance of SerializedSnapshot */
function isSerializedSnapshot(raw: Record<string, any>): raw is SerializedSnapshot {
  const model = raw as SerializedSnapshot
  return model.apiVersion === 'kui-shell/v1' && model.kind === 'Snapshot' && Array.isArray(model.spec.windows)
}

/** For the Kui command registration: enforce one mandatory positional parameter */
const required = [{ name: '<filepath>', docs: 'path to saved snapshot' }]

/** Usage for the replay command */
const replayUsage = {
  usage: {
    strict: 'replay',
    required,
    optional: [
      { name: '--freshen', alias: '-f', boolean: true, docs: 'Regenerate snapshot' },
      { name: '--new-window', alias: '-w', boolean: true, docs: 'Replay in a new window (Electron only)' },
      { name: '--new-tab', alias: '-t', boolean: true, docs: 'Replay in a tab' },
      { name: '--status-stripe', docs: 'Modify status stripe', allowed: ['default', 'blue', 'yellow', 'red'] }
    ]
  },
  flags: {
    boolean: ['new-window', 'w', 'new-tab', 't', 'freshen', 'f']
  }
}

/** Usage for the snapshot command */
const snapshotUsage = {
  usage: {
    strict: 'snapshot',
    required,
    optional: [
      { name: '--shallow', alias: '-s', boolean: true, docs: 'Do not record click events' },
      { name: '--description', alias: '-d', docs: 'Description for this snapshot' },
      { name: '--title', alias: '-t', docs: 'Title for this snapshot' }
    ]
  },
  flags: {
    boolean: ['--shallow', '-s']
  }
}

let nSnapshotable = 0
export function preload() {
  eventBus.onAddSnapshotable(() => nSnapshotable++)
  eventBus.onRemoveSnapshotable(() => nSnapshotable--)
}

interface ReplayOptions extends ParsedOptions {
  'new-tab': boolean
  'new-window': boolean
  'status-stripe': StatusStripeChangeEvent['type']
}

interface SnapshotOptions extends ParsedOptions {
  s?: boolean
  shallow?: boolean
  d?: string
  description?: string
  t?: string
  title?: string
}

/** Format a Markdown string that describes the given snapshot */
function formatMessage(snapshot: SerializedSnapshot) {
  return `**Now Playing**: ${snapshot.spec.title || 'a snapshot'}`
}

/** Re-emit prior start event in new tab */
function reEmitStartInTab(tab: Tab, uuid: string, startEvent: SnapshotBlock['startEvent']) {
  eventBus.emitCommandStart(Object.assign({}, startEvent, { tab: Object.assign({}, tab, { uuid }) }))
}

/** Re-emit prior complete event in new tab */
function reEmitCompleteInTab(tab: Tab, uuid: string, completeEvent: SnapshotBlock['completeEvent']) {
  const evt = Object.assign({}, completeEvent, { tab: Object.assign({}, tab, { uuid }) })
  eventBus.emitCommandComplete(evt)
}

/**
 * The command name we use to replay the click in a given block
 * (`execUUID`) and table row (`rowIdx`).
 *
 */
function replayClickFor(execUUID: string, rowIdx: number) {
  return `replay-click-${execUUID}-${rowIdx}`
}

/**
 * Record clicks
 *
 */
type Click = { completeEvent: SnapshotBlock['completeEvent']; onClicks: { rowIdx: number; onClick: string }[] }
class FlightRecorder {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly tab: Tab, private readonly blocks: SnapshotBlock[]) {}

  /** Find onclick handlers that we should crawl */
  private collectOnClicks(): Click[] {
    return this.blocks
      .map(_ =>
        _.completeEvent && isTable(_.completeEvent.response)
          ? {
              completeEvent: _.completeEvent,
              onClicks: _.completeEvent.response.body
                .map((_, rowIdx) =>
                  _.onclickIdempotent && typeof _.onclick === 'string' ? { rowIdx, onClick: _.onclick } : undefined
                )
                .filter(_ => _)
            }
          : undefined
      )
      .filter(_ => _)
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
    }

    events[rowIdx] = xform(event)
  }

  /**
   * Run through the rows of a Table response, issue the onclick
   * handler, and store the (start,complete) event pairs, indexed by
   * row of the table; that's a ClickSnapshot.
   *
   */
  public async record(): Promise<ClickSnapshot> {
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
              await fakeTab.REPL.pexec(_.onClick, { tab: fakeTab })
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

/** @return name of backup file or void if backup not needed */
function backup(REPL: Arguments['REPL'], filepath: string): Promise<string | void> {
  const ext = extname(filepath)
  const bak = join(dirname(filepath), basename(filepath, ext) + '.bak' + ext)
  return REPL.rexec(`cp ${REPL.encodeComponent(filepath)} ${REPL.encodeComponent(bak)}`, { quiet: undefined })
    .then(() => bak)
    .catch((err: CodedError<string>) => {
      if (err.code !== 'ENOENT') {
        throw err
      } else {
      }
    })
}

/** Regenerate snapshot */
async function freshen(REPL: Arguments['REPL'], filepath: string) {
  const bak = await backup(REPL, filepath)
  await REPL.qexec(
    `tab new --cmdline "kui-freshen ${filepath} --in-new-tab" --title "Freshening ${basename(filepath)}"`
  )
  return `Notebook has been freshened${bak ? `. Backup placed in ${bak}.` : ''}`
}

/** Load snapshot model from disk */
async function loadSnapshot(REPL: Arguments['REPL'], filepath: string): Promise<SerializedSnapshot> {
  return JSON.parse(
    (await REPL.rexec<{ data: string }>(`vfs fstat ${REPL.encodeComponent(filepath)} --with-data`)).content.data
  )
}

/** Command registration */
export default function(registrar: Registrar) {
  // register the `replay` command
  registrar.listen<KResponse, ReplayOptions>(
    '/replay',
    async ({ argvNoOptions, parsedOptions, REPL, tab }) => {
      const filepath = argvNoOptions[1]

      if (parsedOptions.freshen) {
        return freshen(REPL, filepath)
      }

      const model = await loadSnapshot(REPL, filepath)
      if (!isSerializedSnapshot(model)) {
        console.error('invalid snapshot', model)
        throw new Error('Invalid snapshot')
      } else {
        const message = formatMessage(model)
        const titleOption = model.spec.title ? `--title "${model.spec.title}"` : ''

        if (parsedOptions['new-window'] && inElectron()) {
          // the electron bits are sequestered in plugin-electron, to
          // avoid pulling in electron for purely browser-based clients
          return REPL.qexec(`replay-electron ${filepath} ${titleOption}`)
        } else if (parsedOptions['new-tab']) {
          return REPL.qexec(
            `tab new --cmdline "replay ${filepath}" --status-stripe-type ${parsedOptions['status-stripe'] ||
              'blue'} ${titleOption}`,
            undefined,
            undefined,
            { data: { 'status-stripe-message': message } }
          )
        } else if (parsedOptions['status-stripe']) {
          tab.state.desiredStatusStripeDecoration = {
            type: parsedOptions['status-stripe'],
            message
          }
        }

        // we need to map the split uuids in the snapshot to those in
        // the current tab
        const splitAlignment: Record<string, string> = {}

        if (model.spec.clicks) {
          Object.keys(model.spec.clicks.startEvents).forEach(execUUID => {
            const startEvents = model.spec.clicks.startEvents[execUUID]
            const completeEvents = model.spec.clicks.completeEvents[execUUID]
            if (startEvents && completeEvents && startEvents.length === completeEvents.length) {
              startEvents.forEach((startEvent, rowIdx) => {
                const completeEvent = completeEvents[rowIdx]
                if (startEvent && completeEvent) {
                  const channel = `/${replayClickFor(execUUID, rowIdx)}`
                  registrar.listen(channel, async () => {
                    const uuid = splitAlignment[startEvent.tab]
                    reEmitStartInTab(tab, uuid, startEvent)
                    reEmitCompleteInTab(tab, uuid, completeEvent)
                    return true
                  })
                }
              })
            }
          })
        }

        await promiseEach(model.spec.windows[0].tabs[0].blocks, async ({ startEvent, completeEvent }) => {
          // if (!splitAlignment[startEvent.tab]) {
          // splitAlignment[startEvent.tab] = splits[splits.length - 1]
          // }

          if (!splitAlignment[startEvent.tab]) {
            const ourUUID = tab.uuid
            const theirUUID = startEvent.tab
            splitAlignment[theirUUID] = ourUUID
          }

          // in order to maintain tab-index-invariance, we need to
          // remember the mapping from the new split's ID at the time
          // of replay (`tabUUIDOfNewSplitBefore`); then, after
          // re-issuing the complete event, just below, we will tie
          // this together with the split ID in this current world
          const tabUUIDOfNewSplitBefore =
            startEvent.route === '/split'
              ? (completeEvent.response as TabLayoutModificationResponse<NewSplitRequest>).spec.ok.props.tabUUID
              : undefined

          const uuid = splitAlignment[startEvent.tab]
          try {
            reEmitStartInTab(tab, uuid, startEvent)
            reEmitCompleteInTab(tab, uuid, completeEvent)
          } catch (err) {
            console.error(err)
          }

          // here is where we update the tabUUID mapping for that new
          // split; after re-issuing the complete event, we should
          // have the split's tabUUID in this new world
          if (tabUUIDOfNewSplitBefore !== undefined) {
            const theirUUID = tabUUIDOfNewSplitBefore
            const ourUUID = (completeEvent.response as TabLayoutModificationResponse<NewSplitRequest>).spec.ok.props
              .tabUUID
            splitAlignment[theirUUID] = ourUUID
          }
        })

        setTimeout(() => tab.scrollToTop())
        return true
      }
    },
    replayUsage
  )

  // register the `snapshot` command
  registrar.listen<KResponse, SnapshotOptions>(
    '/snapshot',
    ({ argvNoOptions, parsedOptions, REPL, tab }) =>
      new Promise((resolve, reject) => {
        let nSplits = 0
        let blocks: SnapshotBlock[] = []

        // debounce block callbacks
        const seenExecUUIDs: Record<string, boolean> = {}

        const ourMainTab = getPrimaryTabId(tab)
        eventBus.emitSnapshotRequest({
          filter: (evt: CommandStartEvent) => {
            if (
              !/^kui-freshen/.test(evt.command) &&
              getPrimaryTabId(evt.tab) === ourMainTab &&
              !seenExecUUIDs[evt.execUUID]
            ) {
              seenExecUUIDs[evt.execUUID] = true
              return true
            }
          },
          cb: async (blocksInSplit: SnapshotBlock[]) => {
            blocks = blocks.concat(blocksInSplit)
            nSplits++

            if (nSplits === nSnapshotable) {
              // sort blocks by startTime
              blocks.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))

              // if needed, we could optimize this by recording per
              // blocksInSplit, as they arrive
              const clicks = parsedOptions.shallow ? undefined : await new FlightRecorder(tab, blocks).record()

              try {
                const filepath = argvNoOptions[argvNoOptions.indexOf('snapshot') + 1]
                const snapshot: SerializedSnapshot = {
                  apiVersion: 'kui-shell/v1',
                  kind: 'Snapshot',
                  spec: {
                    title: parsedOptions.t || parsedOptions.title,
                    description: parsedOptions.d || parsedOptions.description,
                    clicks,
                    windows: [
                      {
                        uuid: '0',
                        tabs: [
                          {
                            uuid: '0',
                            blocks
                          }
                        ]
                      }
                    ]
                  }
                }

                /**
                 * We have excluded block and replaced tab with uuid in the top level
                 * completeEvent and startEvent of a snapshot,
                 * but there are still some underlying properties have tab and block,
                 * so we filter out HTML tab and block in the replacer,
                 * see issue: https://github.com/IBM/kui/issues/5458
                 *
                 */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const replacer = (key: string, value: any) => {
                  if (key === 'tab' && typeof value === typeof tab) {
                    return undefined
                  } else if (key === 'block') {
                    return undefined
                  } else {
                    return value
                  }
                }

                const data = JSON.stringify(snapshot, replacer, 2)
                await REPL.rexec<{ data: string }>(`fwrite ${REPL.encodeComponent(filepath)}`, { data })

                resolve(true)
              } catch (err) {
                reject(err)
              }
            }
          }
        })
      }),
    snapshotUsage
  )

  /** Freshen command handler */
  registrar.listen<KResponse, { 'in-new-tab': boolean }>(
    '/kui-freshen',
    async args => {
      const filepath = args.argvNoOptions[1]
      const model = await loadSnapshot(args.REPL, filepath)

      // some older snapshots have duplicates due to an earlier bug
      const seenExecUUIDs: Record<string, boolean> = {}

      // reexecute the commands
      const splitAlignment: Record<string, Tab> = {}
      await promiseEach(model.spec.windows[0].tabs[0].blocks, async ({ startEvent, completeEvent }) => {
        try {
          if (!seenExecUUIDs[startEvent.execUUID]) {
            seenExecUUIDs[startEvent.execUUID] = true

            if (!splitAlignment[startEvent.tab]) {
              const theirUUID = startEvent.tab
              splitAlignment[theirUUID] = args.tab
            }

            const tabUUIDOfNewSplitBefore =
              startEvent.route === '/split'
                ? (completeEvent.response as TabLayoutModificationResponse<NewSplitRequest>).spec.ok.props.tabUUID
                : undefined

            const tab = splitAlignment[startEvent.tab]
            const response = await args.REPL.pexec(startEvent.command, { tab })

            if (tabUUIDOfNewSplitBefore !== undefined) {
              const theirUUID = tabUUIDOfNewSplitBefore
              const ourTab = (response as TabLayoutModificationResponse<NewSplitRequest>).spec.ok.props.tab
              splitAlignment[theirUUID] = ourTab()
            }
          }
        } catch (err) {
          console.error(`Error freshening: ${err.message}`, startEvent, err)
        }
      })

      // save the snapshot
      const titleOption = model.spec.title ? ` --title "${model.spec.title}"` : ''
      const descrOption = model.spec.description ? ` --description "${model.spec.description}"` : ''
      await args.REPL.qexec(`snapshot ${args.REPL.encodeComponent(filepath)} ${titleOption} ${descrOption}`)

      // close our temporary tab
      if (args.parsedOptions['in-new-tab']) {
        // the -A asks to close all splits in the tab
        await args.REPL.pexec('tab close -A')
      }

      return true
    },
    { flags: { boolean: ['in-new-tab'] } }
  )
}
