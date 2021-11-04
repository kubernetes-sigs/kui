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

export { default as Theme, ThemeProperties } from '../webapp/themes/Theme'
export { findByName as findThemeByName } from '../webapp/themes/find'
export { getDefault as getDefaultTheme } from '../webapp/themes/default'
export {
  switchTo as switchToTheme,
  getPersistedThemeChoice,
  resetToDefault as resetToDefaultTheme
} from '../webapp/themes/persistence'
