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

import { Arguments } from '@kui-shell/core'
import { KubeOptions, getAsMMRTransformer as viewTransformer } from '@kui-shell/plugin-kubectl'

import getConfig from '../config'

interface CodeEngineOptionsWithName extends KubeOptions {
  name: string
}

export const registration = {
  viewTransformer
}

export default async function(this: string, args: Arguments<CodeEngineOptionsWithName>) {
  const name = args.parsedOptions.name
  if (!name) {
    throw new Error('Required flag "name" not set')
  }

  const { currentConfigFile } = await getConfig(args)

  return args.REPL.qexec(`${this} ${name} -o yaml --kubeconfig "${currentConfigFile}"`)
}
