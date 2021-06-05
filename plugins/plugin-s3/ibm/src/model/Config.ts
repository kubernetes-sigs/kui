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

/** Properties of the config.json in the plugin directory */
interface Config {
  endpointForKui: string
  serviceInstanceName: string
  HMACProvided: boolean
  AccessKeyID: string
  SecretAccessKey: string
  'Default Region': string
}

export function hasDefaultRegion(config: void | Record<string, any>): config is Pick<Config, 'Default Region'> {
  return config && typeof (config as Config)['Default Region'] === 'string'
}

export function hasEndpoint(config: void | Record<string, any>): config is Pick<Config, 'endpointForKui'> {
  return config && typeof (config as Config).endpointForKui === 'string'
}

export function hasServiceInstanceName(
  config: void | Record<string, any>
): config is Pick<Config, 'serviceInstanceName'> {
  return config && typeof (config as Config).serviceInstanceName === 'string'
}

export function isGoodConfigIgnoringEndpoint(config: void | Record<string, any>): config is Config {
  const conf = config as Config
  return (
    config &&
    typeof conf.AccessKeyID === 'string' &&
    typeof conf.SecretAccessKey === 'string' &&
    config.HMACProvided &&
    hasServiceInstanceName(config)
  )
}

export function isOnlyMissingEndpoint(config: void | Record<string, any>): config is Omit<Config, 'endpointForKui'> {
  return isGoodConfigIgnoringEndpoint(config) && !hasEndpoint(config)
}

export default Config
