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

import React from 'react'
import { v4 as uuid } from 'uuid'
import TurndownService from 'turndown'
import { TextContent } from '@patternfly/react-core'

import { GlobStats } from '@kui-shell/plugin-bash-like/fs'
import { Events, Tab as KuiTab, encodeComponent } from '@kui-shell/core'

import ReactMarkdown, { Options } from 'react-markdown'

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

// parses out ::import{filepath} as node.type === 'leafDirective', but
// does not create any DOM elements
import remarkDirective from 'remark-directive'

import inlineSnippets from '../../../controller/snippets'

import emojis from 'remark-emoji'
import frontmatter from 'remark-frontmatter'

import { filepathForResponses } from '../../../controller/fetch'

import components from './components'
import wizard from './components/Wizard/rehype-wizard'

import {
  hackMarkdownSource,
  rehypeCodeIndexer,
  rehypeTip,
  rehypeTabbed,
  Choices,
  ChoiceState,
  newChoiceState
} from 'madwizard'

import { CodeBlockResponse } from './components/code'
import prefetchTableRows from './components/code/prefetch'
import encodePriorResponses from './components/code/encoding'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'

import icons from './rehype-icons'
import { kuiFrontmatter, tryFrontmatter } from './frontmatter'

const rehypePlugins = (uuid: string, choices: ChoiceState): Options['rehypePlugins'] => [
  wizard,
  [rehypeTabbed, uuid, choices],
  rehypeTip,
  [rehypeCodeIndexer, uuid],
  icons,
  rehypeRaw,
  rehypeSlug
]
const remarkPlugins: (tab: KuiTab) => Options['remarkPlugins'] = (tab: KuiTab) => [
  gfm,
  remarkDirective,
  [frontmatter, ['yaml', 'toml']],
  [kuiFrontmatter, { tab }],
  emojis // [emojis, { emoticon: true }]
]

export type Props = Partial<Choices> & {
  /** Source filepath */
  filepath?: string

  /** Source content */
  source: string

  /** Render executable code blocks with the executable code block component [Default: true] */
  executableCodeBlocks?: boolean

  /** Execute code blocks immediately? */
  executeImmediately?: boolean

  /** Has the user clicked to execute a code block? */
  codeBlockResponses?: CodeBlockResponse[]

  /** Source content type */
  contentType?: 'text/html' | 'application/markdown'

  /** uuid of containing Block */
  execUUID?: string

  tab?: KuiTab

  /** if we have the full path to the source file */
  fullpath?: string

  /** css class for top-level element */
  className?: string

  /** extra css classes for top-level element */
  extraClassName?: string

  /** Do not linkify external links */
  noExternalLinks?: boolean

  /** If true, don't provide scrollability */
  nested?: boolean

  /** Base HTTP Url? */
  baseUrl?: string

  /** Support for pymdownx.snippets */
  snippetBasePath?: string

  onRender?: () => void
}

type State = {
  /** Did we get some severe error in rendering? */
  hasError: boolean

  source: Props['source']

  /** Has the user clicked to execute a code block? */
  codeBlockResponses: CodeBlockResponse[]
}

export default class Markdown extends React.PureComponent<Props, State> {
  private mounted = false

