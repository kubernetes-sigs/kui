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

interface SubwindowPrefs {
  cwd?: string
  env?: Record<any, any>
  fullscreen?: boolean
  useContentSize?: boolean
  synonymFor?: object

  /** Use this window width */
  width?: number

  /** Use this window height */
  height?: number

  /** Use this window title */
  title?: string

  /** Use this as the initial title for the first tab */
  initialTabTitle?: string

  /** Internal: this is not a Kui window */
  _notAKuiWindow?: boolean

  quietExecCommand?: boolean
  position?: () => Promise<{ x: number; y: number }>
  bringYourOwnWindow?: () => void
}

export default SubwindowPrefs
