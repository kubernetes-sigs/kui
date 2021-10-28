/*
 * Copyright 2021 The Kubernetes Authors
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
import commonPathPrefix from 'common-path-prefix'
import { TableComposable, Tbody, Tr, Td } from '@patternfly/react-table'

import {
  // Events,
  i18n,
  encodeComponent
} from '@kui-shell/core'
import { eventBus, Mount, getCurrentMounts } from '@kui-shell/plugin-s3'
import {
  Ansi,
  Icons,
  ViewLevel,
  Markdown,
  TextWithIconWidget,
  TextWithIconWidgetOptions,
  Tooltip
} from '@kui-shell/plugin-client-common'

import '../web/scss/S3Mounts.scss'

const strings = i18n('plugin-s3')

/** Status of mount */
type Status = 'error' | 'not-mounted' | 'mounted'

type Props = TextWithIconWidgetOptions

interface State {
  text: string
  status: string
  nMounted: number
  mounts: Mount[]
  mountsByProvider: Record<string, Mount[]>
  viewLevel: ViewLevel
}

export default class S3Mounts extends React.PureComponent<Props, State> {
  private readonly handler = this.reportMounts.bind(this)

  public constructor(props: Props) {
    super(props)

    this.state = {
      text: '',
      status: '',
      nMounted: 0,
      mounts: [],
      mountsByProvider: {},
      viewLevel: 'hidden'
    }
  }

  /**
   * Check the current branch, and the dirtiness thereof.
   *
   */
  private async reportMounts() {
    const mounts = getCurrentMounts()

    const mountsByProvider = mounts.reduce((M, mount) => {
      if (!M[mount.provider]) {
        M[mount.provider] = []
      }
      M[mount.provider].push(mount)
      return M
    }, {} as State['mountsByProvider'])

    const nMounted = this.nMounted(mountsByProvider)

    this.setState({
      mounts,
      nMounted,
      mountsByProvider,
      text: strings('S3'),
      viewLevel: nMounted === 0 ? 'warn' : 'normal'
    })
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    eventBus.on('/s3/configuration/update', this.handler)
    // Events.wireToStandardEvents(this.handler)
  }

  /** Make sure to unsubscribe! */
  public componentWillUnmount() {
    eventBus.off('/s3/configuration/update', this.handler)
    // Events.unwireToStandardEvents(this.handler)
  }

  /** @return the header for the Popover component */
  private popoverHeader() {
    return (
      <React.Fragment>
        <div>{strings('S3 Mounts')}</div>
        <div className="sub-text even-smaller-text">
          {this.state.nMounted === 0
            ? strings('No S3 connections found')
            : strings('You are currently connected to these S3 services')}
        </div>
      </React.Fragment>
    )
    /* <div className="sub-text even-smaller-text">{this.changeBranch()}</div> */
  }

  /** @return the body for the Popover component */
  private popoverBody() {
    return <React.Fragment>{this.mounts()}</React.Fragment>
  }

  /** @return the number of successful S3 mounts */
  private nMounted(mounts = this.state.mountsByProvider) {
    return Object.keys(mounts).reduce((N, provider) => {
      return N + (mounts[provider].find(mount => mount.isMounted) ? 1 : 0)
    }, 0)
  }

  /** @return an icon that represents the mount status of the given mount */
  private iconCell(status: Status, provider: string, mounts: Mount[], publicOnly: boolean) {
    const icon = status === 'mounted' ? 'Checkmark' : 'Warning'
    const className = status === 'mounted' ? (publicOnly ? 'yellow-text' : 'green-text') : 'sub-text'

    const content =
      status === 'error'
        ? strings('Error connecting to', provider, mounts.map(_ => _.error.message).join(', '))
        : status === 'not-mounted'
        ? strings('Unable to connect to', provider)
        : publicOnly
        ? strings('Connected to public buckets on', provider, mounts.map(_ => _.mountPath).join(', '))
        : strings('Successfully connected to', provider, mounts.map(_ => _.mountPath).join(', '))

    return (
      <Td modifier="fitContent" className="kiwi--checkmark-column">
        <Tooltip markdown={content} position="left">
          <Icons icon={icon} className={className} />
        </Tooltip>
      </Td>
    )
  }

