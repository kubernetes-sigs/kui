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
import { DropDown, DropDownAction } from '../../..'

export interface Props {
  id?: string
  position?: 'left' | 'right'
  actions: DropDownAction[]
}

export default function DropdownWidget(props: Props) {
  return (
    <div className="kui--status-stripe-element" data-padding="none" id={props.id}>
      <DropDown isPlain direction="up" toggle="caret" position={props.position} actions={props.actions} />
    </div>
  )
}
