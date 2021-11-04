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

import InputProps from './props/Input'
import SessionProps from './props/Session'
import BrandingProps from './props/Branding'
import FeatureFlags from './props/FeatureFlags'
import { Themes } from '@kui-shell/core'

type TestingFlags = {
  _for_testing_: number
}

type KuiConfiguration = Partial<Themes.ThemeProperties> &
  Partial<InputProps> &
  Partial<SessionProps> &
  Partial<BrandingProps> &
  Partial<FeatureFlags> &
  Partial<TestingFlags>

export default KuiConfiguration
