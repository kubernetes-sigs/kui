import { safeLoad, safeDump } from 'js-yaml'

import { execSync } from 'child_process'

export function kubectlApplyRule(rule) {
  const yamlRule = safeDump(rule)
  const command = `cat <<"EOF" | kubectl apply -f -\n${yamlRule}\nEOF`
  execSync(command, { encoding: 'utf-8' })
}

function getLabelInfo(label) {
  const deployment = execSync(
    `kubectl get deployments -n ${label['destination_service_namespace']} ${label['destination_workload']} -oyaml`,
    { encoding: 'utf-8' }
  )
  return safeLoad(deployment)['spec']['template']['metadata']['labels']
}

export function applyDestinationRule(userDecision) {
  const destinationRule = {
    apiVersion: 'networking.istio.io/v1alpha3',
    kind: 'DestinationRule',
    metadata: {
      name: userDecision['service_name'] + '.' + userDecision['service_namespace'] + '.' + 'iter8-experiment',
      namespace: userDecision['service_namespace']
    },
    spec: {
      host: userDecision['service_name'],
      subsets: []
    }
  }
  for (const [key, value] of Object.entries(userDecision)) {
    if (key === 'service_name' || key === 'service_namespace') {
      continue
    }
    destinationRule['spec']['subsets'].push({ labels: getLabelInfo(value['version_labels']), name: key })
    kubectlApplyRule(destinationRule)
  }
  return destinationRule
}

export function applyVirtualService(dr, userDecision) {
  const virtualService = {
    apiVersion: dr['apiVersion'],
    kind: 'VirtualService',
    metadata: {
      name: dr['metadata']['name'],
      namespace: dr['metadata']['namespace']
    },
    spec: {
      hosts: [dr['spec']['host']],
      http: [
        {
          route: []
        }
      ]
    }
  }
  const subsets = dr['spec']['subsets']
  for (let i = 0; i < subsets.length; i++) {
    virtualService['spec']['http'][0]['route'].push({
      destination: { host: dr['spec']['host'], subset: subsets[i]['name'] },
      weight: userDecision[subsets[i]['name']]['traffic_percentage']
    })
    kubectlApplyRule(virtualService)
  }
}

export function applyTrafficSplit(userDecision) {
  try {
    const dr = applyDestinationRule(userDecision)
    applyVirtualService(dr, userDecision)
    return JSON.stringify({ success: 200 })
  } catch (err) {
    return JSON.stringify({ error: err })
  }
}

const arrSum = arr => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

export function checkTrafficSplit(trafficPerVersion) {
  if (arrSum(trafficPerVersion) === 100) {
    return true
  } else {
    return false
  }
}
// To check traffic Split:
// checkTrafficSplit([10,20,30])
// checkTrafficSplit([10,20,30]).toString()

// To apply traffic split:
// const sample = {
//     "service_name": "reviews",
//     "service_namespace": "bookinfo_iter8",
//     "candidate-1": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v2"
//             },
//             "traffic_percentage": 20
//     },
//     "candidate-2": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v3"
//             },
//             "traffic_percentage": 80
//     }
// }
// applyTrafficSplit(sample)
