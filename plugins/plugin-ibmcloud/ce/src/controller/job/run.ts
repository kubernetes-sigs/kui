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

import { Arguments, ExecType } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'
import { KubeOptions, getTransformer as viewTransformer } from '@kui-shell/plugin-kubectl'

import ListJob from './list'
import doList from '../generic/list'

type RunOptions = KubeOptions

export const registration = {
  viewTransformer
}

const listJob = doList.bind(ListJob)

function exec(args: Arguments<KubeOptions>) {
  args.execOptions.env = { IBMCLOUD_COLOR: 'false' }
  return doExecWithStdoutViaPty(args)
}

async function runOne(args: Arguments<RunOptions>) {
  const response = await exec(args)

  const name = response.match(/Successfully created job '(.*)'/)
  if (!name || !name[1]) {
    return response
  } else if (args.execOptions.type === ExecType.Nested) {
    return name[1]
  } else {
    return listJob(args, { names: [name[1]], watch: true }).catch(err => {
      console.error('error in list-after-run', err)
      return response
    })
  }
}

export default async function(args: Arguments<RunOptions>) {
  return runOne(args)
}
