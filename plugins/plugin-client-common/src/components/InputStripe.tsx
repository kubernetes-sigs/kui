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
import { Tab as KuiTab, eventBus } from '@kui-shell/core'

import Block from './Terminal/Block'
import { InputOptions } from './Terminal/Block/Input'
import BlockModel, { Active } from './Terminal/Block/BlockModel'

import '../../web/css/static/InputStripe.scss'

type Props = InputOptions & {
  tab?: KuiTab

  /** tab uuid; this is grafted in for you, by TabContent */
  uuid?: string
}

interface State {
  idx: number
  model: BlockModel
}

export default class InputStripe extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const channel = `/command/complete/fromuser/${this.props.uuid}`
    eventBus.on(channel, this.onOutputRender.bind(this))

    this.state = {
      idx: 0,
      model: Active()
    }
  }

  /** Command has completed in our tab */
  private onOutputRender() {
    this.setState(curState => ({ idx: curState.idx + 1, model: Active() }))
  }

  public render() {
    return (
      <div className="kui--input-stripe repl">
        <Block
          idx={this.state.idx}
          tab={this.props.tab}
          model={this.state.model}
          noOutput
          noPromptContext
          promptPlaceholder={this.props.promptPlaceholder}
        />
      </div>
    )
  }
}
