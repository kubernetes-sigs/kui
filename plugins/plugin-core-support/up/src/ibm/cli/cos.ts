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

import { Arguments } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

async function check(args: Arguments) {
  try {
    await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud cos help' }))
    return true
  } catch (err) {
    return false
  }
}

const install = 'ibmcloud plugin install cloud-object-storage'

export default {
  label: 'CLI plugin: ibmcloud cloud-object-storage',
  fix: install,
  onFail: install,
  check
}
