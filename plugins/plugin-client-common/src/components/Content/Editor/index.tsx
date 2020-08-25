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
import { extname } from 'path'
import { IDisposable, editor as Monaco, Range } from 'monaco-editor'

import { File, isFile } from '@kui-shell/plugin-bash-like/fs'
import {
  Button,
  REPL,
  SaveError,
  StringContent,
  ToolbarText,
  ToolbarProps,
  MultiModalResponse,
  TabLayoutChangeEvent,
  eventChannelUnsafe,
  eventBus,
  i18n
} from '@kui-shell/core'

import ClearButton from './ClearButton'
import SaveFileButton from './SaveFileButton'
import RevertFileButton from './RevertFileButton'

import getKuiFontSize from './lib/fonts'
import { language } from './lib/file-types'
import defaultMonacoOptions, { Options as MonacoOptions } from './lib/defaults'

import '../../../../web/scss/components/Editor/Editor.scss'

const strings = i18n('plugin-client-common', 'editor')

type Props = MonacoOptions &
  ToolbarProps & {
    tabUUID: string
    repl: REPL
    content: StringContent
    response: File | MultiModalResponse
  }

interface State {
  editor: Monaco.ICodeEditor
  wrapper: HTMLDivElement
  subscription?: IDisposable
  toolbarText?: ToolbarText
  catastrophicError: Error
  cleaners: (() => void)[]
}

