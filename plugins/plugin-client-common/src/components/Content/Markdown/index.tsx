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

import { Options } from 'react-markdown'
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

// ==foo== -> <mark>foo</mark>
import hackMarks from './remark-mark'

// parses out ::import{filepath} as node.type === 'leafDirective', but
// does not create any DOM elements
import remarkDirective from 'remark-directive'

// ++ctrl+alt+delete++== -> <kbd>ctrl</kbd>+<kbd>alt</kbd>+<kbd>delete</kbd>
import hackKeys from './remark-keys'

import inlineSnippets from '../../../controller/snippets'

import emojis from 'remark-emoji'
import frontmatter from 'remark-frontmatter'

import { filepathForResponses } from '../../../controller/fetch'

import tip from './rehype-tip'
import tabbed from './rehype-tabbed'
import hackIndentation from './rehype-tabbed/hack'

import components from './components'
import wizard from './components/Wizard/rehype-wizard'
import rehypeImports, { remarkImports } from './remark-import'

import { ChoicesMap } from './components/code/graph'
import { CodeBlockResponse } from './components/code'
import prefetchTableRows from './components/code/prefetch'
import encodePriorResponses from './components/code/encoding'
import codeIndexer from './components/code/rehype-code-indexer'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'

import icons from './rehype-icons'
import { kuiFrontmatter, tryFrontmatter } from './frontmatter'

export interface ChoiceState {
  keys: () => ReturnType<typeof Object.keys>
  entries: () => ReturnType<typeof Object.entries>
  contains: <K extends keyof ChoicesMap>(key: K) => boolean
  get: <K extends keyof ChoicesMap>(key: K) => ChoicesMap[K]
  set: <K extends keyof ChoicesMap>(key: K, value: ChoicesMap[K], overrideRejections?: boolean) => boolean
  remove: <K extends keyof ChoicesMap>(key: K) => boolean
}

export interface Choices {
  /** Choices made, e.g. "i want to install using curl" */
  choices: ChoiceState
}

const rehypePlugins = (uuid: string, choices: ChoiceState): Options['rehypePlugins'] => [
  wizard,
  [tabbed, uuid, choices],
  tip,
  [codeIndexer, uuid],
  rehypeImports,
  icons,
  rehypeRaw,
  rehypeSlug
]
const remarkPlugins: (tab: KuiTab) => Options['remarkPlugins'] = (tab: KuiTab) => [
  gfm,
  remarkDirective,
  remarkImports,
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

  /** Choices made, e.g. "i want to install using curl" */
  choices: ChoicesMap

  /** Choices rejected, e.g. "i really don't want to install using curl" */
  rejectedChoices: Record<keyof ChoicesMap, boolean>
}

export default class Markdown extends React.PureComponent<Props, State> {
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {
      source: '',
      choices: {},
      rejectedChoices: {},
      hasError: false,
      codeBlockResponses: []
    }
    setTimeout(() => this.prepareSource())
  }

  /** We are going away. Invoke cleaners */
  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  /** We are coming to life */
  public componentDidMount() {
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
    const sourcePriorToInlining = Markdown.source(this.props).trim()

    if (this.props.tab && this.props.tab.REPL) {
      setTimeout(async () => {
        const args = { REPL: this.repl }
        const source = await inlineSnippets(args, this.snippetBasePath)(sourcePriorToInlining, this.props.filepath)
        this.setState({ source: Markdown.hackSource(source), codeBlockResponses: [] })
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

  private codeBlockHasBeenReplayed(codeBlockIdx: number) {
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

  /** Avoid back-to-back-to-back state updates from ChoiceState changes */
  private currentBatchUpdate: ReturnType<typeof setTimeout>
  private readonly batches: ((curState: State) => Pick<State, 'choices' | 'rejectedChoices'>)[] = []
  private batch(fn: (curState: State) => Pick<State, 'choices' | 'rejectedChoices'> | null) {
    if (this.currentBatchUpdate) {
      clearTimeout(this.currentBatchUpdate)
    }
    this.batches.push(fn)
    this.currentBatchUpdate = setTimeout(() => {
      const batches = this.batches.splice(0, this.batches.length)
      this.setState(curState => {
        const resp = batches.reduce((curState, fn) => fn(curState) || curState, curState)
        return resp
      })
    }, 20)
  }

  private readonly choices: ChoiceState = this.props.choices || {
    keys: () => Object.keys(this.state.choices),
    entries: () => Object.entries(this.state.choices),

    contains: (key: keyof ChoicesMap) => {
      return key in this.state.choices
    },

    get: (key: keyof ChoicesMap) => {
      return this.state.choices[key]
    },

    remove: <K extends keyof ChoicesMap>(key: K) => {
      if (key in this.state.choices) {
        this.batch(curState => {
          if (key in curState.choices) {
            delete curState.choices[key]
            return {
              choices: Object.assign({}, curState.choices),
              rejectedChoices: Object.assign({}, curState.rejectedChoices, { [key]: true })
            }
          }

          return null
        })
        return true
      } else {
        return false
      }
    },

    set: <K extends keyof ChoicesMap>(key: K, value: ChoicesMap[K], overrideRejections = true) => {
      if (this.state.choices[key] === value) {
        return false
      }

      this.batch(curState => {
        if (overrideRejections || !(key in curState.rejectedChoices)) {
          delete curState.rejectedChoices[key]
          return {
            choices: Object.assign({}, curState.choices, { [key]: value }),
            rejectedChoices: Object.assign({}, curState.rejectedChoices)
          }
        }

        return null
      })

      return true
    }
  }

  /** This will be the `components` argument to `<ReactMarkdown/>` */
  private readonly _components = components({
    mdprops: this.props,
    repl: this.repl,
    uuid: this.uuid,
    choices: this.choices,
    spliceInCodeExecution: this.spliceInCodeExecution.bind(this),
    codeBlockResponses: this.codeBlockHasBeenReplayed.bind(this)
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
    return hackKeys(hackMarks(hackIndentation(source)))
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
