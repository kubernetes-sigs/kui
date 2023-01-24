/*
 * Copyright 2022 The Kubernetes Authors
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
import prettyMillis from 'pretty-ms'
import { Scalar } from '@kui-shell/plugin-client-common'
import { Flex, FlexItem } from '@patternfly/react-core'

import '../../web/scss/components/Playground/PlaygroundTerminal.scss'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'

export type Command = {
  cmdline: string
  status: 'success' | 'error' | 'in-progress'
  response?: import('@kui-shell/core').KResponse
  startTime: number
  endTime: number
}

export type CommandProps = {
  nExecStarts: number
  nExecCompletions: number

  /** Executed (or executing) commands */
  commands: Command[]
}

type Props = CommandProps & {
  /** Kui REPL controller */
  tab: import('@kui-shell/core').Tab
}

/** Visualize the command executions from <Playground/> */
export default class PlaygroundTerminal extends React.PureComponent<Props> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private readonly _noop = () => {}

  private readonly _flex1 = { default: 'flex_1' as const }

  public render() {
    return (
      <div
        className="kui--madwizard-playground-terminal kui--inverted-color-context flex-layout flex-fill flex-align-stretch flex-column"
        style={{ backgroundColor: 'var(--color-sidecar-background-02)' }}
      >
        {this.props.commands
          .filter(_ => _.response && typeof _.response !== 'boolean')
          .map(_ => (
            <Flex key={_.cmdline}>
              <FlexItem>
                {_.status === 'success' ? (
                  <CheckCircleIcon className="green-text" />
                ) : _.status === 'error' ? (
                  <ExclamationTriangleIcon className="red-text" />
                ) : undefined}
              </FlexItem>
              <FlexItem flex={this._flex1}>
                <Scalar
                  response={_.response || ''}
                  willChangeSize={this._noop}
                  execUUID={_.cmdline}
                  tab={this.props.tab}
                />
              </FlexItem>
              <FlexItem className="slightly-deemphasize even-smaller-text">
                {_.endTime ? prettyMillis(_.endTime - _.startTime, { compact: true }) : '…'}
              </FlexItem>
            </Flex>
          ))}
      </div>
    )
  }
}