export default class Editor extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    // created below in render() via ref={...} -> initMonaco()
    this.state = {
      cleaners: [],
      editor: undefined,
      wrapper: undefined,
      catastrophicError: undefined
    }
  }

  public static getDerivedStateFromError(error: Error) {
    return { catastrophicError: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error in Editor', error, errorInfo)
  }

  /**
   * ToolbarText for a clean editor, i.e. no changes have been made
   * since last save.
   *
   */
  private static allClean(props: Props): ToolbarText {
    return {
      type: 'info',
      text: strings(!props.readOnly ? 'isUpToDate' : 'isUpToDateReadonly')
    }
  }

  /**
   * ToolbarText to indicate error saving.
   *
   */
  private static error(props: Props, msg: string, ...args: string[]): ToolbarText {
    return {
      type: 'error',
      text: strings(msg, ...args)
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
    this.state.cleaners.forEach(cleaner => cleaner())
  }

  private static isClearable(props: Props) {
    return (
      (isFile(props.response) && !props.readOnly) ||
      (!isFile(props.response) && props.content.spec && props.content.spec.clearable !== false)
    )
  }

  private static onChange(props: Props, editor: Monaco.ICodeEditor) {
    let currentDecorations: string[]

    return () => {
      if (currentDecorations) {
        editor.deltaDecorations(currentDecorations, [])
        currentDecorations = undefined
      }

      const clearable = Editor.isClearable(props)

      const buttons: Button[] = []

      // save
      if (isFile(props.response)) {
        const save = SaveFileButton(editor, props.repl, props.response, (success: boolean) => {
          if (success) {
            props.willUpdateToolbar(this.allClean(props), !clearable ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(this.error(props, 'errorSaving'))
          }
        })
        buttons.push(save)
      } else if (props.content.spec && props.content.spec.save) {
        const { onSave } = props.content.spec.save
        buttons.push({
          mode: 'Save',
          label: props.content.spec.save.label || strings('saveLocalFile'),
          kind: 'view' as const,
          command: async () => {
            try {
              const save = await onSave(editor.getValue())
              if (!(save && save.noToolbarUpdate)) {
                props.willUpdateToolbar(
                  (save && save.toolbarText) || this.allClean(props),
                  !clearable ? undefined : [ClearButton(editor)]
                )
              }
            } catch (error) {
              const err = error as SaveError

              if (err.revealLine) {
                editor.revealLineInCenter(err.revealLine)
                currentDecorations = editor.deltaDecorations(currentDecorations || [], [
                  {
                    range: new Range(err.revealLine, 1, err.revealLine, 1),
                    options: {
                      isWholeLine: true,
                      className: 'kui--editor-line-highlight',
                      glyphMarginClassName: 'kui--editor-line-glyph'
                    }
                  }
                ])
              }

              const alert = {
                type: 'warning' as const,
                text: strings('isModified'),
                alerts: [
                  {
                    type: 'error' as const,
                    title: strings('errorApplying'),
                    body: err.message
                  }
                ]
              }

              props.willUpdateToolbar(alert, buttons, undefined)
            }
          }
        })
      }

      // revert
      if (isFile(props.response)) {
        const revert = RevertFileButton(editor, props.repl, props.response, (success: boolean, data?: string) => {
          if (success) {
            editor.setValue(data)
            props.willUpdateToolbar(this.allClean(props), !clearable ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(this.error(props, 'errorReverting'))
          }
        })
        buttons.push(revert)
      } else if (props.content.spec && props.content.spec.revert) {
        const { onRevert } = props.content.spec.revert
        buttons.push({
          mode: 'Revert',
          label: props.content.spec.revert.label || strings('revert'),
          kind: 'view' as const,
          command: async () => {
            try {
              const data = await onRevert()
              editor.setValue(data)
              props.willUpdateToolbar(this.allClean(props), !clearable ? undefined : [ClearButton(editor)])
            } catch (err) {
              console.error(err)
              props.willUpdateToolbar(this.error(props, 'errorReverting'))
            }
          }
        })
      }

      // clear
      if (clearable) {
        buttons.push(ClearButton(editor))
      }

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
      // send an initial update; note how the initial toolbarText may
      // be governed by the response
      const msg = props.response.toolbarText || this.allClean(props)
      const buttons = props.response.toolbarText ? [] : !Editor.isClearable(props) ? undefined : [ClearButton(editor)]
      props.willUpdateToolbar(msg, buttons)

      // then subscribe to future model change events
      return editor.onDidChangeModelContent(Editor.onChange(props, editor))
    }
  }

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private static initMonaco(props: Props, state: State): Partial<State> {
    const cleaners = []

    try {
      // here we instantiate an editor widget
      const providedOptions = {
        value: props.content.content,
        readOnly:
          !isFile(props.response) &&
          (!props.content.spec || props.content.spec.readOnly !== false) &&
          (props.readOnly || !isFile(props.response) || false),
        language:
          props.content.contentType === 'text/plain'
            ? language(
                props.content.contentType,
                isFile(props.response) ? extname(props.response.spec.filepath).slice(1) : undefined
              )
            : props.content.contentType || undefined
      }
      const options = Object.assign(defaultMonacoOptions(providedOptions), providedOptions)
      const editor = Monaco.create(state.wrapper, options)

      const onZoom = () => {
        editor.updateOptions({ fontSize: getKuiFontSize() })
      }
      eventChannelUnsafe.on('/zoom', onZoom)
      cleaners.push(() => eventChannelUnsafe.off('/zoom', onZoom))

      const onTabLayoutChange = (evt: TabLayoutChangeEvent) => {
        if (!evt.isSidecarNowHidden) {
          editor.layout()
        }
      }
      eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
      cleaners.push(() => eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))

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

      const subscription = Editor.subscribeToChanges(props, editor)
      cleaners.push(() => subscription.dispose())

      cleaners.push(() => {
        editor.dispose()
        const model = editor.getModel()
        if (model) {
          model.dispose()
        }
      })

      return {
        editor,
        cleaners
      }
    } catch (err) {
      console.error('Error initing Monaco: ', err)
      state.catastrophicError = err
      return state
    }
  }

  public render() {
    if (this.state.catastrophicError) {
      return <div className="oops"> {this.state.catastrophicError.toString()}</div>
    } else {
      return (
        <div className="code-highlighting">
          <div className="monaco-editor-wrapper" ref={wrapper => this.setState({ wrapper })}></div>
        </div>
      )
    }
  }
}
