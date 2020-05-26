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
import { DropDown } from '@kui-shell/plugin-client-common'
import { Abortable, Arguments, Button, FlowControllable, REPL, ToolbarProps, ToolbarText, i18n } from '@kui-shell/core'

import { Pod } from '../../model/resource'
import { KubeOptions } from '../../../controller/kubectl/options'

const strings = i18n('plugin-kubectl')

/**
 * We will wait this many milliseconds after the PTY is ready for log
 * data to arrive before proclaiming No log data.
 *
 */
export const HYSTERESIS = 1500

export type Job = Abortable & FlowControllable

export type StreamingStatus = 'Live' | 'Paused' | 'Stopped' | 'Error'

export interface ContainerProps {
  args: Arguments<KubeOptions>
  repl: REPL
  pod: Pod
  toolbarController: ToolbarProps
}

export interface ContainerState {
  /** Are we focused on one container? `undefined` means all containers. */
  container: string

  /** The underlying PTY streaming job. */
  job: Job

  /**
   * To help with races, e.g. switch to container A, then B, then A;
   * we need to distinguish the PTYs for the first and last, despite
   * them targeting the same container
   *
   */
  streamUUID: string
}

export abstract class ContainerComponent<State extends ContainerState> extends React.PureComponent<
  ContainerProps,
  State
> {
  protected abstract toolbarText(status: StreamingStatus): ToolbarText

  /** Buttons to display in the Toolbar. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected toolbarButtons(status: StreamingStatus): Button[] {
    return this.containerList()
  }

  protected supportsAllContainers() {
    return false
  }

  /** When we are going away, make sure to abort the streaming job. */
  public componentWillUnmount() {
    if (this.state.job) {
      this.state.job.abort()
    }
  }

  /** Update Toolbar text and Toolbar buttons. */
  protected updateToolbar(status: StreamingStatus) {
    this.props.toolbarController.willUpdateToolbar(
      this.toolbarText(status),
      this.toolbarButtons(status),
      true // replace default buttons
    )
  }

  protected showContainer(container: string) {
    this.setState({ container })
  }

  /** Render a selection component that allows user to select a container. */
  protected containerOptions() {
    const { containers } = this.props.pod.spec
    if (containers.length > 1) {
      const actions = containers
        .map(_ => ({
          label: _.name,
          isSelected: this.state.container === _.name,
          hasDivider: false,
          handler: () => this.showContainer(_.name)
        }))
        .concat(
          !this.supportsAllContainers()
            ? []
            : [
                {
                  label: strings('All Containers'),
                  isSelected: this.isAllContainers(),
                  hasDivider: true,
                  handler: () => this.showContainer(undefined)
                }
              ]
        )

      return <DropDown actions={actions} className="kui--repl-block-right-element" />
    }
  }

  /** Are we focusing on all containers? */
  protected isAllContainers() {
    return !this.state.container
  }

  /** List of containers that is compatible with toolbar buttons model */
  protected containerList() {
    return this.props.pod.spec.containers.length <= 1
      ? []
      : [
          {
            mode: 'container-list',
            label: 'Select a container',
            kind: 'view' as const,
            command: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            icon: this.containerOptions()
          } as Button
        ]
  }
}
