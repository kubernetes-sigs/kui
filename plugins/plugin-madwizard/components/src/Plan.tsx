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

import Debug from 'debug'
import React from 'react'
import { TreeView, TreeViewProps } from '@patternfly/react-core'
import type { Arguments } from '@kui-shell/core'
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'
import { CardResponse, Icons, Loading, Markdown, SupportedIcon } from '@kui-shell/plugin-client-common'

import { Graph, CodeBlock, Choices, Memoizer, Tree } from 'madwizard'

import read from './read'

import '@kui-shell/plugin-client-common/web/scss/components/Tree/_index.scss'
import '@kui-shell/plugin-client-common/web/scss/components/Wizard/Imports.scss'

const debug = Debug('plugins/plugin-madwizard/components/Plan')

class ReactUI implements Tree.UI<React.ReactNode> {
  public markdown(body: string) {
    return <Markdown nested source={body} />
  }

  public span(content: string, ...decorations: Tree.Decoration[]) {
    if (decorations.length === 0) {
      return content
    } else {
      const className = decorations
        .map(decoration =>
          decoration === 'blue'
            ? 'color-base0D'
            : decoration === 'red'
            ? 'color-base08'
            : decoration === 'magenta'
            ? 'color-base0E'
            : decoration === 'cyan'
            ? 'color-base0C'
            : decoration === 'yellow'
            ? 'color-base09'
            : decoration === 'dim'
            ? 'sub-text'
            : ''
        )
        .filter(Boolean)
        .join(' ')

      if (decorations.includes('bold')) {
        return <strong className={className}>{content}</strong>
      } else {
        return <span className={className}>{content}</span>
      }
    }
  }

  public code(body: string) {
    return (
      <pre>
        <code>{body}</code>
      </pre>
    )
  }

  public icon(cls: string) {
    return <Icons className="kui--dependence-tree-subtask--icon" icon={cls as SupportedIcon} />
  }

  public statusToIcon(status: Graph.Status) {
    switch (status) {
      case 'success':
        return <Icons className="pf-m-success" icon="Checkmark" />
    }
  }

  public title(title: string | string[], status?: Graph.Status) {
    if (Array.isArray(title)) {
      return (
        <React.Fragment>
          {title.map((_, idx, A) => (
            <span key={idx}>
              {this.title(_, status)}
              {idx < A.length - 1 ? ' ' : ''}
            </span>
          ))}
        </React.Fragment>
      )
    } else if (status === 'error') {
      return <span className="red-text">{title}</span>
    } else {
      return title
    }
  }

  public open(filepath: string) {
    return (
      <button
        className="kui--tree-action pf-c-button pf-m-plain"
        onClick={() => {
          debug('drilling down to notebook', filepath)
          pexecInCurrentTab(`replay ${encodeComponent(filepath)}`, undefined, true, true)
        }}
      >
        <Icons icon="Info" />
      </button>
    )
  }

  public ask(/* prompt: import('enquirer').Prompt */): Promise<string | Record<string, string>> {
    return Promise.resolve({})
  }
}

type Props = Choices.Choices &
  Partial<CodeBlock.Title> &
  Partial<CodeBlock.Description> & {
    /** Raw list of code blocks */
    blocks: CodeBlock.CodeBlockProps[]
  }

// type Progress = { nDone: number; nError: number; nTotal: number }

/** Map from treeModel node ID to the cumulative progress of that subtree */
// type ProgressMap = Record<string, Progress> */

type State = Partial<
  Choices.Choices & {
    /** The Tree UI model */
    data?: void | TreeViewProps['data']

    /** Any error while computing the Tree UI model */
    error?: unknown

    graph?: Graph.OrderedGraph
  }
> & {
  /** Map from CodeBlock.CodeBlockProps.id to execution status of that code block */
  codeBlockStatus: Record<string, Graph.Status>
}

export default class Plan extends React.PureComponent<Props, State> {
  private readonly memos = new Memoizer()

  public constructor(props: Props) {
    super(props)
    this.state = {
      codeBlockStatus: {}
    }
  }

