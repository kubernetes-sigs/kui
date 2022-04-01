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

// FIXME:
/* eslint-disable react/prop-types */

import React from 'react'
import { Props as PopoverProps } from '../../spi/Popover'

type Props = React.PropsWithChildren<{
  className?: string

  /** Override default Popover positioning for all children */
  position?: PopoverProps['position']
}>

export default class MeterWidgets extends React.PureComponent<Props> {
  private className() {
    return 'kui--status-stripe-meter ' + (this.props.className || '')
  }

  private graft(node: Props['children'], key?: number) {
    if (React.isValidElement(node)) {
      // ^^^ this check avoids tsc errors
      return React.cloneElement(node as React.ReactElement<{ key?: number; position: Props['position'] }>, {
        key,
        position: 'top-end' // meter widgets should default to top-end positioning of Popovers
      })
    } else {
      return node
    }
  }

  /** Graft on the REPL focus management */
  private children() {
    if (Array.isArray(this.props.children)) {
      return this.props.children.map((child, idx) => this.graft(child, idx))
    } else {
      return this.graft(this.props.children)
    }
  }

  public render() {
    return <div className={this.className()}>{this.children()}</div>
  }
}
