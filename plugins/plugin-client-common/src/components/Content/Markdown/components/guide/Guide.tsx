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
import { i18n } from '@kui-shell/core/mdist/api/i18n'
import type { Tab } from '@kui-shell/core'
import { Choices, CodeBlock, Graph, Memoizer, Wizard as Wiz } from 'madwizard'

import { Grid, GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid'
import { Chip } from '@patternfly/react-core/dist/esm/components/Chip'
import { Tile } from '@patternfly/react-core/dist/esm/components/Tile'
import { Progress } from '@patternfly/react-core/dist/esm/components/Progress'
import { ChipGroup } from '@patternfly/react-core/dist/esm/components/ChipGroup'
import { WizardStep } from '@patternfly/react-core/dist/esm/components/Wizard'

import Wizard, { Props as WizardProps } from '../Wizard/KWizard'

import Card from '../../../../spi/Card'
import Icons from '../../../../spi/Icons'

// import { CodeBlockResponseFn } from '../../components'
import Markdown from '../../../Markdown'
import { Status, statusToClassName, statusToIcon } from '../../../ProgressStepper'

import '../../../../../../web/scss/components/Wizard/Guide.scss'

const strings = i18n('plugin-client-common', 'code')

export type Props = Choices.Choices &
  Partial<CodeBlock.Title> &
  Partial<CodeBlock.Description> & {
    /** Enclosing Kui Tab */
    tab: Tab

    /** markdown document id */
    uuid: string

    /** Raw list of code blocks */
    blocks: CodeBlock.CodeBlockProps[]

    /** Status of code blocks */
    // codeBlockResponses: CodeBlockResponseFn
  }

type State = Choices.Choices & {
  /** Internal error in rendering? */
  error?: Error

  /** Graph of code blocks to be executed */
  graph: Graph.OrderedGraph

  /** Choice Frontier */
  frontier: ReturnType<typeof Graph.findChoiceFrontier>

  /** Instance of Wizard model */
  wizard: Wiz.Wizard

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
    this.state = {
      startAtStep: 0,
      isRunning: false,
      graph: undefined,
      frontier: undefined,
      wizard: undefined,
      wizardStepStatus: undefined,
      choices: props.choices
    }
  }

  public componentDidMount() {
    this.init(this.props)
  }

  /**
   * TODO move to a more common location?
   */
  private static isValidFrontier(frontier: ReturnType<typeof Graph.findChoiceFrontier>): boolean {
    return frontier.length > 0 && frontier.every(_ => _.prereqs.length > 0 || !!_.choice)
  }

  private readonly memos = new Memoizer()

  private async init(props: Props, useTheseChoices?: State['choices']) {
    const choices = useTheseChoices || props.choices || Choices.newChoiceState('default')
    if (!useTheseChoices && !props.choices) {
      choices.onChoice(this.onChoiceFromAbove)
    }

    const newGraph = await Graph.compile(
      props.blocks,
      choices,
      this.memos,
      undefined,
      'sequence',
      props.title,
      props.description
    )

    this.setState(state => {
      const noChangeToGraph = state && Graph.sameGraph(state.graph, newGraph)

      const graph = noChangeToGraph ? state.graph : Graph.order(newGraph)
      const frontier = noChangeToGraph && state && state.frontier ? state.frontier : Graph.findChoiceFrontier(graph)

      const startAtStep = state ? state.startAtStep : 1
      const wizard = Wiz.wizardify(graph, this.memos, { previous: state.wizard })
      const wizardStepStatus = noChangeToGraph && state ? state.wizardStepStatus : []

      const isRunning = state ? state.isRunning : false

      return { graph, frontier, choices, wizard, wizardStepStatus, startAtStep, isRunning }
    })
  }

  public componentWillUnmount() {
    if (this.state.choices) {
      this.state.choices.offChoice(this.onChoiceFromAbove)
    }
  }

  /** @return a wrapper UI for the content of a wizard step */
  private stepContent(actualContent: React.ReactNode) {
    return <Card className="kui--markdown-tab-card">{actualContent}</Card>
  }

  public static getDerivedStateFromError(error: Error) {
    console.error(error)
    return { error }
  }

  /** @return a UI component to visualize the given markdown source */
  private renderContent(source: Wiz.TaskStep['step']['content']) {
    return (
      source &&
      this.stepContent(
        <Markdown
          tab={this.props.tab}
          nested
          source={typeof source === 'string' ? source : source()}
          choices={this.state.choices}
          executeImmediately={this.state.isRunning}
        />
      )
    )
  }

  /** @return text to place below the wizard step title */
  private wizardStepDescription(description: React.ReactNode) {
    return description && <div className="kui--wizard-nav-item-description">{description}</div>
  }

  /** A choice was made somewhere in the UI */
  private readonly onChoiceFromAbove = ({ choices }: Choices.Choices) => this.init(this.props, choices.clone())

  /**
   * A choice was made in *this* UI. The `this.props.choices.set()`
   * will eventually find its way back to a call to
   * `this.onChoiceFromAbove()`
   */
  private readonly onChoice = (evt: React.MouseEvent) => {
    const group = evt.currentTarget.getAttribute('data-choice-group')
    const title = evt.currentTarget.getAttribute('data-choice-title')
    this.props.choices.setKey(group, title)
  }

  /** @return UI that offers the user a choice */
  private tilesForChoice(choice: Graph.Choice) {
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
                isSelected={this.state.choices && this.state.choices.getKey(choice.group) === _.title}
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

  /** Add React `component` to the given choice step */
  private choiceUI({ status, step, graph }: Wiz.ChoiceStep, isFirstChoice: boolean) {
    return {
      status,
      graph,
      step: Object.assign({}, step, {
        name: graph.title,
        component: this.tilesForChoice(graph),
        stepNavItemProps: isFirstChoice && {
          children: this.wizardStepDescription(
            <span className="sub-text">{this.choiceIcon1} This step requires you to choose how to proceed</span>
          )
        }
      })
    }
  }

  /** Add React `component` to the given task execution step */
  private taskUI({ status, step, graph }: Wiz.TaskStep) {
    return {
      status,
      graph,
      step: {
        name: step.name === 'Missing title' ? <span className="red-text">{step.name}</span> : step.name,
        component: this.renderContent(step.content),
        stepNavItemProps: {
          children: this.wizardStepDescription(Graph.extractDescription(graph))
        }
      }
    }
  }

  /** @return the `WizardStep` models for this Guide */
  private wizardSteps() {
    let isFirstChoice = true
    return this.state.wizard
      .map(_ => {
        if (Wiz.isChoiceStep(_)) {
          const ui = this.choiceUI(_, isFirstChoice)
          isFirstChoice = false
          return ui
        } else if (Wiz.isTaskStep(_)) {
          return this.taskUI(_)
        } else {
          return undefined
        }
      })
      .filter(Boolean)
  }

  private validateStepsIfNeeded(steps: ReturnType<typeof this.wizardSteps>): WizardStep[] {
    Promise.all(
      steps.map(async (_, idx) => {
        if (!this.state.wizardStepStatus[idx] || this.state.wizardStepStatus[idx] === 'blank') {
          const status = await Graph.validate(_.graph, this.memos, {
            validator: (cmdline: string) => this.props.tab.REPL.qexec(cmdline)
          })
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
        this.state.choices.removeKey(key)
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
    const descriptionContent = Graph.extractDescription(this.state.graph)
    return descriptionContent && <Markdown nested source={descriptionContent} />
  }

  private wizardDescriptionFooter(steps: WizardStep[]) {
    return <div className="kui--markdown-major-paragraph">{this.progress(steps)}</div>
  }

  private wizardTitle() {
    return Graph.extractTitle(this.state.graph)
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
    try {
      if (!this.state || !this.state.frontier) {
        return <React.Fragment />
      } else if (this.state.error) {
        return 'Internal error'
      } else if (this.state.frontier.length === 0) {
        return this.allDoneWithChoices()
      } else {
        return this.presentChoices()
      }
    } catch (error) {
      console.error(error)
      setTimeout(() => this.setState({ error }))
      return 'Internal Error'
    }
  }
}
