/*
 * Copyright 2022 The Kubernetes Authors
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

import type { Arguments } from '@kui-shell/core'

async function fetchMarkdownFile(filepath: string, args: Pick<Arguments, 'REPL'>) {
  const { loadNotebook } = await import('@kui-shell/plugin-client-common/notebook')

  const [data /*, codeBlockResponses */] = await Promise.all([
    loadNotebook(filepath, args)
    // loadNotebook(filepathForResponses(filepath), args, true)
  ])

  return {
    data: typeof data === 'string' ? data : JSON.stringify(data)
    /* codeBlockResponses: (typeof codeBlockResponses === 'string'
      ? JSON.parse(codeBlockResponses)
      : codeBlockResponses) as CommentaryResponse['props']['codeBlockResponses'] */
  }
}

export default async function read(filepath: string, args: Pick<Arguments, 'REPL'>) {
  // TODO... use user-specified profile
  const profile = 'default'

  const reader = async (file: import('vfile').VFile) => {
    const { data } = await fetchMarkdownFile(file.path, args)
    file.value = data
    return file
  }

  const { Choices, Parser } = await import('madwizard')
  return Parser.parse(filepath, reader, Choices.newChoiceState(profile), undefined, {
    store: process.env.GUIDEBOOK_STORE
  })
}
