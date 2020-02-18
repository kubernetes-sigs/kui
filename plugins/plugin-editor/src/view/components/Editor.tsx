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
import { IDisposable, editor as Monaco, Range } from 'monaco-editor'

import { File, isFile } from '@kui-shell/plugin-bash-like/fs'
import { Button, REPL, StringContent, ToolbarTextState, MultiModalResponse, i18n } from '@kui-shell/core'

import ClearButton from './ClearButton'
import SaveFileButton from './SaveFileButton'
import RevertFileButton from './RevertFileButton'

import { language } from '../../lib/file-types'
import defaultMonacoOptions, { Options as MonacoOptions } from '../../lib/defaults'

import '../../../web/css/static/theme-alignment.css'
import '../../../web/css/static/editor.css'
import 'monaco-editor/min/vs/editor/editor.main.css'

const strings = i18n('plugin-editor')

interface Props extends MonacoOptions {
  repl: REPL
  content: StringContent
  response: File | MultiModalResponse
  willUpdateToolbar?: (toolbarText: ToolbarTextState, buttons?: Button[]) => void
}

interface State {
  editor: Monaco.ICodeEditor
  wrapper: HTMLDivElement
  subscription?: IDisposable
  toolbarText?: ToolbarTextState
}

export default class Editor extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    // created below in render() via ref={...} -> initMonaco()
    this.state = {
      editor: undefined,
      wrapper: undefined
    }
  }

  /**
   * ToolbarTextState for a clean editor, i.e. no changes have been made
   * since last save.
   *
   */
  private static allClean(props: Props): ToolbarTextState {
    return {
      type: 'info',
      text: strings(!props.readOnly ? 'isUpToDate' : 'isUpToDateReadonly')
    }
  }

  /**
   * ToolbarTextState to indicate error saving.
   *
   */
  private static error(props: Props, msg: string): ToolbarTextState {
    return {
      type: 'error',
      text: strings(msg)
    }
  }

  /** Called whenever we have proposed (props,state); we derive a new State */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.editor && state.wrapper) {
      // then we are ready to render monaco into the wrapper
      return Editor.initMonaco(props, state)
    } else {
      return state
    }
  }

  /** Called when this component is no longer attached to the document */
  public componentWillUnmount() {
    this.destroyMonaco()
  }

  /** Called when we no longer need the monaco-editor instance */
  private destroyMonaco() {
    if (this.state.editor) {
      this.state.editor.dispose()
      const model = this.state.editor.getModel()
      if (model) {
        model.dispose()
      }

      if (this.state.subscription) {
        this.state.subscription.dispose()
      }
    }
  }

  private static onChange(props: Props, editor: Monaco.ICodeEditor) {
    return () => {
      const buttons: Button[] = []

      if (isFile(props.response)) {
        const save = SaveFileButton(editor, props.repl, props.response, (success: boolean) => {
          if (success) {
            props.willUpdateToolbar(this.allClean(props), props.readOnly ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(this.error(props, 'errorSaving'))
          }
        })
        buttons.push(save)

        const revert = RevertFileButton(editor, props.repl, props.response, (success: boolean, data?: string) => {
          if (success) {
            editor.setValue(data)
            props.willUpdateToolbar(this.allClean(props), props.readOnly ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(this.error(props, 'errorReverting'))
          }
        })
        buttons.push(revert)
      }

      buttons.push(ClearButton(editor))

      props.willUpdateToolbar(
        {
          type: 'warning',
          text: strings('isModified')
        },
        buttons
      )
    }
  }

  /** Handle Toolbar registrations */
  private static subscribeToChanges(props: Props, editor: Monaco.ICodeEditor) {
    if (props.willUpdateToolbar) {
      // send an initial update
      props.willUpdateToolbar(this.allClean(props), props.readOnly ? undefined : [ClearButton(editor)])

      // then subscribe to future model change events
      return editor.onDidChangeModelContent(Editor.onChange(props, editor))
    }
  }

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private static initMonaco(props: Props, state: State): Partial<State> {
    try {
      // here we instantiate an editor widget
      const providedOptions = {
        value: props.content.content,
        readOnly: props.readOnly || !isFile(props.response) || false,
        language: props.content.contentType ? language(props.content.contentType) : undefined
      }
      const options = Object.assign(defaultMonacoOptions(providedOptions), providedOptions)
      const editor = Monaco.create(state.wrapper, options)

      editor['clearDecorations'] = () => {
        // debug('clearing decorations', editor['__cloudshell_decorations'])
        const none = [{ range: new Range(1, 1, 1, 1), options: {} }]
        editor['__cloudshell_decorations'] = editor.deltaDecorations(editor['__cloudshell_decorations'] || [], none)
      }

      state.wrapper['getValueForTests'] = () => {
        return editor.getValue()
      }

      if (!props.readOnly) {
        state.wrapper.focus()
      }

      return {
        editor,
        subscription: Editor.subscribeToChanges(props, editor)
      }
    } catch (err) {
      console.error(err)
      return state
    }
  }

  public render() {
    return (
      <div className="code-highlighting">
        <div className="monaco-editor-wrapper" ref={wrapper => this.setState({ wrapper })}></div>
      </div>
    )
  }
}
