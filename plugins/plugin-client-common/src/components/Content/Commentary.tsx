/*
 * Copyright 2020 The Kubernetes Authors
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
import { EventEmitter } from 'events'
import { i18n } from '@kui-shell/core/mdist/api/i18n'
import type { CommentaryResponse, Tab } from '@kui-shell/core'
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent'

import Card from '../spi/Card'
import { MutabilityContext } from '../Client/MutabilityContext'
import { CurrentMarkdownTab, CurrentMarkdownTabProps } from './Markdown/components/tabbed'

const Markdown = React.lazy(() => import('./Markdown'))
const SimpleMarkdown = React.lazy(() => import('./Markdown/Simple'))
const Button = React.lazy(() => import('../spi/Button'))
const SimpleEditor = React.lazy(() => import('./Editor/SimpleEditor'))

const strings = i18n('plugin-client-common')

type Props = CommentaryResponse['props'] & {
  tab: Tab
  execUUID: string
  willUpdateResponse?: (text: string) => void
  willRemove?: () => void
  willUpdateCommand?: (command: string) => void
  onRender: () => void
}

type PropsInternal = Props & CurrentMarkdownTabProps

interface State {
  initialActiveKey?: PropsInternal['activeKey']
  isEdit: boolean
  textValue: string
  lastAppliedTextValue: string
}

/** Allows decoupled edit/preview */
const events = new EventEmitter()

/** Requests for current textValue */
function getChannel(props: Pick<PropsInternal, 'receive' | 'send'>) {
  return `/get/${props.receive || props.send}`
}

/** Broadcast current textValue */
function editChannel(props: Pick<PropsInternal, 'receive' | 'send'>) {
  return `/edit/${props.receive || props.send}`
}

export function onCommentaryEdit(channel: string, cb: (textValue: string, filepath?: string) => void) {
  const props = { receive: channel }
  events.on(editChannel(props), cb)
  events.emit(getChannel(props), cb)
}

export function offCommentaryEdit(channel: string, cb: (textValue: string, filepath?: string) => void) {
  events.off(editChannel({ receive: channel }), cb)
}

class Commentary extends React.PureComponent<PropsInternal, State> {
  private readonly cleaners: (() => void)[] = []

  public constructor(props: PropsInternal) {
    super(props)

    const textValue = this.initialTextValue()
    this.state = {
      initialActiveKey: props.activeKey,
      isEdit: props.edit === false ? false : props.edit || textValue.length === 0,
      textValue,
      lastAppliedTextValue: textValue
    }
  }

  public static getDerivedStateFromProps(props: PropsInternal, state: State) {
    if (props.previousActiveKey !== undefined && props.activeKey === state.initialActiveKey) {
      events.emit(editChannel(props), state.textValue, props.filepath)
    }

    return state
  }

  public componentDidMount() {
    this.initCouplingEvents()
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())

