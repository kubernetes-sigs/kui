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
import { v4 } from 'uuid'
import { i18n, Tab } from '@kui-shell/core'
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
  isLeafNode,
  bodySource,
  hasSource,
  sameGraph
} from '../code/graph'

import Wizard, { Props as WizardProps } from '../Wizard/KWizard'

import Card from '../../../../spi/Card'
import Icons from '../../../../spi/Icons'

import { CodeBlockResponseFn } from '../../components'
import Markdown, { Choices, onChoice, offChoice } from '../../../Markdown'
import { Status, statusToClassName, statusToIcon } from '../../../ProgressStepper'

import '../../../../../../web/scss/components/Wizard/Guide.scss'

const strings = i18n('plugin-client-common', 'code')

type WizardStepWithGraph = { graph: Graph; step: WizardStep }

type Props = Choices & {
  /** Enclosing Kui Tab */
  tab: Tab

  /** markdown document id */
  uuid: string

  /** Raw list of code blocks */
  blocks: CodeBlockProps[]

  /** Status of code blocks */
  codeBlockResponses: CodeBlockResponseFn
}

type State = Choices & {
  /** Graph of code blocks to be executed */
  graph: OrderedGraph

  /** Choice Frontier */
  frontier: ReturnType<typeof findChoiceFrontier>

  /** validation status of each wizard step */
  wizardStepStatus: Status[]

  /** Which of `wizardStepStatus` to display (indexed from 1) */
  startAtStep: number

  /** are we in the middle of a `this.startRun` automated execution? */
  isRunning: boolean
}

export default class Guide extends React.PureComponent<Props, State> {
  private readonly choiceIcon1 = (<Icons className="yellow-text" icon="Warning" />)
  private readonly choiceIcon2 = (<Icons icon="PlusSquare" />)

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

    const startAtStep = state ? state.startAtStep : 1
    const wizardStepStatus = noChangeToGraph && state ? state.wizardStepStatus : []

    const isRunning = state ? state.isRunning : false

