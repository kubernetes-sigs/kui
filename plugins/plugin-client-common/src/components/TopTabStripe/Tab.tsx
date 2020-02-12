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
import { i18n, eventBus, Event, ExecType } from '@kui-shell/core'

import { topTabs } from '@kui-shell/client/config.d/style.json'
import { productName } from '@kui-shell/client/config.d/name.json'

const strings = i18n('plugin-core-support')

function isUsingCommandName() {
  return topTabs.names === 'command' && !document.body.classList.contains('kui--alternate')
}

interface Props {
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
}

export default class Tab extends React.PureComponent<Props, State> {
  private onCommandStart: (evt: Event) => void
  private onCommandComplete: (evt: Event) => void

  public constructor(props: Props) {
    super(props)

    this.state = {
      title: productName,
      processing: false
    }

    this.addCommandEvaluationListeners()
  }

  public componentWillUnmount() {
    this.removeCommandEvaluationListeners()
  }

  private removeCommandEvaluationListeners() {
    eventBus.off('/command/start', this.onCommandStart)
    eventBus.off('/command/complete', this.onCommandComplete)
  }

  /**
   * Register any command evaluation listeners, i.e. when the REPL finishes evaluating a command.
   *
   */
  private addCommandEvaluationListeners() {
    this.onCommandComplete = (event: Event) => {
      if (this.props.uuid === event.tab.state.uuid) {
        if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
          // ignore nested, which means one plugin calling another
          this.setState({ processing: false })
        }
      }
    }

    this.onCommandStart = (event: Event) => {
      if (this.props.uuid === event.tab.state.uuid) {
        if (event.execType !== undefined && event.execType !== ExecType.Nested && event.route) {
          // ignore nested, which means one plugin calling another
          // debug('got event', event)
          if (
            event.route !== undefined &&
            !event.route.match(/^\/(tab|getting\/started)/) // ignore our own events and help
          ) {
            if (isUsingCommandName()) {
              this.setState({ processing: true, title: event.command })
              return
            }
          }

          this.setState({ processing: true })
        }
      }
    }

    eventBus.on('/command/start', this.onCommandStart)
    eventBus.on('/command/complete', this.onCommandComplete)
  }

  public render() {
    return (
      <a
        href="#"
        className={
          'kui-tab left-tab-stripe-button kui--tab-navigatable' +
          (this.props.active ? ' kui-tab--active left-tab-stripe-button-selected' : '')
        }
        data-tab-button-index={this.props.idx + 1}
        aria-label="tab"
        tabIndex={2}
        onMouseDown={evt => {
          evt.preventDefault()
          evt.stopPropagation()
        }}
        onClick={() => {
          this.props.onSwitchTab(this.props.idx)
        }}
      >
        <div className="kui-tab--label left-tab-stripe-button-label">
          {isUsingCommandName() && this.state.title}
          {!isUsingCommandName() && <span className="kui-tab--label-text">{strings('Tab')} </span>}
          {!isUsingCommandName() && <span className="kui-tab--label-index"></span>}
        </div>

        {this.props.closeable && (
          <div
            className="left-tab-stripe-button-closer"
            onClick={evt => {
              evt.stopPropagation()
              evt.preventDefault()
              this.props.onCloseTab(this.props.idx)
            }}
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M12 4.7l-.7-.7L8 7.3 4.7 4l-.7.7L7.3 8 4 11.3l.7.7L8 8.7l3.3 3.3.7-.7L8.7 8z"></path>
            </svg>
          </div>
        )}
      </a>
    )
  }
}
