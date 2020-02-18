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
import { Tab as KuiTab } from '@kui-shell/core'

import Input from './Input'
import Output from './Output'
import { BlockModel, isFinished, isProcessing, hasUUID } from './BlockModel'

interface Props {
  idx: number
  tab: KuiTab
  model: BlockModel

  onOutputRender: (idx: number) => void
}

interface State {
  // needed temporarily to make pty/client happy
  _block?: HTMLElement
}

export default class Block extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {}
  }

  private output() {
    if (isFinished(this.props.model) || isProcessing(this.props.model)) {
      return (
        <Output
          tab={this.props.tab}
          model={this.props.model}
          onRender={() => this.props.onOutputRender(this.props.idx)}
        />
      )
    }
  }

  public render() {
    return (
      <div
        className={'repl-block ' + this.props.model.state.toString()}
        data-base-class="repl-block"
        data-uuid={hasUUID(this.props.model) && this.props.model.execUUID}
        data-input-count={this.props.idx}
        ref={c => this.setState({ _block: c })}
      >
        {this.state._block && <Input tab={this.props.tab} model={this.props.model} _block={this.state._block} />}
        {this.output()}
      </div>
    )
  }
}
