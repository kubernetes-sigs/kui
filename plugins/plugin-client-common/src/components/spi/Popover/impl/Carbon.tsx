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

import React from 'react'
import { Tooltip } from 'carbon-components-react'

import Props from '../model'
import '../../../../../web/scss/components/Popover/Carbon.scss'

export default function CarbonPopover(props: Props) {
  const hack = { align: 'start' }

  return (
    <Tooltip
      {...hack}
      tabIndex={-1}
      direction={props.position === 'auto' ? 'bottom' : props.position}
      triggerClassName={props.triggerClassName}
      className={'kui--popover kui--inverted-color-context ' + (props.className || '')}
      showIcon={false}
      triggerText={props.children}
    >
      <h6>{props.headerContent}</h6>
      <div className="top-pad">{props.bodyContent}</div>
    </Tooltip>
  )
}
