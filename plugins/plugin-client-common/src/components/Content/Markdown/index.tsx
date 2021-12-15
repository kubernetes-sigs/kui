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

import { Tab as KuiTab } from '@kui-shell/core'

import { Options } from 'react-markdown'
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

import emojis from 'remark-emoji'
import frontmatter from 'remark-frontmatter'

import components from './components'
import tip, { hackTipIndentation } from './rehype-tip'
import tabbed, { hackTabIndentation } from './rehype-tabbed'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
const rehypePlugins: Options['rehypePlugins'] = [tabbed, tip, rehypeRaw, rehypeSlug]
const remarkPlugins: Options['plugins'] = [gfm, [frontmatter, ['yaml', 'toml']], [emojis, { emoticon: true }]]

export interface Props {
  source: string
  contentType?: 'text/html' | 'application/markdown'

  tab?: KuiTab

  /** if we have the full path to the source file */
  fullpath?: string

  /** css class for top-level element */
  className?: string

  /** Do not linkify external links */
  noExternalLinks?: boolean

  /** If true, don't provide scrollability */
  nested?: boolean

  /** Base HTTP Url? */
  baseUrl?: string

  onRender?: () => void
}

interface State {
  source: Props['source']

  /** Has the user clicked to execute a code block? */
  codeHasBeenExecuted: boolean[]
}

export default class Markdown extends React.PureComponent<Props, State> {
  private readonly _components = components({
    mdprops: this.props,
    repl: this.repl,
    uuid: uuid(),
    spliceInCodeExecution: this.spliceInCodeExecution.bind(this),
    codeHasBeenExecuted: this.codeHasBeenExecuted.bind(this)
  })

  public constructor(props: Props) {
    super(props)
    this.state = Markdown.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    if (state && state.codeHasBeenExecuted.findIndex(_ => _ === true) >= 0) {
      return state
    } else if (!state || state.source !== props.source) {
      return {
        source: Markdown.source(props),
        codeHasBeenExecuted: []
      }
    } else {
      return state
    }
  }

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
      return hackTipIndentation(hackTabIndentation(props.source)).trim()
    }
  }

  private codeHasBeenExecuted(codeIdx: number): boolean {
    return this.state.codeHasBeenExecuted[codeIdx]
  }

  private spliceInCodeExecution(replacement: string, startOffset: number, endOffset: number, codeIdx: number) {
    this.setState(curState => {
      const codeHasBeenExecuted = curState.codeHasBeenExecuted /* probably not needed since `source` changes .slice() */
      codeHasBeenExecuted[codeIdx] = true

      return {
        codeHasBeenExecuted,
        source: curState.source.slice(0, startOffset) + replacement + curState.source.slice(endOffset)
      }
    })
  }

  /** Helps with tests... */
  private codeIdx: number

  public render() {
    if (this.props.onRender) {
      this.props.onRender()
    }

    const { source } = this.state
    if (source.length === 0) {
      return <React.Fragment />
    }

    return (
      <React.Suspense fallback={<div />}>
        <TextContent>
          <ReactMarkdown
            plugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={this._components()}
            data-is-nested={this.props.nested || undefined}
            className={
              this.props.className ||
              'padding-content marked-content page-content' +
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
