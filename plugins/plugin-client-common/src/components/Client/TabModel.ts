/*
 * Copyright 2018 IBM Corporation
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

import { StatusStripeChangeEvent, TabState } from '@kui-shell/core'

/** cheapo uuid; we only need single-threaded uniqueness */
let _uuidCounter = 1
export function uuid() {
  return (_uuidCounter++).toString()
}

export interface TopTabButton<P extends { key: string } = { key: string }> {
  icon: React.ReactElement<P>
}

export default class TabModel {
  public constructor(
    private readonly _uuid = uuid(),
    private readonly desiredStatusStripeDecoration?: StatusStripeChangeEvent,
    background?: boolean,
    private readonly _title?: string,
    private readonly _state = new TabState(_uuid, desiredStatusStripeDecoration),
    private readonly _buttons: TopTabButton[] = [],
    private readonly _initialCommandLine?: string,
    private readonly _onClose?: string
  ) {
    this._state.capture()

    if (!background) {
      this._state.updateStatusStripe()
    }
  }

  public get uuid() {
    return this._uuid
  }

  public get state() {
    return this._state
  }

  public get buttons() {
    return this._buttons
  }

  public get title() {
    return this._title
  }

  public get initialCommandLine() {
    return this._initialCommandLine
  }

  public get onClose() {
    return this._onClose
  }

  public update(buttons: TopTabButton[]) {
    return new TabModel(this.uuid, undefined, undefined, this.title, this.state, buttons, undefined, this.onClose)
  }
}
