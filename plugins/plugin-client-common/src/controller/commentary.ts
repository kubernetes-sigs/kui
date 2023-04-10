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

import { basename } from 'path'

import type { Arguments, CommentaryResponse, ParsedOptions } from '@kui-shell/core'

/**
 * commentary command parsedOptions type
 */
export type CommentaryOptions = ParsedOptions &
  Pick<CommentaryResponse['props'], 'header' | 'edit' | 'preview' | 'receive' | 'send' | 'replace' | 'simple'> & {
    f: string
    file: string
    title: string
    'base-url': string

    /** Support for pymdownx.snippets */
    'snippet-base-path': string

    /** Toggle the tab to be in readonly mode */
    readonly: boolean
  }

/**
 * commentary command usage
 */
/* const usage: UsageModel = {
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
      name: '--edit',
      docs: 'Open the UI in edit mode'
    },
    {
      name: '--header',
      docs: 'Show header text [Default: true]'
    },
    {
      name: '--preview',
      docs: 'Show a preview while editing [Default: true]'
    },
    {
      name: '--readonly',
      docs: 'Set the enclosing tab to be readonly'
    },
    {
      name: '--send',
      docs: 'Send edits to this channel (implies --no-header and --no-preview)'
    },
    {
      name: '--receive',
      docs: 'Consume edits from this channel (implies --no-header and --no-edit)'
    },
    {
      name: '--replace',
      docs: 'Replace all existing content in this tab'
    },
    {
      name: '--file',
      alias: '-f',
      docs: 'File that contains the texts'
    }
  ]
} */

async function formatBaseUrl(filepath: string) {
  if (/^http:/.test(filepath)) {
    const { format } = await import('url')
    const url = new URL(filepath)

    url.pathname = url.pathname.replace(basename(url.pathname), '{filename}')
    return format(url)
  } else {
    return filepath.replace(basename(filepath), '{filename}')
  }
}

/** TODO: move to core Tab api? */
export async function setTabReadonly({ tab }: Arguments) {
  const [{ eventBus }, { getPrimaryTabId }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Events'),
    import('@kui-shell/core/mdist/api/Tab')
  ])
  eventBus.emitWithTabId('/kui/tab/edit/unset', getPrimaryTabId(tab))
}

export async function addComment(args: Arguments<CommentaryOptions>): Promise<true | CommentaryResponse> {
  const {
    edit: _edit,
    header: _header,
    preview: _preview,
    'snippet-base-path': snippetBasePath,
    receive,
    send,
    title,
    readonly,
    replace,
    simple
  } = args.parsedOptions

  const filepath = args.parsedOptions.file || args.parsedOptions.f

  const edit = receive !== undefined ? false : send !== undefined ? true : _edit
  const header = receive !== undefined || send !== undefined ? false : _header
  const preview = send !== undefined ? false : receive !== undefined ? true : _preview

  const { default: fetchMarkdownFile, join } = await import('./fetch')

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
          .replace(/--(no-)?(header|edit|preview|readonly|replace)\s*/g, '')
          .replace(/(-t|--title|--send|--receive)\s+\S+\s*/g, '')
          .replace(/^\\#/, '#') // escaped initial comment -> h1

          // this isn't perfect; e.g. it doesn't handle `commentary "hello" "world`; but it's a start
          .replace(/^"/, '')
          .replace(/"$/, ''),
        codeBlockResponses: undefined
      }

  if (filepath && readonly) {
    setTabReadonly(args)
  }

  const baseUrl = args.parsedOptions['base-url']
    ? join(args.parsedOptions['base-url'], '{filename}')
    : filepath
    ? await formatBaseUrl(filepath)
    : undefined

  if (data !== undefined) {
    if (data === '#' || args.command === 'commentary') {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'CommentaryResponse',
        props: {
          edit,
          header,
          preview,
          replace,
          receive,
          send,
          simple,
          snippetBasePath,
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
          edit,
          header,
          preview,
          replace,
          receive,
          send,
          simple,
          snippetBasePath,
          title,
          filepath,
          children: data,
          codeBlockResponses,
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
 * This delegate is helpful to wrap the rendering of a given markdown
 * `filepath` in a maximized view that is injected as a replacement
 * for the current view.
 */
export function delegate(args: Arguments) {
  const delegate = args.argvNoOptions[2]
  const filepath = args.argvNoOptions[3]
  if (!delegate || !filepath) {
    throw new Error('Usage: commentary delegate <filepath>')
  }

  const children = `
---
layout:
    1:
        position: default
        maximized: true
---

\`\`\`shell
---
execute: now
outputOnly: true
maximize: true
---
${delegate} ${args.REPL.encodeComponent(filepath)}
\`\`\`
`

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'CommentaryResponse',
    props: {
      replace: true,
      children
    }
  }
}
