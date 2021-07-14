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
  group: Group.CLI,
  label: (checkResult?: false | string) =>
    checkResult === undefined ? 'ibmcloud' : !checkResult ? 'not installed' : colors.gray(checkResult),
  check,
  fix:
    process.platform === 'linux'
      ? 'curl -L https://clis.ng.bluemix.net/install/linux | bash - '
      : process.platform === 'darwin'
      ? 'curl -L https://clis.ng.bluemix.net/install/osx | bash - '
      : 'curl -L https://clis.ng.bluemix.net/install/powershell | bash - '
}
