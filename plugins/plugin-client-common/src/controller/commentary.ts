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

import { format } from 'url'
import { basename, dirname, join } from 'path'

import {
  Arguments,
  CommentaryResponse,
  Events,
  ParsedOptions,
  Registrar,
  UsageModel,
  encodeComponent,
  getPrimaryTabId
} from '@kui-shell/core'

/**
 * commentary command parsedOptions type
 */
interface CommentaryOptions extends ParsedOptions {
  f: string
  file: string
  title: string
  'base-url': string

  /** Toggle the tab to be in readonly mode */
  readonly: boolean
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
      name: '--readonly',
      docs: 'Set the enclosing tab to be readonly'
    },
    {
      name: '--file',
      alias: '-f',
      docs: 'File that contains the texts'
    }
  ]
}

export function filepathForResponses(filepath: string) {
  return join(dirname(filepath), basename(filepath).replace(/\..*$/, '') + '.json')
}

async function fetch(filepath: string, { REPL }: Pick<Arguments, 'REPL'>, errOk = false) {
  try {
    return (await REPL.rexec<(string | object)[]>(`_fetchfile ${encodeComponent(filepath)}`)).content[0]
  } catch (err) {
    if (!errOk) {
      throw err
    } else {
      return undefined
    }
  }
}

export async function fetchMarkdownFile(filepath: string, args: Pick<Arguments, 'REPL'>) {
  const { pathname } = /^https?:/.test(filepath) ? new URL(filepath) : { pathname: filepath }

  if (!/\.md$/.test(pathname)) {
    throw new Error('File extension not support')
  } else {
    const [data, codeBlockResponses] = await Promise.all([
      fetch(filepath, args),
      fetch(filepathForResponses(filepath), args, true)
    ])

    return {
      data: typeof data === 'string' ? data : JSON.stringify(data),
      codeBlockResponses: (typeof codeBlockResponses === 'string'
        ? JSON.parse(codeBlockResponses)
        : codeBlockResponses) as CommentaryResponse['props']['codeBlockResponses']
    }
  }
}

function formatBaseUrl(filepath: string) {
  if (/^http:/.test(filepath)) {
    const url = new URL(filepath)

    url.pathname = url.pathname.replace(basename(url.pathname), '{filename}')
    return format(url)
  } else {
    return filepath.replace(basename(filepath), '{filename}')
  }
}

async function addComment(args: Arguments<CommentaryOptions>): Promise<true | CommentaryResponse> {
  const { title, readonly } = args.parsedOptions
  const filepath = args.parsedOptions.file || args.parsedOptions.f

  // the markdown data either comes from a file, or directly from the
  // command line
  const { data = '#', codeBlockResponses } = filepath
    ? await fetchMarkdownFile(filepath, args) // from file
    : {
        data: args.command // directly from command line
          .trim()
          .slice(args.command.indexOf(' ') + 1)
          .trim()
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/(-t|--title)\s+\S+/, ''),
        codeBlockResponses: undefined
      }

  if (filepath && readonly) {
    Events.eventBus.emitWithTabId('/kui/tab/edit/toggle', getPrimaryTabId(args.tab))
  }

  const baseUrl = args.parsedOptions['base-url']
    ? join(args.parsedOptions['base-url'], '{filename}')
    : filepath
    ? formatBaseUrl(filepath)
    : undefined

  if (data !== undefined) {
    if (data === '#' || args.command === 'commentary') {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'CommentaryResponse',
        props: {
          title,
          children: '',
          baseUrl
        }
      }
    } else {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'CommentaryResponse',
        props: {
          title,
          filepath,
          children: data,
          codeBlockResponses: codeBlockResponses,
          baseUrl
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
  const flags = {
    boolean: ['readonly']
  }

  commandTree.listen('/commentary', addComment, { usage, outputOnly: true, flags })
  commandTree.listen('/#', addComment, { usage, outputOnly: true, noCoreRedirect: true, flags })
}
