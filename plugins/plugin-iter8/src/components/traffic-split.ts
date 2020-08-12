/*eslint-disable */
import { safeLoad, safeDump } from 'js-yaml'

import { execSync } from 'child_process'

export function kubectlApplyRule(rule) {
  const yamlRule = safeDump(rule)
  const command = `cat <<"EOF" | kubectl apply -f -\n${yamlRule}\nEOF`
  execSync(command, { encoding: 'utf-8' })
}

function getLabelInfo(label) {
  const deployment = execSync(
    `kubectl get deployments -n ${label['destination_workload_namespace']} ${label['destination_workload']} -oyaml`,
    { encoding: 'utf-8' }
  )
  return safeLoad(deployment)['spec']['template']['metadata']['labels']
}

function drPresence(userDecision) {
  var dr = execSync(`kubectl get dr -n ${userDecision['service_namespace']} -o jsonpath='{.items[*].metadata.name}'`, {
    encoding: 'utf-8'
  })
  dr = dr.split(' ')
  if (dr.length == 0) {
    return false
  } else {
    var temp = {}
    var drlabel = { 'iter8-tools/host': userDecision['service_name'], 'iter8-tools/role': 'stable' }
    for (var i = 0; i < dr.length; i++) {
      temp = execSync(`kubectl get dr -n ${userDecision['service_namespace']} ${dr[i]} -oyaml`, { encoding: 'utf-8' })
      temp = safeLoad(temp)
      if (temp.metadata.labels == drlabel) {
        delete temp['metadata']['annotations']
        delete temp['metadata']['creationTimestamp']
        delete temp['metadata']['generation']
        delete temp['metadata']['resourceVersion']
        delete temp['metadata']['selfLink']
        delete temp['metadata']['uid']
        temp.metadata.namespace = userDecision['service_namespace']
        return temp
      }
    }
  }
  return false
}

export function applyDestinationRule(userDecision) {
  var drPresent = drPresence(userDecision)
  var destinationRule = {}
  if (drPresent === false) {
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
        host: 'productpage',
        subsets: []
      }
    }
  } else {
    destinationRule = drPresent
    destinationRule.spec.subsets = []
  }
  for (const [key, value] of Object.entries(userDecision)) {
    if (key === 'service_name') {
      continue
    } else if (key === 'service_namespace') {
      continue
    }
    destinationRule['spec']['subsets'].push({ labels: getLabelInfo(value['version_labels']), name: key })
  }
  kubectlApplyRule(destinationRule)
  return destinationRule
}

export function applyVirtualService(dr, userDecision) {
  var vsName = userDecision['service_name'] + '.' + userDecision['service_namespace'] + '.' + 'iter8-experiment'
  const vsRule = safeLoad(
    execSync(`kubectl get vs -n ${userDecision['service_namespace']} ${vsName} -oyaml`, { encoding: 'utf-8' })
  )
  var route = vsRule['spec']['http'][0]['route']
  vsRule['spec']['http'][0]['route'] = []
  const subsets = dr['spec']['subsets']
  for (let i = 0; i < subsets.length; i++) {
    vsRule['spec']['http'][0]['route'].push({
      destination: { host: dr['spec']['host'], subset: subsets[i]['name'], port: { number: 9080 } },
      weight: userDecision[subsets[i]['name']]['traffic_percentage']
    })
  }
  kubectlApplyRule(vsRule)
}

export function applyTrafficSplit(userDecision) {
  try {
    const dr = applyDestinationRule(userDecision)
    applyVirtualService(dr, userDecision)
    return JSON.stringify({ success: 200 })
  } catch (err) {
    console.log(err)
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
      version_labels: {
        destination_workload_namespace: ns,
        destination_workload: trafficDecision[i].version
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
//                 'destination_workload_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v3"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v4": {
//         "version_labels": {
//                 'destination_workload_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v4"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v5": {
//         "version_labels": {
//                 'destination_workload_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v5"
//             },
//             "traffic_percentage": 25
//     },
//     "reviews-v6": {
//         "version_labels": {
//                 'destination_workload_namespace': "bookinfo-iter8",
//                 'destination_workload': "reviews-v6"
//             },
//             "traffic_percentage": 25
//     },
// }
// applyTrafficSplit(sample)
