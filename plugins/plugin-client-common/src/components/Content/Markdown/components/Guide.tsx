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

import order from './code/graph/order'
import compile from './code/graph/compile'
import { findChoiceFrontier, findCodeBlockFrontier, findPrereqsAndMainTasks } from './code/graph/choice-frontier'
import {
  Graph,
  CodeBlockProps,
  OrderedGraph,
  extractTitle,
  extractDescription,
  hasSource,
  sameGraph
} from './code/graph'

import Markdown, { Choices, ChoiceState } from '..'
import Card from '../../../spi/Card'

const Wizard = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Wizard })))

import '../../../../../web/scss/components/Wizard/PatternFly.scss'

type Props = Choices & {
  /** markdown document id */
  uuid: string

  /** Raw list of code blocks */
  blocks: CodeBlockProps[]
}

interface State {
  /** Graph of code blocks to be executed */
  graph: OrderedGraph

  /** Choice Frontier */
  frontier: ReturnType<typeof findChoiceFrontier>
}

class Guide extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = Guide.getDerivedStateFromProps(props)
  }

  /**
   * TODO move to a more common location?
   *
   * It may be the case that our state.graph has no choices (or no
   * remaining choices, subject to the `Choices`, i.e. the choices
   * already made). In this situation, we still need to present the
   * remaining, non-choicey work. We do so by presenting the
   * Prerequisites and Main Tasks. If we still get nothing, then we
   * present the raw code blocks (just below).
   *
   */
  private static computeChoiceFrontier(graph: Graph, choices: Props['choices']) {
    const frontier1 = findChoiceFrontier(graph, choices)

    const frontier2 =
      frontier1.length > 0
        ? frontier1
        : [
            {
              prereqs: findPrereqsAndMainTasks(graph),
              choice: undefined
            }
          ]

    const frontier =
      frontier2.length > 0
        ? frontier2
        : [
            {
              prereqs: findCodeBlockFrontier(graph, choices),
              choice: undefined
            }
          ]

    return frontier
  }

  public static getDerivedStateFromProps(props: Props, state?: State) {
    const newGraph = compile(props.blocks, props.choices, 'sequence')
    const noChangeToGraph = state && sameGraph(state.graph, newGraph)

    const graph = noChangeToGraph ? state.graph : order(newGraph)
    const frontier = Guide.computeChoiceFrontier(graph, props.choices)

    return { graph, frontier }
  }

  private allDoneWithChoices() {
    return 'all done with choices'
  }

  private graph(graph: Graph) {
    if (hasSource(graph)) {
      return (
        <Card className="kui--markdown-tab-card">
          <Markdown nested source={graph.source} choices={this.props.choices} />
        </Card>
      )
    } /* else if (isSequence(graph)) {
      return <React.Fragment>{graph.sequence.map(_ => this.graph(_))}</React.Fragment>
    } else if (isParallel(graph)) {
      return <React.Fragment>{graph.parallel.map(_ => this.graph(_))}</React.Fragment>
    } else {
      return (
        <pre key={graph.id}>
          <CodeBlock
            className="kui--code-block-in-markdown"
            value={graph.body}
            language={graph.language}
            optional={graph.optional}
            validate={graph.validate}
            id={graph.id}
            tab={undefined}
            arg1={undefined}
            onResponse={this.onResponse}
          />
        </pre>
      )
    } */
  }

  /* private readonly onResponse = () => {
    // noop
  } */

  private wizardStepDescription(description: string) {
    return (
      <div className="kui--wizard-nav-item-description">
        {/* this.wizardCodeBlockSteps(stepIdx) */}
        <div className="paragraph">{description}</div>
      </div>
    )
  }

  private presentChoices() {
    const steps = this.state.frontier
      .flatMap(({ prereqs, choice }) =>
        [
          ...prereqs.map(_ => ({
            name: extractTitle(_),
            component: this.graph(_),
            stepNavItemProps: {
              children: this.wizardStepDescription(extractDescription(_))
            }
          })),
          choice ? { name: choice.title, component: this.graph(choice) } : undefined
        ].filter(Boolean)
      )
      .map(_ => Object.assign(_, { hideCancelButton: true }))

    return steps.length === 0 ? (
      'Nothing to do!'
    ) : (
      <div className="kui--wizard">
        <div className="kui--wizard-main-content">
          <Wizard
            hideClose
            steps={steps}
            title={extractTitle(this.state.graph)}
            description={extractDescription(this.state.graph)}
          />
        </div>
      </div>
    )
  }

  public render() {
    if (!this.state) {
      return <React.Fragment />
    } else if (this.state.frontier.length === 0) {
      return this.allDoneWithChoices()
    } else {
      return this.presentChoices()
    }
  }
}

export default function guidebookGuideWrapper(uuid: string, choices: ChoiceState) {
  return function guidebookGuide(props: { 'data-kui-code-blocks': string }) {
    const blocks = props['data-kui-code-blocks']
      ? JSON.parse(props['data-kui-code-blocks']).map(_ => JSON.parse(Buffer.from(_, 'base64').toString()))
      : undefined

    return !blocks ? (
      <span className="all-pad">Nothing to do!</span>
    ) : (
      <Guide uuid={uuid} blocks={blocks} choices={choices} />
    )
  }
}
