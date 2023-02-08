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

/**
 * Name: nginx
 * Ready: 1/1
 * Status: Running
 * Restarts: '0'
 * Age: 5h28m
 * IP: 172.30.166.246
 * Node: 10.73.230.194
 * Nominated node: <none>
 * Readiness gates: <none>
 *
 */

import { Pod } from '@kui-shell/plugin-kubectl-core'

import { age, none } from './Generic'
import toDescriptionList from './convert'

function ready(pod: Pod) {
  const { containerStatuses } = pod.status

  const numerator = !containerStatuses
    ? 0
    : containerStatuses.reduce((count, status) => count + (status.ready ? 1 : 0), 0)
  const denominator = containerStatuses.length

  return `${numerator}/${denominator}`
}

function restarts(pod: Pod) {
  const { containerStatuses } = pod.status
  return containerStatuses.reduce((count, status) => count + status.restartCount, 0)
}

function readinessGates(pod: Pod) {
  if (!pod.spec.readinessGates) {
    return none()
  } else {
    return pod.spec.readinessGates.map(_ => _.conditionType || '').join(', ')
  }
}

export default function PodSummary(pod: Pod) {
  const { spec, status } = pod

  const model = {
    // Name: metadata.name,
    Ready: ready(pod),
    // Status: status.phase,
    Restarts: restarts(pod),
    Age: age(pod),
    IP: status.podIP,
    Node: spec.nodeName
  }

  if (spec.readinessGates) {
    model['Readiness gates'] = readinessGates(pod)
  }

  if (spec.nominatedNodeName) {
    model['Nominated node'] = spec.nominatedNodeName
  }

  return toDescriptionList(model)
}
