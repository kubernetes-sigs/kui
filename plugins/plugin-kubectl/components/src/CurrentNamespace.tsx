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

import React from 'react'

import { Icons, ViewLevel, DropdownWidget } from '@kui-shell/plugin-client-common'
import {
  i18n,
  eventChannelUnsafe,
  getTab,
  Tab,
  pexecInCurrentTab,
  wireToTabEvents,
  wireToStandardEvents,
  unwireToTabEvents,
  unwireToStandardEvents,
  inBrowser
} from '@kui-shell/core'
import {
  KubeContext,
  getCurrentDefaultNamespace,
  onKubectlConfigChangeEvents,
  offKubectlConfigChangeEvents
} from '@kui-shell/plugin-kubectl'

interface State {
  currentNamespace: string
  allNamespaces: string[]
  viewLevel: ViewLevel
}

const strings = i18n('plugin-kubectl')

export default class CurrentNamespace extends React.PureComponent<{}, State> {
  private readonly handler = this.reportCurrentNamespace.bind(this)

  public constructor(props = {}) {
    super(props)

    this.state = {
      currentNamespace: '',
      allNamespaces: [],
      viewLevel: 'hidden'
    }
  }

  /** @return a short string that we can fit into a context UI widget */
  private renderNamespace(context: KubeContext): string {
    return context.metadata.namespace
  }

  /** Avoid recomputation for a flurry of events */
  private last: number
  private debounce(): boolean {
    const now = Date.now()
    const last = this.last
    this.last = now

    return last && now - last < 250
  }

  private async reportCurrentNamespace(idx?: Tab | number) {
    const tab = getTab(idx)
    if (!tab || !tab.REPL) {
      if (tab && !tab.REPL) {
        eventChannelUnsafe.once(`/tab/new/${tab.uuid}`, () => this.reportCurrentNamespace())
      }
      return
    } else if (this.debounce()) {
      return
    }

    try {
      const [currentNamespace, allNamespaces] = await Promise.all([
        getCurrentDefaultNamespace(tab),
        tab.REPL.qexec<string>('kubectl get ns -o name').then(_ =>
          _.split(/\n/).map(_ => _.replace(/^namespace\//, ''))
        )
      ])

      if (currentNamespace) {
        this.setState({
          currentNamespace,
          allNamespaces: allNamespaces.sort((a, b) => (a === currentNamespace ? 1 : b === currentNamespace ? -1 : 0)),
          viewLevel: 'normal' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
        })
      }
    } catch (err) {
      console.error(err)
      this.last = undefined

      this.setState({
        currentNamespace: '',
        allNamespaces: [],
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

  /** @return the dropdown items */
  private items() {
    return this.state.allNamespaces.map(ns => ({
      label: ns,
      isSelected: ns === this.state.currentNamespace,
      handler: () => pexecInCurrentTab(`kubectl config set-context --current --namespace=${ns}`)
    }))
  }

  public render() {
    // FIXME disable the on-hover effect with the icon
    if (this.state.allNamespaces.length === 0) {
      return <React.Fragment />
    }

    return (
      <DropdownWidget
        position="left"
        icon={<Icons icon="At" />}
        id="kui--plugin-kubeui--current-namespace"
        title={strings('Kubernetes namespace')}
        actions={this.items()}
      />
    )
  }
}
