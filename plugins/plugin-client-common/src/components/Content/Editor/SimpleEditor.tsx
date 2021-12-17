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
import { editor as Monaco, KeyMod, KeyCode } from 'monaco-editor'

import { Events } from '@kui-shell/core'

import getKuiFontSize from './lib/fonts'
import defaultMonacoOptions, { Options as MonacoOptions } from './lib/defaults'

import '../../../../web/scss/components/Editor/Editor.scss'

export type Props = Pick<MonacoOptions, 'fontSize'> &
  Monaco.IEditorConstructionOptions & {
    tabUUID?: string
    content: string
    contentType: string
    simple?: boolean
    className?: string
    readonly?: boolean
    onContentChange?: (content: string) => void
    scrollIntoView?: boolean

    /** Focus on initial render (this is the default for !readonly) */
    focus?: boolean

    /** Font size adjustment factor, based off getKuiFontSize(), i.e. the default font size for the theme and client */
    fontSizeAdjust?: number

    /** Minimum height of the editor */
    minHeight?: number

    /** Use a light theme? Default: false */
    light?: boolean

    /** Callback when user hits cmd/ctrl+S or shift-return */
    onSave?: (content: string) => void

    /** Callback when user hits Escape */
    onCancel?: (content: string) => void
  }

interface State {
  editor: ReturnType<typeof Monaco.create>
  wrapper: React.RefObject<HTMLDivElement>
  catastrophicError: Error
  cleaners: (() => void)[]
}

export default class SimpleEditor extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)

    // created below in render() via ref={...} -> initMonaco()
    this.state = {
      cleaners: [],
      wrapper: React.createRef<HTMLDivElement>(),
      editor: undefined,
      catastrophicError: undefined
    }
  }

  public static getDerivedStateFromError(error: Error) {
    return { catastrophicError: error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('catastrophic error in Editor', error, errorInfo)
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !nextState.editor || !!nextState.catastrophicError
  }

  /** Called whenever we have proposed (props,state); we derive a new State */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (state.editor) {
      const model = state.editor.getModel()
      const currentLanguage = model.getLanguageId()
      const newLanguage = SimpleEditor.language(props.contentType)
      if (model.getValue() !== props.content || currentLanguage !== newLanguage) {
        state.editor.setValue(props.content)
        Monaco.setModelLanguage(model, newLanguage)
      }
    }

    return state
  }

  /** Called when this component is no longer attached to the document */
  public componentWillUnmount() {
    this.destroyMonaco()
  }

  /** Called when we no longer need the monaco-editor instance */
  private destroyMonaco() {
    this.state.cleaners.forEach(cleaner => cleaner())
  }

  /** When content of the editor changes, call `onContentChange`  */
  private static onChange(props: Props, editor: Monaco.ICodeEditor) {
    return () => {
      props.onContentChange(editor.getValue())
    }
  }

  /** Register onSave and onCancel keyboard shortcuts */
  private registerKeyboardShortcuts(editor: State['editor']) {
    const { onSave, onCancel } = this.props

    // if the enclosing view has passed in an onSave controller, we
    // will register CtrlCmd+S and Shift+Enter as keyboard shortcuts
    // for this controller
    if (onSave) {
      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
        onSave(editor.getValue())
      })
      editor.addCommand(KeyMod.Shift | KeyCode.Enter, () => {
        onSave(editor.getValue())
      })
    }

    // ibid, but for Escape -> onCancel
    if (onCancel) {
      editor.addCommand(KeyCode.Escape, () => {
        onCancel(editor.getValue())
      })
    }
  }

  private static language(contentType: string): string {
    return /^(ba)?sh$/.test(contentType) ? 'shell' : contentType
  }

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private initMonaco(props: Props, state: State) {
    const cleaners = []

    try {
      // here we instantiate an editor widget
      const providedOptions = {
        value: props.content,
        readOnly: props.readonly !== undefined ? props.readonly : true,
        fontSize: props.fontSize || getKuiFontSize() * (props.fontSizeAdjust || 1),
        language: SimpleEditor.language(props.contentType),
        wordWrap: props.wordWrap,
        simple: props.simple
      }
      const overrides: Monaco.IStandaloneEditorConstructionOptions = { theme: props.light ? 'vs' : 'vs-dark' }
      const options: Monaco.IStandaloneEditorConstructionOptions = Object.assign(
        defaultMonacoOptions(providedOptions),
        providedOptions,
        overrides
      )

      const editor = Monaco.create(state.wrapper.current, options)

      this.registerKeyboardShortcuts(editor)

      const adjustHeight = !props.simple
        ? undefined
        : () => {
            // if we know 1) the height of the content won't change, and
            // 2) we are running in "simple" mode (this is mostly the case
            // for inline editor components, as opposed to editor
            // components that are intended to fill the full view), then:
            // size the height to fit the content
            const minHeight = this.props.minHeight !== undefined ? this.props.minHeight : 250
            const contentHeight = Math.max(minHeight, editor.getContentHeight())
            state.wrapper.current.style.height =
              (minHeight === 0 ? contentHeight : Math.min(0.3 * window.innerHeight, contentHeight)) + 'px'
          }
      adjustHeight && adjustHeight()

      state.wrapper.current['getValueForTests'] = () => {
        return editor.getValue()
      }

      let ignoreEvent = false
      editor.onDidContentSizeChange(() => {
        if (ignoreEvent) return
        try {
          ignoreEvent = true
          adjustHeight && adjustHeight()
          editor.layout()
        } finally {
          ignoreEvent = false
        }
      })

      if (props.onContentChange) {
        editor.onDidChangeModelContent(SimpleEditor.onChange(props, editor))
      }

      if (!options.readOnly && this.props.focus !== false) {
        setTimeout(() => editor.focus())
      }

      const onZoom = () => {
        editor.updateOptions({ fontSize: getKuiFontSize() })
      }
      Events.eventChannelUnsafe.on('/zoom', onZoom)
      cleaners.push(() => Events.eventChannelUnsafe.off('/zoom', onZoom))

      if (props.tabUUID) {
        const onTabLayoutChange = () => {
          editor.layout()
        }
        Events.eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
        cleaners.push(() => Events.eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))
      }

      cleaners.push(() => {
        editor.dispose()
        const model = editor.getModel()
        if (model) {
          model.dispose()
        }
      })

      this.setState({
        editor,
        cleaners
      })
    } catch (err) {
      console.error('Error initing Monaco: ', err)
      this.setState({
        catastrophicError: err
      })
    }
  }

  public componentDidMount() {
    if (!this.state.editor && this.state.wrapper.current) {
      // then we are ready to render monaco into the wrapper
      this.initMonaco(this.props, this.state)
    } else if (this.props.scrollIntoView && this.state.wrapper.current) {
      this.state.wrapper.current.scrollIntoView()
    }
  }

  public render() {
    if (this.state.catastrophicError) {
      return <div className="oops"> {this.state.catastrophicError.toString()}</div>
    } else {
      const className = 'monaco-editor-wrapper' + (this.props.className ? ' ' + this.props.className : '')
      return <div className={className} ref={this.state.wrapper} />
    }
  }
}
