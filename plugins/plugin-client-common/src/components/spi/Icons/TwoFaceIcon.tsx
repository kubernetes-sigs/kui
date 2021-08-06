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

import Icons, { Props, SupportedIcon } from '.'

type TwoFaceProps<A extends SupportedIcon, B extends SupportedIcon> = Pick<Props, 'className'> & {
  /** The primary icon */
  a: A

  /** The icon to display transiently after a click */
  b: B

  /** Optional className for the B face */
  classNameB?: string

  /** After a click transition from a to b, millis to wait before auto-toggling back to a */
  delay?: number

  /** Underlying click handler. This component will add its own wrapper handler, to handle the face toggle */
  onClick?: (evt: React.MouseEvent) => void

  /** Tooltip */
  title?: string
}

type TwoFaceState = { face: 'a' | 'b' }

export default class TwoFaceIcon<
  A extends SupportedIcon,
  B extends SupportedIcon,
  Props extends TwoFaceProps<A, B>
> extends React.PureComponent<Props, TwoFaceState> {
  private readonly toggle = this.onToggle.bind(this)

  public constructor(props: Props) {
    super(props)

    this.state = {
      face: 'a'
    }
  }

  /** So we don't handle events after unmounting */
  private _unmounted = true
  private get unmounted() {
    return this._unmounted
  }

  private set unmounted(umm: boolean) {
    this._unmounted = umm
  }

  public componentDidMount() {
    this.unmounted = false
  }

  public componentWillUnmount() {
    this.unmounted = true
  }

  private toggleState() {
    if (!this.unmounted) {
      this.setState(curState => ({ face: curState.face === 'a' ? 'b' : 'a' }))
    }
  }

  private onToggle(evt: React.MouseEvent) {
    evt.stopPropagation()

    this.toggleState()
    setTimeout(() => this.toggleState(), this.props.delay || 1500)

    if (this.props.onClick) {
      this.props.onClick(evt)
    }
  }

  public render() {
    return (
      <a
        href="#"
        onClick={this.toggle}
        title={this.props.title}
        className={
          (this.props.className || '') +
          ' ' +
          (this.state.face === 'b' && this.props.classNameB ? this.props.classNameB : '')
        }
      >
        <Icons icon={this.state.face === 'a' ? this.props.a : this.props.b} />
      </a>
    )
  }
}
