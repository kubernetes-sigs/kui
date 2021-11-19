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

import { Arguments, Capabilities, ExecType, ParsedOptions, i18n } from '@kui-shell/core'

import readConfig from './config'
import { isGoodConfig } from './local'
import { setServiceInstanceName } from './bind'
import { setEndpointIfPossible } from './endpoint'
import Config, { hasEndpoint, hasServiceInstanceName } from '../model/Config'

const strings = i18n('plugin-s3', 'ibm')

interface Options extends ParsedOptions {
  output: 'name'
  'cos-instance': string
}

/** Avoid redundant lookups for one-and-done headless mode */
const headlessTasks: Record<string, Promise<string | Config>> = {}
function invalidate({ command }: Pick<Arguments, 'command'>) {
  return (headlessTasks[command] = undefined)
}

async function innerValidate(args: Arguments<Options>): Promise<string | Config> {
  const config = await readConfig(args)

  const instanceName = args.parsedOptions['cos-instance']
  const matchingNames = !instanceName || config.serviceInstanceName === instanceName

  if (isGoodConfig(config) && matchingNames) {
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
    const nonMatchingServiceNameError = strings('nonMatchingServiceNameError', instanceName, config.serviceInstanceName)

    if (noEndpoint && noCreds) {
      invalidate(args)
      throw new Error(`${noCredsMessage} ${noEndpointMessage}`)
    } else if (noEndpoint) {
      invalidate(args)
      throw new Error(noEndpointMessage)
    } else if (noCreds) {
      invalidate(args)
      throw new Error(noCredsMessage)
    } else {
      if (!hasServiceInstanceName(config) && !(await setServiceInstanceName(args, config))) {
        invalidate(args)
        throw new Error(noServiceInstanceNameError)
      } else if (!matchingNames) {
        invalidate(args)
        throw new Error(nonMatchingServiceNameError)
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
  if (Capabilities.isHeadless()) {
    if (!headlessTasks[args.command]) {
      headlessTasks[args.command] = innerValidate(args)
    }
    return headlessTasks[args.command]
  } else {
    return innerValidate(args)
  }
}
