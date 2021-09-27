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

/**
 * Attribution: https://github.com/tobiasahlin/SpinKit
 *
 */

import React from 'react'
import 'spinkit/spinkit.min.css'

interface Props {
  className?: string
}

function classOf(cls: string, props: Props) {
  return cls + (props.className ? ' ' + props.className : '')
}

export function Plane(props: Props) {
  return <div className={classOf('sk-plane', props)}></div>
}

export function Chase(props: Props) {
  return (
    <div className={classOf('sk-chase', props)}>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  )
}

export function Bounce(props: Props) {
  return (
    <div className={classOf('sk-bounce', props)}>
      <div className="sk-bounce-dot"></div>
      <div className="sk-bounce-dot"></div>
    </div>
  )
}

export function Wave(props: Props) {
  return (
    <div className={classOf('sk-wave', props)}>
      <div className="sk-wave-rect"></div>
      <div className="sk-wave-rect"></div>
      <div className="sk-wave-rect"></div>
      <div className="sk-wave-rect"></div>
      <div className="sk-wave-rect"></div>
    </div>
  )
}

export function Pulse(props: Props) {
  return <div className={classOf('sk-pulse', props)}></div>
}

export function Flow(props: Props) {
  return (
    <div className={classOf('sk-flow', props)}>
      <div className="sk-flow-dot"></div>
      <div className="sk-flow-dot"></div>
      <div className="sk-flow-dot"></div>
    </div>
  )
}

export function Swing(props: Props) {
  return (
    <div className={classOf('sk-swing', props)}>
      <div className="sk-swing-dot"></div>
      <div className="sk-swing-dot"></div>
    </div>
  )
}

export function Circle(props: Props) {
  return (
    <div className={classOf('sk-circle', props)}>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
      <div className="sk-circle-dot"></div>
    </div>
  )
}

export function CircleFade(props: Props) {
  return (
    <div className={classOf('sk-circle-fade', props)}>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
      <div className="sk-circle-fade-dot"></div>
    </div>
  )
}

export function Grid(props: Props) {
  return (
    <div className={classOf('sk-grid', props)}>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
      <div className="sk-grid-cube"></div>
    </div>
  )
}

export function FoldingCube(props: Props) {
  return (
    <div className={classOf('sk-fold', props)}>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
      <div className="sk-fold-cube"></div>
    </div>
  )
}

export function Wander(props: Props) {
  return (
    <div className={classOf('sk-wander', props)}>
      <div className="sk-wander-cube"></div>
      <div className="sk-wander-cube"></div>
      <div className="sk-wander-cube"></div>
    </div>
  )
}

export default function defaultSpinner(props: Props & { spinnerClassName?: string }) {
  return (
    <span className={classOf('kui--repl-block-spinner', props)}>
      <Plane className={props.spinnerClassName} />
    </span>
  )
}
