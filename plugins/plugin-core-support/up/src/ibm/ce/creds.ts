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

import Group from '../../Group'
import Options from '../options'
import service from './CodeEngineService'

/** This is only needed because CodeEngine CLI does not currently auto-refresh tokens */

function check(args: Arguments): Promise<string | boolean> {
  return args.REPL.qexec('ibmcloud ce job list')
    .then(() => 'your token is valid')
    .catch(() => {
      throw new Error('Refresh tokens have expired')
    })
}

async function fix(args: Arguments<Options>) {
  const useThisProject =
    process.env['CE_PROJECT'] ||
    args.parsedOptions['code-engine-project'] ||
    (await args.REPL.qexec<string>('ibmcloud ce project current-name'))

  if (useThisProject) {
    await args.REPL.qexec(`ibmcloud ce project select -n "${useThisProject}"`)
  } else {
    throw new Error('No CodeEngine project found')
  }

  return check(args)
}

export default {
  group: Group.Authorization,
  service,

  label: (checkResult?: false | string) =>
    checkResult === undefined
      ? 'Valid Auth Token'
      : !checkResult
      ? colors.red('not selected')
      : colors.yellow(checkResult),
  description: 'To schedule jobs against IBM CodeEngine, you will need valid and non-expired credentials',
  needsCloudLogin: true,
  onFail: 'ibmcloud ce project create --name <projectname=superproject>',
  fix,
  check
}
