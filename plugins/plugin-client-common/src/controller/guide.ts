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

import React from 'react'
import { v4 } from 'uuid'
import { basename } from 'path'
import {
  Arguments,
  CommentaryResponse,
  ParsedOptions,
  Registrar,
  Util,
  encodeComponent,
  isPopup
} from '@kui-shell/core'

import fetchMarkdownFile from './fetch'
import { setTabReadonly } from './commentary' // TODO move to core?
import { tryFrontmatter } from '../components/Content/Markdown/frontmatter-parser'

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
  try {
    const filepath = args.argvNoOptions[1]

    if (!args.parsedOptions.here && !isPopup()) {
      await args.REPL.qexec(`tab new --cmdline "guide --here ${encodeComponent(filepath)}"`)
      return true
    }

    const reader = async (file: import('vfile').VFile) => {
      const { data } = await fetchMarkdownFile(file.path, args)
      file.value = data
      return file
    }

    const { data: rawData /* , codeBlockResponses */ } = await fetchMarkdownFile(filepath, args)
    const { attributes } = tryFrontmatter(rawData)

    const { VFile } = await import('vfile')
    const { Choices, Parser } = await import('madwizard')
    const input = new VFile({
      value: rawData,
      cwd: Util.cwd(),
      path: Util.expandHomeDir(filepath)
    })
    const choices = Choices.newChoiceState('default')
    const { blocks } = await Parser.blockify(input, reader, choices)

    const { default: Guide } = await import('../components/Content/Markdown/components/guide')
    const { default: Imports } = await import('../components/Content/Markdown/components/Imports')
    const { default: SplitInjector } = await import('../components/Views/Terminal/SplitInjector')

    const title = attributes.title || basename(filepath)

    const { execUUID: uuid } = args.execOptions
    const tree = React.createElement(Imports, { imports: blocks, choices, title })
    const guide = React.createElement(Guide, { tab: args.tab, uuid, blocks, choices, title })

    const react = React.createElement(SplitInjector.Consumer, undefined, injector => {
      injector.inject([{ uuid: v4(), node: tree, position: 'left-strip', count: 0, opts: { inverseColors: true } }])
      return injector.modify(args.tab.uuid, guide, { maximized: true })
    })

    args.tab.setTitle(title)
    setTabReadonly(args)
    return { react }
  } catch (err) {
    console.error(err)
    throw err
  }
  /* const data = `---
title: ${attributes.title || basename(filepath)}
layout:
    1: left
    2: 
        position: default
        maximized: true
    - ${Util.expandHomeDir(filepath)}
---

::imports

---

::guide
`

  setTabReadonly(args)
  return response(filepath, {
    data,
    codeBlockResponses
  }) */
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
