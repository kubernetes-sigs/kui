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
import { REPL, getTabId, eventBus, KResponse, Tab as KuiTab } from '@kui-shell/core'

import TitleBar from './TitleBar'

import '../../../web/css/static/sidecar.css'
import '../../../web/css/static/sidecar-main.css'

export interface Props<R extends KResponse> {
  repl: REPL
  tab: KuiTab
  response: R
}

export abstract class BaseSidecar<R extends KResponse, State> extends React.PureComponent<Props<R>, State> {
  protected containerStyle() {
    return { display: 'flex', flex: 1, 'overflow-y': 'hidden', 'flex-direction': 'column' }
  }

  protected onMaximize() {
    eventBus.emit(`/sidecar/maximize/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onRestore() {
    eventBus.emit(`/sidecar/restore/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onMinimize() {
    eventBus.emit(`/sidecar/minimize/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected onClose() {
    eventBus.emit(`/sidecar/close/${getTabId(this.props.tab)}`, this.props.tab)
  }

  protected viewId() {
    return 'kui-default-sidecar'
  }

  protected isFixedWidth() {
    return false
  }

  protected title(kind?: string, namespace?: string, fixedWidth = true, onClickNamespace?: () => void) {
    return (
      <TitleBar
        fixedWidth={fixedWidth}
        kind={kind}
        namespace={namespace}
        onClickNamespace={onClickNamespace}
        onScreenshot={() => this.props.repl.pexec('screenshot sidecar')}
        onMaximize={this.onMaximize.bind(this)}
        onRestore={this.onRestore.bind(this)}
        onMinimize={this.onMinimize.bind(this)}
        onClose={this.onClose.bind(this)}
      />
    )
  }
}
