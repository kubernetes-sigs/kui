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

/* eslint-disable @typescript-eslint/camelcase */

import colors from 'colors/safe'
import { Arguments, encodeComponent } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import Group from '../../Group'
import Options from '../options'
import service from './PublicCloudService'

async function check(args: Arguments) {
  const res = await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud target --output=json' }))
  if (res.includes('No resource group targeted')) {
    throw new Error(res)
  } else {
    const { resource_group, region } = JSON.parse(res)
    if (!resource_group) {
      throw new Error('No active resource group ')
    } else {
      const resourceGroupMsg = resource_group
        ? `${colors.gray('resource-group=')}${colors.yellow(resource_group.name)}`
        : ''
      const regionMsg = region ? `${colors.gray('region=')}${colors.yellow(region.name)}` : ''
      return `${resourceGroupMsg} ${regionMsg}`
    }
  }
}

export default {
  service,
  group: Group.Authorization,

  label: (checkResult?: false | string) =>
    checkResult === undefined ? 'IBM Cloud Target' : checkResult === false ? colors.red('not selected') : checkResult,
  description: 'You will need to specify a resource group and region target within IBM Cloud',
  needsCloudLogin: true,
  onFail: 'ibmcloud target -r <region=us-south,eu-de>',
  fix: async ({ REPL, parsedOptions }: Arguments<Options>) => {
    await REPL.qexec(
      'ibmcloud target --fix' +
        (parsedOptions.region ? ` --region ${encodeComponent(parsedOptions.region)}` : '') +
        (parsedOptions['resource-group'] ? ` --resource-group ${encodeComponent(parsedOptions['resource-group'])}` : '')
    )
    return true
  },
  check
}
