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

import {
  Markdown,
  ViewLevel,
  Select,
  TextWithIconWidget,
  TextWithIconWidgetOptions
} from '@kui-shell/plugin-client-common'
import { Events, getCurrentTab, getTab, Tab, TabState, encodeComponent, pexecInCurrentTab, i18n } from '@kui-shell/core'
import { KubeContext } from '@kui-shell/plugin-kubectl'

type Props = TextWithIconWidgetOptions

interface State {
  currentContext: string
  allContexts: KubeContext[]
  options: { label: string; isSelected: boolean; description: string; command: string }[]
  viewLevel: ViewLevel
}

const strings = i18n('plugin-kubectl')

function KubernetesIcon() {
  return <Markdown source=":material-kubernetes:" />
}

export let ready = false
Events.eventBus.once('/tab/new', () => (ready = true))

export default class CurrentContext extends React.PureComponent<Props, State> {
  private readonly handler = this.reportCurrentContext.bind(this)
  private readonly handlerForConfigChange = this.getCurrentContextFromChange.bind(this)
  private readonly handlerNotCallingKubectl = this.getCurrentContextFromTab.bind(this)

  public constructor(props: Props) {
    super(props)

    this.state = {
      currentContext: strings('Loading...'),
      allContexts: [],
      options: [],
      viewLevel: 'loading'
    }
  }

  /** @return e.g. name/uuid -> name; or name:nnnn -> name */
  private renderName(context: string): string {
    // ibmcloud: {clustername}/{uuid}
    const match1 = context.match(/^([^/]+)[/:][0-9a-z]+$/)
    if (match1) {
      return match1[1]
    }

    // openshift: {namespace}/{clusterhost}:{port}/{user}
    const match2 = context.match(/^[^/]+\/([^/]+):\d+\/[^/]+$/)
    if (match2) {
      return match2[1]
    }

    // AWS: arn:aws:eks:{region}:{uuid}:cluster/{clustername}
    // e.g. region us-east-1
    // e.g. uuid 581274594392
    const match3 = context.match(/arn:[^:]+:[^:]+:[^:]+:[^:]+:cluster\/(.*)$/)
    if (match3) {
      return match3[1]
    }

    return context
  }

  /** So we don't handle events after unmounting */
  private _unmounted = true
  private get unmounted() {
    return this._unmounted
  }

  private set unmounted(umm: boolean) {
    this._unmounted = umm
  }

  /** Avoid recomputation for a flurry of events */
  private last: number
  private debounce(): boolean {
    const now = Date.now()
    const last = this.last
    this.last = now

    return last && now - last < 250
  }

  private async getCurrentContextFromChange() {
    if (this.unmounted) {
      return
    }

    const { kubectl, getAllContexts, getCurrentDefaultContextName } = await import('@kui-shell/plugin-kubectl')

    const tab = getCurrentTab()
    const defaultCurrentContext = await getCurrentDefaultContextName(tab)

    const currentContext = defaultCurrentContext

    const allContexts = this.state.allContexts.find(_ => _.metadata.name === currentContext)
      ? this.state.allContexts
      : await getAllContexts(tab)

    this.setState({
      allContexts,
      currentContext,
      options: this.options(currentContext, allContexts, kubectl)
    })
  }

  private options(currentContext: string, allContexts: State['allContexts'], kubectl: string) {
    return allContexts.map(context => {
      const { name } = context.metadata
      const label = this.renderName(name)
      const isSelected = name === currentContext

      return {
        label,
        isSelected,
        description: isSelected ? strings('This is your current context') : undefined,
        quietExec: true,
        command: `${kubectl} config use-context ${encodeComponent(name)}`
      }
    })
  }

  private setNoContext() {
    this.last = undefined
    this.setState({
      viewLevel: 'hidden',
      allContexts: [],
      options: []
    })
  }

