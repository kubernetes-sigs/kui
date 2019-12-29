/*
 * Copyright 2019 IBM Corporation
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

import Theme from './Theme'
import { flatten } from '../../core/utility'
import { uiThemes } from '../../core/settings'

/**
 * @return the Theme model associated with the given theme name
 *
 */
export function findByName(name: string): { theme: Theme; plugin: string } {
  const flat = flatten(uiThemes().map(({ plugin, themes }) => themes.map(theme => ({ plugin, theme }))))

  return flat.find(_ => _.theme.name === name)
}

export default findByName
