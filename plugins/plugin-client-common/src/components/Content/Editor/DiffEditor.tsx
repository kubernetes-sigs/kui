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
import { editor as Monaco } from 'monaco-editor'

import { eventBus, eventChannelUnsafe, TabLayoutChangeEvent } from '@kui-shell/core/mdist/api/Events'
import type { MultiModalResponse } from '@kui-shell/core'
import { isFile } from '@kui-shell/plugin-bash-like/fs'

import getKuiFontSize from './lib/fonts'
import { language } from './lib/file-types'
import defaultMonacoOptions, { Options as MonacoOptions } from './lib/defaults'

import '../../../../web/scss/components/Editor/Editor.scss'

type Props = MonacoOptions & {
  response: MultiModalResponse
  tabUUID: string
  originalContent: string
  modifiedContent: string
  contentType: string

  /** Use a light theme? Default: false */
  light?: boolean

  /** Size height to fit? */
  sizeToFit?: boolean

  // Render the diff side by side or inline
  renderSideBySide?: boolean
}

interface State {
  editor: Monaco.IDiffEditor
  wrapper: HTMLDivElement
  catastrophicError: Error
  cleaners: (() => void)[]
}

export default class DiffEditor extends React.PureComponent<Props, State> {
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
      return DiffEditor.initMonaco(props, state)
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

  /** Called when we have a ready wrapper (monaco's init requires an wrapper */
  private static initMonaco(props: Props, state: State): Partial<State> {
    const cleaners = []

    try {
      // here we instantiate an editor widget
      const providedOptions = {
        readOnly: true,
        renderSideBySide: props.renderSideBySide
      }
      const overrides: Monaco.IStandaloneDiffEditorConstructionOptions = { theme: props.light ? 'vs' : 'vs-dark' }
      const options: Monaco.IStandaloneDiffEditorConstructionOptions = Object.assign(
        defaultMonacoOptions(providedOptions),
        providedOptions,
        overrides
      )

      const contentType =
        props.contentType === 'text/plain'
          ? language(
              props.contentType,
              isFile(props.response) ? extname(props.response.spec.filepath).slice(1) : undefined
            )
          : props.contentType || undefined

      const editor = Monaco.createDiffEditor(state.wrapper, options)
      editor.setModel({
        original: Monaco.createModel(props.originalContent, contentType),
        modified: Monaco.createModel(props.modifiedContent, contentType)
      })

      editor.onDidUpdateDiff(() => {
        const lineChanges = editor.getLineChanges()
        if (lineChanges && lineChanges.length !== 0) {
          editor.revealLineInCenterIfOutsideViewport(lineChanges[0].originalStartLineNumber)
        }
      })

      const onZoom = () => {
        editor.updateOptions({ fontSize: getKuiFontSize() })
      }
      eventChannelUnsafe.on('/zoom', onZoom)
      cleaners.push(() => eventChannelUnsafe.off('/zoom', onZoom))

      if (props.sizeToFit) {
        const sizeToFit = (
          _width?: number,
          height = Math.min(0.4 * window.innerHeight, Math.max(250, editor.getModifiedEditor().getContentHeight()))
        ) => {
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

        const onTabLayoutChange = (evt: TabLayoutChangeEvent) => {
          sizeToFit()
          if (evt.isWidthConstrained) {
            editor.updateOptions({ renderSideBySide: false })
          } else {
            editor.updateOptions({ renderSideBySide: props.renderSideBySide })
          }
        }
        eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
        cleaners.push(() => eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))
      } else {
        const onTabLayoutChange = (evt: TabLayoutChangeEvent) => {
          editor.layout()
          if (evt.isWidthConstrained) {
            editor.updateOptions({ renderSideBySide: false })
          } else {
            editor.updateOptions({ renderSideBySide: props.renderSideBySide })
          }
        }
        eventBus.onTabLayoutChange(props.tabUUID, onTabLayoutChange)
        cleaners.push(() => eventBus.offTabLayoutChange(props.tabUUID, onTabLayoutChange))
      }

      state.wrapper['getValueForTests'] = () => {
        return editor.getModifiedEditor().getValue()
      }

      cleaners.push(() => {
        const model = editor.getModel()
        if (model) {
          model.original.dispose()
          model.modified.dispose()
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
