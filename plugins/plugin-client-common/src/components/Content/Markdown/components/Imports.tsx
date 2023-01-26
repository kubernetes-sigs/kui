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
import { Tree, Graph, Choices, CodeBlock, Memoizer } from 'madwizard'
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'
import { TreeView, TreeViewProps } from '@patternfly/react-core/dist/esm/components/TreeView'

import Icons, { SupportedIcon } from '../../../spi/Icons'
// import Spinner from '../../../Views/Terminal/Block/Spinner'
import { ProgressStepState } from '../../ProgressStepper'

import Markdown from '../../Markdown'
const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

import '../../../../../web/scss/components/Tree/_index.scss'
import '../../../../../web/scss/components/Wizard/Imports.scss'

const debug = Debug('plugins/plugin-client-common/components/Content/Markdown/Imports')

class ReactUI implements Tree.UI<React.ReactNode> {
  public markdown(body: string) {
    return <Markdown nested source={body} />
  }

  public ask() {
    return Promise.resolve({})
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
}

type Status = ProgressStepState['status']

type Props = Choices.Choices &
  Partial<CodeBlock.Title> &
  Partial<CodeBlock.Description> & {
    imports: CodeBlock.CodeBlockProps[]
  }

// type Progress = { nDone: number; nError: number; nTotal: number }

/** Map from treeModel node ID to the cumulative progress of that subtree */
// type ProgressMap = Record<string, Progress>

type State = Choices.Choices &
  Pick<TreeViewProps, 'data'> & {
    error?: Error

    imports: Graph.OrderedGraph

    /** Map from CodeBlockProps.id to execution status of that code block */
    codeBlockStatus: Record<string, Status>
  }

class Imports extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      data: null,
      imports: undefined,
      choices: props.choices,
      codeBlockStatus: undefined
    }
  }

  private readonly memos = new Memoizer()

  private async init(props: Props, useTheseChoices?: State['choices']) {
    try {
      const choices = useTheseChoices || props.choices || Choices.newChoiceState('default')
      if (!useTheseChoices && !props.choices) {
        choices.onChoice(this.onChoice)
      }

      const newGraph = await Graph.compile(
        props.imports,
        choices,
        this.memos,
        undefined,
        'sequence',
        props.title,
        props.description
      )

      this.setState(state => {
        try {
          const noChange = state && Graph.sameGraph(state.imports, newGraph)

          const imports = noChange ? state.imports : Graph.order(newGraph)
          const codeBlockStatus = state ? this.state.codeBlockStatus : {}
          const data = noChange ? state.data : this.computeTreeModel(imports, codeBlockStatus).data

          return noChange
            ? null
            : {
                data,
                choices,
                imports,
                error: undefined,
                codeBlockStatus
              }
        } catch (error) {
          console.error(error)
          return Object.assign({}, state, { error })
        }
      })
    } catch (error) {
      console.error(error)
      this.setState({ error })
    }
  }

  private readonly onChoice = ({ choices }: Choices.Choices) => this.init(this.props, choices.clone())

  public static getDerivedStateFromError(error: Error) {
    console.error(error)
    return { error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error in Imports', error, errorInfo)
  }

  public componentDidMount() {
    this.computeTreeModelIfNeeded()
  }

  public componentWillUnmount() {
    this.state.choices.offChoice(this.onChoice)
  }

  public componentDidUpdate() {
    if (!this.state.error) {
      this.computeTreeModelIfNeeded()
    }
  }

  /** Compute or re-compute tree model */
  private computeTreeModelIfNeeded() {
    if (!this.state.data) {
      this.init(this.props)
    }
  }

  private computeTreeModel(
    imports = this.state.imports,
    status = this.state.codeBlockStatus,
    doValidate = true
  ): Pick<State, 'data'> {
    if (this.state.error) {
      return
    }

    try {
      return {
        data: new Tree.Treeifier<React.ReactNode>(new ReactUI(), status, doValidate && this.validate.bind(this)).toTree(
          imports
        )
      }
    } catch (error) {
      console.error(error)
      this.setState({ error })
    }
  }

  private async validate(props: CodeBlock.CodeBlockProps) {
    try {
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
    } catch (error) {
      console.error(error)
      this.setState({ error })
    }
  }

  private readonly onValidate = (id: string, status: Status) => {
    setTimeout(() =>
      this.setState(curState => {
        const codeBlockStatus = Object.assign({}, curState.codeBlockStatus, { [id]: status })
        const { data } = this.computeTreeModel(curState.imports, codeBlockStatus, false)
        return { data, codeBlockStatus }
      })
    )
  }

  public render() {
    if (this.state.error) {
      return 'Internal Error'
    }

    return !this.state.data ? (
      <React.Fragment />
    ) : (
      <TreeView className="kui--dependence-tree kui--tree" hasGuides data={this.state.data} />
    )
  }
}

/* type LabelWithStatusProps = { label?: string; status: Status }

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

export default function guidebookImports(props: Props) {
  return (
    <ReactCommentary>
      <div className="padding-content marked-content page-content" data-is-nested>
        <Imports {...props} />
      </div>
    </ReactCommentary>
  )
}
