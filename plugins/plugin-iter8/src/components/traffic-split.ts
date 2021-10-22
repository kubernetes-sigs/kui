/*
 * Copyright 2020 The Kubernetes Authors
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
/*eslint-disable */
import _ from 'lodash'
import { Arguments } from '@kui-shell/core'
import { KubeResource } from '@kui-shell/plugin-kubectl'

export async function kubectlApplyRule(rule, { REPL }: Pick<Arguments, 'REPL'>) {
  delete rule['originatingCommand']
  delete rule['kuiRawData']
  delete rule['isKubeResource']
  const { dump } = await import('js-yaml')
  const yamlRule = dump(rule)

  return await REPL.qexec(`cat <<"EOF" | kubectl apply -f -\n${yamlRule}\nEOF`)
}

async function getLabelInfo(label, { REPL }: Pick<Arguments, 'REPL'>) {
  var deployment = await REPL.qexec<KubeResource>(
    `kubectl get deployments -n ${label['destination_workload_namespace']} ${label['destination_workload']} -o json`
  )
  return deployment['spec']['template']['metadata']['labels']
}

async function getportnumber(svc, ns, { REPL }: Pick<Arguments, 'REPL'>) {
  return (await REPL.qexec(`kubectl get svc -n ${ns} ${svc} -o json`))['spec']['ports'][0]['port']
}

export function applyTrafficSplit(userDecision, { REPL }: Pick<Arguments, 'REPL'>) {
  var destinationRule = {}
  destinationRule = {
    apiVersion: 'networking.istio.io/v1alpha3',
    kind: 'DestinationRule',
    metadata: {
      name: userDecision['service_name'] + '.' + userDecision['service_namespace'] + '.' + 'iter8-experiment',
      namespace: userDecision['service_namespace'],
      labels: {
        'iter8-tools/host': userDecision['service_name'],
        'iter8-tools/role': 'stable'
      }
    },
    spec: {
      host: userDecision['service_name'],
      subsets: []
    }
  }
  setTimeout(async () => {
    for (const [key, value] of Object.entries(userDecision)) {
      if (key === 'service_name') {
        continue
      } else if (key === 'service_namespace') {
        continue
      } else if (key === 'edgeService') {
        continue
      } else if (key === 'hostGateways') {
        continue
      }
      let [l] = await Promise.all([getLabelInfo(value['version_labels'], { REPL })])
      destinationRule['spec']['subsets'].push({ labels: l, name: key })
    }
    console.log('Applying Destination Rule')
    kubectlApplyRule(destinationRule, { REPL })
    applyVirtualService(destinationRule, userDecision, { REPL })
  })
}

export function applyVirtualService(dr, userDecision, { REPL }: Pick<Arguments, 'REPL'>) {
  var virtualService = {}
  virtualService = {
    apiVersion: 'networking.istio.io/v1alpha3',
    kind: 'VirtualService',
    metadata: {
      name: userDecision['service_name'] + '.' + userDecision['service_namespace'] + '.' + 'iter8-experiment',
      namespace: userDecision['service_namespace'],
      labels: {
        'iter8-tools/host': userDecision['service_name'],
        'iter8-tools/role': 'stable'
      }
    },
    spec: {
      hosts: [userDecision['service_name']],
      gateways: ['mesh'],
      http: [{ route: [] }]
    }
  }
  if (userDecision.edgeService === true) {
    for (var i = 0; i < userDecision.hostGateways.length; i++) {
      virtualService['spec']['hosts'].push(userDecision.hostGateways[i].name)
      virtualService['spec']['gateways'].push(userDecision.hostGateways[i].gateway)
    }
  }
  setTimeout(async () => {
    const [port] = await Promise.all([
      getportnumber(userDecision.service_name, userDecision.service_namespace, { REPL })
    ])
    const subsets = dr['spec']['subsets']
    virtualService['spec']['http'][0]['route'] = []
    for (let i = 0; i < subsets.length; i++) {
      virtualService['spec']['http'][0]['route'].push({
        destination: { host: dr['spec']['host'], subset: subsets[i]['name'], port: { number: port } },
        weight: userDecision[subsets[i]['name']]['traffic_percentage']
      })
    }
    console.log('Applying Virtual Service')
    kubectlApplyRule(virtualService, { REPL })
  })
}

const arrSum = arr => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

export function checkTrafficSplit(trafficPerVersion) {
  if (arrSum(trafficPerVersion) === 100) {
    return true
  } else {
    return false
  }
}

// Utility wrapper for traffic check
export function trafficCheck(result: Array<any>) {
  let trafficArr = []
  for (let i = 0; i < result.length; i++) {
    trafficArr.push(result[i].split)
  }
  return checkTrafficSplit(trafficArr)
}
// Organizes relevant information for building vs
export function getUserDecision(ns: string, service: string, trafficDecision: Array<any>) {
  let trafficObj = {
    service_name: service,
    service_namespace: ns
  }
  for (let i = 0; i < trafficDecision.length; i++) {
    trafficObj[`${trafficDecision[i].version}`] = {
      version_labels: {
        destination_workload_namespace: ns,
        destination_workload: trafficDecision[i].version
      },
      traffic_percentage: trafficDecision[i].split
    }
  }
  return trafficObj
}