  /** @return information about the mount */
  private infoCell(status: Status, provider: string, mounts: Mount[], publicOnly: boolean) {
    const prefix =
      mounts.length === 1 ? mounts[0].mountPath : commonPathPrefix(mounts.map(_ => _.mountPath)).replace(/\/$/, '')

    const className = status !== 'mounted' ? 'sub-text' : ''
    const content =
      status === 'not-mounted'
        ? strings('A is not mounted', provider)
        : publicOnly
        ? strings('A is mounted public on B', provider, prefix, encodeURIComponent(`ls ${encodeComponent(prefix)}`))
        : strings('A is mounted on B', provider, prefix, encodeURIComponent(`ls ${encodeComponent(prefix)}`))

    return (
      <Td className={className}>
        {status === 'error' ? (
          <React.Fragment>
            <div className="small-bottom-pad">{strings('A is not mounted due to an error', provider)}</div>
            <Ansi className="pre-wrap">{mounts[0].error.message.trim()}</Ansi>
          </React.Fragment>
        ) : (
          <Markdown nested source={content} />
        )}
      </Td>
    )
  }

  /** @return a table row for the given set of mounts */
  private rowForMounts(status: Status, provider: string, mounts: Mount[], publicOnly = false) {
    return (
      mounts.length > 0 && (
        <Tr key={`${status}-${provider}`}>
          {this.iconCell(status, provider, mounts, publicOnly)}
          {this.infoCell(status, provider, mounts, publicOnly)}
        </Tr>
      )
    )
  }

  /** @return UI for list of mounts */
  private mounts() {
    return (
      <TableComposable
        className="kiwi--s3-mounts-table small-top-pad even-smaller-text pre-wrap kui--table-like-wrapper"
        variant="compact"
        borders={false}
      >
        <Tbody>
          {Object.keys(this.state.mountsByProvider).map(provider => {
            const {
              erroredMounts,
              otherwiseNotMounted,
              successfullyMounted,
              publicMounts
            } = this.state.mountsByProvider[provider].reduce(
              (M, _) => {
                if (_.error && !/ECONNREFUSED/.test(_.error.message)) {
                  M.erroredMounts.push(_)
                } else if (!_.isMounted) {
                  M.otherwiseNotMounted.push(_)
                } else if (_.publicOnly) {
                  M.publicMounts.push(_)
                } else {
                  M.successfullyMounted.push(_)
                }
                return M
              },
              {
                erroredMounts: [] as Mount[],
                otherwiseNotMounted: [] as Mount[],
                successfullyMounted: [] as Mount[],
                publicMounts: [] as Mount[]
              }
            )

            return (
              <React.Fragment key={provider}>
                {this.rowForMounts('error', provider, erroredMounts)}
                {this.rowForMounts('not-mounted', provider, otherwiseNotMounted)}
                {this.rowForMounts('mounted', provider, publicMounts, true)}
                {this.rowForMounts('mounted', provider, successfullyMounted)}
              </React.Fragment>
            )
          })}
        </Tbody>
      </TableComposable>
    )
  }

  /** @return desired Popover model */
  private popover() {
    return {
      bodyContent: this.popoverBody(),
      headerContent: this.popoverHeader()
    }
  }

  public render() {
    return (
      <TextWithIconWidget
        className={this.props.className}
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="kiwi--plugin-s3--s3-mounts"
        title={strings('Your current S3 connections')}
        {...this.props}
        popover={this.popover()}
      >
        <Icons
          icon={this.state.nMounted === 0 ? 'Warning' : 'Checkmark'}
          className={this.state.nMounted > 0 ? 'green-text' : ''}
        />
      </TextWithIconWidget>
    )
  }
}
