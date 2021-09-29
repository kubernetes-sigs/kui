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

// import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import Group from '../Group'
import service from './KubectlService'

async function check(args: Arguments) {
  try {
    const { clientVersion } = JSON.parse(
      await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'kubectl version --client=true -o json' }))
    )
    return clientVersion.gitVersion
  } catch (err) {
    return false
  }
}

export default {
  service,
  group: Group.CLI,
  label: 'kubectl',
  // (checkResult?: false | string) =>
  //    checkResult === undefined ? 'Installed' : !checkResult ? 'not installed' : colors.gray(checkResult),
  description: 'The kubectl CLI allows access to your Kubernetes clusters',
  check,
  fix:
    process.platform === 'linux'
      ? 'curl -LO "https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl" && chmod a+rx kubectl && sudo cp kubectl /usr/local/bin/kubectl'
      : process.platform === 'darwin'
      ? 'curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl" && chmod a+rx kubectl && sudo cp kubectl /usr/local/bin/kubectl'
      : 'curl -LO https://dl.k8s.io/release/v1.21.0/bin/windows/amd64/kubectl.exe'
}
