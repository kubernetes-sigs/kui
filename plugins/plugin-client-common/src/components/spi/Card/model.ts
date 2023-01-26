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

import { ReactNode } from 'react'

import type { Tab } from '@kui-shell/core'
import { DropDownAction } from '../DropDown'

interface Props {
  /** tab identifier, which helps e.g. contained Editors maintain sizing as tab layout changes */
  tab?: Tab

  /** Place the given header node at the top of the Card */
  header?: ReactNode

  /** Place the given footer node at the bottom of the Card */
  footer?: ReactNode

  /** Content rendered inside the CardTitle */
  title?: string

  /** Place the given icon image at the top of the Card */
  icon?: string

  /** Body of the Card. If given a string, it will be passed through as the source <Markdown source="..." /> */
  children: string | ReactNode

  /** Base HTTP Url? */
  baseUrl?: string

  /* [Optional] Display title in header? */
  titleInHeader?: boolean

  /** [Optional] Display body in header? */
  bodyInHeader?: boolean

  /** [Optional] Overflow menu actions; rendered in the upper right corner */
  actions?: DropDownAction[]

  /** [Optional] Options to be rendered in the upper right corner (not in an overflow menu) */
  inlineActions?: ReactNode[]

  /** [Optional] CSS class to associate with the outermost Card element */
  className?: string

  /** [Optional] CSS class to associate with the Card footer */
  footerClassName?: string

  /** [Optional] Card onClick handler */
  onCardClick?: (evt: React.MouseEvent) => void

  /** [Optional] Use standard box-shadow (default: no box-shadow) */
  boxShadow?: boolean
}

export default Props
