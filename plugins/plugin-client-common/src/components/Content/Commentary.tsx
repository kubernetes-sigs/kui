/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { CommentaryResponse, i18n } from '@kui-shell/core'

import Card from '../spi/Card'
import Markdown from './Markdown'
import SimpleEditor from './Editor/SimpleEditor'

const strings = i18n('plugin-client-common')

interface State {
  isEdit: boolean
  textValue: string
}

type Props = CommentaryResponse['props'] & {
  willUpdateResponse?: (text: string) => void
  willRemove?: () => void
}

export default class Commentary extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const textValue = this.initialTextValue()
    this.state = {
      isEdit: textValue.length === 0,
      textValue
    }
  }

  /** revert button */
  private revert() {
    this.setState({ textValue: this.initialTextValue() })
  }

  /** done button removes the editor  */
  private done() {
    const label = strings('Done')
    return (
      <a
        role="presentation"
        href="#"
        className={'kui--tab-navigatable kui--commentary-button'}
        onClick={this._setNoEdit}
      >
        <span role="tab" title={label}>
          {label}
        </span>
      </a>
    )
  }

  /** toolbar hosts editor actions */
  private toolbar() {
    return <div className="kui--commentary-editor-toolbar fill-container flush-right">{this.done()}</div>
  }

  /** Enter isEdit mode */
  private setEdit() {
    this.setState({ isEdit: true })
  }

  private readonly _setEdit = this.setEdit.bind(this)

  /** Exit isEdit mode */
  private setNoEdit(evt: React.MouseEvent) {
    // so that the event doesn't propagate to the onClick on the Card itself
    evt.stopPropagation()

    if (this.state.textValue === '') {
      this.props.willRemove()
    } else {
      this.setState({ isEdit: false })
    }
  }

  private readonly _setNoEdit = this.setNoEdit.bind(this)

  private card() {
    return (
      <Card
        {...this.props}
        className="kui--commentary-card"
        data-is-editing={this.state.isEdit || undefined}
        onCardClick={this._setEdit}
        header={this.state.isEdit && strings('Editing Comment as Markdown')}
        footer={this.state.isEdit && this.toolbar()}
      >
        {this.state.textValue}
        {this.state.isEdit && this.editor()}
      </Card>
    )
  }

  private onContentChange(value: string) {
    this.setState({ textValue: value })
    if (this.props.willUpdateResponse) {
      this.props.willUpdateResponse(this.state.textValue)
    }
  }

  private readonly _onContentChange = this.onContentChange.bind(this)

  /** @return the initial content to display, before any editing */
  private initialTextValue() {
    return this.props.children || ''
  }

  private editor() {
    return (
      <SimpleEditor
        tabUUID={this.props.tabUUID}
        content={this.initialTextValue()}
        className="kui--source-ref-editor kui--inverted-color-context"
        readonly={false}
        fontSize={12}
        onContentChange={this._onContentChange}
        contentType="markdown"
      />
    )
  }

  public render() {
    if (this.props.elsewhere) {
      return (
        <span className="kui--repl-result-else">
          <Markdown source={this.props.children} />
        </span>
      )
    } else {
      return <div className="kui--commentary">{this.card()}</div>
    }
  }
}
