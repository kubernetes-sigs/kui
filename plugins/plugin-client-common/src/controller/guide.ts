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

import Debug from 'debug'
import { basename } from 'path'
import { Arguments, CommentaryResponse, ParsedOptions, Registrar, Util, encodeComponent } from '@kui-shell/core'

import fetchMarkdownFile from './fetch'
import { setTabReadonly } from './commentary' // TODO move to core?
import { tryFrontmatter } from '../components/Content/Markdown/frontmatter-parser'

const debug = Debug('plugin-client-common/controller/guide')

interface HereOptions extends ParsedOptions {
  /** Show the content in the current tab? */
  here: boolean
}

function response(
  filepath: string,
  { data, codeBlockResponses }: Awaited<ReturnType<typeof fetchMarkdownFile>>
): CommentaryResponse {
  return {
    apiVersion: 'kui-shell/v1',
    kind: 'CommentaryResponse',
    props: {
      filepath,
      children: data,
      codeBlockResponses
    }
  }
}

async function show(args: Arguments<HereOptions>) {
  const filepath = args.argvNoOptions[1]

  if (!args.parsedOptions.here) {
    await args.REPL.qexec(`tab new --cmdline "show --here ${encodeComponent(filepath)}"`)
    return true
  }

  setTabReadonly(args)
  return response(filepath, await fetchMarkdownFile(filepath, args))
}

async function guide(args: Arguments<HereOptions>) {
  const filepath = args.argvNoOptions[1]

  if (!args.parsedOptions.here) {
    await args.REPL.qexec(`tab new --cmdline "guide --here ${encodeComponent(filepath)}"`)
    return true
  }

  const { data: rawData, codeBlockResponses } = await fetchMarkdownFile(filepath, args)
  const { attributes } = tryFrontmatter(rawData)

  const data = `---
title: ${attributes.title || basename(filepath)}
layout:
    1: left
    2: 
        position: default
        maximized: true
imports:
    - ${Util.expandHomeDir(filepath)}
---

::imports

---

::guide
`

  debug('guide generated markdown', data)

  setTabReadonly(args)
  return response(filepath, {
    data,
    codeBlockResponses
  })
}

/**
 * This plugin introduces the commentary command
 *
 */
export default function registerGuideController(commandTree: Registrar) {
  const flags = {
    boolean: ['here']
  }

  commandTree.listen('/show', show, { outputOnly: true, flags })
  commandTree.listen('/guide', guide, { outputOnly: true, flags })
}
