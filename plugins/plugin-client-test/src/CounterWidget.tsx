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

import { Events } from '@kui-shell/core'
import { Icons, ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'

interface Props {
  idx: number
}

interface State {
  counter: number
  viewLevel: ViewLevel
}

/** just for fun, cycle through colors */
export const colors = ['ok' as const, 'warn' as const, 'error' as const, 'normal' as const]

/** an id we want to attach to our fragment, to help with tests */
export const id = (idx: number) => `test-client-counter-fragment-${idx}`

export default class CounterWidget extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      counter: 0,
      viewLevel: colors[0]
    }
  }

  private update() {
    this.setState(curState => ({
      // alternate between error, warn,  and normal presentation
      viewLevel: colors[(curState.counter + 1) % colors.length],
      counter: curState.counter + 1
    }))
  }

  /**
   * Once we have mounted, schedule an update based on standard REPL
   * events.
   *
   */
  public componentDidMount() {
    Events.wireToStandardEvents(this.update.bind(this))
  }

  public render() {
    return (
      <TextWithIconWidget
        text={`count: ${this.state.counter}`}
        viewLevel={this.state.viewLevel}
        id={id(this.props.idx)}
        iconOnclick="echo hi"
        textOnclick="echo ho"
      >
        <Icons icon="Trash" />
      </TextWithIconWidget>
    )
  }
}
