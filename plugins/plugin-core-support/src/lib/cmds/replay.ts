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
  eventBus,
  inElectron,
  KResponse,
  ParsedOptions,
  Snapshot,
  SnapshotBlock,
  Registrar,
  promiseEach
} from '@kui-shell/core'

/**
 * Schema for a serialized snapshot of the Inputs and Outputs of
 * command executions.
 */
interface SerializedSnapshot {
  apiVersion: 'kui-shell/v1'
  kind: 'Snapshot'
  spec: Snapshot
}

/** @return wether or not the given `raw` json is an instance of SerializedSnapshot */
function isSerializedSnapshot(raw: Record<string, any>): raw is SerializedSnapshot {
  const model = raw as SerializedSnapshot
  return model.apiVersion === 'kui-shell/v1' && model.kind === 'Snapshot' && Array.isArray(model.spec.windows)
}

/** For the Kui command registration: enforce one mandatory positional parameter */
function usage(cmd: string) {
  return {
    usage: {
      strict: cmd,
      required: [{ name: '<filepath>', docs: 'path to saved snapshot' }],
      optional: [{ name: '--new-window', alias: '-w', boolean: true, docs: 'Replay in a new window (Electron only)' }]
    },
    flags: {
      boolean: ['new-window', 'w']
    }
  }
}

let nSnapshotable = 0
export function preload() {
  eventBus.onAddSnapshotable(() => nSnapshotable++)
  eventBus.onRemoveSnapshotable(() => nSnapshotable--)
}

interface Options extends ParsedOptions {
  'new-window': boolean
}

/** Command registration */
export default function(registrar: Registrar) {
  // register the `replay` command
  registrar.listen<KResponse, Options>(
    '/replay',
    async ({ argvNoOptions, parsedOptions, REPL, tab }) => {
      const filepath = argvNoOptions[1]

      if (parsedOptions['new-window'] && inElectron()) {
        // the electron bits are sequestered in plugin-electron, to
        // avoid pulling in electron for purely browser-based clients
        return REPL.qexec(`replay-electron ${filepath}`)
      }

      const model = JSON.parse(
        (await REPL.rexec<{ data: string }>(`vfs fstat ${REPL.encodeComponent(filepath)} --with-data`)).content.data
      )

      if (!isSerializedSnapshot(model)) {
        console.error('invalid snapshot', model)
        throw new Error('Invalid snapshot')
      } else {
        await promiseEach(model.spec.windows[0].tabs[0].blocks, async ({ startEvent, completeEvent }) => {
          // NOTE: work around the replayability issue of split command not returning a replayable model: https://github.com/IBM/kui/issues/5399
          if (startEvent.command === 'split') {
            await REPL.qexec('split')
          }

          eventBus.emitCommandStart(
            Object.assign({}, startEvent, { tab: Object.assign({}, tab, { uuid: startEvent.tab }) })
          )
          eventBus.emitCommandComplete(
            Object.assign({}, completeEvent, { tab: Object.assign({}, tab, { uuid: completeEvent.tab }) })
          )
        })
        return true
      }
    },
    usage('replay')
  )

  // register the `snapshot` command
  registrar.listen(
    '/snapshot',
    ({ argvNoOptions, REPL, tab }) =>
      new Promise((resolve, reject) => {
        let nSplits = 0
        let blocks: SnapshotBlock[] = []

        eventBus.emitSnapshotRequest(async (blocksInSplit: SnapshotBlock[]) => {
          blocks = blocks.concat(blocksInSplit)
          nSplits++

          if (nSplits === nSnapshotable) {
            // sort blocks by startTime
            blocks.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))

            try {
              const filepath = argvNoOptions[argvNoOptions.indexOf('snapshot') + 1]
              const snapshot: SerializedSnapshot = {
                apiVersion: 'kui-shell/v1',
                kind: 'Snapshot',
                spec: {
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

              const data = JSON.stringify(snapshot, replacer)
              await REPL.rexec<{ data: string }>(`fwrite ${REPL.encodeComponent(filepath)}`, { data })

              resolve(true)
            } catch (err) {
              reject(err)
            }
          }
        })
      }),
    usage('snapshot')
  )
}
