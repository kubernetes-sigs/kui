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

import { REPL } from '@kui-shell/core'
import { DropDownAction } from '../DropDown'

interface Props {
  /** Place the given header node at the top of the Card */
  header?: ReactNode

  /** Content rendered inside the CardTitle */
  title?: string

  /** Place the given icon image at the top of the Card */
  icon?: string

  /** Body of the Card. If given a string, it will be passed through as the source <Markdown source="..." /> */
  children: string | ReactNode

  /* [Optional] Display title in header? */
  titleInHeader?: boolean

  /** [Optional] Display body in header? */
  bodyInHeader?: boolean

  /** [Optional] Actions to be rendered in an overflow menu associated with the Card */
  actions?: DropDownAction[]

  /** [Optional] CSS class to associate with the outermost Card element */
  className?: string

  /** [Optional] REPL controller, but required if you want your Card
   * to have functional kuiexec?command=... links via Markdown */
  repl?: REPL
}

export default Props