  private async init(props: Props, useTheseChoices?: State['choices']) {
    try {
      const choices = useTheseChoices || props.choices
      const newGraph = await Graph.compile(
        props.blocks,
        choices,
        this.memos,
        undefined,
        'sequence',
        props.title,
        props.description
      )
      choices.onChoice(this.onChoice)

      this.setState(state => {
        const noChange = state && state.graph && Graph.sameGraph(state.graph, newGraph)

        const graph = noChange ? state.graph : Graph.order(newGraph)
        const codeBlockStatus = state ? this.state.codeBlockStatus : {}
        const data = noChange ? state.data : this.computeTreeModel(graph, codeBlockStatus).data

        return noChange
          ? null
          : {
              data,
              choices,
              graph,
              error: undefined,
              codeBlockStatus
            }
      })
    } catch (err) {
      console.error(err)
    }
  }

  private readonly onChoice = ({ choices }: Choices.Choices) => this.init(this.props, choices.clone())

  public static getDerivedStateFromError(error: Error) {
    console.error(error)
    return { error }
  }

  public componentDidMount() {
    this.computeTreeModelIfNeeded()
  }

  public componentWillUnmount() {
    if (this.state && this.state.choices) {
      this.state.choices.offChoice(this.onChoice)
    }
  }

  public componentDidUpdate() {
    if (!this.state.error) {
      this.computeTreeModelIfNeeded()
    }
  }

  /** Compute or re-compute tree model */
  private computeTreeModelIfNeeded() {
    if (!this.state || !this.state.data) {
      setTimeout(() => this.init(this.props))
    }
  }

  private computeTreeModel(
    graph: State['graph'],
    status: State['codeBlockStatus'],
    doValidate = true
  ): Partial<Pick<State, 'data'>> {
    if (graph) {
      try {
        return {
          data: new Tree.Treeifier<React.ReactNode>(
            new ReactUI(),
            status,
            doValidate ? this.validate.bind(this) : undefined
          ).toTree(graph)
        }
      } catch (error) {
        console.error(error)
        this.setState({ error })
      }
    }
    return { data: undefined }
  }

  private async validate(props: CodeBlock.CodeBlockProps) {
    const status = this.state.codeBlockStatus ? this.state.codeBlockStatus[props.id] : 'blank'

    if (props.validate && status !== 'in-progress' && status !== 'success') {
      try {
        this.onValidate(props.id, 'in-progress')
        // emitLinkUpdate(this.props.codeBlockId, 'in-progress')
        await pexecInCurrentTab(props.validate.toString(), undefined, true, true)
        this.onValidate(props.id, 'success')
        // emitLinkUpdate(this.props.codeBlockId, 'success')
      } catch (err) {
        this.onValidate(props.id, 'blank')
        // this.setState({ status: 'blank' })
        // emitLinkUpdate(this.props.codeBlockId, 'blank')
      }
    }
  }

  private readonly onValidate = (id: string, status: Graph.Status) => {
    setTimeout(() =>
      this.setState(curState => {
        const codeBlockStatus = Object.assign({}, curState.codeBlockStatus, { [id]: status })
        const { data } = this.computeTreeModel(curState.graph, codeBlockStatus, false)
        return { data, codeBlockStatus }
      })
    )
  }

  public render() {
    if (!this.state || !this.state.graph || !this.state.data) {
      return <Loading />
    } else if (this.state.error) {
      return 'Internal Error'
    } else {
      return <TreeView className="kui--dependence-tree kui--tree" hasGuides data={this.state.data} />
    }
  }
}

/* type LabelWithStatusProps = { label?: string; status: Graph.Status }

class LabelWithStatus extends React.PureComponent<LabelWithStatusProps> {
  private get status() {
    return this.props.status || 'blank'
  }

  private icon() {
    const icon = this.status === 'in-progress' ? <Spinner /> : statusToIcon(this.status)

    // make sure not to include any wrappers if we have no actual content
    return icon && <span className={statusToClassName(this.status) + ' kui--validator small-left-pad'}>{icon}</span>
  }

  public render() {
    const icon = this.icon()
    const { label } = this.props

    // make sure not to include any wrappers if we have no actual content
    return (
      (label || icon) && (
        <span className="kui--tree-leaf-label no-wrap">
          {label}
          {icon}
        </span>
      )
    )
  }
} */

export async function plan(filepath: string, props: Pick<Props, 'title' | 'description'> & Pick<Arguments, 'tab'>) {
  return (
    <CardResponse>
      <div className="padding-content marked-content page-content" data-is-nested>
        <Plan title={props.title} description={props.description} {...await read(filepath, { REPL: props.tab.REPL })} />
      </div>
    </CardResponse>
  )
}
