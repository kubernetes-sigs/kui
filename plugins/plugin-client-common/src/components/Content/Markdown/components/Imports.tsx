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
import { basename } from 'path'
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core'
import { TreeView, TreeViewProps } from '@patternfly/react-core'

import {
  isEmpty,
  isSequence,
  isParallel,
  isTitledSteps,
  isSubTask,
  isChoice,
  compile,
  sameGraph,
  order,
  progress,
  CodeBlockProps,
  OrderedCodeBlock,
  OrderedChoice,
  OrderedGraph,
  OrderedParallel,
  OrderedSequence,
  OrderedSubTask,
  OrderedTitledSteps
} from './code/graph'

import Tree from './ImportsTree'
import Icons from '../../../spi/Icons'
import Spinner from '../../../Views/Terminal/Block/Spinner'
import { ProgressStepState, statusToIcon, statusToClassName } from '../../ProgressStepper'

import '../../../../../web/scss/components/Tree/_index.scss'
import '../../../../../web/scss/components/Wizard/Imports.scss'

const debug = Debug('plugins/plugin-client-common/components/Content/Markdown/Imports')

type Status = ProgressStepState['status']

interface Props {
  imports: CodeBlockProps[]
}

type Progress = { nDone: number; nError: number; nTotal: number }

/** Map from treeModel node ID to the cumulative progress of that subtree */
type ProgressMap = Record<string, Progress>

type State = Pick<TreeViewProps, 'data'> & {
  hasError: boolean

  imports: OrderedGraph

  /** Map from CodeBlockProps.id to execution status of that code block */
  codeBlockStatus: Record<string, Status>
}

function isDone({ nDone, nTotal }: Progress) {
  return nDone === nTotal
}

