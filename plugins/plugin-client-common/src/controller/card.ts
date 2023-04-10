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
 * card command parsedOptions type
 */
export interface CardOptions extends ParsedOptions {
  title: string
  // icon: string
  filename: string
  f: string
}

/**
 * card command handler
 *
 */
export default async function doCard(opts: Arguments<CardOptions>): Promise<ReactResponse> {
  const argv = opts.argvNoOptions
  const option = opts.parsedOptions
  const { title /* , icon */ } = option

  const { default: card } = await import('../components/spi/Card')

  const filepath = option.filename || option.f
  if (filepath) {
    const { default: fetchMarkdownFile } = await import('./fetch')

    const { data } = await fetchMarkdownFile(filepath, opts)
    return { react: card({ title, children: data /*, icon */ }) }
  } else {
    const body = argv.slice(1)
    if (body) {
      return { react: card({ title, children: body /* , icon */ }) }
    } else {
      throw new Error('Invalid arguments: need card body text')
    }
  }
}
