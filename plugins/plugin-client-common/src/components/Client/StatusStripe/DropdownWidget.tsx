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

import Tooltip, { Props as TooltipProps } from '../../spi/Tooltip'
import DropDown, { DropDownProps, DropDownAction } from '../../spi/DropDown'

export type Props = Pick<DropDownProps, 'position'> & {
  /** Dom identifier for status stripe wrapper around the button */
  id?: string

  /** Special case for widgets that use a nested component that provides its own padding */
  noPadding?: boolean

  /** Positioning of tooltip */
  tooltipPosition?: TooltipProps['position']

  icon?: React.ReactNode
  title?: string
  actions: DropDownAction[]
}

export default function DropdownWidget(props: Props) {
  return (
    <Tooltip content={props.title} position={props.tooltipPosition}>
      <div
        className="kui--status-stripe-element kui--status-stripe-element-clickable"
        id={props.id}
        data-no-padding={props.noPadding || undefined}
      >
        <DropDown isPlain direction="up" toggle="caret" {...props} />
      </div>
    </Tooltip>
  )
}
