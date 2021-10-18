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

import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import Group from '../../Group'
import service from '../base/PublicCloudService'

async function check(args: Arguments) {
  try {
    const version = await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud version' }))

    // ibmcloud version 1.6.0+59b6322-2021-05-26T20:35:50+00:00
    // -> v1.6.0
    return version
      .trim()
      .replace(/^ibmcloud version /, 'v')
      .replace(/\+.*$/, '')
  } catch (err) {
    return false
  }
}

export default {
  service,
  group: Group.CLI,

  label: (checkResult?: false | string) =>
    checkResult === undefined ? 'IBM Cloud CLI' : !checkResult ? 'not installed' : colors.gray(checkResult),
  description: 'The ibmcloud CLI allows access to your IBM Cloud resources',
  check,
  fix:
    process.platform === 'linux'
      ? 'curl -fsSL https://clis.cloud.ibm.com/install/linux | sh'
      : process.platform === 'darwin'
      ? 'curl -fsSL https://clis.cloud.ibm.com/install/osx | sh'
      : "iex(New-Object Net.WebClient).DownloadString('https://clis.cloud.ibm.com/install/powershell')"
}
