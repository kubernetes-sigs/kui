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
import prettyPrintDuration from 'pretty-ms'

import Status from './CodeBlockStatus'

type TimerProps = {
  startTime: number
  endTime?: number
  status: Status

  /** Show completion Date? */
  showDate?: boolean

  /** className of Timer */
  className?: string

  /** className of Timer text */
  innerClassName?: string
}

interface TimerState {
  /** durationDom, used for counting up duration while Processing */
  counter?: ReturnType<typeof setInterval>
  durationDom: React.RefObject<HTMLSpanElement>
}

export default class Timer extends React.PureComponent<TimerProps, TimerState> {
  public constructor(props: TimerProps) {
    super(props)
    this.state = Timer.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: TimerProps, state?: TimerState) {
    const counter = state ? Timer.updateCountup(props, state) : null

    if (!state) {
      return {
        counter,
        durationDom: React.createRef<HTMLSpanElement>()
      }
    } else {
      return Object.assign({}, state, { counter })
    }
  }

  public componentWillUnmount() {
    if (this.state.counter) {
      clearInterval(this.state.counter)
    }
  }

  protected static newCountup(startTime: number, durationDom: TimerState['durationDom']) {
    if (durationDom.current) {
      durationDom.current.innerText = ''
    }

    return setInterval(() => {
      const millisSinceStart = (~~(Date.now() - startTime) / 1000) * 1000
      if (millisSinceStart > 0 && durationDom.current) {
        durationDom.current.innerText = prettyPrintDuration(millisSinceStart)
      }
    }, 1000)
  }

  private static updateCountup(props: TimerProps, state: TimerState) {
    const counter =
      props.status === 'processing' ? state.counter || Timer.newCountup(props.startTime, state.durationDom) : undefined

    if (!counter && state.counter) {
      clearInterval(state.counter)

      if (state.durationDom.current) {
        state.durationDom.current.innerText = ''
      }
    }

    return counter
  }

  public render() {
    const completed = !!this.props.endTime
    const showingDate = this.props.showDate && completed

    const now = completed ? this.props.endTime : Date.now()

    const duration = completed ? prettyPrintDuration(Math.max(0, now - this.props.startTime)) : undefined

    const noParen = !showingDate || !duration
    const openParen = noParen ? '' : '('
    const closeParen = noParen ? '' : ')'

    const children = [openParen, duration, closeParen].filter(Boolean)

    return (
      <span className={this.props.className}>
        {showingDate && new Date(this.props.startTime).toLocaleTimeString()}
        <span className={this.props.innerClassName}>
          {this.props.status === 'processing' && <span ref={this.state.durationDom} />}
          {children}
        </span>
      </span>
    )
  }
}
