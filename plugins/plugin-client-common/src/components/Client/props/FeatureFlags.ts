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

type FeatureFlags = {
  /** [Optional] Enable WatchPane? */
  enableWatchPane?: boolean

  /** [Optional] disable table title? */
  disableTableTitle?: boolean

  /** [Optional] show sidecar name as breadcrumb or hero text, default: 'breadcrumb' */
  sidecarName?: 'breadcrumb' | 'heroText'

  /** [Optional] Enable Split Terminals? */
  splitTerminals?: boolean

  /** [Optional] automatically pin watchable command ouptut to the WatchPane? */
  enableWatcherAutoPin?: boolean
}

export default FeatureFlags
