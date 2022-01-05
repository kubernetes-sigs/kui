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
import { CommentaryResponse, Tab, i18n } from '@kui-shell/core'

import Card from '../spi/Card'
import Button from '../spi/Button'
import { MutabilityContext } from '../Client/MutabilityContext'

const Markdown = React.lazy(() => import('./Markdown'))
const SimpleEditor = React.lazy(() => import('./Editor/SimpleEditor'))

const strings = i18n('plugin-client-common')

interface State {
  isEdit: boolean
  textValue: string
  lastAppliedTextValue: string
}

type Props = CommentaryResponse['props'] & {
  tab: Tab
  execUUID: string
  willUpdateResponse?: (text: string) => void
  willRemove?: () => void
  willUpdateCommand?: (command: string) => void
  onRender: () => void
}

export default class Commentary extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const textValue = this.initialTextValue()
    this.state = {
      isEdit: textValue.length === 0,
      textValue,
      lastAppliedTextValue: textValue
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
        kind="secondary"
        size="small"
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
        kind="tertiary"
        size="small"
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
        size="small"
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

  private card() {
    return (
      <MutabilityContext.Consumer>
        {value => (
          <span className="kui--commentary-card" onDoubleClick={!value.editable ? undefined : this._setEdit}>
            <Card
              {...this.props}
              data-is-editing={this.state.isEdit || undefined}
              header={this.state.isEdit && strings('Editing Comment as Markdown')}
              footer={this.state.isEdit && this.toolbar()}
            >
              <Markdown
                nested
                execUUID={this.props.execUUID}
                filepath={this.props.filepath}
                source={this.state.textValue}
                codeBlockResponses={this.props.codeBlockResponses}
                baseUrl={this.props.baseUrl}
                tab={this.props.tab}
              />
              {this.state.isEdit && this.editor()}
            </Card>
          </span>
        )}
      </MutabilityContext.Consumer>
    )
  }

  /** Percolate `SimpleEditor` edits up to the Preview view */
  private onContentChange(value: string) {
    this.setState({ textValue: value })
    if (this.props.willUpdateResponse) {
      this.props.willUpdateResponse(this.state.textValue)
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
          onSave={this._onSaveFromEditor}
          onCancel={this._onCancelFromEditor}
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
      <div className="kui--commentary" data-is-editing={this.state.isEdit || undefined}>
        {this.card()}
      </div>
    )
  }
}

type ReactProps = React.PropsWithChildren<{}>

export class ReactCommentary extends React.PureComponent<ReactProps> {
  public render() {
    return (
      <div className="kui--commentary">
        <span className="kui--commentary-card">
          <Card>{this.props.children}</Card>
        </span>
      </div>
    )
  }
}
