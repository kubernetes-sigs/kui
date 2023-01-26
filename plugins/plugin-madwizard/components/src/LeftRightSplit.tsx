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
import type { Tab } from '@kui-shell/core'
import { CardResponse, SplitInjector } from '@kui-shell/plugin-client-common'

/** TODO we should probably mvoe this into @kui-shell/plugin-client-common */

interface Props {
  /** Kui Tab in which this response is to be situated */
  tab: Tab

  /** The left and right nodes, respectively */
  children: [React.ReactNode, React.ReactNode]

  /** Whether the left-hand content is to be a thin strip, or a normal-width split. [default: 'left-strip'] */
  left?: 'left-strip' | 'default'

  /** Tab UUID to assign to the left split */
  leftUUID: string
}

/**
 * Arrange `props.tab` to have a left-right split, using
 * `props.children[0]` as the left content, and `props.children[1]` as
 * the right content.
 */
export default class LeftRightSplit extends React.PureComponent<Props> {
  private get left() {
    return <CardResponse>{this.props.children[0]}</CardResponse>
  }

  private get right() {
    return <CardResponse>{this.props.children[1]}</CardResponse>
  }

  public render() {
    const left = {
      uuid: this.props.leftUUID,
      count: 1,
      node: this.left,
      position: this.props.left || ('left-strip' as const),
      opts: { inverseColors: true }
    }

    return (
      <SplitInjector.Consumer>
        {injector => {
          setTimeout(() => injector.inject([left]))
          return injector.modify(this.props.tab.uuid, this.right, { maximized: true })
        }}
      </SplitInjector.Consumer>
    )
  }
}
