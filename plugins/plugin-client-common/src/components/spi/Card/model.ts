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

import { ReactNode } from 'react'

import { DropDownAction } from '../DropDown'

interface Props {
  /** Place the given header node at the top of the Card */
  header: ReactNode

  /** Force children to be a required property */
  children: ReactNode

  /** [Optional] Actions to be rendered in an overflow menu associated with the Card */
  actions?: DropDownAction[]

  /** [Optional] CSS class to associate with the outermost Card element */
  className?: string
}

export default Props
