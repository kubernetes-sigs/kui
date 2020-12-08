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

export interface Action {
  label: string
  handler: () => void
  isSelected?: boolean
  hasDivider?: boolean
}

export interface Props {
  /** Tooltip */
  title?: string

  /** Render more plain/inline style? */
  isPlain?: boolean

  /** Should the Dropdown roll up or down? Default is down */
  direction?: 'up' | 'down'

  /** Should the Dropdown "pointer" be positioned on the left or on the right? Default is left */
  position?: 'left' | 'right'

  /** Icon to include in the dropdown toggler */
  icon?: React.ReactNode

  /** Use kebab or regular caret-style dropdown toggler? Default is kebab */
  toggle?: 'kebab' | 'caret'

  /** Actions to be rendered in an overflow menu associated with the Card */
  actions: Action[]

  /** [Optional] CSS class to associate with the outermost Card element */
  className?: string

  /** [Optional] Handler called when the DropDown is closed */
  onClose?: () => void
}

export default Props
