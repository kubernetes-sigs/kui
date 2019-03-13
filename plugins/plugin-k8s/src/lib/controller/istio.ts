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
const debug = Debug('k8s/controller/istio')

import { join } from 'path'
import { exec } from 'child_process'

import { rexec as $, qexec as $$ } from '@kui-shell/core/core/repl'

/**
 * Squash and log errors; this is useful when deleting a collection of
 * resources asynchronously
 *
 */
const squash = (err: Error) => {
  console.error(err)
}

/**
 * Install istio
 *
 */
const installIstio = async ({ parsedOptions }) => {
  const tmp = '/tmp' // FIXME
  const platform = process.platform === 'darwin' ? 'osx' : process.platform === 'win32' ? 'win' : 'linux'
  const version = parsedOptions.version || '1.0.6'

  const installDir = join(tmp, `istio-${version}`)
  const { remove: rm } = await import('fs-extra') // dynamic load for webpack
  await rm(installDir)

  debug('downloading release', version)
  await new Promise((resolve, reject) => {
    exec(`curl -L https://github.com/istio/istio/releases/download/${version}/istio-${version}-${platform}.tar.gz | tar zxf -`, { cwd: tmp }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        debug(stdout)
        resolve()
      }
    })
  })

  /* debug('installing crds')
  try {
    const crds = join(installDir, 'install/kubernetes/helm/istio/templates/crds.yaml')
    await $(`kubectl apply -f ${crds}`)
  } catch (err) {
    debug('error installing istio CRDs', err.code, err)
    if (err.code === 409) {
      debug('already exists... that should be ok')
    } else {
      throw err
    }
  } */

  debug('installing service account')
  // service account
  // helm https://raw.githubusercontent.com/istio/istio/1.0.6/install/kubernetes/helm/helm-service-account.yaml
  // helm init --service-account tiller

  debug('installing charts')
  const chart = join(installDir, 'install/kubernetes/helm/istio')
  return $$(`helm install ${chart} --name istio --namespace istio-system --set grafana.enabled=true --set tracing.enabled=true`)
}

/**
 * Uninstall istio
 *
 */
const uninstallIstio = async ({ parsedOptions }) => {
  const version = parsedOptions.version || '1.0.6'

  await Promise.all([
    $(`kubectl delete -f https://raw.githubusercontent.com/istio/istio/${version}/install/kubernetes/helm/istio/templates/crds.yaml`).catch(squash),
    $('helm delete --purge istio').catch(squash)
  ])

  return true
}

/** resource definitions for bookinfo */
const bookinfoYamls = 'https://raw.githubusercontent.com/istio/istio/release-1.0/samples/bookinfo/platform/kube/bookinfo.yaml,https://raw.githubusercontent.com/istio/istio/release-1.0/samples/bookinfo/networking/bookinfo-gateway.yaml'

/**
 * Install the istio bookinfo sample application
 *
 */
const installBookinfo = async () => {
  await $('kubectl label namespace default istio-injection=enabled --overwrite')
  return $$(`kubectl apply -f ${bookinfoYamls}`)
}

/**
 * Uninnstall the istio bookinfo sample application
 *
 */
const uninstallBookinfo = async () => {
  return $$(`kubectl delete -f ${bookinfoYamls}`)
}

/**
 * Return the istio ingress URL
 *
 */
const ingress = async ({ argvNoOptions: args }) => {
  const [ ingressHost, ingressPort, secureIngressPort ] = await Promise.all([
    $(`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`),
    $(`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].port}'`),
    $(`kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].port}'`)
  ])

  const baseUrl = `http://${ingressHost}:${ingressPort}`

  const appName = args[args.indexOf('ingress') + 1]
  if (appName) {
    return `${baseUrl}/${appName}`
  } else {
    return baseUrl
  }
}

/**
 * Report on the status of the bookinfo deployments
 *
 */
const statusBookinfo = async () => {
  return $$(`k8s status ${bookinfoYamls}`)
}

/**
 * Register the commands
 *
 */
export default async (commandTree, prequire) => {
  commandTree.listen('/istio/install', installIstio, { noAuthOk: true })
  commandTree.listen('/istio/delete', uninstallIstio, { noAuthOk: true })

  commandTree.listen('/bookinfo/install', installBookinfo, { noAuthOk: true })
  commandTree.listen('/bookinfo/create', installBookinfo, { noAuthOk: true })
  commandTree.listen('/bookinfo/uninstall', uninstallBookinfo, { noAuthOk: true })
  commandTree.listen('/bookinfo/delete', uninstallBookinfo, { noAuthOk: true })
  commandTree.listen('/istio/ingress', ingress, { noAuthOk: true })
  commandTree.listen('/bookinfo/status', statusBookinfo, { noAuthOk: true })
}
