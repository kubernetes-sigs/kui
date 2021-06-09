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

import { Table } from '@kui-shell/core'

type FeatureFlags = {
  /** [Optional] disable table title? */
  disableTableTitle?: boolean

  /** [Optional] when drilling down a table cell, open a new window to execute the comamnd?  */
  drilldownTo?: Table['drilldownTo']

  /** [Optional] show sidecar name as breadcrumb or hero text, default: 'breadcrumb' */
  sidecarName?: 'breadcrumb' | 'heroText'

  /** [Optional] Show bottom status stripe? [default: true] */
  statusStripe?: boolean

  /** Operate in popup mode? */
  isPopup?: boolean

  /** [Optional] automatically pin watchable command ouptut to the WatchPane? */
  enableWatcherAutoPin?: boolean

  /**
   * [Optional] maximum number of times to show `loadingDone` to users
   * if set to -1, always show welcome;
   * if not 0, not show welcome
   * default: -1
   *
   */
  showWelcomeMax?: number

  /** [Optional] Should Tables NOT be presented within a Card/Tile UI? */
  lightweightTables?: boolean
}

export default FeatureFlags
