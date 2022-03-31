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
import { Chip, ChipGroup, Flex, Tile, Wizard, WizardStep } from '@patternfly/react-core'

import order from '../code/graph/order'
import compile from '../code/graph/compile'
import { findChoiceFrontier, findCodeBlockFrontier, findPrereqsAndMainTasks } from '../code/graph/choice-frontier'
import {
  Graph,
  Choice,
  CodeBlockProps,
  OrderedGraph,
  extractTitle,
  extractDescription,
  hasSource,
  sameChoices,
  sameGraph
} from '../code/graph'

import Card from '../../../../spi/Card'
import Icons from '../../../../spi/Icons'
import Markdown, { Choices } from '../..'

import '../../../../../../web/scss/components/Wizard/PatternFly.scss'

type Props = Choices & {
  /** markdown document id */
  uuid: string

  /** Raw list of code blocks */
  blocks: CodeBlockProps[]
}

type State = Choices & {
  /** Graph of code blocks to be executed */
  graph: OrderedGraph

  /** Choice Frontier */
  frontier: ReturnType<typeof findChoiceFrontier>
}

export default class Guide extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = Guide.getDerivedStateFromProps(props)
  }

  /**
   * TODO move to a more common location?
   */
  private static isValidFrontier(frontier: ReturnType<typeof findChoiceFrontier>): boolean {
    return frontier.length > 0 && frontier.every(_ => _.prereqs.length > 0 || !!_.choice)
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

    const frontier2 = Guide.isValidFrontier(frontier1)
      ? frontier1
      : [
          {
            prereqs: findPrereqsAndMainTasks(graph),
            choice: undefined
          }
        ]

    const frontier = Guide.isValidFrontier(frontier2)
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
    const noChangeToChoices = state && sameChoices(props.choices, state.choices)
    const choices = noChangeToChoices ? state.choices : props.choices

    const newGraph = compile(props.blocks, choices, 'sequence')
    const noChangeToGraph = state && sameGraph(state.graph, newGraph)

    const graph = noChangeToGraph ? state.graph : order(newGraph)
    const frontier = noChangeToChoices && noChangeToGraph ? state.frontier : Guide.computeChoiceFrontier(graph, choices)

    return { graph, frontier, choices }
  }

  private stepContent(inner: React.ReactNode) {
    return <Card className="kui--markdown-tab-card">{inner}</Card>
  }

  private graph(graph: Graph) {
    if (hasSource(graph)) {
      return this.stepContent(<Markdown nested source={graph.source} choices={this.state.choices} />)
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

  private wizardStepDescription(description: string) {
    return (
      description && (
        <div className="kui--wizard-nav-item-description">
          {/* this.wizardCodeBlockSteps(stepIdx) */}
          <div className="paragraph">{description}</div>
        </div>
      )
    )
  }

  /**
   * @return a `WizardStep` for a non-choice prereq for a choice on
   * the choice frontier
   */
  private wizardStepForPrereq(_: Graph): WizardStep {
    return {
      name: extractTitle(_),
      component: this.graph(_),
      stepNavItemProps: {
        children: this.wizardStepDescription(extractDescription(_))
      }
    }
  }

  private readonly onChoice = (evt: React.MouseEvent) => {
    const group = evt.currentTarget.getAttribute('data-choice-group')
    const title = evt.currentTarget.getAttribute('data-choice-title')
    this.props.choices.set(group, title)
  }

  private tilesForChoice(choice: Choice) {
    return this.stepContent(
      <Flex>
        {choice.choices.map((_, idx) => {
          return (
            <Tile
              key={idx}
              isStacked
              title={_.title}
              icon={<Icons icon="PlusSquare" />}
              isSelected={this.state.choices && this.state.choices.get(choice.group) === _.title}
              onClick={this.onChoice}
              data-choice-group={choice.group}
              data-choice-title={_.title}
            >
              {this.graph(_.graph)}
            </Tile>
          )
        })}
      </Flex>
    )
  }

  /**
   * @return a `WizardStep` for a choice on the choice frontier
   */
  private wizardStepForChoiceOnFrontier(choice: Choice): WizardStep {
    if (choice) {
      return { name: choice.title, component: this.tilesForChoice(choice) }
    }
  }

  /**
   * @return the `WizardStep` models for this Guide */
  private wizardSteps(): WizardStep[] {
    // the steps will be the interleaved ((...prereqs, choice), ...)
    // dictated by the this.state.frontier model, which comes from
    // choice-frontier.ts; the flatMap just says we want to flatten
    // this nested interleaving down to a linear set of WizardSteps
    return this.state.frontier
      .flatMap(({ prereqs, choice }): WizardStep[] =>
        [...prereqs.map(_ => this.wizardStepForPrereq(_)), this.wizardStepForChoiceOnFrontier(choice)].filter(Boolean)
      )
      .map(_ => Object.assign(_, { hideCancelButton: true }))
  }

  private readonly removeChip = (evt: React.MouseEvent) => {
    const node = evt.currentTarget.parentElement
    if (node) {
      const key = node.getAttribute('data-ouia-component-id')
      if (key) {
        this.state.choices.remove(key)
      }
    }
  }

  /** UI to indicate what choices the user has already made */
  private chips() {
    return (
      <ChipGroup numChips={6}>
        {this.state.choices.entries().map(([key, value]) => (
          <Chip key={key} ouiaId={key} onClick={this.removeChip}>
            {value}
          </Chip>
        ))}
      </ChipGroup>
    )
  }

  private wizardDescription() {
    const descriptionContent = extractDescription(this.state.graph)

    return (
      <React.Fragment>
        {descriptionContent && <div className="paragraph">{descriptionContent}</div>}

        {this.chips()}
      </React.Fragment>
    )
  }

  private presentChoices() {
    const steps = this.wizardSteps()

    return steps.length === 0 ? (
      'Nothing to do!'
    ) : (
      <div className="kui--wizard">
        <div className="kui--wizard-main-content">
          <Wizard
            hideClose
            steps={steps}
            title={extractTitle(this.state.graph)}
            description={this.wizardDescription()}
          />
        </div>
      </div>
    )
  }

  private allDoneWithChoices() {
    return 'all done with choices'
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
