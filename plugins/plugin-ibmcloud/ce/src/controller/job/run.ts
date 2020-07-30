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

import { Arguments, KResponse } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'
import { KubeOptions, getTransformer as viewTransformer } from '@kui-shell/plugin-kubectl'

import ListJob from './list'
import doList from '../generic/list'

interface RunOptions extends KubeOptions {
  bulk: number
}

export const registration = {
  viewTransformer
}

const listJob = doList.bind(ListJob)

function exec(args: Arguments<KubeOptions>) {
  return doExecWithStdoutViaPty(args)
}

async function runOne(args: Arguments<KubeOptions>) {
  const response = await exec(args)

  const name = response.match(/Successfully created job '(.*)'/)
  if (!name || !name[1]) {
    return response
  } else {
    return listJob(args, { extraArgs: [name[1]], watch: true }).catch(err => {
      console.error('error in list-after-run', err)
      return response
    })
  }
}

function safely(response: Promise<KResponse>) {
  return response
    .then(() => true)
    .catch(err => {
      console.error('error in job', err)
      return false
    })
}

export default async function(args: Arguments<RunOptions>) {
  if (args.parsedOptions.bulk) {
    args.command = args.command.replace(`--bulk ${args.parsedOptions.bulk}`, '')
    const successBits = await Promise.all(
      Array(args.parsedOptions.bulk)
        .fill(0)
        .map(() => safely(exec(args)))
    )
    const nFail = successBits.reduce((nFail, bit) => (nFail += bit ? 0 : 1), 0)
    return `Spawned ${args.parsedOptions.bulk} jobs with ${nFail} abnormal terminations`
  } else {
    return runOne(args)
  }
}
