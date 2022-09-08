/*
 * Copyright 2019 The Kubernetes Authors
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

export const keys = {
  Numpad1: '\uE01B',
  Numpad2: '\uE01C',
  PageUp: '\uE00E',
  PageDown: '\uE00F',
  End: '\uE010',
  Home: '\uE011',
  Delete: '\uE017',
  BACKSPACE: '\uE003',
  TAB: '\uE004',
  ENTER: '\uE007',
  DELETE: '\uE017',
  CONTROL: '\uE009',
  META: '\uE03D',
  ESCAPE: '\uE00C',
  ctrlOrMeta: process.platform === 'darwin' ? '\uE03D' : '\uE009',

  // Send NULL to release Control key at the end of the call, otherwise the state of Control is kept between calls
  ctrlN: ['\uE009', 'n', 'NULL'],
  ctrlP: ['\uE009', 'p', 'NULL'],
  ctrlC: ['\uE009', 'c', 'NULL'],

  holdDownKey: function (this: ISuite, character: string) {
    return this.app.client.performActions([
      {
        type: 'key',
        id: 'keyboard',
        actions: [{ type: 'keyDown', value: character }]
      }
    ])
  },

  releaseKey: function (this: ISuite, character: string) {
    return this.app.client.performActions([
      {
        type: 'key',
        id: 'keyboard',
        actions: [{ type: 'keyUp', value: character }]
      }
    ])
  }
}
