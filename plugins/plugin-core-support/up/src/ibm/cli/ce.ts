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
import service from '../ce/CodeEngineService'

async function check(args: Arguments) {
  try {
    const { Version } = JSON.parse(
      await doExecWithStdoutViaPty(
        Object.assign({}, args, { command: 'ibmcloud plugin show code-engine --output json' })
      )
    )

    const version = `v${Version.Major}.${Version.Minor}.${Version.Build}`
    if (Version.Major < 1 || Version.Minor < 6) {
      return {
        ok: false,
        message: `Your IBM Cloud CodeEngine CLI plugin is too old. Got ${version}. Expected >= 1.6.0`
      }
    } else {
      return version
    }
  } catch (err) {
    return false
  }
}

const install = 'ibmcloud plugin install code-engine'

export default {
  service,
  group: Group.CLIPlugin,

  label: (checkResult?: false | string) =>
    checkResult === undefined ? 'Installed CLI plugin' : !checkResult ? 'not installed' : colors.gray(checkResult),
  description: 'The CodeEngine plugin to the ibmcloud CLI allows access to a multi-tenant Kubernetes cluster',
  fix: install,
  onFail: install,
  check
}
