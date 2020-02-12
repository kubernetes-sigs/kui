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

import Block from './Block'
import { BlockModel, BlockState } from './Block/BlockModel'

interface Props {
  active: boolean
}

interface State {
  blocks: BlockModel[]
}

export default class ScrollableTerminal extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      blocks: [{ state: BlockState.Uninitialized }]
    }
  }

  public render() {
    return (
      <repl className="repl" id="main-repl">
        <div className="repl-inner zoomable">
          {this.state.blocks.map((_, idx) => (
            <Block key={idx} idx={idx} state={_.state} />
          ))}
        </div>
      </repl>
    )
  }
}
