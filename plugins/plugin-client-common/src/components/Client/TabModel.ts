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

import { TabState } from '@kui-shell/core'

/** cheapo uuid; we only need single-threaded uniqueness */
let _uuidCounter = 1
export function uuid() {
  return (_uuidCounter++).toString()
}

export default class TabModel {
  private readonly _uuid: string
  private readonly _state: TabState

  public constructor() {
    this._uuid = uuid()
    this._state = new TabState(this._uuid)
    this._state.capture()
  }

  public get uuid() {
    return this._uuid
  }

  public get state() {
    return this._state
  }
}
