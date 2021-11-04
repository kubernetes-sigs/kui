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
import { i18n, Event, Events, ExecType, Themes } from '@kui-shell/core'
import { NavItem } from '@patternfly/react-core'

import Icons from '../../spi/Icons'
import Tooltip from '../../spi/Tooltip'
import ctrlOrMeta from './ctrlOrMeta'

const Markdown = React.lazy(() => import('../../Content/Markdown'))

const strings = i18n('plugin-core-support')
const strings2 = i18n('plugin-client-common')

export interface TabConfiguration {
  topTabNames?: 'command' | 'fixed' // was { topTabs } from '@kui-shell/client/config.d/style.json'
  title?: string
}

type Props = TabConfiguration & {
  idx: number
  uuid: string
  active: boolean
  closeable: boolean
  onCloseTab: (idx: number) => void
  onSwitchTab: (idx: number) => void
}

interface State {
  title: string
  processing: boolean
  isFreshlyCreated: boolean
  topTabNames: 'command' | 'fixed'
}

export default class Tab extends React.PureComponent<Props, State> {
  private _unmounted = false

  private readonly closeTabRef = React.createRef<HTMLDivElement>()

  private onCommandStart: (evt: Event) => void
  private onCommandComplete: (evt: Event) => void
  private onThemeChange: ({ themeModel: Theme }) => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      title: props.title || strings('Tab'),
      processing: false,
      isFreshlyCreated: true,
      topTabNames: props.topTabNames || 'fixed'
    }

    if (!props.topTabNames) {
      setTimeout(async () => {
        const { theme } = await Themes.findThemeByName(
          (await Themes.getPersistedThemeChoice()) || (await Themes.getDefaultTheme())
        )
        if (theme.topTabNames && !this._unmounted) {
          this.setState({
            topTabNames: theme.topTabNames
          })
        }
      })
    }

    this.addCommandEvaluationListeners()
  }

  public componentWillUnmount() {
    this._unmounted = true
    this.removeCommandEvaluationListeners()
  }

  private removeCommandEvaluationListeners() {
    Events.eventBus.offCommandStart(this.props.uuid, this.onCommandStart)
    Events.eventBus.offCommandComplete(this.props.uuid, this.onCommandStart)
    Events.eventChannelUnsafe.off('/theme/change', this.onThemeChange)
  }

  /**
   * Register any command evaluation listeners, i.e. when the REPL finishes evaluating a command.
   *
   */
  private addCommandEvaluationListeners() {
    this.onCommandComplete = (event: Event) => {
      if (this.props.uuid === event.tab.state.uuid && !this._unmounted) {
        if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
          // ignore nested, which means one plugin calling another
          this.setState({ processing: false })
        }

        this.setState({ processing: false })
      }
    }

    this.onCommandStart = (event: Event) => {
      if (this.props.uuid === event.tab.state.uuid && !this._unmounted) {
        if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
          // ignore nested, which means one plugin calling another
          // debug('got event', event)
          if (
            event.route !== undefined &&
            !event.route.match(/^\/(tab|getting\/started)/) // ignore our own events and help
          ) {
            if (this.isUsingCommandName()) {
              this.setState({ processing: true, title: event.command || this.state.title, isFreshlyCreated: false })
              return
            }
          }

          this.setState({ processing: true, isFreshlyCreated: false })
        }
      }
    }

    this.onThemeChange = ({ themeModel }: { themeModel: Themes.Theme }) => {
      if (!this._unmounted) {
        this.setState({
          topTabNames: themeModel.topTabNames || 'fixed'
        })
      }
    }

    Events.eventBus.onCommandStart(this.props.uuid, this.onCommandStart)
    Events.eventBus.onCommandComplete(this.props.uuid, this.onCommandComplete)
    Events.eventChannelUnsafe.on('/theme/change', this.onThemeChange)
  }

  private isUsingCommandName() {
    return this.state.topTabNames === 'command' // && !document.body.classList.contains('kui--alternate')
  }

  private readonly _onMouseDownNavItem = (evt: React.SyntheticEvent) => {
    evt.preventDefault()
    evt.stopPropagation()
  }

  private readonly _onClickNavItem = () => this.props.onSwitchTab(this.props.idx)

  private readonly _onClickCloseButton = (evt: React.SyntheticEvent) => {
    evt.stopPropagation()
    evt.preventDefault()
    this.props.onCloseTab(this.props.idx)
  }

  public render() {
    return (
      <NavItem
        href="#"
        data-tab-names={this.state.topTabNames}
        data-fresh={this.state.isFreshlyCreated}
        data-custom-label={this.props.title ? true : undefined}
        data-custom-label-text={this.props.title || undefined}
        isActive={this.props.active}
        styleChildren={false}
        className={
          'kui--tab kui--tab-navigatable' +
          (this.props.active ? ' kui--tab--active' : '') +
          (this.state.processing ? ' processing' : '')
        }
        data-tab-button-index={this.props.idx + 1}
        aria-label="tab"
        onMouseDown={this._onMouseDownNavItem}
        onClick={this._onClickNavItem}
      >
        <div className="kui--tab--label">
          {this.isUsingCommandName() && this.state.title}
          {!this.isUsingCommandName() && (
            <span className="kui--tab--label-text">
              {this.props.title ? (
                <React.Suspense fallback={<div />}>
                  <Markdown nested source={this.props.title} />
                </React.Suspense>
              ) : (
                strings('Tab')
              )}{' '}
            </span>
          )}
          {!this.isUsingCommandName() && <span className="kui--tab--label-index"></span>}
        </div>
        {/* TODO: button to toggle edit mode could */}
        {this.props.closeable && (
          <React.Fragment>
            <div className="kui--tab-close" ref={this.closeTabRef} onClick={this._onClickCloseButton}>
              <Icons icon="WindowClose" focusable="false" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
            </div>
            <Tooltip reference={this.closeTabRef} position="bottom">
              {strings2('Close this tab', ctrlOrMeta('W'))}
            </Tooltip>
          </React.Fragment>
        )}
      </NavItem>
    )
  }
}
