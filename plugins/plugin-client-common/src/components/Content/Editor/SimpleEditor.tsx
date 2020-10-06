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

import React from 'react'
import { editor as Monaco } from 'monaco-editor'

import { eventChannelUnsafe, eventBus } from '@kui-shell/core'

import getKuiFontSize from './lib/fonts'
import defaultMonacoOptions, { Options as MonacoOptions } from './lib/defaults'

import '../../../../web/scss/components/Editor/Editor.scss'

type Props = Pick<MonacoOptions, 'fontSize'> & {
  tabUUID: string
  content: string
  contentType: string
  simple?: boolean
  className?: string
  readonly?: boolean
  onContentChange?: (content: string) => void

  /** Use a light theme? Default: false */
  light?: boolean
}

interface State {
  editor: Monaco.ICodeEditor
  wrapper: HTMLDivElement
  catastrophicError: Error
  cleaners: (() => void)[]
}

export default class SimpleEditor extends React.PureComponent<Props, State> {
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

  /** Called whenever we have proposed (props,state); we derive a new State */
  public static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.editor && state.wrapper) {
      // then we are ready to render monaco into the wrapper
      return SimpleEditor.initMonaco(props, state)
    } else {
      if (state.editor) {
        if (state.editor.getValue() !== props.content) {
          state.editor.setValue(props.content)
        }
      }
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

  /** When content of the editor changes, call `onContentChange`  */
  private static onChange(props: Props, editor: Monaco.ICodeEditor) {
    return () => {
      props.onContentChange(editor.getValue())
    }
  }

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private static initMonaco(props: Props, state: State): Partial<State> {
    const cleaners = []

    try {
      // here we instantiate an editor widget
      const providedOptions = {
        value: props.content,
        readOnly: props.readonly !== undefined ? props.readonly : true,
        fontSize: props.fontSize || getKuiFontSize(),
        language: props.contentType,
        simple: props.simple
      }
      const overrides: Monaco.IStandaloneEditorConstructionOptions = { theme: props.light ? 'vs' : 'vs-dark' }
      const options: Monaco.IStandaloneEditorConstructionOptions = Object.assign(
        defaultMonacoOptions(providedOptions),
        providedOptions,
        overrides
      )
      const editor = Monaco.create(state.wrapper, options)

      if (options.readOnly && props.simple) {
        // if we know 1) the height of the content won't change, and
        // 2) we are running in "simple" mode (this is mostly the case
        // for inline editor components, as opposed to editor
        // components that are intended to fill the full view), then:
        // size the height to fit the content
        state.wrapper.style.height = Math.min(400, editor.getContentHeight()) + 'px'
      }

      state.wrapper['getValueForTests'] = () => {
        return editor.getValue()
      }

      editor.onDidChangeModelContent(SimpleEditor.onChange(props, editor))

      if (!options.readOnly) {
        setTimeout(() => editor.focus())
      }

      const onZoom = () => {
        editor.updateOptions({ fontSize: getKuiFontSize() })
      }
      eventChannelUnsafe.on('/zoom', onZoom)
      cleaners.push(() => eventChannelUnsafe.off('/zoom', onZoom))

      const onTabLayoutChange = () => {
        editor.layout()
      }
      eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
      cleaners.push(() => eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))

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
      const className = 'monaco-editor-wrapper' + (this.props.className ? ' ' + this.props.className : '')
      return <div className={className} ref={wrapper => this.setState({ wrapper })}></div>
    }
  }
}
