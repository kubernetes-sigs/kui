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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import * as Debug from 'debug'
import * as needle from 'needle'
import * as parseDuration from 'parse-duration'

import { REPL, UI } from '@kui-shell/core'

const debug = Debug('k8s/clients/kiali')

export interface KialiOptions {
  local: boolean
  kialiNamespace: string
  duration: string
  pi: string
  graphType: string
  layout: string
  injectServiceNodes: boolean
  groupBy: string
  appenders: string
  namespaces?: string
  namespace?: string
}

class DefaultOptions implements KialiOptions {
  local = false

  kialiNamespace = 'istio-system'

  duration = '10m'

  pi = '15000'

  graphType = 'versionedApp'

  layout = 'dagre'

  injectServiceNodes = true

  groupBy = 'app'

  appenders = 'deadNode,sidecarsCheck,serviceEntry,istio'

  namespaces = 'default'

  namespace = 'default'
}

export class Namespace extends DefaultOptions {
  constructor(namespace: string) {
    super()
    this.namespace = namespace
  }
}

/**
 * Thin veneer on needle
 *
 */
const fetch = (method: 'get') => (url: string) => {
  return needle(method, url, {
    json: true,
    username: 'kiali',
    password: 'kiali',
    rejectUnauthorized: false
  }).then(_ => _.body)
}
const get = fetch('get')

/**
 * Determine the API endpoint for the Kiali installation.
 *
 */