    return { graph, frontier, choices, wizardStepStatus, startAtStep, isRunning }
  }

  public componentDidMount() {
    onChoice(this.onChoiceFromAbove)
  }

  public componentWillUnmount() {
    offChoice(this.onChoiceFromAbove)
  }

  /** @return a wrapper UI for the content of a wizard step */
  private stepContent(actualContent: React.ReactNode) {
    return <Card className="kui--markdown-tab-card">{actualContent}</Card>
  }

  /** @return a UI component to visualize the given `graph` */
  private renderGraph(graph: Graph) {
    const source = hasSource(graph) ? graph.source : isLeafNode(graph) ? bodySource(graph) : ''
    return this.stepContent(
      <Markdown
        tab={this.props.tab}
        nested
        source={source}
        choices={this.state.choices}
        executeImmediately={this.state.isRunning}
      />
    )
  }

  /** @return text to place below the wizard step title */
  private wizardStepDescription(description: React.ReactNode) {
    return description && <div className="kui--wizard-nav-item-description">{description}</div>
  }

  /**
   * @return a `WizardStep` for a non-choice prereq for a choice on
   * the choice frontier
   */
  private wizardStepForPrereq(graph: Graph): WizardStepWithGraph {
    return {
      graph,
      step: {
        name: extractTitle(graph) || <span className="red-text">Missing title</span>,
        component: this.renderGraph(graph),
        stepNavItemProps: {
          children: this.wizardStepDescription(extractDescription(graph))
        }
      }
    }
  }

  /** A choice was made somewhere in the UI */
  private readonly onChoiceFromAbove = ({ choices }: Choices) =>
    setTimeout(() =>
      this.setState({
        frontier: undefined,
        wizardStepStatus: [],
        choices: Object.assign({}, choices)
      })
    )

  /**
   * A choice was made in *this* UI. The `this.props.choices.set()`
   * will eventually find its way back to a call to
   * `this.onChoiceFromAbove()`
   */
  private readonly onChoice = (evt: React.MouseEvent) => {
    const group = evt.currentTarget.getAttribute('data-choice-group')
    const title = evt.currentTarget.getAttribute('data-choice-title')
    this.props.choices.set(group, title)
  }

  /** @return UI that offers the user a choice */
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
                icon={this.choiceIcon2}
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
  private wizardStepForChoiceOnFrontier(graph: Choice, isFirstChoice: boolean): WizardStepWithGraph {
    if (graph) {
      return {
        graph,
        step: {
          name: graph.title,
          component: this.tilesForChoice(graph),
          stepNavItemProps: isFirstChoice && {
            children: this.wizardStepDescription(
              <span className="sub-text">{this.choiceIcon1} This step requires you to choose how to proceed</span>
            )
          }
        }
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

  /**
   * Modifiy the given `step` to include any UI bits that all wizard
   * steps should have.
   */
  private readonly addCommonWizardStepProperties = (step: WizardStep, idx: number) => {
    const status = this.state.wizardStepStatus[idx]
    const name = this.withStatus(step.name, status)

    return Object.assign(step, { name, hideCancelButton: true })
  }

  /** @return the `WizardStep` models for this Guide */
  private wizardSteps(): WizardStepWithGraph[] {
    // the steps will be the interleaved ((...prereqs, choice), ...)
    // dictated by the this.state.frontier model, which comes from
    // choice-frontier.ts; the flatMap just says we want to flatten
    // this nested interleaving down to a linear set of WizardSteps
    const idxOfFirstChoice = this.state.frontier.findIndex(_ => _.choice)
    return this.state.frontier.flatMap(({ prereqs, choice }, idx): WizardStepWithGraph[] =>
      [
        ...prereqs.map(_ => this.wizardStepForPrereq(_)),
        this.wizardStepForChoiceOnFrontier(choice, idx === idxOfFirstChoice)
      ].filter(Boolean)
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

  /** User clicked to remove a chip */
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

    // categoryName={strings('Your Choices')}
    return (
      chips.length > 0 && (
        <ChipGroup className="kui--chip-group kui--inverted-color-context" numChips={8}>
          {chips}
        </ChipGroup>
      )
    )
  }

  /**
   * @return a progress bar UI that indicates how far along we are
   * towards completion of the given `steps`
   */
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
    return <div className="kui--markdown-major-paragraph">{this.progress(steps)}</div>
  }

  private wizardTitle() {
    return extractTitle(this.state.graph)
    // {this.state.isRunning && <span className="small-left-pad">{statusToIcon('in-progress')}</span>}
  }

  private hasRemainingChoices() {
    return !!this.state.frontier.find(_ => _.choice !== undefined)
  }

  /** Commence automated execution of code blocks */
  private readonly startRun = () => {
    this.setState(curState => {
      const firstNotDoneStepIdx = curState.wizardStepStatus.findIndex(_ => _ !== 'success')

      return {
        isRunning: true,

        // remember that startAtStep is 1-indexed
        startAtStep: firstNotDoneStepIdx < 0 ? curState.startAtStep : firstNotDoneStepIdx + 1
      }
    })
  }

  /** Terminate automated execution of code blocks */
  private readonly stopRun = () => {
    this.setState({ isRunning: false })
  }

  private runAction(): WizardProps['rightButtons'][any] {
    return (
      !this.hasRemainingChoices() && {
        className: 'kui--guidebook-run',
        onClick: this.state.isRunning ? this.stopRun : this.startRun,
        children: strings(this.state.isRunning ? 'Stop' : 'Run'),
        isDisabled: this.hasRemainingChoices() // ??? this does not seem to take...
      }
    )
  }

  private actions(): Partial<WizardProps['rightButtons']> {
    // return [this.runAction()].filter(Boolean)
    return undefined
  }

  private presentChoices() {
    const steps = this.validateStepsIfNeeded(this.wizardSteps()).map(this.addCommonWizardStepProperties)

    return steps.length === 0 ? (
      'Nothing to do!'
    ) : (
      <div className="kui--guide">
        <div className="kui--wizard">
          <div className="kui--wizard-main-content">
            <Wizard
              key={this.state.isRunning && v4()}
              boxShadow
              hideClose
              steps={steps}
              title={this.wizardTitle()}
              startAtStep={this.state.startAtStep}
              description={this.wizardDescription()}
              descriptionFooter={this.wizardDescriptionFooter(steps)}
              rightButtons={this.actions()}
              topContent={this.chips()}
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
