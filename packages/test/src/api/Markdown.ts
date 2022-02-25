/*
 * Copyright 2022 The Kubernetes Authors
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

import { ISuite } from './common'
import { PROMPT_BLOCK, OUTPUT_LAST } from './selectors'

export default class Markdown {
  public readonly tip = '.kui--markdown-tip'
  public readonly tabs = '.kui--markdown-tabs'
  public readonly tab = `${this.tabs} .kui--markdown-tab button`
  public readonly icon = `${PROMPT_BLOCK} .kui--markdown-icon`

  private readonly _codeBlock = '.kui--code-block-in-markdown'
  public readonly runButton = '.kui--block-action-run'

  public getText(ctx: ISuite) {
    return ctx.app.client.$(OUTPUT_LAST).then(_ => _.getText())
  }

  public tipWithTitle(title: string) {
    return `${this.tip}[data-title="${title}"]`
  }

  public tipContent(baseSelector = this.tip) {
    return `${baseSelector} > div`
  }

  public tabWithTitle(title: string) {
    return `${this.tab}[data-title="${title}"]`
  }

  public codeBlock(index: number) {
    return `${this._codeBlock}[data-code-index="${index}"]`
  }
}