let cachedApihost: string
const apihost = async (options: KialiOptions = new DefaultOptions()) => {
  if (options.local) {
    return `http://localhost:3000`
  }

  if (cachedApihost) {
    return cachedApihost
  }

  const { kialiNamespace } = options

  const [svc, ingress] = await Promise.all([
    REPL.rexec(`kubectl get svc kiali -n "${kialiNamespace}" -o json`),
    REPL.rexec(`kubectl get ingress kiali -n "${kialiNamespace}" -o json`)
  ])
  debug('svc', svc)
  debug('ingress', ingress)

  if (svc.spec.type === 'NodePort') {
    const port = svc.spec.ports[0].nodePort

    if (ingress.status.loadBalancer) {
      if (ingress.status.loadBalancer.ingress.length > 0) {
        // [0]??
        const { ip } = ingress.status.loadBalancer.ingress[0]
        cachedApihost = `https://${ip}:${port}`

        return cachedApihost
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
export const consoleView = async (options: KialiOptions = new DefaultOptions()) => {
  return `${await apihost(options)}/kiali/console`
}

const _modes = [
  { mode: 'apps', command: () => 'kiali get apps' },
  { mode: 'graph', command: () => 'kiali graph --local' }
]
export const modes = (defaultMode: string) =>
  _modes.map(_ => Object.assign({}, _, { defaultMode: _.mode === defaultMode }))

/**
 * @return the endpoint of the Kiali graph view
 * e.g. graph/namespaces/?edges=noEdgeLabels&graphType=versionedApp&namespaces=default&injectServiceNodes=true&duration=60&pi=15000&layout=dagre
 *
 */
export const graphView = async (_options: KialiOptions = new DefaultOptions()) => {
  const options = Object.assign({}, new DefaultOptions(), _options)

  // the graph view seems to accept duration in units of seconds, weird. the graph model API accepts prometheus strings etc.
  const MILLIS_PER_SECOND = 1000

  const endpoint = `${await apihost(options)}/console/graph/namespaces/?edges=noEdgeLabels&graphType=${
    options.graphType
  }&namespaces=${options.namespace}&injectServiceNodes=true&duration=${parseDuration(options.duration) /
    MILLIS_PER_SECOND}&pi=${parseDuration(options.pi)}&layout=${options.layout}`
  debug('graphView endpoint', endpoint)

  const content = document.createElement('webview')
  content.src = endpoint

  /* content.addEventListener('did-stop-loading', function () {
    content.openDevTools()
  }) */

  content.addEventListener('did-finish-load', function() {
    content.insertCSS(`
body { padding: 0 !important; background: #242924 !important; font-size: 16px !important; }
#root, .container-pf-nav-pf-vertical, .container-fluid { height: 100% !important; }
.ferfxaq { height: 100% !important; }
.nav-pf-vertical, .navbar-pf-vertical, .breadcrumbs-pf-title { display: none; }
.pficon-ok:before { color: #29a329 !important; }
.label-pair .label-key { background-color: #1999b3 !important; color: hsl(120, 13%, 80%) !important; }
.label-pair .label-value { background-color: hsl(228, 90%, 68%) !important; color: hsl(120, 13%, 80%) !important; }
.container-pf-nav-pf-vertical > div:first-child { display: none; }
.toolbar-pf { display: none !important; }
.blank-slate-pf { background: transparent !important; border-color: transparent !important; color: hsl(120, 13%, 80%) !important; }
.btn-primary { background: hsl(228, 90%, 68%) !important; border: hsl(228, 90%, 68%) !important; }
.btn-default { background: hsl(120, 13%, 80%) !important; border: hsl(228, 90%, 68%) !important; color: #131513 !important; }
.panel-heading { background: hsl(120, 9%, 20%) !important; color: hsl(120, 13%, 80%) !important; border: #809980 !important; }
.panel { background: hsl(120, 8%, 30%) !important; color: hsl(120, 13%, 80%) !important; border-color: #809980 !important; }
.card-pf { background-color: hsl(120, 13%, 80%) !important; box-shadow-color: #809980 !important; color: #131513 !important; }
.f1ad7fht, .f1dwpjwl { background: #f4fbf4 !important; border-color: #809980 !important; } /* Legend, Hide */
a { color: hsl(228, 90%, 68%) !important; }
.container-pf-nav-pf-vertical { margin: 0 !important; }
.navbar-pf-vertical, .about-modal-pf, .login-pf body, .login-pf .login-pf, .nav-pf-vertical, .nav-pf-vertical .list-group-item.active>a, .nav-pf-vertical .list-group-item:hover>a { background-color: #242924 !important; }
hr { border-top-color: #809980 !important; }
`)
  })

  return {
    type: 'custom',
    isEntity: true,
    prettyType: 'kiali',
    name: 'Graph View',
    packageName: options.namespace,
    presentation: UI.Presentation.FixedSize,
    modes: modes('graph'),
    content
  }
}

/**
 * Fetch the Kiali graph model
 *
 * @param namespace application namespace
 *
 */
/* export const graphModel = async (options: IKialiOptions = new DefaultOptions()) => {
  // e.g. https://10.10.10.10:9080/kiali/api/namespaces/graph?duration=60s&graphType=versionedApp&injectServiceNodes=true&groupBy=app&appenders=deadNode,sidecarsCheck,serviceEntry,istio&namespaces=default

  const url = `${apihost(options)}/kiali/api/namespaces/graph?duration=${options.duration}&graphType=${options.graphType}&injectServiceNodes=${options.injectServiceNodes}&groupBy=${options.groupBy}&appenders=${options.appenders}&namespaces=${options.namespaces}`

  return needle('get', url, { json: true, username: 'kiali', password: 'kiali' })
} */

interface Application {
  name: string
  istioSidecar: boolean
}
interface ApplicationList {
  namespace: {
    name: string
  }
  applications: Application[]
}

/**
 * Applications model
 *
 */
export const appList = async (options: KialiOptions = new DefaultOptions()): Promise<ApplicationList> => {
  const url = `${await apihost(options)}/kiali/api/namespaces/${options.namespace}/apps`
  return get(url)
}

interface WorkplaceStatus {
  name: string // e.g. "details-v1"
  replicas: number
  available: number
}

interface ApplicationHealth {
  workloadStatuses: WorkplaceStatus[]
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
export const appHealth = async (
  app: string,
  options: KialiOptions = new DefaultOptions(),
  rateInterval = '10m'
): Promise<ApplicationHealth> => {
  const url = `${await apihost(options)}/kiali/api/namespaces/${
    options.namespace
  }/apps/${app}/health?rateInterval=${rateInterval}`
  return get(url)
}