  /** Handlers to be called on unmount */
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {
      source: '',
      hasError: false,
      codeBlockResponses: []
    }
    setTimeout(() => this.prepareSource())
  }

  /** We are going away. Invoke cleaners */
  public componentWillUnmount() {
    this.mounted = false
    this.cleaners.forEach(_ => _())
  }

  /** We are coming to life */
  public componentDidMount() {
    this.mounted = true
    this.initSnapshotEvents()
  }

  /** New props, so re-fetch inlined source if needed */
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.source !== this.props.source) {
      this.prepareSource()
    }
  }

  /**
   * Base path for snippet inlining. Prefer `this.props`, which comes
   * from user/command line. Otherwise, look in the top matter of the
   * document.  Later, in `inlineSnippets` we will also look in each
   * include line in the document, which may also specify a
   * line-specific base path.
   */
  private get snippetBasePath() {
    if (this.props.snippetBasePath) {
      return this.props.snippetBasePath
    } else {
      const fm = tryFrontmatter(this.props.source)
      if (fm.attributes && fm.attributes.snippets && fm.attributes.snippets.basePath) {
        return fm.attributes.snippets.basePath
      }
    }
  }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  /**
   * To support snippet inlining (which may require an async file
   * fetch), we need to prepare the source from props into state. Yay
   * react.
   */
  private prepareSource() {
    if (!this.mounted) {
      return
    }

    const sourcePriorToInlining = Markdown.source(this.props).trim()

    if (this.props.tab && this.props.tab.REPL) {
      setTimeout(async () => {
        if (this.mounted) {
          const args = { REPL: this.repl }
          const source = await inlineSnippets(args, this.snippetBasePath)(sourcePriorToInlining, this.props.filepath)
          this.setState({ source: Markdown.hackSource(source), codeBlockResponses: [] })
        }
      })
    } else {
      this.setState({ source: Markdown.hackSource(sourcePriorToInlining), codeBlockResponses: [] })
    }
  }

  /** Handle requests to save codeBlockResponses to disk */
  private initSnapshotEvents() {
    const { filepath, execUUID } = this.props

    if (filepath && execUUID) {
      const onSnapshot = async () => {
        const codeBlockResponses = this.codeBlockResponses()
        if (codeBlockResponses.find(_ => _)) {
          const stats = (await this.repl.rexec<GlobStats[]>(`vfs ls ${encodeComponent(filepath)}`)).content

          if (Array.isArray(stats) && stats.length === 1 && stats[0].dirent.mount.isLocal) {
            try {
              const fp = encodeComponent(filepathForResponses(filepath))
              await this.repl.qexec(`vfs fwrite ${fp}`, undefined, undefined, {
                data: encodePriorResponses(await prefetchTableRows(codeBlockResponses, this.repl))
              })
            } catch (err) {
              console.error('Error saving code block responses', err)
            }
          } else {
            console.error('Unable to save code block responses, since original filepath not writeable')
          }
        }
      }
      Events.eventChannelUnsafe.on(`/kui/snapshot/request/${execUUID}`, onSnapshot)
      this.cleaners.push(() => Events.eventChannelUnsafe.off(`/kui/snapshot/request/${execUUID}`, onSnapshot))
    }
  }

  /**
   * @return the combined state and props of codeBlockResponses,
   * favoring any overrides in state, because those result from
   * executions in this session, whereas props come from pre-recorded output
   *
   */
  private codeBlockResponses() {
    const fromProps = this.props.codeBlockResponses || []
    const fromState = this.state.codeBlockResponses || []

    return Array(Math.max(fromProps.length, fromState.length))
      .fill(undefined)
      .map((_, idx) => fromState[idx] || fromProps[idx])
  }

  private codeBlockResponseWithReplayedBit(codeBlockIdx: number) {
    const fromProps = this.props.codeBlockResponses ? this.props.codeBlockResponses[codeBlockIdx] : undefined
    const fromState = this.state.codeBlockResponses[codeBlockIdx]

    // replayed if we have a response in props, because the commentary
    // controller has fetched this from a json from that stores
    // pre-recorded output
    const replayed = !!fromProps

    // the current response to be displayed favors state, as these
    // come from re-executions in this session
    const response = fromState || fromProps || undefined

    return Object.assign({ replayed }, response)
  }

  private readonly uuid = uuid()

  private readonly choices: ChoiceState = this.props.choices || newChoiceState()

  /** This will be the `components` argument to `<ReactMarkdown/>` */
  private readonly _components = components({
    mdprops: this.props,
    repl: this.repl,
    uuid: this.uuid,
    choices: this.choices,
    spliceInCodeExecution: this.spliceInCodeExecution.bind(this),
    codeBlockResponses: this.codeBlockResponseWithReplayedBit.bind(this)
  })

  /** `exec` controller */
  private get repl() {
    return this.props.tab ? this.props.tab.REPL : undefined
  }

  /** @return markdown source, as string in application/markdown format */
  private static source(props: Props) {
    if (props.contentType === 'text/html') {
      const { gfm } = require('turndown-plugin-gfm')
      const td = new TurndownService()
      td.use(gfm)
      return td.turndown(props.source)
    } else {
      return props.source
    }
  }

  /**
   * Deal with pymdown indentation syntax, and other not-worth-parsing
   * syntax from pymdown (such as target=_blank for links).
   */
  private static hackSource(source: string) {
    return hackMarkdownSource(source)
      .trim()
      .replace(/\){target=[^}]+}/g, ')')
      .replace(/{draggable=(false|true)}/g, '')
  }

  /** We got a code block response from execution in this session */
  private spliceInCodeExecution(
    status: CodeBlockResponse['status'],
    response: CodeBlockResponse['response'],
    codeIdx: number
  ) {
    if (!this.mounted) {
      return
    }

    this.setState(curState => {
      const codeBlockResponses = curState.codeBlockResponses.slice()
      codeBlockResponses[codeIdx] = {
        status,
        response
      }

      return {
        codeBlockResponses
      }
    })
  }

  public render() {
    if (this.props.onRender) {
      this.props.onRender()
    }

    if (this.state.hasError) {
      return <TextContent>Internal Error</TextContent>
    }

    const { source } = this.state
    if (source.length === 0) {
      return <React.Fragment />
    }

    return (
      <React.Suspense fallback={<div />}>
        <TextContent>
          <ReactMarkdown
            remarkPlugins={remarkPlugins(this.props.tab)}
            rehypePlugins={rehypePlugins(this.uuid, this.choices)}
            components={this._components()}
            data-is-nested={this.props.nested || undefined}
            className={
              this.props.className ||
              'padding-content marked-content page-content ' +
                (this.props.extraClassName || '') +
                (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : '')
            }
          >
            {source}
          </ReactMarkdown>
        </TextContent>
      </React.Suspense>
    )
  }
}
