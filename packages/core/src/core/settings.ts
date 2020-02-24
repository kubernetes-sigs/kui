/*
 * Copyright 2018 IBM Corporation
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

import { ThemeSet } from '../webapp/themes/Theme'

export { clearPreference, getPreference, setPreference, userDataDir } from './userdata'

export async function uiThemes(): Promise<ThemeSet[]> {
  // it is ipmortant to delay the loading here. otherwise,
  // plugins/plugins will load command-tree, which will load
  // context.ts, which will establish the context prior to settings --
  // dependence cycle
  const { prescanModel } = await import('../plugins/plugins')

  // the filter part is there only to be overly defensive
  return prescanModel().themeSets.filter(_ => _)
}
