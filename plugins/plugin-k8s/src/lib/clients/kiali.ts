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

import * as Debug from 'debug'
const debug = Debug('k8s/clients/kiali')

import * as needle from 'needle'

import { rexec as $, encodeComponent } from '@kui-shell/core/core/repl'

interface IOptions {
  kialiNamespace: string
  duration: string
  graphType: string
  injectServiceNodes: boolean
  groupBy: string
  appenders: string
  namespaces?: string
  namespace?: string
}

class DefaultOptions implements IOptions {
  kialiNamespace = 'istio-system'
  duration = '10m'
  graphType = 'versionedApp'
  injectServiceNodes = true
  groupBy = 'app'
  appenders = 'deadNode,sidecarsCheck,serviceEntry,istio'
  namespaces = 'default'
  namespace = 'default'
}

export class Namespace extends DefaultOptions {
  constructor (namespace: string) {
    super()
    this.namespace = namespace
  }
}

/**
 * Thin veneer on needle
 *
 */
const fetch = (method: string) => (url: string) => {
  return needle(method, url, { json: true, username: 'kiali', password: 'kiali', rejectUnauthorized: false })
    .then(_ => _.body)
}
const get = fetch('get')

/**
 * Determine the API endpoint for the Kiali installation.
 *
 */
let cachedApihost: string
const apihost = async (kialiNamespace: string) => {
  if (cachedApihost) {
    return cachedApihost
  }

  const [ svc, ingress ] = await Promise.all([
    $(`kubectl get svc kiali -n "${kialiNamespace}" -o json`),
    $(`kubectl get ingress kiali -n "${kialiNamespace}" -o json`)
  ])
  debug('svc', svc)
  debug('ingress', ingress)

  if (svc.spec.type === 'NodePort') {
    const port = svc.spec.ports[0].nodePort

    if (ingress.status.loadBalancer) {
      if (ingress.status.loadBalancer.ingress.length > 0) {
        // [0]??
        const { ip } = ingress.status.loadBalancer.ingress[0]
        return cachedApihost = `https://${ip}:${port}`
      } else {
        throw new Error(`kiali ingress has no exposed IPs`)
      }
    } else {
      throw new Error(`kiali ingress type not yet handled ${Object.keys(ingress.status)[0]}`)
    }
  } else {
    throw new Error(`kiali service type not yet handled ${svc.spec.type}`)
  }
}

/**
 * @return the endpoint of the Kiali console
 *
 */
export const kialiConsole = async (options: IOptions = new DefaultOptions()) => {
  return `${await apihost(options.kialiNamespace)}/kiali/console`
}

/**
 * Fetch the Kiali graph model
 *
 * @param namespace application namespace
 *
 */
export const graph = async (options: IOptions = new DefaultOptions()) => {
  // e.g. https://10.10.10.10:9080/kiali/api/namespaces/graph?duration=60s&graphType=versionedApp&injectServiceNodes=true&groupBy=app&appenders=deadNode,sidecarsCheck,serviceEntry,istio&namespaces=default

  const url = `${apihost(options.kialiNamespace)}/kiali/api/namespaces/graph?duration=${options.duration}&graphType=${options.graphType}&injectServiceNodes=${options.injectServiceNodes}&groupBy=${options.groupBy}&appenders=${options.appenders}&namespaces=${options.namespaces}`

  return needle('get', url, { json: true, username: 'kiali', password: 'kiali' })
}

interface IApplication {
  name: string
  istioSidecar: boolean
}
interface IApplicationList {
  namespace: {
    name: string
  }
  applications: Array<IApplication>
}

/**
 * Applications model
 *
 */
export const appList = async (options: IOptions = new DefaultOptions()): Promise<IApplicationList> => {
  const url = `${await apihost(options.kialiNamespace)}/kiali/api/namespaces/${options.namespace}/apps`
  return get(url)
}

interface IWorkplaceStatus {
  name: string // e.g. "details-v1"
  replicas: number
  available: number
}

interface IApplicationHealth {
  workloadStatuses: Array<IWorkplaceStatus>
  requests: {
    errorRatio: number
    inboundErrorRatio: number
    outboundErrorRatio: number
  }
}

/**
 * Application health model
 *
 */
export const appHealth = async (app: string, options: IOptions = new DefaultOptions(), rateInterval = '10m'): Promise<IApplicationHealth> => {
  const url = `${await apihost(options.kialiNamespace)}/kiali/api/namespaces/${options.namespace}/apps/${app}/health?rateInterval=${rateInterval}`
  return get(url)
}
