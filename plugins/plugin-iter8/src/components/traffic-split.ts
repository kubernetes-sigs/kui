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
  }
  applyKube(virtualService)
}

export function applyTrafficSplit(userDecision) {
  try {
    const dr = applyDestinationRule(userDecision)
    applyVirtualService(dr, userDecision)
    return JSON.stringify({ success: 200 })
  } catch (err) {
    return JSON.stringify({ error: err })
  }
  // const dr = applyDestinationRule(userDecision)
  // // applyVirtualService(dr, userDecision)
  // return JSON.stringify(dr)
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
export function trafficCheck(result: Array<any>){
  let trafficArr = [];
  for(let i = 0; i < result.length; i++){
    trafficArr.push(result[i].split);
  }
  return(checkTrafficSplit(trafficArr));
}
// Organizes relevant information for building vs
export function getUserDecision(ns: string, service: string, trafficDecision: Array<any>){
  let trafficObj = {
    "service_name": service,
    "service_namespace": ns,
  }
  for(let i = 0; i < trafficDecision.length; i++){
    trafficObj[`${trafficDecision[i].version}`] = {
      "version_labels":{
        "destination_service_namespace": ns,
        "destination_workload": trafficDecision[i].version
      },
      "traffic_percentage": trafficDecision[i].split
    }
  }
  return(trafficObj)
}
// To apply traffic split:
// const sample = {
//     "service_name": "reviews",
//     "service_namespace": "bookinfo-iter8",
//     "reviews-v3": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v3"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v4": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v4"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v5": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v5"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v6": {
//         "version_labels": {
//                 'destination_service_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v6"
//             },
//             "traffic_percentage": 25
//     },
// }
// applyTrafficSplit(sample)
