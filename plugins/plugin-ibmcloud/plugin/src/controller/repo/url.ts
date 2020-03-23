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

import { Arguments, CodedError, i18n } from '@kui-shell/core'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * @return the repo URL for the given repo name
 *
 */
export default async function getRepoURL(args: Arguments, repoName: string): Promise<string> {
  const repos = await (await import('./raw')).default(args)
  const repo = repos.find(_ => _.Name === repoName)

  if (!repo) {
    const err: CodedError = new Error(strings('Repository not installed'))
    err.code = 404
    throw err
  } else {
    return repo.URL
  }
}
