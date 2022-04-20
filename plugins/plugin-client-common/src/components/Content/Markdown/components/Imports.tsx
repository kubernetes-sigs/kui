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
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core'
import { TreeView, TreeViewProps, TextContent } from '@patternfly/react-core'

import {
  sameGraph,
  OrderedGraph,
  CodeBlockProps,
  Title,
  Description,
  order,
  compile,
  Choices,
  Decoration,
  Treeifier,
  UI
} from 'madwizard'

import Icons, { SupportedIcon } from '../../../spi/Icons'
// import Spinner from '../../../Views/Terminal/Block/Spinner'
import { ProgressStepState } from '../../ProgressStepper'

const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

import '../../../../../web/scss/components/Tree/_index.scss'
import '../../../../../web/scss/components/Wizard/Imports.scss'

const debug = Debug('plugins/plugin-client-common/components/Content/Markdown/Imports')

class ReactUI implements UI<React.ReactNode> {
  public span(content: string, ...decorations: Decoration[]) {
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

  public statusToIcon(status: Status) {
    switch (status) {
      case 'success':
        return <Icons className="pf-m-success" icon="Checkmark" />
    }
  }

  public title(title: string | string[], status?: Status) {
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

type Props = Choices &
  Partial<Title> &
  Partial<Description> & {
    imports: CodeBlockProps[]
  }

type Progress = { nDone: number; nError: number; nTotal: number }

/** Map from treeModel node ID to the cumulative progress of that subtree */
type ProgressMap = Record<string, Progress>

type State = Choices &
  Pick<TreeViewProps, 'data'> & {
    hasError: boolean

    imports: OrderedGraph

    /** Map from CodeBlockProps.id to execution status of that code block */
    codeBlockStatus: Record<string, Status>
  }

class Imports extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = Imports.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    const choices = state ? state.choices : props.choices
    const newGraph = compile(props.imports, choices, 'sequence', props.title, props.description)
    const noChange = state && sameGraph(state.imports, newGraph)

    const imports = noChange ? state.imports : order(newGraph)
    const data = noChange ? state.data : null
    const codeBlockStatus = state ? state.codeBlockStatus : {}

    return noChange
      ? state
      : {
          data,
          choices,
          imports,
          hasError: false,
          codeBlockStatus
        }
  }

  private readonly onChoice = ({ choices }: Choices) => setTimeout(() => this.setState({ choices: choices.clone() }))

  public componentDidMount() {
    this.state.choices.onChoice(this.onChoice)
    this.computeTreeModelIfNeeded()
  }

  public componentWillUnmount() {
    this.state.choices.offChoice(this.onChoice)
  }

  public componentDidUpdate() {
    this.computeTreeModelIfNeeded()
  }

  /** Compute or re-compute tree model */
  private computeTreeModelIfNeeded() {
    if (!this.state.data) {
      this.setState(curState => {
        if (!curState.data) {
          return this.computeTreeModel()
        } else {
          return null
        }
      })
    }
  }

  private computeTreeModel(
    imports = this.state.imports,
    status = this.state.codeBlockStatus,
    doValidate = true
  ): Pick<State, 'data'> {
    return {
      data: new Treeifier<React.ReactNode>(new ReactUI(), status, doValidate && this.validate.bind(this)).toTree(
        imports
      )
    }
  }

  private async validate(props: CodeBlockProps) {
    const status = this.state.codeBlockStatus[props.id]

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

  private readonly onValidate = (id: string, status: Status) => {
    this.setState(curState => {
      const codeBlockStatus = Object.assign({}, curState.codeBlockStatus, { [id]: status })
      const { data } = this.computeTreeModel(curState.imports, codeBlockStatus, false)
      return { data, codeBlockStatus }
    })
  }

  public render() {
    if (this.state.hasError) {
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
      <TextContent>
        <div className="padding-content marked-content page-content" data-is-nested>
          <Imports {...props} />
        </div>
      </TextContent>
    </ReactCommentary>
  )
}
