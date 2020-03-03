/*
 * Copyright 2017-18 IBM Corporation
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

export const keys = {
  ENTER: 13,
  BACKSPACE: 127,
  ESCAPE: 27,
  TAB: 9,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  U: 85,
  UP: 38,
  P: 80,
  DOWN: 40,
  K: 75,
  L: 76,
  N: 78,
  R: 82,
  T: 'T'.charCodeAt(0),
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36
}

export { keys as Codes }

/** does the given keycode correspond to a cursor movement? */
export const isCursorMovement = (evt: KeyboardEvent): boolean => {
  const code = evt.key
  return (
    (evt.ctrlKey && (code === 'a' || code === 'e' || code === 'f' || code === 'b')) ||
    code === 'ArrowLeft' ||
    code === 'ArrowRight'
  )
}
