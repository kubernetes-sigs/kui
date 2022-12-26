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
import { Parser, Choices } from 'madwizard'
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent'

import type { Tab as KuiTab } from '@kui-shell/core'
import { inElectron } from '@kui-shell/core/mdist/api/Capabilities'

import ReactMarkdown, { Options } from 'react-markdown'

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

// ==foo== -> <mark>foo</mark>
import hackMarks from './remark-mark.js'

// ++ctrl+alt+delete++== -> <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>delete</kbd>
import hackKeys from './remark-keys.js'

// parses out ::import{filepath} as node.type === 'leafDirective', but
// does not create any DOM elements
import remarkDirective from 'remark-directive'

import emojis from 'remark-emoji'
import frontmatter from 'remark-frontmatter'

import components from './components'
import { CodeBlockResponse } from './components/code'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'

import icons from './rehype-icons'
import { kuiFrontmatter, tryFrontmatter } from './frontmatter'

const rehypePlugins = (uuid: string, choices: Choices.ChoiceState, filepath: string): Options['rehypePlugins'] => [
  Parser.rehypeWizard,
  [Parser.rehypeTabbed, uuid, choices, { optimize: { aprioris: inElectron() } }],
  Parser.rehypeTip,
  [Parser.rehypeCodeIndexer, uuid, filepath, {}, undefined, true],
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

export type Props = Partial<Choices.Choices> & {
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
}

export default class Markdown extends React.PureComponent<Props, State> {
  private mounted = false

  /** Handlers to be called on unmount */
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {
      source: '',
      hasError: false
    }
  }

  /** We are going away. Invoke cleaners */
  public componentWillUnmount() {
    this.mounted = false
    this.cleaners.forEach(_ => _())
  }

  /** We are coming to life */
  public componentDidMount() {
    this.mounted = true
    this.prepareSource()
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
  private async prepareSource() {
    if (!this.mounted) {
      return
    }

    const sourcePriorToInlining = (await this.source(this.props)).trim()

    if (this.props.tab && this.props.tab.REPL) {
      setTimeout(async () => {
        if (this.mounted) {
          const args = { REPL: this.repl }
          const { loadNotebook } = await import('@kui-shell/plugin-client-common/notebook')
          const fetcher = (filepath: string) => loadNotebook(filepath, args).then(_ => _.toString())
          const source = await Parser.inlineSnippets({
            fetcher,
            madwizardOptions: {},
            snippetBasePath: this.snippetBasePath
          })(sourcePriorToInlining, this.props.filepath)
          this.setState({ source: Markdown.hackSource(source) })
        }
      })
    } else {
      this.setState({ source: Markdown.hackSource(sourcePriorToInlining) })
    }
  }

  private codeBlockResponseWithReplayedBit(codeBlockIdx: number) {
    const fromProps = this.props.codeBlockResponses ? this.props.codeBlockResponses[codeBlockIdx] : undefined

    // replayed if we have a response in props, because the commentary
    // controller has fetched this from a json from that stores
    // pre-recorded output
    const replayed = !!fromProps

    // the current response to be displayed favors state, as these
    // come from re-executions in this session
    const response = fromProps || undefined

    return Object.assign({ replayed }, response)
  }

  private readonly uuid = uuid()

  private readonly choices: Choices.ChoiceState = this.props.choices || Choices.newChoiceState('default')

  /** This will be the `components` argument to `<ReactMarkdown/>` */
  private readonly _components = components({
    mdprops: this.props,
    repl: this.repl,
    uuid: this.uuid,
    choices: this.choices,
    codeBlockResponses: this.codeBlockResponseWithReplayedBit.bind(this)
  })

  /** `exec` controller */
  private get repl() {
    return this.props.tab ? this.props.tab.REPL : undefined
  }

  /** @return markdown source, as string in application/markdown format */
  private async source(props: Props) {
    if (props.contentType === 'text/html') {
      const [{ default: TurndownService }, { gfm }] = await Promise.all([
        import('turndown'),
        import('turndown-plugin-gfm')
      ])
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
    return hackKeys(hackMarks(Parser.hackMarkdownSource(source)))
      .trim()
      .replace(/\){target=[^}]+}/g, ')')
      .replace(/{draggable=(false|true)}/g, '')
  }

  private readonly _remarkPlugins = remarkPlugins(this.props.tab)
  private readonly _rehypePlugins = rehypePlugins(this.uuid, this.choices, this.props.filepath)

  private get className() {
    return (
      this.props.className ||
      'padding-content marked-content page-content ' +
        (this.props.extraClassName || '') +
        (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : '')
    )
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
            className={this.className}
            components={this._components()}
            remarkPlugins={this._remarkPlugins}
            rehypePlugins={this._rehypePlugins}
            data-is-nested={this.props.nested || undefined}
          >
            {source}
          </ReactMarkdown>
        </TextContent>
      </React.Suspense>
    )
  }
}
