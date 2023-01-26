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

import type { Arguments, Registrar, ParsedOptions, UsageModel, ReactResponse } from '@kui-shell/core'

import Alert from '../components/spi/Alert'

/**
 * alert command parsedOptions type
 */
interface AlertOptions extends ParsedOptions {
  body: string
}

/**
 * alert command usage
 */
const usage: UsageModel = {
  command: 'alert',
  strict: 'alert',
  example: 'alert [<alert type>] [<alert title text>] [--body <alert body text>]',
  docs: 'Alert',
  required: [
    {
      name: 'type',
      docs: 'info, success, warning, or error'
    },
    {
      name: 'title',
      docs: 'alert title text'
    }
  ],
  optional: [
    {
      name: '--body',
      docs: 'alert body text'
    }
  ]
}

/**
 * alert command handler
 *
 */
async function doAlert(opts: Arguments<AlertOptions>): Promise<ReactResponse> {
  const argv = opts.argvNoOptions
  const option = opts.parsedOptions
  const type = argv[1]
  const title = argv[2]

  const [{ isSupportedToolbarTextType }, { UsageError }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Sidecar'),
    import('@kui-shell/core/mdist/api/Response')
  ])

  if (isSupportedToolbarTextType(type)) {
    return { react: Alert({ alert: { type, title, body: option.body }, className: 'kui--terminal-alert' }) }
  } else {
    throw new UsageError(`alert type must be: 'info', 'success', 'warning' or 'error'.`)
  }
}

/**
 * This plugin introduces the /alert command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen('/alert', doAlert, { usage })
}
