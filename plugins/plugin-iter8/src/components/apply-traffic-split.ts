import { safeLoad, safeDump } from 'js-yaml'

const execSync = require('child_process').execSync

function applyKube(rule) {
  const yamlRule = safeDump(rule)
  const command = `cat <<EOF | kubectl apply -f -\n${yamlRule}\nEOF`
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
      name: userDecision['service_name'] + '.' + 'bookinfo-iter8' + '.' + 'iter8-experiment',
      namespace: 'bookinfo-iter8'
    },
    spec: {
      host: userDecision['service_name'],
      subsets: []
    }
  }
  for (const [key, value] of Object.entries(userDecision)) {
    if (key === 'service_name') {
      continue
    }
    destinationRule['spec']['subsets'].push({ labels: getLabelInfo(value['version_labels']), name: key })
    applyKube(destinationRule)
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
    applyKube(virtualService)
  }
}

export function applyTrafficSplit(userDecision) {
  try {
    const dr = applyDestinationRule(userDecision)
    applyVirtualService(dr, userDecision)
    return { success: 200 }
  } catch (err) {
    return { error: err }
  }
}

// const sample = {
//     "service_name": "reviews",
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
