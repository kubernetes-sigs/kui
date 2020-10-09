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

import readConfig from './config'
import { isGoodConfig } from './local'

export default async function(args: Arguments) {
  const config = await readConfig(args)

  if (isGoodConfig(config)) {
    if (args.execOptions.type === ExecType.TopLevel) {
      return 'Your connection to IBM Cloud Object Storage looks good'
    } else {
      return config
    }
  } else if (!config.endpointForKui) {
    throw new Error('Please set your IBM Cloud Object Storage endpoint via `ibmcloud cos endpoint`')
  } else if (!config.HMACProvided || !config.AccessKeyID || !config.SecretAccessKey) {
    throw new Error('An HMAC key is needed. Please try `ibmcloud cos bind`')
  } else {
    const message = 'Invalid IBM Cloud Object Storage configuration detected'
    console.error(message, config)
    throw new Error(message)
  }
}
