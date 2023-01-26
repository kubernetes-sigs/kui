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

import type { StatusStripeChangeEvent } from '@kui-shell/core/mdist/api/Events'
import type { KResponse, ParsedOptions, Registrar } from '@kui-shell/core'

import { loadNotebook } from '@kui-shell/plugin-client-common/notebook'

/** For the Kui command registration: enforce one mandatory positional parameter */
// const required = [{ name: '<filepath>', docs: 'path to saved snapshot' }]

/** Usage for the replay command */
const replayUsage = {
  /* usage: {
    strict: 'replay',
    required,
    optional: [
      { name: '--new-window', alias: '-w', boolean: true, docs: 'Replay in a new window (Electron only)' },
      { name: '--replace-current-tab', alias: '-r', boolean: true, docs: 'Replace the content of the current tab' },
      { name: '--status-stripe', docs: 'Modify status stripe', allowed: ['default', 'blue', 'yellow', 'red'] }
    ]
  }, */
  flags: {
    alias: { 'new-window': ['w'], 'replace-current-tab': ['r'] },
    boolean: ['new-window', 'w', 'replace-current-tab', 'r']
  }
}

interface ReplayOptions extends ParsedOptions {
  'new-window': boolean
  'status-stripe': StatusStripeChangeEvent['type']

  /** Support for pymdownx.snippets */
  'snippet-base-path': string
}

/** Format a Markdown string that describes the given snapshot */
function formatMessage(title?: string) {
  return `**Now Playing**: ${title || 'a snapshot'}`
}

/** Command registration */
export default function (registrar: Registrar) {
  // Register the `replay-content` command; this deals with replaying
  // a command using fixed prefetched content. The assumption is that
  // `execOptions.data` has a view model (not a controller data model)
  // that can be directly injected into a view component. For example,
  // `kubectl get` responds with a controller data model, and the
  // `kubectl get` controller has also registered a viewTransformer
  // that takes the data model into a view model. To prefetch this
  // content, you can be assured to get a view model rather than a
  // data model if you do a pexec rather than a qexec. It may help to
  // pass pexec(cmdline, { quiet: true, echo: false, noHistory: true
  // }`) if you want to avoid the command execution during prefetch as
  // showing up in the Kui UI.
  registrar.listen<KResponse, ReplayOptions>('/replay-content', ({ execOptions }) => {
    if (Buffer.isBuffer(execOptions.data)) {
      throw new Error('Unsupported replay content')
    } else {
      return execOptions.data
    }
  })

  // Register the `replay` command; this deals with replaying a
  // markdown guidebook
  registrar.listen<KResponse, ReplayOptions>(
    '/replay',
    async ({ argvNoOptions, parsedOptions, REPL }) => {
      const [{ expandHomeDir }, { encodeComponent }, { inElectron }] = await Promise.all([
        import('@kui-shell/core/mdist/api/Util'),
        import('@kui-shell/core/mdist/api/Exec'),
        import('@kui-shell/core/mdist/api/Capabilities')
      ])

      const filepaths = argvNoOptions.slice(1).map(_ => expandHomeDir(_))

      if (parsedOptions['new-window'] && inElectron()) {
        // the electron bits are sequestered in plugin-electron, to
        // avoid pulling in electron for purely browser-based clients
        return REPL.qexec(`replay-electron ${filepaths}`)
      } else {
        const snippetBasePath = parsedOptions['snippet-base-path']
          ? ` --snippet-base-path ${encodeComponent(parsedOptions['snippet-base-path'])}`
          : ''

        const cmdline = (filepath: string) => `commentary --readonly ${snippetBasePath} -f ${encodeComponent(filepath)}`

        await Promise.all([
          parsedOptions.r ? REPL.pexec(cmdline(filepaths[0]), { noHistory: true }) : true,
          ...filepaths.slice(parsedOptions.r ? 1 : 0).map(async filepath => {
            const _src = await loadNotebook(filepath, { REPL })
            const src = typeof _src === 'string' ? _src : JSON.stringify(_src)

            const fm = await import('front-matter').then(_ => _.default<{ title?: string }>(src))
            const message = formatMessage(fm.attributes.title)
            const titleProps = fm.attributes.title ? `--title ${encodeComponent(fm.attributes.title)}` : ''

            // open tabs in background if we are doing a --replace-current-tab (-r) for the first
            const bg = parsedOptions.r ? '--bg' : ''

            await REPL.qexec(
              `tab new ${bg} --cmdline '${cmdline(filepath)}' ${titleProps} --status-stripe-type ${
                parsedOptions['status-stripe'] || 'blue'
              }`,
              undefined,
              undefined,
              { data: { 'status-stripe-message': message } }
            )
          })
        ])
      }

      return true
    },
    replayUsage
  )

  // register the `snapshot` command
  registrar.listen('/snapshot', async args => {
    const { eventBus } = await import('@kui-shell/core/mdist/api/Events')
    await eventBus.emitSnapshotRequest({}, args.tab.uuid)
    return true
  })
}
