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

import { Arguments, encodeComponent } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import Group from '../../Group'
import Options from '../options'
import service from './PublicCloudService'

async function check(args: Arguments) {
  await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud account show' }))
  return true
}

export default {
  service,
  group: Group.CloudAuthorization,

  label: 'IBM Cloud Login',
  description: 'You will need a valid token to access the IBM Cloud',
  needsCloudLogin: true,
  onFail: 'ibmcloud login',
  fix: async ({ REPL, parsedOptions }: Arguments<Options>, onInit: Arguments['execOptions']['onInit']) => {
    const sso = parsedOptions.sso ? `--sso` : ''
    const apikey = parsedOptions.apikey ? `--apikey=${parsedOptions.apikey}` : ''

    const env = { IBMCLOUD_VERSION_CHECK: 'false' }
    const opts: Arguments['execOptions'] = { onInit, env, pipeStdin: true }

    if (process.env.TRAVIS_JOB_ID || !process.stdout.isTTY) {
      // when testing on traivs, force login without prompting for a region since we will test region targeting in target --fix
      await REPL.qexec(`ibmcloud login ${sso || apikey} --no-region`, undefined, undefined, opts)
    } else {
      await REPL.qexec(
        `ibmcloud login ${sso || apikey}` +
          (parsedOptions.region ? ` -r ${encodeComponent(parsedOptions.region)}` : '') +
          (parsedOptions['resource-group'] ? ` -g ${encodeComponent(parsedOptions['resource-group'])}` : ''),
        undefined,
        undefined,
        opts
      )
    }
    return true
  },
  check
}
