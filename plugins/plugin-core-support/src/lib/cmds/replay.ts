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

import {
  eventBus,
  expandHomeDir,
  inElectron,
  Arguments,
  CommandStartEvent,
  KResponse,
  ParsedOptions,
  Registrar,
  StatusStripeChangeEvent,
  Notebook,
  isNotebook,
  getPrimaryTabId
} from '@kui-shell/core'

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
      { name: '--close-current-tab', alias: '-c', boolean: true, docs: 'Also close the current tab' },
      { name: '--replace-current-tab', alias: '-r', boolean: true, docs: 'Replace the content of the current tab' },
      { name: '--status-stripe', docs: 'Modify status stripe', allowed: ['default', 'blue', 'yellow', 'red'] }
    ]
  },
  flags: {
    alias: { 'new-window': ['w'], freshen: ['f'], 'close-current-tab': ['c'], 'replace-current-tab': ['r'] },
    boolean: ['new-window', 'w', 'freshen', 'f', 'close-current-tab', 'c', 'replace-current-tab', 'r']
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
      { name: '--exec', alias: '-x', docs: 'Prefer to re-execute commands when replay' },
      { name: '--title', alias: '-t', docs: 'Title for this snapshot' }
    ]
  },
  flags: {
    boolean: ['--shallow', '-s']
  }
}

interface ReplayOptions extends ParsedOptions {
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
  exec?: boolean
  x?: boolean
}

/** Format a Markdown string that describes the given snapshot */
function formatMessage(snapshot: Notebook) {
  return `**Now Playing**: ${snapshot.metadata.name || 'a snapshot'}`
}

/** Load snapshot model from disk */
async function loadNotebook(REPL: Arguments['REPL'], filepath: string): Promise<Notebook> {
  return JSON.parse(
    (await REPL.rexec<{ data: string }>(`vfs fstat ${REPL.encodeComponent(filepath)} --with-data`)).content.data
  )
}

/** Command registration */
export default function(registrar: Registrar) {
  // register the `replay` command
  registrar.listen<KResponse, ReplayOptions>(
    '/replay',
    async ({ argvNoOptions, parsedOptions, REPL }) => {
      const filepaths = argvNoOptions.slice(1).map(_ => expandHomeDir(_))
      const models = await Promise.all(filepaths.map(filepath => loadNotebook(REPL, filepath)))

      const valid = models.map(_ => isNotebook(_))
      const nInvalid = models.reduce((N, valid) => (N += valid ? 0 : 1), 0)
      if (nInvalid > 0) {
        const invalids = filepaths.filter((_, idx) => !valid[idx])
        console.error('invalid notebooks', invalids)
        throw new Error(invalids.length === 1 ? 'Invalid notebook' : `Invalid notebooks: ${invalids.join(' ')}`)
      } else {
        const messages = models.map(formatMessage)
        const titles = models.map(model => (model.metadata.name ? model.metadata.name : ''))
        const titleOptions =
          titles.length === 0 || titles.every(_ => _.length === 0) ? '' : `--title "${titles.join(',')}"`

        if (parsedOptions['new-window'] && inElectron()) {
          // the electron bits are sequestered in plugin-electron, to
          // avoid pulling in electron for purely browser-based clients
          return REPL.qexec(`replay-electron ${filepaths}`)
        } else {
          if (parsedOptions.c) {
            // see https://github.com/IBM/kui/issues/5929
            await REPL.qexec('tab close')
          }

          return REPL.qexec(
            `tab new --snapshot "${filepaths.join(',')}" --quiet --status-stripe-type ${parsedOptions[
              'status-stripe'
            ] || 'blue'} ${titleOptions} ${parsedOptions.r ? ' -r' : ''}`,
            undefined,
            undefined,
            { data: { 'status-stripe-message': messages.length === 1 ? messages[0] : messages } }
          )
        }
      }
    },
    replayUsage
  )

  // register the `snapshot` command
  registrar.listen<KResponse, SnapshotOptions>(
    '/snapshot',
    ({ argvNoOptions, parsedOptions, REPL, tab }) =>
      new Promise((resolve, reject) => {
        // debounce block callbacks
        const seenExecUUIDs: Record<string, boolean> = {}

        const ourMainTab = getPrimaryTabId(tab)
        eventBus.emitSnapshotRequest(
          {
            filter: (evt: CommandStartEvent) => {
              if (!seenExecUUIDs[evt.execUUID]) {
                seenExecUUIDs[evt.execUUID] = true
                return true
              }
            },
            cb: async (snapshot: Buffer) => {
              try {
                const filepath = expandHomeDir(argvNoOptions[argvNoOptions.indexOf('snapshot') + 1])
                await REPL.rexec<{ data: string }>(`vfs fwrite ${REPL.encodeComponent(filepath)}`, {
                  data: Buffer.from(snapshot).toString()
                })
                resolve(true)
              } catch (err) {
                reject(err)
              }
            },
            opts: {
              name: parsedOptions.t || parsedOptions.title,
              description: parsedOptions.d || parsedOptions.description,
              preferReExecute: parsedOptions.exec || parsedOptions.x,
              shallow: parsedOptions.shallow
            }
          },
          ourMainTab
        )
      }),
    snapshotUsage
  )
}
