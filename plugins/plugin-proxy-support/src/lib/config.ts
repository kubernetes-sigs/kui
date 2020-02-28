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

export interface ActualProxyServerConfig {
  url: string
  // needleOptions?: needle.NeedleOptions
}

export interface DisabledProxyServerConfig {
  enabled: boolean
}

export type ProxyServerConfig = DisabledProxyServerConfig | ActualProxyServerConfig

export function isDisabled(_config: ProxyServerConfig): _config is DisabledProxyServerConfig {
  const config = _config as DisabledProxyServerConfig
  return config && config.enabled === false
}

export function defaultConfig(): { proxyServer: ProxyServerConfig } {
  return {
    proxyServer: {
      enabled: false
    }
  }
}

export function config(): Promise<{ proxyServer: ProxyServerConfig }> {
  return import('@kui-shell/client/config.d/proxy.json').catch(() => {
    console.log('using default proxy configuration')
    return defaultConfig()
  })
}
