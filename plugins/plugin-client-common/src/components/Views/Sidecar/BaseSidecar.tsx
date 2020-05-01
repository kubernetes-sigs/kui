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
import { isPopup, inBrowser, REPL, KResponse, Tab as KuiTab, ParsedOptions } from '@kui-shell/core'

import Width from './width'
import sameCommand from './same'
import TitleBar, { Props as TitleBarProps } from './TitleBar'
import CircularBuffer from './CircularBuffer'

import '../../../../web/css/static/sidecar.css'
import '../../../../web/css/static/sidecar-main.css'
import '../../../../web/css/static/sidecar-carbon.css'

/**
 * In order to support a sidecar being managed from an enclosing
 * context, we offer these Props. This is helpful for those cases
 * where one wishes to broker multiple sidecar views into a single
 * enclosing view; e.g. so that the broker can show at most one of the
 * assorted views at a time.
 *
 * For managed sidecars, may pass down an `onClose` and
 * `willLoseFocus` event set, so that the enclosing container may also
 * manage those aspects of the view.
 *
 */
export interface SidecarOptions {
  defaultWidth?: Width
  onClose?: () => void

  /** Current presentation of the sidecar; e.g. Maximized or Closed or Default width? */
  width?: Width
  willChangeSize?: (width: Width) => void

  willLoseFocus?: () => void
}

export type Props = SidecarOptions & {
  uuid?: string
  tab?: KuiTab
}

export interface BaseHistoryEntry {
  cwd: string
  argvNoOptions: string[]
  parsedOptions: ParsedOptions
}

/** Mostly, this State deals with the current "width" of the view. */
export interface BaseState<HistoryEntry extends BaseHistoryEntry> {
  /** TODO investigate removing these */
  repl: REPL
  tab: KuiTab

  current: HistoryEntry
  history: CircularBuffer<HistoryEntry>
}

type Cleaner = () => void

/** cwd */
export function cwd() {
  return process.env.PWD || (!inBrowser() && process.cwd())
}

export abstract class BaseSidecar<
  R extends KResponse,
  HistoryEntry extends BaseHistoryEntry
> extends React.PureComponent<Props, BaseState<HistoryEntry>> {
  protected cleaners: Cleaner[] = []

  protected constructor(props: Props) {
    super(props)

    // Interpret Escape key as a toggle of the view's width
    if (!this.isFixedWidth()) {
      const onEscape = this.onEscape.bind(this)
      document.addEventListener('keydown', onEscape)
      this.cleaners.push(() => document.removeEventListener('keydown', onEscape))
      // ^^^ Note! keydown versus keyup is important (for now at
      // least; @starpit 20200408); see https://github.com/IBM/kui/issues/4215
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  /** @return a `HistoryEntry` for the given `Response` */
  protected abstract getState(
    tab: KuiTab,
    response: R,
    argvNoOptions: string[],
    parsedOptions: ParsedOptions
  ): HistoryEntry

  /** Enter a given `response` into the History model */
  protected onResponse(tab: KuiTab, response: R, _, argvNoOptions: string[], parsedOptions: ParsedOptions) {
    this.setState(curState => {
      const existingIdx = curState.history
        ? curState.history.findIndex(sameCommand(argvNoOptions, parsedOptions, cwd()))
        : -1
      const current =
        this.idempotent() && existingIdx !== -1
          ? curState.history.peekAt(existingIdx)
          : this.getState(tab, response, argvNoOptions, parsedOptions)

      if (current) {
        this.props.willChangeSize(this.defaultWidth())

        if (!curState.history) {
          return {
            tab,
            repl: tab.REPL,
            current,
            history: new CircularBuffer(current, this.capacity())
          }
        } else {
          if (existingIdx === -1) {
            curState.history.push(current)
          } else {
            curState.history.update(existingIdx, current)
          }

          return {
            tab,
            repl: tab.REPL,
            current,
            history: curState.history
          }
        }
      }
    })
  }

  /** Capacity of the circular buffer; e.g. if 1, then no history */
  protected capacity() {
    return 15
  }

  /** Is getState() idempotent? i.e. Will two command executions that satisfy `sameCommand` always produce the same response? */
  protected idempotent() {
    return false
  }

  /** Should we display Back/Forward arrows for history navigation? */
  protected useArrowNavigation() {
    return true
  }

  /** We are about to go away; invoke the register cleaners. */
  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  /** @return the current History entry */
  protected get current(): HistoryEntry {
    return this.state.current
  }

  protected defaultWidth(): Width {
    return this.props.defaultWidth || Width.Split60
  }

  /** Escape key toggles sidecar visibility */
  private onEscape(evt: KeyboardEvent) {
    if (evt.key === 'Escape' && !document.getElementById('confirm-dialog') && !isPopup()) {
      if (this.props.willChangeSize) {
        this.props.willChangeSize(this.props.width === Width.Closed ? this.defaultWidth() : Width.Closed)
      }
    }
  }

  protected onMaximize() {
    if (this.props.willChangeSize) {
      this.props.willChangeSize(Width.Maximized)
    }
  }

  protected onRestore() {
    if (this.props.willChangeSize) {
      this.props.willChangeSize(this.defaultWidth())
    }
  }

  protected onClose() {
    if (this.props.onClose) {
      this.props.onClose()
    }

    if (this.props.willChangeSize) {
      this.props.willChangeSize(Width.Closed)
    }
  }

  protected isFixedWidth() {
    return false
  }

  protected width(): Required<string> {
    switch (this.props.width) {
      case Width.Maximized:
        return 'visible maximized'
      default:
        return 'visible'
    }
  }

  protected title(
    props?: Omit<TitleBarProps, 'width' | 'fixedWidth' | 'onClose' | 'onRestore' | 'onMaximize' | 'onMinimize' | 'repl'>
  ) {
    return (
      <TitleBar
        {...props}
        repl={this.state.tab.REPL}
        width={this.props.width}
        fixedWidth={this.isFixedWidth()}
        onMaximize={this.onMaximize.bind(this)}
        onRestore={this.onRestore.bind(this)}
        onClose={this.onClose.bind(this)}
        back={
          this.useArrowNavigation() &&
          this.props.width !== Width.Closed &&
          this.state.history.length > 1 && {
            enabled: true,
            onClick: () => {
              this.setState(curState => ({ current: curState.history.shiftLeft() }))
            }
          }
        }
        forward={
          this.useArrowNavigation() &&
          this.props.width !== Width.Closed &&
          this.state.history.length > 1 && {
            enabled: true,
            onClick: () => {
              this.setState(curState => ({ current: curState.history.shiftRight() }))
            }
          }
        }
      />
    )
  }
}
