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

import { Tab } from '@kui-shell/core'
import { fetchFileString } from '@kui-shell/plugin-kubectl'
import { AvailablePluginRaw } from '../models/plugin'

/** hmm, the config.json for installed plugins does not seem to
 * reference the owning plugin repository!? */
const defaultURL = 'https://plugins.cloud.ibm.com'

/**
 * @return a model of available plugins
 *
 */
export default async function getAvailablePlugins(
  tab: Tab,
  url = defaultURL
): Promise<{ plugins: AvailablePluginRaw[] }> {
  return JSON.parse((await fetchFileString(tab, `${url}/plugins`))[0])
}

/**
 * @return a model of available plugins, or an empty model if the repository cannot be reached
 *
 */
export async function getAvailablePluginsSafe(tab: Tab, url = defaultURL): Promise<{ plugins: AvailablePluginRaw[] }> {
  try {
    return await getAvailablePlugins(tab, url)
  } catch (err) {
    console.error(err)
    return { plugins: [] }
  }
}
