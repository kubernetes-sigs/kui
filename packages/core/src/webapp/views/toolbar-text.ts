/*
 * Copyright 2017-19 IBM Corporation
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

/**
 * Text to be displayed in the sidecar toolbar
 *
 */

import { element } from '../util/dom'
import Formattable from './formattable'

type ToolbarTextType = 'info' | 'warning' | 'error'

type ToolbarTextValue = string | Element

export interface ToolbarText {
  type: ToolbarTextType
  text: ToolbarTextValue
}

export interface RefreshableToolbarText extends ToolbarText {
  attach: (owner: Element) => RefreshableToolbarText
  refresh: () => void
}

export class ToolbarTextImpl implements RefreshableToolbarText {
  private _container: Element

  // eslint doesn't recognize the typescript constructor-settor syntax
  // eslint-disable-next-line no-useless-constructor
  public constructor(public type: ToolbarTextType, public text: string | Element) {}

  public attach(owner: Element) {
    this._container = element('.sidecar-bottom-stripe-toolbar .sidecar-toolbar-text', owner)
    return this
  }

  public refresh() {
    if (this._container) {
      const content = element('.sidecar-toolbar-text-content', this._container)
      if (typeof this.text === 'string') {
        content.innerText = this.text
      } else {
        content.appendChild(this.text)
      }
      this._container.setAttribute('data-type', this.type)
    }
  }
}

export function isToolbarText(subtext: Formattable | ToolbarText): subtext is ToolbarText {
  const spec = subtext as ToolbarText
  return spec && spec.type !== undefined && spec.text !== undefined
}

export function isRefreshableToolbarText(ttext: ToolbarText): ttext is RefreshableToolbarText {
  const refreshable = ttext as RefreshableToolbarText
  return refreshable.attach !== undefined && refreshable.refresh !== undefined
}
