/*
 * Copyright 2023 The Kubernetes Authors
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
import { inlineSnippets } from 'madwizard/dist/parser'
import { ChoiceState, newChoiceState } from 'madwizard/dist/choices'
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent'

import type { Tab as KuiTab } from '@kui-shell/core'

import frontmatter from 'remark-frontmatter'
import ReactMarkdown, { Options } from 'react-markdown'

import components from './components'
import { kuiFrontmatter } from './frontmatter'

export type Props = {
  /** Source filepath */
  filepath?: string

  /** Source content */
  source: string

  /** Execute code blocks immediately? */
  executeImmediately?: boolean

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

export default class SimpleMarkdown extends React.PureComponent<Props, State> {
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
          const source = await inlineSnippets({
            fetcher,
            madwizardOptions: {},
            snippetBasePath: this.snippetBasePath
          })(sourcePriorToInlining, this.props.filepath)
          this.setState({ source: this.hackSource(source) })
        }
      })
    } else {
      this.setState({ source: this.hackSource(sourcePriorToInlining) })
    }
  }

  private readonly uuid = uuid()

  private readonly choices: ChoiceState = newChoiceState('default')

  /** This will be the `components` argument to `<ReactMarkdown/>` */
  private readonly _components = components({
    mdprops: this.props,
    repl: this.repl,
    uuid: this.uuid,
    choices: this.choices,
    codeBlockResponses: () => undefined
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
  protected hackSource(source: string) {
    return source
  }

  private get className() {
    return (
      this.props.className ||
      'padding-content marked-content page-content ' +
        (this.props.extraClassName || '') +
        (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : '')
    )
  }

  private readonly _remarkPlugins: Options['remarkPlugins'] = [
    [frontmatter, ['yaml', 'toml']],
    [kuiFrontmatter, { tab: this.props.tab }]
  ]

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
            data-is-nested={this.props.nested || undefined}
          >
            {source}
          </ReactMarkdown>
        </TextContent>
      </React.Suspense>
    )
  }
}
