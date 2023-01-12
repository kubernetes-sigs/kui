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

import React, { PropsWithChildren } from 'react'
import { Events, Tab as KuiTab } from '@kui-shell/core'

import KuiContext from './context'
import Block from '../Views/Terminal/Block'
import KuiConfiguration from './KuiConfiguration'
import { InputOptions } from '../Views/Terminal/Block/Input'
import BlockModel, { Active } from '../Views/Terminal/Block/BlockModel'

import '../../../web/css/static/InputStripe.scss'

type Props = PropsWithChildren<
  Partial<KuiConfiguration> &
    InputOptions & {
      tab?: KuiTab

      /** tab uuid; this is grafted in for you, by TabContent */
      uuid?: string
    }
>

interface State {
  idx: number
  model: BlockModel
}

export default class InputStripe extends React.PureComponent<Props, State> {
  private _blockRef = React.createRef<Block>()

  public constructor(props: Props) {
    super(props)

    this.state = {
      idx: 0,
      model: Active()
    }
  }

  public componentDidMount() {
    Events.eventBus.onCommandComplete(this.props.uuid, this.onOutputRender.bind(this))
  }

  /** Command has completed in our tab */
  private onOutputRender() {
    this.setState(curState => ({ idx: curState.idx + 1, model: Active() }))
  }

  public doFocus() {
    if (this._blockRef.current) {
      this._blockRef.current.doFocus()
    }
  }

  public render() {
    return (
      <KuiContext.Provider value={{ prompt: this.props.prompt || '\u276f' }}>
        <div className="kui--input-stripe repl">
          <Block
            ref={this._blockRef}
            idx={this.state.idx}
            uuid={`${this.props.uuid}-${this.state.idx}`}
            tab={this.props.tab}
            model={this.state.model}
            noOutput
            noPromptContext
            isFocused
            promptPlaceholder={this.props.promptPlaceholder}
          >
            {this.props.children}
          </Block>
        </div>
      </KuiContext.Provider>
    )
  }
}
