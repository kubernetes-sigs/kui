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
import { ToolbarText, Button, ToolbarProps } from '@kui-shell/core'

interface Props {
  willUpdateToolbar?: (toolbarText: ToolbarText, buttons?: Button[]) => void
}

interface State {
  iter: number
  timer: ReturnType<typeof setInterval>
}

class ReactTest extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    const timer = setInterval(this.incr.bind(this), 2000)

    this.state = {
      iter: 0,
      timer
    }
  }

  public componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  private incr() {
    if (this.props.willUpdateToolbar) {
      this.props.willUpdateToolbar({ type: 'info' as const, text: `hello this is iter ${this.state.iter}` })
    }

    this.setState(curState => ({ iter: curState.iter + 1 }))
  }

  public render() {
    return <div className="kui--test-react-mode-content">Hello world</div>
  }
}

export default function () {
  return function ReactContent(props: ToolbarProps) {
    return <ReactTest {...props} />
  }
}
