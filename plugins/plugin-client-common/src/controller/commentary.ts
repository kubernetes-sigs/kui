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
  CommentaryResponse,
  ParsedOptions,
  Registrar,
  UsageModel,
  findFile,
  expandHomeDir
} from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

/**
 * commentary command parsedOptions type
 */
interface CommentaryOptions extends ParsedOptions {
  title: string
  file: string
  f: string
}

/**
 * commentary command usage
 */
const usage: UsageModel = {
  command: 'commentary',
  strict: 'commentary',
  example: 'commentary -f [<markdown file path>]',
  docs: 'Commentary',
  optional: [
    {
      name: '--title',
      alias: '-t',
      docs: 'Title for the commentary'
    },
    {
      name: '--file',
      alias: '-f',
      docs: 'File that contains the texts'
    }
  ]
}

export async function fetchMarkdownFile(filepath: string, args: Arguments): Promise<string> {
  const fullpath = findFile(expandHomeDir(filepath))
  const suffix = filepath.substring(filepath.lastIndexOf('.') + 1)

  if (suffix !== 'md') {
    throw new Error('File extension not support')
  } else {
    // fetch the data:
    //   --with-data says give us the file contents
    const stats = (await args.tab.REPL.rexec<FStat>(`vfs fstat ${args.tab.REPL.encodeComponent(fullpath)} --with-data`))
      .content

    if (stats.isDirectory) {
      throw new Error('Invalid filepath')
    } else {
      return stats.data as string
    }
  }
}

async function addComment(args: Arguments<CommentaryOptions>): Promise<CommentaryResponse> {
  const { title } = args.parsedOptions
  const filepath = args.parsedOptions.file || args.parsedOptions.f

  if (filepath) {
    const data = await fetchMarkdownFile(filepath, args)
    return {
      apiVersion: 'kui-shell/v1',
      kind: 'CommentaryResponse',
      props: {
        title,
        children: data
      }
    }
  } else {
    throw new Error('Insufficient arguments: must specify --file or -f')
  }
}

/**
 * This plugin introduces the /card command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen('/commentary', addComment, { usage, outputOnly: true })
}
