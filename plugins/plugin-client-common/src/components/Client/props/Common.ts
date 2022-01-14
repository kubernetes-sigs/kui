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

export default interface CommonProps {
  /** If in popup mode, execute the given command line */
  commandLine?: string[]

  /** do not show <?> help widget */
  noHelp?: boolean

  /** do not show Settings/Themes widget */
  noSettings?: boolean

  /** Are tabs closeable? [default: true except for config.d/client.json readonly: true */
  closeableTabs?: boolean

  /** Don't show top tabs [default: false] */
  noTopTabs?: boolean
}
