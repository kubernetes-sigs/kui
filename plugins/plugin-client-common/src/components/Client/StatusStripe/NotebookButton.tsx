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

import * as React from 'react'
import { pexecInCurrentTab } from '@kui-shell/core'

import Icons, { SupportedIcon } from '../../spi/Icons'

interface Props {
  /** DOM id */
  id: string

  /** aria-label */
  label?: string

  /** tooltip for the button */
  title: string

  /** Kui Tab title to use when playing the notebook */
  tabTitle: string

  /** The filepath to the Kui notebook */
  notebook: string

  /** The icon that represents this button */
  icon: SupportedIcon
}

export default function NotebookButton(props: Props) {
  return (
    <div className="kui--status-stripe-button">
      <a
        href="#"
        className="kui--tab-navigatable kui--status-stripe-element-clickable kui--status-stripe-element"
        id={props.id}
        aria-label={props.label || props.icon}
        tabIndex={0}
        title={props.title}
        onClick={() =>
          pexecInCurrentTab(
            `tab new --cmdline "replay ${props.notebook}" --title "${props.tabTitle}" --status-stripe-type blue --status-stripe-message "${props.tabTitle}"`
          )
        }
      >
        <Icons icon={props.icon} />
      </a>
    </div>
  )
}
