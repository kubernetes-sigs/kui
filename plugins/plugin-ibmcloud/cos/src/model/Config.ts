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

/** Properties of the config.json in the plugin directory */
interface Config {
  endpointForKui: string
  HMACProvided: boolean
  AccessKeyID: string
  SecretAccessKey: string
}

export function hasEndpoint(config: void | Record<string, any>): config is Pick<Config, 'endpointForKui'> {
  return typeof (config as Config).endpointForKui === 'string'
}

export function isOnlyMissingEndpoint(config: void | Record<string, any>): config is Omit<Config, 'endpointForKui'> {
  const conf = config as Config
  return (
    config && typeof conf.AccessKeyID === 'string' && typeof conf.SecretAccessKey === 'string' && !hasEndpoint(config)
  )
}

export default Config
