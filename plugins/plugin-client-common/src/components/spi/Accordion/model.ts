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

import type { Tab } from '@kui-shell/core'

interface Props {
  className?: string
  isWidthConstrained?: boolean
  tab?: Tab

  /** The titles of the accordion entries */
  names: (string | React.ReactNode)[]

  /**
   * The content for the accordion entries. These are intentionally
   * delayed via the `() => ...`, to avoid rendering the content for
   * all accordion elements up front. See https://github.com/IBM/kui/issues/6582
   *
   */
  content: (() => React.ReactNode)[]
}

export default Props
