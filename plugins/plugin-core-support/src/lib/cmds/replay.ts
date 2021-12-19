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
  Capabilities,
  Events,
  Arguments,
  KResponse,
  ParsedOptions,
  Registrar,
  encodeComponent,
  Util
} from '@kui-shell/core'

/** For the Kui command registration: enforce one mandatory positional parameter */
const required = [{ name: '<filepath>', docs: 'path to saved snapshot' }]

/** Usage for the replay command */
const replayUsage = {
  usage: {
    strict: 'replay',
    required,
    optional: [
      { name: '--new-window', alias: '-w', boolean: true, docs: 'Replay in a new window (Electron only)' },
      { name: '--replace-current-tab', alias: '-r', boolean: true, docs: 'Replace the content of the current tab' },
      { name: '--status-stripe', docs: 'Modify status stripe', allowed: ['default', 'blue', 'yellow', 'red'] }
    ]
  },
  flags: {
    alias: { 'new-window': ['w'], 'replace-current-tab': ['r'] },
    boolean: ['new-window', 'w', 'replace-current-tab', 'r']
  }
}

interface ReplayOptions extends ParsedOptions {
  'new-window': boolean
  'status-stripe': Events.StatusStripeChangeEvent['type']
}

/** Format a Markdown string that describes the given snapshot */
function formatMessage(title?: string) {
  return `**Now Playing**: ${title || 'a snapshot'}`
}

/** Load snapshot model from disk */
async function loadNotebook(REPL: Arguments['REPL'], filepath: string): Promise<string> {
  return (await REPL.rexec<{ data: string }>(`vfs fstat ${REPL.encodeComponent(filepath)} --with-data`)).content.data
}

/** Command registration */
export default function(registrar: Registrar) {
  // register the `replay` command
  registrar.listen<KResponse, ReplayOptions>(
    '/replay',
    async ({ argvNoOptions, parsedOptions, REPL }) => {
      const filepaths = argvNoOptions.slice(1).map(_ => Util.expandHomeDir(_))

      if (parsedOptions['new-window'] && Capabilities.inElectron()) {
        // the electron bits are sequestered in plugin-electron, to
        // avoid pulling in electron for purely browser-based clients
        return REPL.qexec(`replay-electron ${filepaths}`)
      } else {
        await Promise.all(
          filepaths.map(async filepath => {
            const cmdline = `commentary --readonly -f ${encodeComponent(filepath)}`
            const src = await loadNotebook(REPL, filepath)

            const fm = await import('front-matter').then(_ => _.default<{ title?: string }>(src))
            const message = formatMessage(fm.attributes.title)
            const titleProps = fm.attributes.title ? `--title ${encodeComponent(fm.attributes.title)}` : ''

            return REPL.qexec(
              `tab new --cmdline "${cmdline}" ${titleProps} --status-stripe-type ${parsedOptions['status-stripe'] ||
                'blue'}`,
              undefined,
              undefined,
              { data: { 'status-stripe-message': message } }
            )
          })
        )
      }
    },
    replayUsage
  )

  // register the `snapshot` command
  registrar.listen('/snapshot', async args => {
    await Events.eventBus.emitSnapshotRequest({}, args.tab.uuid)
    return true
  })
}
