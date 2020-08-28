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

import { Icons, ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'
import {
  eventChannelUnsafe,
  getTab,
  Tab,
  wireToTabEvents,
  wireToStandardEvents,
  unwireToTabEvents,
  unwireToStandardEvents,
  inBrowser,
  i18n
} from '@kui-shell/core'
import {
  KubeContext,
  getCurrentDefaultNamespace,
  onKubectlConfigChangeEvents,
  offKubectlConfigChangeEvents
} from '@kui-shell/plugin-kubectl'

interface State {
  text: string
  viewLevel: ViewLevel
}

const strings = i18n('plugin-kubectl')

export default class CurrentNamespace extends React.PureComponent<{}, State> {
  private readonly handler = this.reportCurrentNamespace.bind(this)

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

  private async reportCurrentNamespace(idx?: Tab | number) {
    const tab = getTab(idx)
    if (!tab || !tab.REPL) {
      if (tab && !tab.REPL) {
        eventChannelUnsafe.once(`/tab/new/${tab.uuid}`, () => this.reportCurrentNamespace())
      }
      return
    }

    try {
      const ns = await getCurrentDefaultNamespace(tab)

      if (ns) {
        this.setState({
          text: ns,
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
    this.handler()
    if (inBrowser()) {
      wireToTabEvents(this.handler)
      onKubectlConfigChangeEvents(this.handler)
    } else {
      wireToStandardEvents(this.handler)
      onKubectlConfigChangeEvents(this.handler)
    }
  }

  /** Bye! */
  public componentWillUnmount() {
    if (inBrowser()) {
      unwireToTabEvents(this.handler)
      offKubectlConfigChangeEvents(this.handler)
    } else {
      unwireToStandardEvents(this.handler)
      offKubectlConfigChangeEvents(this.handler)
    }
  }

  public render() {
    // FIXME disable the on-hover effect with the icon
    return (
      <TextWithIconWidget
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="kui--plugin-kubeui--current-namespace"
        textOnclick="kubectl get namespaces"
        title={strings('Kubernetes namespace')}
      >
        <div className="current-namesapce-button" onClick={() => false}>
          <Icons icon="At" />
        </div>
      </TextWithIconWidget>
    )
  }
}
