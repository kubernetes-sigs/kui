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
import { extname } from 'path'
import { IDisposable, editor as Monaco, Range } from 'monaco-editor'

import { File, isFile } from '@kui-shell/plugin-bash-like/fs'
import {
  Button,
  Events,
  REPL,
  EditableSpec,
  SaveError,
  StringContent,
  ToolbarText,
  ToolbarProps,
  MultiModalResponse,
  encodeComponent,
  i18n
} from '@kui-shell/core'

import Icons from '../../spi/Icons'
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
    content: StringContent & Partial<EditableSpec>
    response: File | MultiModalResponse

    /** Use a light theme? Default: false */
    light?: boolean

    /** Size height to fit? */
    sizeToFit?: boolean
  }

interface State {
  content: Props['content']
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
      content: props.content,
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
  private static allClean(readOnly: boolean): ToolbarText {
    return {
      type: 'info',
      text: strings(!readOnly ? 'isUpToDate' : 'isUpToDateReadonly')
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
    } else if (
      !state.content ||
      props.content.content !== state.content.content ||
      props.content.contentType !== state.content.contentType
    ) {
      return {
        content: props.content,
        subscription: Editor.reinitMonaco(props, state, Editor.isReadOnly(props, state))
      }
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

  private static isClearable(props: Props, content: State['content']) {
    return (
      (isFile(props.response) && !props.readOnly) ||
      (!isFile(props.response) && content.spec && content.spec.clearable !== false)
    )
  }

  private static onChange(props: Props, content: State['content'], readOnly: boolean, editor: Monaco.ICodeEditor) {
    let currentDecorations: string[]

    return (evt: Monaco.IModelContentChangedEvent) => {
      // See initMonaco(): note how we first set `value: ''`, then we
      // asynchronously update the text, which results in an onChange
      // callback. Thus, we can safely ignore the first change, which
      // corresponds to a versionId of 2, since we first set `value:
      // ''`. https://github.com/kubernetes-sigs/kui/issues/7426
      if (evt.versionId === 2) {
        return
      }

      if (currentDecorations) {
        editor.deltaDecorations(currentDecorations, [])
        currentDecorations = undefined
      }

      const clearable = Editor.isClearable(props, content)

      const buttons: Button[] = []

      // save
      if (isFile(props.response)) {
        const save = SaveFileButton(editor, props.repl, props.response, (success: boolean) => {
          if (success) {
            props.willUpdateToolbar(Editor.allClean(readOnly), !clearable ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(Editor.error(props, 'errorSaving'))
          }
        })
        buttons.push(save)
      } else if (content.spec && content.spec.save) {
        const { onSave } = content.spec.save
        buttons.push({
          mode: 'Save',
          label: content.spec.save.label || strings('saveLocalFile'),
          kind: 'drilldown' as const,
          icon: <Icons icon="Save" />,
          inPlace: true,
          command: async () => {
            try {
              const save = await onSave(editor.getValue())
              if (!(save && save.noToolbarUpdate)) {
                props.willUpdateToolbar(
                  (save && save.toolbarText) || Editor.allClean(readOnly),
                  !clearable ? undefined : [ClearButton(editor)]
                )
              }

              /** return the command to be executed */
              if (save && save.command) {
                return save.command
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
            props.willUpdateToolbar(Editor.allClean(readOnly), !clearable ? undefined : [ClearButton(editor)])
          } else {
            props.willUpdateToolbar(Editor.error(props, 'errorReverting'))
          }
        })
        buttons.push(revert)
      } else if (content.spec && content.spec.revert) {
        const { onRevert } = content.spec.revert
        buttons.push({
          mode: 'Revert',
          label: content.spec.revert.label || strings('revert'),
          kind: 'view' as const,
          icon: <Icons icon="Revert" />,
          command: async () => {
            try {
              const data = await onRevert()
              editor.setValue(data)
              props.willUpdateToolbar(Editor.allClean(readOnly), !clearable ? undefined : [ClearButton(editor)])
            } catch (err) {
              console.error(err)
              props.willUpdateToolbar(Editor.error(props, 'errorReverting'))
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
  private static subscribeToChanges(
    props: Props,
    content: State['content'],
    editor: Monaco.ICodeEditor,
    readOnly: boolean
  ) {
    if (props.willUpdateToolbar) {
      // send an initial update; note how the initial toolbarText may
      // be governed by the response
      const msg = (readOnly && props.response.toolbarText) || (!readOnly && Editor.allClean(readOnly)) // <-- always use allClean if !readOnly
      const buttons = props.response.toolbarText
        ? []
        : !Editor.isClearable(props, content)
        ? undefined
        : [ClearButton(editor)]
      props.willUpdateToolbar(msg, buttons)

      // then subscribe to future model change events
      return editor.onDidChangeModelContent(Editor.onChange(props, content, readOnly, editor))
    }
  }

  private static async extractValue(
    content: Props['content'],
    response: Props['response'],
    repl: REPL
  ): Promise<string> {
    try {
      return (typeof content.content !== 'string' || content.content.length === 0) && isFile(response)
        ? await repl.qexec<string>(`vfs fslice ${encodeComponent(response.spec.fullpath)} ${0} ${8192}`)
        : content.content
    } catch (err) {
      console.error(err)
      return err.message
    }
  }

  private static reinitMonaco(props: Props, state: State, readOnly: boolean): IDisposable {
    setTimeout(async () => {
      state.editor.setValue(await Editor.extractValue(props.content, props.response, props.repl))

      const msg = (readOnly && props.response.toolbarText) || (!readOnly && Editor.allClean(readOnly)) // <-- always use allClean if !readOnly
      props.willUpdateToolbar(msg, !Editor.isClearable(props, props.content) ? undefined : [ClearButton(state.editor)])

      if (state.subscription) {
        state.subscription.dispose()
      }
    })

    return Editor.subscribeToChanges(props, props.content, state.editor, Editor.isReadOnly(props, state))
  }

  private static isReadOnly(props: Props, state: State): boolean {
    return (
      !isFile(props.response) &&
      (!state.content.spec || state.content.spec.readOnly !== false) &&
      (props.readOnly || !isFile(props.response) || false)
    )
  }

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private static initMonaco(props: Props, state: State): Partial<State> {
    const cleaners = []

    try {
      // here we instantiate an editor widget
      const providedOptions = {
        value: '',
        readOnly: Editor.isReadOnly(props, state),
        language:
          state.content.contentType === 'text/plain'
            ? language(
                state.content.contentType,
                isFile(props.response) ? extname(props.response.spec.filepath).slice(1) : undefined
              )
            : state.content.contentType || undefined
      }
      const overrides: Monaco.IStandaloneEditorConstructionOptions = { theme: props.light ? 'vs' : 'vs-dark' }
      const options: Monaco.IStandaloneEditorConstructionOptions = Object.assign(
        defaultMonacoOptions(providedOptions),
        providedOptions,
        overrides
      )
      const editor = Monaco.create(state.wrapper, options)
      setTimeout(async () => {
        editor.setValue(await Editor.extractValue(state.content, props.response, props.repl))

        // initial default folding level; see https://github.com/kubernetes-sigs/kui/issues/8008
        editor.getAction('editor.foldLevel2').run()
      })

      const onZoom = () => {
        editor.updateOptions({ fontSize: getKuiFontSize() })
      }
      Events.eventChannelUnsafe.on('/zoom', onZoom)
      cleaners.push(() => Events.eventChannelUnsafe.off('/zoom', onZoom))

      const sizeToFit = !props.sizeToFit
        ? () => true
        : (width?: number, height = Math.min(0.4 * window.innerHeight, Math.max(250, editor.getContentHeight()))) => {
            // if we know 1) the height of the content won't change, and
            // 2) we are running in "simple" mode (this is mostly the case
            // for inline editor components, as opposed to editor
            // components that are intended to fill the full view), then:
            // size the height to fit the content
            state.wrapper.style.flexBasis = height + 'px'
          }

      sizeToFit()

      const observer = new ResizeObserver(entries => {
        sizeToFit(entries[0].contentRect.width, entries[0].contentRect.height)
        editor.layout()
      })
      observer.observe(state.wrapper)
      cleaners.push(() => observer.disconnect())

      const onTabLayoutChange = () => {
        sizeToFit()
        editor.layout()
      }
      Events.eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
      cleaners.push(() => Events.eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))

      editor['clearDecorations'] = () => {
        // debug('clearing decorations', editor['__cloudshell_decorations'])
        const none = [{ range: new Range(1, 1, 1, 1), options: {} }]
        editor['__cloudshell_decorations'] = editor.deltaDecorations(editor['__cloudshell_decorations'] || [], none)
      }

      state.wrapper['getValueForTests'] = () => {
        return editor.getValue()
      }

      if (!options.readOnly) {
        setTimeout(() => editor.focus())
      }

      const subscription = Editor.subscribeToChanges(props, props.content, editor, options.readOnly)
      if (subscription) {
        cleaners.push(() => subscription.dispose())
      }

      cleaners.push(() => {
        editor.dispose()
        const model = editor.getModel()
        if (model) {
          model.dispose()
        }
      })

      return {
        editor,
        cleaners,
        subscription
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
