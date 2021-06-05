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

import { Arguments, ExecType, ParsedOptions, i18n, isHeadless } from '@kui-shell/core'

import readConfig from './config'
import { isGoodConfig } from './local'
import { setServiceInstanceName } from './bind'
import { setEndpointIfPossible } from './endpoint'
import Config, { hasEndpoint, hasServiceInstanceName } from '../model/Config'

const strings = i18n('plugin-ibmcloud', 'cos')

interface Options extends ParsedOptions {
  output: 'name'
}

/** Avoid redundant lookups for one-and-done headless mode */
const headlessTasks: Record<string, Promise<string | Config>> = {}

async function innerValidate(args: Arguments<Options>): Promise<string | Config> {
  const config = await readConfig(args)

  if (isGoodConfig(config)) {
    if (args.execOptions.type !== ExecType.Nested) {
      return strings('validCreds')
    } else if (args.parsedOptions.output === 'name') {
      return config.serviceInstanceName
    } else {
      return config
    }
  } else {
    let noEndpoint = !hasEndpoint(config)
    if (!hasEndpoint(config)) {
      noEndpoint = !(await setEndpointIfPossible(args))
    }

    const noCreds = !config.HMACProvided || !config.AccessKeyID || !config.SecretAccessKey

    const noCredsMessage = strings('noCreds')
    const noEndpointMessage = strings('noEndpoint')
    const noServiceInstanceNameError = strings('noServiceInstanceName')

    if (noEndpoint && noCreds) {
      throw new Error(`${noCredsMessage} ${noEndpointMessage}`)
    } else if (noEndpoint) {
      throw new Error(noEndpointMessage)
    } else if (noCreds) {
      throw new Error(noCredsMessage)
    } else {
      if (!hasServiceInstanceName(config) && !(await setServiceInstanceName(args, config))) {
        throw new Error(noServiceInstanceNameError)
      }

      if (args.parsedOptions.output === 'name') {
        return config.serviceInstanceName
      } else {
        return strings('validCreds')
      }
    }
  }
}

export default function doValidateCosConfig(args: Arguments<Options>): Promise<string | Config> {
  if (isHeadless()) {
    if (!headlessTasks[args.command]) {
      headlessTasks[args.command] = innerValidate(args)
    }
    return headlessTasks[args.command]
  } else {
    return innerValidate(args)
  }
}
