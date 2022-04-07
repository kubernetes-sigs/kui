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
import { i18n } from '@kui-shell/core'
import { Chip, ChipGroup, Grid, GridItem, Progress, Tile, WizardStep } from '@patternfly/react-core'

import order from '../code/graph/order'
import compile from '../code/graph/compile'
import { findChoiceFrontier, findCodeBlockFrontier, findPrereqsAndMainTasks } from '../code/graph/choice-frontier'

import validate from '../code/graph/validate'
import {
  Graph,
  Choice,
  CodeBlockProps,
  OrderedGraph,
  extractTitle,
  extractDescription,
  hasSource,
  sameGraph
} from '../code/graph'

import Wizard from '../Wizard/KWizard'

import Card from '../../../../spi/Card'
import Icons from '../../../../spi/Icons'

import Markdown, { Choices, onChoice, offChoice } from '../..'
import { Status, statusToClassName, statusToIcon } from '../../../ProgressStepper'

import '../../../../../../web/scss/components/Wizard/Guide.scss'

const strings = i18n('plugin-client-common', 'code')

type WizardStepWithGraph = { graph: Graph; step: WizardStep }

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

  /** validation status of each wizard step */
  wizardStepStatus: Status[]
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
    const choices = state ? state.choices : props.choices

    const newGraph = compile(props.blocks, choices, 'sequence')
    const noChangeToGraph = state && sameGraph(state.graph, newGraph)

    const graph = noChangeToGraph ? state.graph : order(newGraph)
    const frontier =
      noChangeToGraph && state && state.frontier ? state.frontier : Guide.computeChoiceFrontier(graph, choices)

    const wizardStepStatus = noChangeToGraph && state ? state.wizardStepStatus : []

    return { graph, frontier, choices, wizardStepStatus }
  }

  private readonly onChoiceFromAbove = ({ choices }: Choices) =>
    this.setState({ frontier: undefined, wizardStepStatus: [], choices: Object.assign({}, choices) })

  public componentDidMount() {
    onChoice(this.onChoiceFromAbove)
  }

  public componentWillUnmount() {
    offChoice(this.onChoiceFromAbove)
  }

  private stepContent(inner: React.ReactNode) {
    return <Card className="kui--markdown-tab-card">{inner}</Card>
  }

  private graph(graph: Graph) {
    if (hasSource(graph)) {
      return this.stepContent(<Markdown nested source={graph.source} choices={this.state.choices} />)
    }
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
  private wizardStepForPrereq(graph: Graph): WizardStepWithGraph {
    return {
      graph,
      step: {
        name: extractTitle(graph),
        component: this.graph(graph),
        stepNavItemProps: {
          children: this.wizardStepDescription(extractDescription(graph))
        }
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
      <Grid hasGutter span={4}>
        {choice.choices.map(_ => {
          return (
            <GridItem key={_.title}>
              <Tile
                isStacked
                title={_.title}
                className="kui--tile"
                icon={<Icons icon="PlusSquare" />}
                isSelected={this.state.choices && this.state.choices.get(choice.group) === _.title}
                onClick={this.onChoice}
                data-choice-group={choice.group}
                data-choice-title={_.title}
              >
                {_.description && <Markdown nested source={_.description} />}
              </Tile>
            </GridItem>
          )
        })}
      </Grid>
    )
  }

  /**
   * @return a `WizardStep` for a choice on the choice frontier
   */
  private wizardStepForChoiceOnFrontier(graph: Choice): WizardStepWithGraph {
    if (graph) {
      return {
        graph,
        step: { name: graph.title, component: this.tilesForChoice(graph) }
      }
    }
  }

  private withStatus(name: WizardStep['name'], status: Status) {
    const icon = status && statusToIcon(status)
    if (icon) {
      return (
        <React.Fragment>
          {name} <span className={statusToClassName(status).join(' ') + ' kui--validator'}>{icon}</span>
        </React.Fragment>
      )
    } else {
      return name
    }
  }

  /** Any UI bits that all wizard steps should have */
  private readonly addCommonWizardStepProperties = (step: WizardStep, idx: number) => {
    const status = this.state.wizardStepStatus[idx]
    const name = this.withStatus(step.name, status)

    return Object.assign(step, { name, hideCancelButton: true })
  }

  /**
   * @return the `WizardStep` models for this Guide */
  private wizardSteps(): WizardStepWithGraph[] {
    // the steps will be the interleaved ((...prereqs, choice), ...)
    // dictated by the this.state.frontier model, which comes from
    // choice-frontier.ts; the flatMap just says we want to flatten
    // this nested interleaving down to a linear set of WizardSteps
    return this.state.frontier.flatMap(({ prereqs, choice }): WizardStepWithGraph[] =>
      [...prereqs.map(_ => this.wizardStepForPrereq(_)), this.wizardStepForChoiceOnFrontier(choice)].filter(Boolean)
    )
  }

  private validateStepsIfNeeded(steps: WizardStepWithGraph[]): WizardStep[] {
    Promise.all(
      steps.map(async (_, idx) => {
        if (!this.state.wizardStepStatus[idx] || this.state.wizardStepStatus[idx] === 'blank') {
          const status = await validate(_.graph)
          if (status !== this.state.wizardStepStatus[idx]) {
            this.setState(curState => ({
              wizardStepStatus: [
                ...curState.wizardStepStatus.slice(0, idx),
                status,
                ...curState.wizardStepStatus.slice(idx + 1)
              ]
            }))
          }
        }
      })
    )

    return steps.map(_ => _.step)
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
    // if you want key=value, this would be they key: key.split(/\/([^/]+)$/)[1]}=
    const chips = this.state.choices.entries().map(([key, value]) => (
      <Chip key={key} ouiaId={key} onClick={this.removeChip}>
        {value}
      </Chip>
    ))

    return (
      chips.length > 0 && (
        <ChipGroup className="kui--chip-group" categoryName={strings('Your Choices')} numChips={8}>
          {chips}
        </ChipGroup>
      )
    )
  }

  private progress(steps: WizardStep[]) {
    const nTotal = steps.length
    const nError = this.state.wizardStepStatus.filter(_ => _ === 'error').length
    const nDone = this.state.wizardStepStatus.filter(_ => _ === 'success').length

    const label =
      nError > 0
        ? strings(nError === 1 ? 'xOfyFailingz' : 'xOfyFailingsz', nDone, nError, nTotal)
        : strings('xOfy', nDone, nTotal)

    const variant = nDone === nTotal ? 'success' : nError > 0 ? 'danger' : undefined

    return (
      <Progress
        aria-label="wizard progress"
        className="kui--wizard-progress"
        min={0}
        max={nTotal}
        value={nDone}
        title={strings('Completed Tasks')}
        label={label}
        valueText={label}
        size="sm"
        variant={variant}
        measureLocation="outside"
      />
    )
  }

  private wizardDescription() {
    const descriptionContent = extractDescription(this.state.graph)
    return descriptionContent && <Markdown nested source={descriptionContent} />
  }

  private wizardDescriptionFooter(steps: WizardStep[]) {
    return (
      <div className="kui--markdown-major-paragraph">
        {this.chips()} {this.progress(steps)}
      </div>
    )
  }

  private presentChoices() {
    const steps = this.validateStepsIfNeeded(this.wizardSteps()).map(this.addCommonWizardStepProperties)

    // start at the first non-success step
    const startAtStep = steps.findIndex((_, idx) => this.state.wizardStepStatus[idx] !== 'success')

    return steps.length === 0 ? (
      'Nothing to do!'
    ) : (
      <div className="kui--guide">
        <div className="kui--wizard">
          <div className="kui--wizard-main-content">
            <Wizard
              hideClose
              steps={steps}
              startAtStep={startAtStep < 0 ? 1 : startAtStep + 1}
              title={extractTitle(this.state.graph)}
              description={this.wizardDescription()}
              descriptionFooter={this.wizardDescriptionFooter(steps)}
            />
          </div>
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
