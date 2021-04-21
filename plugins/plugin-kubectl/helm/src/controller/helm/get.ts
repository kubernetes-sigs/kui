/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, KResponse, Registrar, MultiModalResponse, NavResponse } from '@kui-shell/core'
import { doHelp, KubeOptions } from '@kui-shell/plugin-kubectl'

import isUsage from './usage'
import doExecWithStdout from './exec'
import apiVersion from './apiVersion'
import { HelmRelease } from '../../models/release'

// TODO: this needs to be updated to parse out helm v3 responses
async function doGet(
  args: Arguments<KubeOptions>
): Promise<string | MultiModalResponse<HelmRelease> | NavResponse | KResponse> {
  if (isUsage(args, 'get')) {
    return doHelp('helm', args)
  }

  const { argvNoOptions } = args

  const projIdx = argvNoOptions.indexOf('get') + 1
  const releaseIdx = argvNoOptions.length - 1
  const projection = projIdx < releaseIdx ? argvNoOptions[projIdx] : undefined
  const releaseName = argvNoOptions[releaseIdx]

  const basic = /REVISION:\s+(\S+)[\n\r]+RELEASED:\s+([^\n\r]+)[\n\r]+CHART:\s+(\S+)/
  const response = await doExecWithStdout(args)

  if (projection) {
    return response
  }

  const match = response.match(basic)
  if (!match) {
    // then this isn't of the form we expected; return the raw response
    return response
  }

  const revision = match[1]
  const creationTimestamp = match[2]

  const endOfBasicSection = Math.min(response.indexOf('USER-SUPPLIED VALUES'), response.indexOf('COMPUTED VALUES'))

  return {
    apiVersion,
    kind: 'HelmRelease',
    metadata: {
      name: releaseName,
      generation: revision,
      creationTimestamp
    },
    summary: {
      content: response.substring(0, endOfBasicSection).trim(),
      contentType: 'yaml'
    },
    isSimulacrum: true,
    originatingCommand: args,
    isKubeResource: true,
    kuiRawData: response,
    modes: []
  }
}

export default (registrar: Registrar) => {
  registrar.listen('/helm/get', doGet)
}
