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
import stripAnsi from 'strip-ansi'
import { Prompts, Tree } from 'madwizard'

import { Ansi, Tooltip } from '@kui-shell/plugin-client-common'
import {
  ActionGroup,
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Grid,
  Form,
  FormGroup,
  Select,
  SelectGroup,
  SelectProps,
  SelectOption,
  SelectOptionObject,
  TextInput
} from '@patternfly/react-core'

import Mdown from './Mdown'

import HomeIcon from '@patternfly/react-icons/dist/esm/icons/home-icon'
import FilterIcon from '@patternfly/react-icons/dist/esm/icons/filter-icon'
import FilterAltIcon from '@patternfly/react-icons/dist/esm/icons/filter-alt-icon'
import InfoIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon'

import '../../web/scss/components/Ask/_index.scss'

/** One choice to present to the user */
export type Ask<P extends Prompts.Prompt = Prompts.Prompt> = {
  /** Title for this ask */
  title: string

  /** Description for this ask */
  description?: string

  /** Model of what to ask the user */
  prompt: P

  /** Handler for when the user makes a choice */
  onChoose(choice: Awaited<ReturnType<Tree.AnsiUI['ask']>>): void
}

type Props = {
  /** Current prompt model */
  ask: Ask

  /** onClick handler for the home button */
  home(noninteractive?: boolean): void
}

type AssociateWithAsk<A extends Prompts.Prompt, T> = T & {
  /**
   * The question being asked by this form; so we can noticed when
   * the question changes for back-to-back forms.
   */
  ask: Ask<A>
}

type State = {
  /** User has opted for inline filters in the Select */
  hasInlineFilter?: boolean

  /** User has selected from the Select */
  userSelection?: string

  /** Current multiselect state (if any) */
  multiselectOptionsChecked?: AssociateWithAsk<
    Prompts.MultiSelect,
    {
      state: string[]
    }
  >

  /** Current form state (if any) */
  form?: AssociateWithAsk<
    Prompts.Form,
    {
      /**
       * The current set of answers provided by the user, and
       * initialized by the guidebook's `initial` value for each key.
       */
      state: Record<string, string>
    }
  >
}

/**
 * A UI component to present a choice (from madwizard) to the user,
 * and then send the user's selection back.
 *
 */
