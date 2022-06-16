/*
 * Copyright 2021 The Kubernetes Authors
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

import { NewSplitRequest } from '@kui-shell/core'

type SplitPosition = Required<Required<NewSplitRequest>['options']>['position']

export default SplitPosition

export interface SplitPositionProps {
  /** Are we to display one of the splits as a left strip? */
  hasLeftStrip: boolean

  /** Are we to display one of the splits as a right strip? */
  hasRightStrip: boolean
}
