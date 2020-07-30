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

import { REPL } from '@kui-shell/core'

interface CodeEngineConfig {
  /** KUBECONFIG file */
  currentConfigFile: string

  latest_announcements: string
  nameSpaceID: string
  projectID: string
  projectName: string
  region: string
  servingAPI: string
}

export default async function getConfig({ REPL: repl }: { REPL: REPL }): Promise<CodeEngineConfig> {
  try {
    return JSON.parse(
      (await repl.rexec<{ data: string }>(`fstat ~/.bluemix/plugins/code-engine/config.json --with-data`)).content.data
    )
  } catch (err) {
    console.error('Error fetching CodeEngine config', err)
    throw err
  }
}
