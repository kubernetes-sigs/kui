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
import Modal from '../spi/Modal'
import { Events, i18n, Tab as KuiTab } from '@kui-shell/core'

const strings = i18n('plugin-core-support')

interface Props {
  /** tab uuid */
  uuid: string

  tab: KuiTab
}

interface State {
  isActive: boolean
}

/* export interface ConfirmResponse {
  apiVersion: 'kui-shell/confirm/v1'
  kind: 'Confirm'
  spec: {
    command: string
    asking?: string
  }
} */

interface ActiveState extends State {
  isActive: true
  execUUID: string
  command: string
  asking?: string
}

function isActive(state: State): state is ActiveState {
  return state.isActive
}

export default class Confirm extends React.PureComponent<Props, State | ActiveState> {
  public constructor(props: Props) {
    super(props)

    this.initEvents()

    this.state = {
      isActive: false
    }
  }

  private initEvents() {
    const requestChannel = `/kui-shell/Confirm/v1/tab/${this.props.uuid}`
    Events.eventChannelUnsafe.on(requestChannel, this.onConfirmStart.bind(this))
  }

  private onConfirmStart({ command, asking, execUUID }: { command: string; asking?: string; execUUID: string }) {
    this.setState({ isActive: true, command, asking, execUUID })
  }

  /** User has confirmed the command */
  private onConfirm(confirmed: boolean) {
    if (isActive(this.state)) {
      this.setState({ isActive: false })

      const responseChannel = `/kui-shell/Confirm/v1/tab/${this.props.uuid}/execUUID/${this.state.execUUID}/confirmed`
      Events.eventChannelUnsafe.emit(responseChannel, { confirmed })
    }
  }

  private readonly _onSubmit = this.onConfirm.bind(this, true)
  private readonly _onClose = this.onConfirm.bind(this, false)

  public render() {
    if (!isActive(this.state)) {
      return <React.Fragment />
    } else {
      return (
        <Modal
          id="confirm-dialog"
          isOpen
          titleIconVariant="danger"
          title={strings('pleaseConfirm')}
          primaryButtonText={strings('yesIAmSure')}
          secondaryButtonText={strings('cancel')}
          onSubmit={this._onSubmit}
          onClose={this._onClose}
        >
          <p className="bx--modal-content__text">{strings('aboutToExecute')}</p>
          <p className="bx--modal-content__text">
            <strong className="red-text">{this.state.command}</strong>
          </p>
          <p className="bx--modal-content__text">{this.state.asking || strings('areYouSure')}</p>
        </Modal>
      )
    }
  }
}
