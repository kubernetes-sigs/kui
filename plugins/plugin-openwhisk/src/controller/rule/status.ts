/*
 * Copyright 2019 IBM Corporation
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

import { Arguments, Registrar } from '@kui-shell/core'

import { fqn } from '../fqn'
import { synonyms } from '../../models/synonyms'
import { clientOptions, getClient } from '../../client/get'
import { deployedRule, withStandardOptions } from '../usage'
import { currentSelection } from '../../models/selection'

const disableUsage = withStandardOptions({
  command: 'disable',
  strict: 'disable',
  docs: 'disable a given rule',
  example: 'wsk rule disable <rule>',
  required: deployedRule
})

const enableUsage = withStandardOptions({
  command: 'enable',
  strict: 'enable',
  docs: 'enable a given rule',
  example: 'wsk rule enable <rule>',
  required: deployedRule
})

const statusUsage = withStandardOptions({
  command: 'status',
  strict: 'status',
  docs: 'get the status (enabled or disabled) of given rule',
  example: 'wsk rule status <rule>',
  required: deployedRule
})

async function doStatus({ tab, argvNoOptions, execOptions }: Arguments) {
  const name = argvNoOptions[argvNoOptions.indexOf('status') + 1] || fqn(currentSelection(tab))

  return (
    await getClient(execOptions).rules.get(
      Object.assign(
        {
          name
        },
        clientOptions
      )
    )
  ).status
}

async function doEnable({ tab, argvNoOptions, execOptions, REPL }: Arguments) {
  const name = argvNoOptions[argvNoOptions.indexOf('enable') + 1] || fqn(currentSelection(tab))

  await getClient(execOptions).rules.enable(
    Object.assign(
      {
        name
      },
      clientOptions
    )
  )

  return REPL.qexec(`wsk rule get "${name}"`)
}

async function doDisable({ tab, argvNoOptions, execOptions, REPL }: Arguments) {
  const name = argvNoOptions[argvNoOptions.indexOf('disable') + 1] || fqn(currentSelection(tab))

  await getClient(execOptions).rules.disable(
    Object.assign(
      {
        name
      },
      clientOptions
    )
  )

  return REPL.qexec(`wsk rule get "${name}"`)
}

export default (registrar: Registrar) => {
  synonyms('rules').forEach(syn => {
    registrar.listen(`/wsk/${syn}/status`, doStatus, statusUsage)
    registrar.listen(`/wsk/${syn}/enable`, doEnable, enableUsage)
    registrar.listen(`/wsk/${syn}/disable`, doDisable, disableUsage)
  })
}