    if (this.props.send) {
      // broadcast clear
      events.emit(editChannel(this.props), '')
    }
  }

  public componentDidUpdate(_, prevState: State) {
    if (this.props.send) {
      // broadcast new textValue if either:
      // a. different textValue
      // b. there has been a tab switch above us (i.e. in a contanining component)
      if (
        prevState.textValue !== this.state.textValue ||
        (this.props.previousActiveKey !== undefined && this.props.activeKey === this.state.initialActiveKey)
      ) {
        events.emit(editChannel(this.props), this.state.textValue, this.props.filepath)
      }
    }
  }

  private readonly onGet = (cb: (textValue: string) => void) => cb(this.state.textValue)
  private readonly onEdit = (textValue: string) => {
    this.setState({ textValue })
  }

  /** Are we a coupled view, i.e. split edit/preview? */
  private get isCoupled() {
    return this.props.send || this.props.receive
  }

  /**
   * Register either as a producer or consumer of edit events. Allows
   * for decoupled edit/preview views.
   *
   */
  private initCouplingEvents() {
    if (this.props.receive) {
      // this is the preview side of the coupling
      events.on(editChannel(this.props), this.onEdit)
      this.cleaners.push(() => events.off(editChannel(this.props), this.onEdit))

      // emit an initial request for the content
      setTimeout(() => events.emit(getChannel(this.props), this.onEdit))
    } else if (this.props.send) {
      // this is the edit side of the coupling
      events.on(getChannel(this.props), this.onGet)
      this.cleaners.push(() => events.off(getChannel(this.props), this.onGet))

      // emit an initial value for the content
      setTimeout(() => events.emit(editChannel(this.props), this.state.textValue, this.props.filepath))
    }
  }

  /** update state to cancel any edits and close the editor */
  private onCancel(evt?: React.MouseEvent) {
    this.onRevert(evt, false)
    this.removeOurselvesIfEmpty()
  }

  private readonly _onCancel = this.onCancel.bind(this)

  /** cancel button */
  private cancel() {
    return (
      <Button
        variant="secondary"
        isSmall
        className="kui--tab-navigatable kui--commentary-button kui--commentary-cancel-button"
        onClick={this._onCancel}
      >
        {strings('Cancel')}
      </Button>
    )
  }

  /** Update state to cancel any updates, but leave editor open */
  private onRevert(evt?: React.MouseEvent, isEdit = true) {
    if (evt) {
      // so that the event doesn't propagate to the onClick on the Card itself
      evt.stopPropagation()
    }

    this.setState(curState => {
      // switch back to the lastAppliedTextValue
      const textValue = curState.lastAppliedTextValue

      if (this.props.willUpdateResponse) {
        this.props.willUpdateResponse(textValue)
      }

      return { isEdit, textValue }
    })
  }

  private readonly _onRevert = this.onRevert.bind(this)

  /** revert button */
  private revert() {
    return (
      <Button
        variant="tertiary"
        isSmall
        className="kui--tab-navigatable kui--commentary-button kui--commentary-revert-button"
        onClick={this._onRevert}
      >
        {strings('Revert')}
      </Button>
    )
  }

  /** If the user clicks Done or Cancel and there is no text, remove ourselves */
  private removeOurselvesIfEmpty(): boolean {
    if (this.state.textValue === '') {
      if (this.props.willRemove) {
        this.props.willRemove()
      }

      return true
    } else {
      return false
    }
  }

  /** Update state to reflect lastAppliedTextValue, and close the editor */
  private onDone(evt?: React.MouseEvent) {
    if (evt) {
      // so that the event doesn't propagate to the onClick on the Card itself
      evt.stopPropagation()
    }

    if (!this.removeOurselvesIfEmpty()) {
      this.setState(curState => {
        this.props.willUpdateCommand(`# ${curState.textValue.replace(/\n/g, '\\n').replace(/\t/g, '\\t')}`)
        return { isEdit: false, lastAppliedTextValue: curState.textValue }
      })
    }
  }

  private readonly _onDone = this.onDone.bind(this)

  /** done button removes the editor  */
  private done() {
    return (
      <Button
        isSmall
        className="kui--tab-navigatable kui--commentary-button kui--commentary-done-button"
        onClick={this._onDone}
      >
        {strings('Done')}
      </Button>
    )
  }

  /** toolbar hosts editor actions */
  private toolbar() {
    return (
      <div className="kui--commentary-editor-toolbar fill-container flush-right">
        {this.done()}&nbsp;{this.cancel()}&nbsp;{this.revert()}
      </div>
    )
  }

  /** Enter isEdit mode */
  private setEdit() {
    this.setState({ isEdit: true })
  }

  private readonly _setEdit = this.setEdit.bind(this)

  private preview() {
    if (this.props.preview !== false) {
      if (this.props.simple) {
        return (
          <SimpleMarkdown
            nested
            execUUID={this.props.execUUID}
            filepath={this.props.filepath}
            baseUrl={this.props.baseUrl}
            source={this.state.textValue}
            tab={this.props.tab}
          />
        )
      } else {
        return (
          <Markdown
            nested
            execUUID={this.props.execUUID}
            filepath={this.props.filepath}
            source={this.state.textValue}
            codeBlockResponses={this.props.codeBlockResponses}
            baseUrl={this.props.baseUrl}
            snippetBasePath={this.props.snippetBasePath}
            tab={this.props.tab}
          />
        )
      }
    }
  }

  private card() {
    return (
      <MutabilityContext.Consumer>
        {value => (
          <span className="kui--commentary-card" onDoubleClick={!value.editable ? undefined : this._setEdit}>
            <Card
              {...this.props}
              data-is-editing={this.state.isEdit || undefined}
              header={this.state.isEdit && this.props.header !== false && strings('Editing Comment as Markdown')}
              footer={this.state.isEdit && !this.isCoupled && this.toolbar()}
            >
              {this.preview()}
              {this.state.isEdit && this.editor()}
            </Card>
          </span>
        )}
      </MutabilityContext.Consumer>
    )
  }

  /** Percolate `SimpleEditor` edits up to the Preview view */
  private onContentChange(value: string) {
    this.setState(curState => {
      if (!curState.isEdit) {
        // then we've already exited edit mode, ignore this content
        // change event
        return null
      } else {
        return { textValue: value }
      }
    })
    if (this.props.willUpdateResponse) {
      this.props.willUpdateResponse(value)
    }
  }

  private readonly _onContentChange = this.onContentChange.bind(this)

  /** User has requested to save changes via keyboard shortcut, from within `SimpleEditor` */
  private onSaveFromEditor(value: string) {
    this.onContentChange(value)
    this.onDone()
  }

  private readonly _onSaveFromEditor = this.onSaveFromEditor.bind(this)

  /** User has requested to cancel changes via keyboard shortcut, from within `SimpleEditor` */
  private onCancelFromEditor() {
    this.onCancel()
  }

  private readonly _onCancelFromEditor = this.onCancelFromEditor.bind(this)

  /** @return the initial content to display, before any editing */
  private initialTextValue() {
    return this.props.children || ''
  }

  private editor() {
    return (
      <React.Suspense fallback={<div />}>
        <SimpleEditor
          tabUUID={this.props.tab.uuid}
          content={this.state.textValue}
          className="kui--source-ref-editor kui--commentary-editor"
          readonly={false}
          simple
          wordWrap="on"
          onSave={this._onSaveFromEditor}
          onCancel={!this.isCoupled && this._onCancelFromEditor}
          onContentChange={this._onContentChange}
          contentType="markdown"
          scrollIntoView={false}
        />
      </React.Suspense>
    )
  }

  public render() {
    this.props.onRender()
    return (
      <div
        className="kui--commentary"
        data-is-editing={this.state.isEdit || undefined}
        data-no-header={this.props.header === false || undefined}
      >
        {this.card()}
      </div>
    )
  }
}

export default class CommentaryExternal extends React.PureComponent<Props> {
  public render() {
    return (
      <CurrentMarkdownTab.Consumer>{config => <Commentary {...this.props} {...config} />}</CurrentMarkdownTab.Consumer>
    )
  }
}

type ReactProps = React.PropsWithChildren<unknown>

export class ReactCommentary extends React.PureComponent<ReactProps> {
  public render() {
    return (
      <div className="kui--commentary">
        <span className="kui--commentary-card">
          <Card>
            <TextContent>{this.props.children}</TextContent>
          </Card>
        </span>
      </div>
    )
  }
}