class ImportsImpl extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = ImportsImpl.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    const newGraph = compile(props.imports, 'sequence')
    const noChange = state && sameGraph(state.imports, newGraph)

    const imports = noChange ? state.imports : order(newGraph)
    const data = noChange ? state.data : null
    const codeBlockStatus = state ? state.codeBlockStatus : {}

    return noChange
      ? state
      : {
          data,
          imports,
          hasError: false,
          codeBlockStatus
        }
  }

  public componentDidMount() {
    this.computeTreeModelIfNeeded()
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
    return this.treeModelForLeaf(imports, status, doValidate, undefined, undefined, 'Tasks')
  }

  private withIcons(
    rollupStatus: Progress,
    origin: OrderedGraph,
    data: TreeViewProps['data'][0],
    showBadge = isDone(rollupStatus)
  ) {
    const isTotallyDone = isDone(rollupStatus)
    const hasErrors = rollupStatus.nError > 0
    const doneOrErrors = isTotallyDone || hasErrors

    const showIcon = data.icon || !showBadge

    const badgeProps = !showBadge
      ? { hasBadge: false }
      : {
          hasBadge: true,
          badgeProps: { isRead: !isTotallyDone },
          customBadgeContent: isTotallyDone ? (
            <Icons className="pf-m-success" icon="Checkmark" />
          ) : (
            <span className="nowrap">{`${rollupStatus.nDone} of ${rollupStatus.nTotal}`}</span>
          )
        }

    return Object.assign({ id: origin.order.toString() }, data, badgeProps, {
      'data-origin': origin,
      'data-has-errors': hasErrors,
      'data-is-totally-done': isTotallyDone,
      expandedIcon: data.expandedIcon || null,
      icon: showIcon && (data.icon || (doneOrErrors && <LabelWithStatus status={hasErrors ? 'error' : 'success'} />))
    })
  }

  /** We filter out code blocks with `validate: $body` */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static ignoreCodeBlock(props: CodeBlockProps) {
    // return validate === body <-- i don't think we need this any more
    return false
  }

  /** @return progress metrics (nDone, nTotal, etc.) for the given ordered graph */
  private progress(graph: OrderedGraph, status: State['codeBlockStatus']) {
    return progress(graph, status, undefined, ImportsImpl.ignoreCodeBlock)
  }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  private treeModelForSubTask(
    origin: OrderedSubTask,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    depth: number
  ): { data: TreeViewProps['data'] } {
    const { key, title, filepath, graph } = origin
    const rollupStatus = this.progress(graph, status)
    const children = Tree.xformFoldChoices(
      graph.sequence
        .map(_ => this.treeModelForLeaf(_, status, doValidate, key, depth + 1))
        .filter(Boolean)
        .flatMap(_ => _.data)
    )

    if (children.length === 0) {
      return
    }

    const hasAction = !!filepath
    const hasBadge = hasAction && rollupStatus.nDone > 0

    const data = this.withIcons(
      rollupStatus,
      origin,
      {
        id: origin.order.toString(),
        name: title || basename(filepath),
        defaultExpanded: depth < 3 && !isDone(rollupStatus),
        children: children.length === 0 ? undefined : children,
        icon: <Icons icon="Guidebook" />,
        action: hasAction && (
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
      },
      hasBadge
    )

    return { data: [Tree.xformFoldNestedSubTask(data)] }
  }

  private treeModelForTitledStep(
    graph: OrderedTitledSteps['steps'][0],
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0
  ) {
    return this.treeModelForSequence(graph.graph, status, doValidate, idPrefix, depth, graph.title)
  }

  private treeModelForTitledSteps(
    graph: OrderedTitledSteps,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0
  ) {
    const _children = graph.steps
      .map((_, childIdx) => this.treeModelForTitledStep(_, status, doValidate, `${idPrefix}-s${childIdx}`, depth + 1))
      .filter(Boolean)
    const rollupStatus = this.progress(graph, status)
    const children = _children.flatMap(_ => _.data)

    return {
      data: [
        this.withIcons(rollupStatus, graph, {
          name: graph.title,
          defaultExpanded: depth < 2,
          children
        })
      ]
    }
  }

  private treeModelForSequence(
    graph: OrderedSequence,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0,
    name: React.ReactNode = ''
  ) {
    const _children = graph.sequence
      .map((_, childIdx) => this.treeModelForLeaf(_, status, doValidate, `${idPrefix}-s${childIdx}`, depth + 1, name))
      .filter(Boolean)
    const rollupStatus = this.progress(graph, status)
    const children = Tree.optimize(
      _children.flatMap(_ => _.data),
      depth
    )

    // only show the "n of m" text for the root
    const hasBadge = isDone(rollupStatus) || depth === 0

    const data = [
      this.withIcons(
        rollupStatus,
        graph,
        {
          name: name || 'Sequence',
          defaultExpanded: depth < 1,
          children: children.length === 0 ? undefined : children
        },
        hasBadge
      )
    ]

    return { data: Tree.xformFoldSingletonSubTask(data) }
  }

  private treeModelForParallel(
    graph: OrderedParallel,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0,
    name: React.ReactNode = ''
  ) {
    const _children = graph.parallel
      .map((_, childIdx) => this.treeModelForLeaf(_, status, doValidate, `${idPrefix}-p${childIdx}`, depth + 1, name))
      .filter(Boolean)
    const rollupStatus = this.progress(graph, status)
    const children = _children.flatMap(_ => _.data)

    const data =
      children.length === 1
        ? children // [Object.assign(children[0], { name: name || children[0].name })]
        : [
            this.withIcons(rollupStatus, graph, {
              name: name || 'Parallel',
              defaultExpanded: depth < 1,
              children: children.length === 0 ? undefined : children
            })
          ]
    return { data }
  }

  private treeModelForChoice(
    graph: OrderedChoice,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0
  ) {
    const _children = graph.choices
      .filter(_ => !isEmpty(_.graph))
      .map(_ =>
        this.treeModelForLeaf(
          _.graph,
          status,
          doValidate,
          `${idPrefix}-g${graph.group}-m${_.member}`,
          depth + 1,
          <span>
            <strong>Option {_.member + 1}</strong>: {_.title}
          </span>
        )
      )
      .filter(Boolean)
    const rollupStatus = this.progress(graph, status)
    const children = _children.flatMap(_ => _.data)

    const data = [
      this.withIcons(rollupStatus, graph, {
        name: graph.title || <span className="italic red-text">Missing heading for choice</span>,
        children
      })
    ]
    return { data }
  }

  private treeModelForCodeBlock(graph: OrderedCodeBlock, status: State['codeBlockStatus'], doValidate: boolean) {
    if (doValidate) {
      setTimeout(() => this.validate(graph))
    }

    const id = graph.order.toString()
    const myStatus = status[graph.id]

    const data = [
      {
        id,
        icon: myStatus && myStatus !== 'success' && <LabelWithStatus status={myStatus} />,
        name: (
          <pre>
            <code>
              {graph.body
                .split(/\n/)
                .map(_ => _.replace(/#.*/, ''))
                .filter(Boolean)[0]
                .trim()
                .slice(0, 30)}
            </code>
          </pre>
        )
      }
    ]

    return { data }
  }

  private treeModelForLeaf(
    graph: OrderedGraph,
    status: State['codeBlockStatus'],
    doValidate: boolean,
    idPrefix = '',
    depth = 0,
    name: React.ReactNode = ''
  ): { data: TreeViewProps['data'] } {
    if (isSequence(graph)) {
      return this.treeModelForSequence(graph, status, doValidate, idPrefix, depth, name)
    } else if (isTitledSteps(graph)) {
      return this.treeModelForTitledSteps(graph, status, doValidate, idPrefix, depth)
    } else if (isParallel(graph)) {
      return this.treeModelForParallel(graph, status, doValidate, idPrefix, depth, name)
    } else if (isChoice(graph)) {
      return this.treeModelForChoice(graph, status, doValidate, idPrefix, depth)
    } else if (isSubTask(graph)) {
      return this.treeModelForSubTask(graph, status, doValidate, depth)
    } else if (!graph.optional && !ImportsImpl.ignoreCodeBlock(graph)) {
      return this.treeModelForCodeBlock(graph, status, doValidate)
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

type LabelWithStatusProps = { label?: string; status: Status }

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
}

export default function guidebookImports(props: Props) {
  const imports = props['data-kui-code-blocks']
    ? JSON.parse(props['data-kui-code-blocks']).map(_ => JSON.parse(Buffer.from(_, 'base64').toString()))
    : undefined

  return !imports ? <span className="all-pad">No imports were found</span> : <ImportsImpl imports={imports} />
}