export default class AskUI extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.userSelection && props.ask.prompt.choices.find(_ => _.name === state.userSelection)) {
      return state
    } else if (state.form && state.form.ask === props.ask) {
      // there has been an update to the form, nothing to do here
      return state
    } else if (state.multiselectOptionsChecked && state.multiselectOptionsChecked.ask === props.ask) {
      // there has been an update to the multiselect, nothing to do here
      return state
    } else {
      const suggested = props.ask.prompt.choices.find(_ => (_ as any)['isSuggested'])

      const form =
        !props.ask || !Prompts.isForm(props.ask.prompt)
          ? undefined
          : {
              ask: props.ask,
              state: props.ask.prompt.choices.reduce((M, _) => {
                M[_.name] = (_ as any)['initial']
                return M
              }, {} as Record<string, string>)
            }

      const multiselectOptionsChecked =
        !props.ask || !Prompts.isMultiSelect(props.ask.prompt)
          ? undefined
          : { ask: props.ask, state: Array.isArray(props.ask.prompt.initial) ? props.ask.prompt.initial : [] }

      return {
        form,
        multiselectOptionsChecked,
        userSelection: !suggested ? undefined : suggested.name
      }
    }
  }

  /** User has clicked home button */
  private readonly _home = async (evt: React.MouseEvent) => {
    if (evt.metaKey || evt.altKey) {
      const { inBrowser } = await import('@kui-shell/core/mdist/api/Capabilities')
      if (inBrowser()) {
        window.open(window.location.href)
      } else {
        const { ipcRenderer } = await import('electron')
        ipcRenderer.sendSync(
          'synchronous-message',
          JSON.stringify({
            operation: 'new-window',
            argv: ['madwizard', 'ui']
          })
        )
      }
    } else {
      this.props.home()
    }
  }

  /** User has clicked on Filter icon */
  private readonly _toggleFilter = () => this.setState(curState => ({ hasInlineFilter: !curState.hasInlineFilter }))

  /** content to show in the upper right */
  private actions() {
    return (
      <React.Fragment>
        <Tooltip content={this.state.hasInlineFilter ? `Disable filter` : `Enable filter`}>
          <Button
            variant="link"
            icon={this.state.hasInlineFilter ? <FilterAltIcon /> : <FilterIcon />}
            onClick={this._toggleFilter}
          />
        </Tooltip>

        <Tooltip markdown={`### Home\n#### Jump back to the beginning\n\n⌘ or Alt-click to open a new window`}>
          <Button variant="link" icon={<HomeIcon />} onClick={this._home} />
        </Tooltip>
      </React.Fragment>
    )
  }

  private card(ask: Ask, body: React.ReactNode) {
    return (
      <Card isLarge isPlain className="sans-serif">
        <CardHeader>
          <CardHeaderMain>
            <CardTitle>{this.title(ask)}</CardTitle>
          </CardHeaderMain>
          <CardActions hasNoOffset>{this.actions()}</CardActions>
        </CardHeader>
        <CardBody className="somewhat-larger-text">
          {ask.description && <Mdown>{ask.description}</Mdown>}
          {body}
        </CardBody>
      </Card>
    )
  }

  private justTheMessage(choice: Ask['prompt']['choices'][number]) {
    return stripAnsi(choice.message || '').replace('  ◄ prior choice', '')
  }

  /** User has clicked on a simple list item */
  private _onSimpleListClick = (evt: React.MouseEvent | React.ChangeEvent) => {
    const parent = evt.currentTarget.parentElement
    if (parent) {
      const itemId = parent.getAttribute('data-name')
      if (itemId && this.props.ask) {
        this.props.ask.onChoose(itemId)
      }
    }
  }

  /** User has clicked to submit a form */
  private readonly _onFormSubmit = (evt: React.SyntheticEvent) => {
    if (this.props.ask) {
      if (this.state.form) {
        evt.preventDefault()
        this.props.ask.onChoose(this.state.form.state)
      } else if (this.state.multiselectOptionsChecked) {
        evt.preventDefault()
        this.props.ask.onChoose(this.state.multiselectOptionsChecked.state)
      }
    }
    return false
  }

  /** User has clicked on a SelectOption */
  private readonly _onSelect = (
    evt: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (!isPlaceholder && selection && this.props.ask) {
      const name = selection.toString()
      this.setState({ userSelection: name })
      this.props.ask.onChoose(name)
    }
  }

  /** User has clicked on a MultiSelectOption checkbox */
  private readonly _onMultiSelect = (
    evt: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    const { ask } = this.props
    if (!isPlaceholder && selection && ask && this.isMultiSelect(ask)) {
      const name = selection.toString()
      this.setState(curState => {
        const selections = this.selections(curState)
        return selections === undefined
          ? { multiselectOptionsChecked: { ask, state: [name] } }
          : {
              multiselectOptionsChecked: Object.assign({}, curState.multiselectOptionsChecked, {
                state: selections.includes(name)
                  ? selections.filter(_ => _ !== name) // toggle off
                  : [...selections, name] // toggle on
              })
            }
      })
    }
  }

  private readonly _selectOptionForChoice = (
    _: Ask<Prompts.Select>['prompt']['choices'][number],
    isFocused = false
  ) => {
    const message = this.justTheMessage(_)
    const isSuggested = this.state?.userSelection === _.name
    const description = (
      <React.Fragment>
        {message !== _.name && (
          <div>
            <Ansi noWrap="normal" className="sans-serif">
              {
                (_.message || '')
                  .replace(/(\n\x1b\[0m)\x1b\[0m {2}/, '$1') // eslint-disable-line no-control-regex
                  .split(/\n/)
                  .slice(-2)[0]
              }
            </Ansi>
          </div>
        )}
        {isSuggested && (
          <div className="top-pad color-base0D">
            <InfoIcon /> You selected this last time
          </div>
        )}
      </React.Fragment>
    )

    // re: className: pf-m-focus; patternfly seems to have a bug with isGrouped Select and isFocused SelectOptions
    return (
      <SelectOption
        key={_.name}
        id={_.name}
        value={_.name}
        description={description}
        isFocused={isFocused}
        className={isFocused ? 'pf-m-focus' : undefined}
      >
        {_.name}
      </SelectOption>
    )
  }

  /** PatternFly's <Select> requires an onToggle, but we want the Select to remain ever-open */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private readonly _doNothing = () => {
    // Intentionally empty
  }

  /** Format title for presentation */
  private title(ask: Ask) {
    return ask.title.replace(/\?$/, '')
  }

  private selections(state = this.state) {
    if (state.multiselectOptionsChecked) {
      return state.multiselectOptionsChecked.state
    }
  }

  /** Render a UI for making a selection */
  private select(
    ask: Ask<Prompts.Select | Prompts.MultiSelect>,
    wrap: (node: React.ReactNode) => React.ReactNode = _ => _
  ) {
    const suggested = ask.prompt.choices.find(_ => _.name === this.state?.userSelection)

    // present a filtered list of options; note that we filter based
    // on the full "message" field, which includes both the title
    // (_.name) and the description (which is buried inside of
    // _.message
    const mkOptions = (filter = '') => {
      const pattern = new RegExp(filter, 'i')

      // options other than the "suggested" (i.e. prior choice)
      const others = ask.prompt.choices
        .filter(_ => _.name !== this.state?.userSelection && (!filter || pattern.test(_.message || '')))
        .map(_ => this._selectOptionForChoice(_))

      // ugh, a bit of syntactic garbage here to make typescript
      // happy. this is just creating a filtered list of two groups:
      // Prior choice and Other choices, but either one may be empty
      // due to the filtering, or the lack of a prior choice
      return [
        ...(suggested && (!filter || pattern.test(suggested.message))
          ? [
              <SelectGroup key="prior" label="Prior choice">
                {this._selectOptionForChoice(suggested, true)}
              </SelectGroup>
            ]
          : []),
        ...(others.length > 0
          ? [
              <SelectGroup
                key="other"
                label={suggested ? 'Other choices' : ask.prompt.choices.length === 1 ? '' : 'Choices'}
              >
                {others}
              </SelectGroup>
            ]
          : [])
      ]
    }

    const isMulti = this.isMultiSelect(ask)
    const onFilter = (evt: React.ChangeEvent | null, filter: string) => mkOptions(filter)

    const titleId = 'kui--madwizard-ask-ui-title'

    const props: SelectProps = {
      onFilter,
      isOpen: true,
      isPlain: true,
      isGrouped: true,
      placeholderText: '',
      children: mkOptions(),
      onToggle: this._doNothing,
      'aria-labelledby': titleId,
      isInputValuePersisted: true,
      isInputFilterPersisted: true,
      selections: this.selections(),
      toggleIndicator: <React.Fragment />,
      noResultsFoundText: 'No matching choices',
      variant: !isMulti ? undefined : 'checkbox',
      hasInlineFilter: this.state.hasInlineFilter,
      inlineFilterPlaceholderText: 'Filter choices',
      onSelect: !isMulti ? this._onSelect : this._onMultiSelect
    }

    // is every message the same as the title?
    const isSimplistic = ask.prompt.choices.every(
      _ => _.name === stripAnsi(_.message || '').replace('  ◄ prior choice', '')
    )

    return (
      <React.Fragment>
        <span id={titleId} hidden />
        {this.card(ask, wrap(<Select {...props} data-is-simplistic={isSimplistic || undefined} />))}
      </React.Fragment>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private checkboxes(ask: Ask<Prompts.MultiSelect>) {
    return this.select(ask, select => (
      <Form onSubmit={this._onFormSubmit} className="top-pad">
        {select}
        {this.formButtons()}
      </Form>
    ))
  }

  /** User has edited the form */
  private readonly _onFormChange = (value: string, evt: React.FormEvent<HTMLInputElement>) => {
    const name = evt.currentTarget.getAttribute('data-name')
    if (name && this.state.form) {
      this.setState(curState => {
        if (curState.form) {
          curState.form.state[name] = value
          return { form: Object.assign({}, curState.form) }
        } else {
          return null
        }
      })
    }
  }

  /** Render button group for form */
  private formButtons() {
    return (
      <ActionGroup>
        <Button variant="primary" type="submit">
          Next
        </Button>
      </ActionGroup>
    )
  }

  /** Render a form ui */
  private form(ask: Ask<Prompts.Form>, form: Required<State>['form']) {
    return this.card(
      ask,
      <Form onSubmit={this._onFormSubmit} className="top-pad">
        <Grid hasGutter md={6}>
          {ask.prompt.choices.map(_ => (
            <FormGroup isRequired key={_.name} label={_.name}>
              <TextInput
                aria-label={`text-input-${_.name}`}
                data-name={_.name}
                isRequired
                value={form.state[_.name]}
                onChange={this._onFormChange}
              />
            </FormGroup>
          ))}
        </Grid>

        {this.formButtons()}
      </Form>
    )
  }

  private isSelect(ask: Ask): ask is Ask<Prompts.Select> {
    return Prompts.isSelect(ask.prompt)
  }

  private isMultiSelect(ask: Ask): ask is Ask<Prompts.MultiSelect> {
    return Prompts.isMultiSelect(ask.prompt)
  }

  private ask(ask: Ask) {
    if (this.isSelect(ask)) {
      return this.select(ask)
    } else if (this.isMultiSelect(ask)) {
      return this.checkboxes(ask)
    } else if (this.state.form) {
      return this.form(ask, this.state.form)
    }
  }

  public render() {
    return (
      <div className="kui--madwizard-ask-ui flex-fill flex-layout flex-align-stretch scrollable scrollable-auto">
        {this.ask(this.props.ask)}
      </div>
    )
  }
}