  private async reportCurrentContext(idx?: Tab | number | string) {
    if (this.unmounted) {
      return
    }

    const tab = getTab(typeof idx === 'string' ? undefined : idx)
    if (!tab || !tab.REPL) {
      if (tab && !tab.REPL) {
        Events.eventChannelUnsafe.once(`/tab/new/${tab.uuid}`, () => this.reportCurrentContext())
      }
      return
    } else if (this.debounce()) {
      return
    }

    try {
      const { kubectl, getAllContexts } = await import('@kui-shell/plugin-kubectl')

      const allContexts = await getAllContexts(tab)
      const currentContextSpec = allContexts.find(context => context.spec.isCurrent)
      const currentContext = currentContextSpec && currentContextSpec.metadata.name

      if (currentContext) {
        this.setState({
          allContexts,
          currentContext,
          options: this.options(currentContext, allContexts, kubectl),
          viewLevel: 'normal' // only show normally if we succeed; see https://github.com/IBM/kui/issues/3537
        })
      } else {
        this.setNoContext()
      }
    } catch (err) {
      console.error(err)
      this.setNoContext()
    }
  }

  private async getCurrentContextFromTab(args: { idx: number; tab: TabState }) {
    const { tab } = args
    if (tab) {
      const { kubectl, getTabState } = await import('@kui-shell/plugin-kubectl')

      const currentContext = getTabState(tab, 'context')
      if (currentContext) {
        this.setState(curState => ({
          currentContext,
          options: this.options(currentContext, curState.allContexts, kubectl),
          viewLevel: 'normal'
        }))
      }
    }
  }

  /** @return UI for listing full context table */
  private listContext() {
    return (
      <a href="#" onClick={() => pexecInCurrentTab('contexts')}>
        {strings('Show Full Details')}
      </a>
    )
  }

  /** @return the header for the Popover component */
  private popoverHeader() {
    return (
      <React.Fragment>
        <div>{strings('Kubernetes Context')}</div>
        <div className="do-not-overflow">
          <strong>{this.renderName(this.state.currentContext)}</strong>
        </div>
        <div className="sub-text even-smaller-text">{this.listContext()}</div>
      </React.Fragment>
    )
  }

  private switchContext() {
    if (this.state.allContexts.length === 0) {
      return
    }

    return (
      <React.Suspense fallback={<div />}>
        <Select
          isOpen
          isClosable={false}
          maxHeight="15rem"
          variant="typeahead"
          options={this.state.options}
          selected={this.state.currentContext}
          key={this.state.currentContext /* pf 4.152.4 regression? "This is the current" does not show on change */}
        />
      </React.Suspense>
    )
  }

  /** @return the body for the Popover component */
  private popoverBody() {
    return <div className="top-pad bottom-pad">{this.switchContext()}</div>
  }

  /** @return desired Popover model */
  private popover() {
    return {
      className: 'kui--popover-select',
      bodyContent: this.popoverBody(),
      headerContent: this.popoverHeader()
    }
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    this.unmounted = false

    if (!ready) {
      Events.eventBus.once('/tab/new', this.handler)
    } else {
      this.handler()
    }
    Events.eventBus.on('/tab/switch/request/done', this.handlerNotCallingKubectl)

    Events.eventBus.onAnyCommandComplete(this.handler)

    import('@kui-shell/plugin-kubectl').then(_ => _.onKubectlConfigChangeEvents(this.handlerForConfigChange))
  }

  /** Bye! */
  public componentWillUnmount() {
    this.unmounted = true
    Events.eventBus.off('/tab/new', this.handler)
    Events.eventBus.off('/tab/switch/request/done', this.handlerNotCallingKubectl)
    Events.eventBus.offAnyCommandComplete(this.handler)
    import('@kui-shell/plugin-kubectl').then(_ => _.offKubectlConfigChangeEvents(this.handlerForConfigChange))
  }

  public render() {
    return (
      <TextWithIconWidget
        className={this.props.className}
        text={this.state.currentContext}
        viewLevel={this.state.viewLevel}
        id="kui--plugin-kubeui--current-context"
        title={strings('Kubernetes context')}
        {...this.props}
        popover={this.popover()}
      >
        <KubernetesIcon />
      </TextWithIconWidget>
    )
  }
}
