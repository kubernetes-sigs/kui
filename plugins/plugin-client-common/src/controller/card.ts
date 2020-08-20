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
  Arguments,
  Registrar,
  ParsedOptions,
  UsageModel,
  ReactResponse,
  findFile,
  expandHomeDir
} from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'
import card from '../components/spi/Card'

/**
 * card command parsedOptions type
 */
interface CardOptions extends ParsedOptions {
  title: string
  icon: string
  filename: string
  f: string
}

/**
 * card command usage
 */
const usage: UsageModel = {
  command: 'card',
  strict: 'card',
  example: 'card [<card body text>] [--title <card title text>]',
  docs: 'Card',
  optional: [
    {
      name: 'body',
      docs: 'card body text'
    },
    {
      name: '--title',
      docs: 'Content rendered inside the CardTitle'
    },
    {
      name: '--icon',
      docs: 'Attribute that specifies the URL of the image to put on the card.'
    },
    {
      name: '-f',
      docs: 'File that contains the texts'
    },
    {
      name: '--file',
      docs: 'File that contains the texts'
    }
  ]
}

/**
 * card command handler
 *
 */
async function doCard(opts: Arguments<CardOptions>): Promise<ReactResponse> {
  const argv = opts.argvNoOptions
  const option = opts.parsedOptions
  const { title, icon } = option

  const filepath = option.filename || option.f
  if (filepath) {
    const fullpath = findFile(expandHomeDir(filepath))
    const suffix = filepath.substring(filepath.lastIndexOf('.') + 1)

    if (suffix !== 'md') {
      throw new Error('File extension not support')
    } else {
      // fetch the data:
      //   --with-data says give us the file contents
      const stats = (
        await opts.tab.REPL.rexec<FStat>(`vfs fstat ${opts.tab.REPL.encodeComponent(fullpath)} --with-data`)
      ).content

      if (stats.isDirectory) {
        throw new Error('Invalid filepath')
      } else {
        const data: string = stats.data
        return { react: card({ title, children: data, icon }) }
      }
    }
  } else {
    const body = argv.slice(1)
    if (body) {
      return { react: card({ title, children: body, icon }) }
    } else {
      throw new Error('Invalid arguments: need card body text')
    }
  }
}

/**
 * This plugin introduces the /card command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen('/card', doCard, { usage })
}
