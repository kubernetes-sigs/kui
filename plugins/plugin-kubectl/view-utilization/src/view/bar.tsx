/*
 * Copyright 2019-2020 IBM Corporation
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
import { getCurrentTab } from '@kui-shell/core'

export const enum BarColor {
  CPU = 'var(--color-latency-0)',
  Memory = 'var(--color-latency-1)',
  Overcommitted = 'var(--color-error)'
}

type WithFraction = { fraction: number }
type WithFractionString = { fractionString: string }
type BarProps = { color: BarColor } & (WithFraction | WithFractionString)

function hasFraction(props: BarProps): props is BarProps & WithFraction {
  return typeof (props as WithFraction).fraction === 'number'
}

/** Format as a "xy%" string */
function fractionString(props: BarProps): string {
  return hasFraction(props) ? 100 * props.fraction + '%' : props.fractionString
}

/**
 * Create a bar, and place it in the given container. If the optional
 * initialFraction is given, then set the bar's width to that value.
 * |    >   |
 *
 * where, in the code below:
 * - `bar` is |        |
 * - `live` is the region of `bar` up to the >
 */
export function Bar(props: BarProps) {
  const liveStyle = {
    backgroundColor: props.color,
    bodrerRight: '1px solid var(--color-stripe-02)',
    width: fractionString(props)
  }

  return (
    <div style={{ display: 'flex', backgroundColor: 'var(--color-stripe-01)', height: '1em', width: '5em' }}>
      <div style={liveStyle} />
    </div>
  )
}

/**
 * Create a container for one or more bars.
 *
 * @param alignment for singleton bars, probably 'center'; for
 * multi-bar content, probably 'space-between'
 *
 * @return the container DOM
 *
 */
export function BarContainer(props: {
  children?: React.ReactNode
  alignment?: 'space-between' | 'center'
  flexDirection?: 'column' | 'row'
  onClick?: string
}) {
  const style = {
    display: 'flex',
    flexDirection: props.flexDirection || ('column' as const),
    justifyContent: props.alignment || 'space-between'
  }

  return props.onClick ? (
    <a style={style} href="#" onClick={() => getCurrentTab().REPL.pexec(props.onClick)}>
      {props.children}
    </a>
  ) : (
    <div style={style}>{props.children}</div>
  )
}

/**
 * Create a single bar with its own container, and return the container.
 *
 */
type BP = BarProps & { text?: boolean }
export function SingletonBar(props: BP) {
  return (
    <BarContainer alignment="center" flexDirection="row">
      <Bar {...props} />
      {props.text && <span className="even-smaller-text sub-text small-left-pad">{fractionString(props)}</span>}
    </BarContainer>
  )
}

export function singletonBar(props: BP) {
  return <SingletonBar {...props} />
}
