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
import { At16 } from '@carbon/icons-react'

import { ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'

import { KubeContext, getCurrentContext } from '@kui-shell/plugin-kubectl'
import { getCurrentTab, eventChannelUnsafe, wireToStandardEvents } from '@kui-shell/core'

interface State {
  text: string
  viewLevel: ViewLevel
}

export default class CurrentNamespace extends React.PureComponent<{}, State> {
  public constructor(props = {}) {
    super(props)

    this.state = {
      text: '',
      viewLevel: 'hidden'
    }
  }

  /** @return a short string that we can fit into a context UI widget */
  private renderNamespace(context: KubeContext): string {
    return context.metadata.namespace
  }

  private async reportCurrentNamespace() {
    const tab = getCurrentTab()
    if (!tab || !tab.REPL) {
      return
    }

    try {
      const currentContext = await getCurrentContext(tab)
      eventChannelUnsafe.emit('/kubeui/context/current', currentContext)

      if (currentContext && currentContext.metadata && currentContext.metadata.namespace) {
        this.setState({
          text: currentContext === undefined ? '' : this.renderNamespace(currentContext),
          viewLevel: 'normal' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
        })
      }
    } catch (err) {
      console.error(err)

      this.setState({
        text: '',
        viewLevel: 'hidden' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
      })
    }
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    this.reportCurrentNamespace()
    wireToStandardEvents(this.reportCurrentNamespace.bind(this))
  }

  public render() {
    // FIXME disable the on-hover effect with the icon
    return (
      <TextWithIconWidget
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="kui--plugin-kubeui--current-namespace"
        textOnclick="kubectl get namespaces"
      >
        <div className="current-namesapce-button" onClick={() => false}>
          <At16 />
        </div>
      </TextWithIconWidget>
    )
  }
}
