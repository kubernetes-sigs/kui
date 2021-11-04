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

import { Arguments, CommentaryResponse, ParsedOptions, Registrar, UsageModel, Util } from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

/**
 * commentary command parsedOptions type
 */
interface CommentaryOptions extends ParsedOptions {
  f: string
  file: string
  title: string
  'base-url': string
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
      name: '--base-url',
      alias: '-b',
      docs: 'Base URL for images'
    },
    {
      name: '--file',
      alias: '-f',
      docs: 'File that contains the texts'
    }
  ]
}

export async function fetchMarkdownFile(filepath: string, args: Arguments): Promise<string> {
  const fullpath = Util.findFile(Util.expandHomeDir(filepath))
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

async function addComment(args: Arguments<CommentaryOptions>): Promise<true | CommentaryResponse> {
  const { title } = args.parsedOptions
  const filepath = args.parsedOptions.file || args.parsedOptions.f

  // the markdown data either comes from a file, or directly from the
  // command line
  const data =
    (filepath
      ? await fetchMarkdownFile(filepath, args) // from file
      : args.command // directly from command line
          .trim()
          .slice(args.command.indexOf(' ') + 1)
          .trim()
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/(-t|--title)\s+\S+/, '')) || '#'

  if (data !== undefined) {
    if (data === '#' || args.command === 'commentary') {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'CommentaryResponse',
        props: {
          title,
          children: '',
          baseUrl: args.parsedOptions['base-url']
        }
      }
    } else {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'CommentaryResponse',
        props: {
          title,
          children: data,
          baseUrl: args.parsedOptions['base-url']
        }
      }
    }
  } else {
    throw new Error(
      'Insufficient arguments: must specify either --file or -f, or provide a comment on the command line'
    )
  }
}

/**
 * This plugin introduces the /card command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen('/commentary', addComment, { usage, outputOnly: true })
  commandTree.listen('/#', addComment, { usage, outputOnly: true, noCoreRedirect: true })
}
