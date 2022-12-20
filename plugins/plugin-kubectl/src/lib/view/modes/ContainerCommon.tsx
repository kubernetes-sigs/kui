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
import { Arguments, Button, ParsedOptions, Job, Tab, ToolbarProps, ToolbarText, i18n } from '@kui-shell/core'
import Icons from '@kui-shell/plugin-client-common/mdist/components/spi/Icons'
import DropDown from '@kui-shell/plugin-client-common/mdist/components/spi/DropDown'

import { Pod, isPod, Deployment, ReplicaSet } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * We will wait this many milliseconds after the PTY is ready for log
 * data to arrive before proclaiming No log data.
 *
 */
export const HYSTERESIS = 1500

export type StreamingStatus = 'Live' | 'Paused' | 'Stopped' | 'Error' | 'Idle'

export interface ContainerProps {
  /** id for the tab */
  mode: string

  args: {
    argsForMode?: Arguments
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
  tab: Tab
  resource: Pod | Deployment | ReplicaSet
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

  protected toolbarButtonsForError(status: StreamingStatus): Button[] {
    if (status === 'Stopped' || status === 'Error') {
      return [
        {
          mode: 'retry-streaming',
          label: strings('Retry'),
          kind: 'view',
          icon: <Icons icon="Retry" onClick={() => this.showContainer(this.state.container)} />,
          command: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
        } as Button
      ]
    } else {
      return []
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected toolbarButtonsForStreaming(status: StreamingStatus): Button[] {
    return []
  }

  /** Buttons to display in the Toolbar. */
  protected toolbarButtons(status: StreamingStatus): Button[] {
    return this.toolbarButtonsForError(status).concat(this.toolbarButtonsForStreaming(status), this.containerList())
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

  /** @returns list of containers managed by this.props.resource */
  protected get containers() {
    if (this.props.resource) {
      const { containers = [] } = isPod(this.props.resource)
        ? this.props.resource.spec
        : this.props.resource.spec.template.spec
      return containers
    } else {
      return []
    }
  }

  /** Render a selection component that allows user to select a container. */
  private containerOptions() {
    const containers = this.containers
    const actions = containers
      .map(_ => ({
        label: _.name,
        isSelected: this.state.container === _.name,
        hasDivider: false,
        handler: () => this.showContainer(_.name)
      }))
      .concat(
        !this.supportsAllContainers() || containers.length === 1
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

    return <DropDown isPlain actions={actions} />
  }

  /** Are we focusing on all containers? */
  protected isAllContainers() {
    return !this.state.container
  }

  /** List of containers that is compatible with toolbar buttons model */
  protected containerList() {
    return [
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
