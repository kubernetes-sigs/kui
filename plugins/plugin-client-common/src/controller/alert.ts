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

import type { Arguments, ParsedOptions, ReactResponse } from '@kui-shell/core'

/**
 * alert command parsedOptions type
 */
export interface AlertOptions extends ParsedOptions {
  body: string
}

/**
 * alert command handler
 *
 */
export default async function doAlert(opts: Arguments<AlertOptions>): Promise<ReactResponse> {
  const argv = opts.argvNoOptions
  const option = opts.parsedOptions
  const type = argv[1]
  const title = argv[2]

  const [{ isSupportedToolbarTextType }, { UsageError }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Sidecar'),
    import('@kui-shell/core/mdist/api/Response')
  ])

  if (isSupportedToolbarTextType(type)) {
    const { default: Alert } = await import('../components/spi/Alert')
    return { react: Alert({ alert: { type, title, body: option.body }, className: 'kui--terminal-alert' }) }
  } else {
    throw new UsageError(`alert type must be: 'info', 'success', 'warning' or 'error'.`)
  }
}
