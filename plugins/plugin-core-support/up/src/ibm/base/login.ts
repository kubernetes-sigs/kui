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

import Options from '../options'

async function check(args: Arguments) {
  try {
    await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud account show' }))
    return true
  } catch (err) {
    return false
  }
}

export default {
  label: 'CLI: ibmcloud login',
  needsCloudLogin: true,
  onFail: 'ibmcloud login',
  fix: async ({ REPL, parsedOptions }: Arguments<Options>) => {
    const sso = parsedOptions.sso ? `--sso` : ''
    const apikey = parsedOptions.apikey ? `--apikey=${parsedOptions.apikey}` : ''

    if (process.env.TRAVIS_JOB_ID || !process.stdout.isTTY) {
      // when testing on traivs, force login without prompting for a region since we will test region targeting in target --fix
      await REPL.qexec(`ibmcloud login ${sso || apikey} --no-region`)
    } else {
      await REPL.qexec(
        `ibmcloud login ${sso || apikey}` +
          (parsedOptions.region ? ` -r ${encodeComponent(parsedOptions.region)}` : '') +
          (parsedOptions['resource-group'] ? ` -g ${encodeComponent(parsedOptions['resource-group'])}` : '')
      )
    }
    return true
  },
  check
}
