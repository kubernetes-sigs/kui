/*
 * Copyright 2018-19 IBM Corporation
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

import Debug from 'debug'

import { KubeResource, KubeStatus } from './resource'
import { maybeAsDate, TryLaterError } from '../util/util'

import { encodeComponent } from '@kui-shell/core/api/repl-util'

const debug = Debug('k8s/states')

/**
 * Resource status/states
 *
 */
export type State = string
export const States = {
  // online-like
  Active: 'Active',
  Online: 'Online',
  Ready: 'Ready',
  Running: 'Running',
  Completed: 'Completed',
  Succeeded: 'Succeeded',
  ProvisionedSuccessfully: 'ProvisionedSuccessfully',

  // online-like from knative
  Deployed: 'Deployed',
  ChannelReady: 'ChannelReady',
  Addressable: 'Addressable',

  // offline-like
  Offline: 'Offline',
  Undeployed: 'Offline',
  Failed: 'Failed',
  Disparity: 'Disparity',
  NotProvisioned: 'NotProvisioned',
  Unschedulable: 'Unschedulable',
  ErrImagePull: 'ErrImagePull',

  // pending-like
  ImagePullBackOff: 'ImagePullBackOff',
  PodInitializing: 'PodInitializing',
  Retrying: 'Retrying',
  Deleting: 'Deploying',
  Deploying: 'Deploying',
  Pending: 'Pending',
  Waiting: 'Waiting',
  Provisioning: 'Provisioning',

  // race: one view is waiting for e.g. Online, then a concurrent
  // operation deletes the resource
  Conflict: 'Conflict'
}

/** groups of States that mark desired final outcomes */
export enum FinalState {
  NotPendingLike,
  OnlineLike,
  OfflineLike
}

/** definitions of these groups */
const stateGroups = {}
const groupOf = (A: State[]) =>
  A.reduce((group, state) => {
    group[state] = true
    return group
  }, {})

/** states that are synonymous with being Online */
stateGroups[FinalState.OnlineLike] = groupOf([
  States.Active,
  States.Online,
  States.Ready,
  States.Running,
  States.ProvisionedSuccessfully,
  States.Deployed,
  States.ChannelReady,
  States.Addressable,
  States.Completed,
  States.Succeeded
])
const isOnlineLike = (state: State): boolean => stateGroups[FinalState.OnlineLike][state]

/** states that are synonymous with being Offline */
stateGroups[FinalState.OfflineLike] = groupOf([
  States.Offline,
  States.Undeployed,
  States.Failed,
  States.Disparity,
  States.NotProvisioned,
  States.Unschedulable,
  States.ErrImagePull
])
const isOfflineLike = (state: State): boolean => stateGroups[FinalState.OfflineLike][state]

/** isPendingLike is the remainder of isOnlineLike and isOfflineLike */
const isPendingLike = (state: State): boolean => !isOnlineLike(state) && !isOfflineLike(state)

/**
 * A rollup of State to "traffic light" model
 *
 */
export enum TrafficLight {
  Gray = 'gray-background',
  Red = 'red-background',
  Yellow = 'yellow-background',
  Green = 'green-background'
}

/**
 * Map a State to a red/yellow/green indicator
 *
 */
export const state2Traffic = (state: State): TrafficLight => {
  return state === States.Conflict
    ? TrafficLight.Gray
    : isOnlineLike(state)
    ? TrafficLight.Green
    : isOfflineLike(state)
    ? TrafficLight.Red
    : TrafficLight.Yellow
}

export const trafficMerge = (t1: TrafficLight, t2: TrafficLight): TrafficLight => {
  if (t1 === TrafficLight.Red || t2 === TrafficLight.Red) {
    return TrafficLight.Red
  } else if (t1 === TrafficLight.Yellow || t2 === TrafficLight.Yellow) {
    return TrafficLight.Yellow
  } else {
    return TrafficLight.Green
  }
}

/**
 * How do we want to color the text for the given resource deployment state?
 *
 */
export const rendering = {
  cssForState: (state: State): string => {
    return `min-width-6em ${state2Traffic(state).toString()}`
  },
  outerCSS: 'no-wrap'
}

/** format a CLI --context option, if we have one */
const contextOption = (context?: string) => (context ? '--context "' + context + '"' : '')

/** format a CLI --namespace option, if we have one */
const ns = (namespace?: string) =>
  namespace && namespace !== 'default' ? `--namespace ${encodeComponent(namespace)}` : ''

/**
 * Pretty generic online message; hepful for resource kinds that
 * don't articulate their status
 *
 */
const genericOnlineMessage = {
  state: States.Online,
  message: 'installed successfully'
}

/**
 * When issuing a kubectl get, the kind alone might be ambiguous
 *
 */
const kindForQuery = (apiVersion: string, kind: string): string => {
  debug('apiVersion', apiVersion)
  const api = apiVersion.replace(/^(.*)\/.*$/, '$1').replace(/^v.*/, '')
  return `${kind}${api.length > 0 ? '.' + api : ''}`
}

/**
 * Get a status struct from the status.conditions array
 *
 */
const getStatusFromConditions = (response: KubeResource) => {
  if (response.status && !response.status.state && response.status.conditions) {
    // use the status.conditions, rather than status.state
    const conditions = response.status.conditions

    conditions.sort((highIndex, lowIndex) => {
      // sort conditions by their lastTransitionTime
      let swap = -(new Date(highIndex.lastTransitionTime).getTime() - new Date(lowIndex.lastTransitionTime).getTime())
      // for conditions with the same lastTransitionTime and status, sort them by type

      if (swap === 0) {
        // for conitions with the same status, put the one with Not-Pending-Type at lower index
        if (!isPendingLike(highIndex.type) && isPendingLike(lowIndex.type)) {
          swap = -1 // swap the condition from high index to lower index
        } else if (isPendingLike(highIndex.type) && !isPendingLike(lowIndex.type)) {
          swap = 1
        }
      }

      return swap
    })
    // debug('using condition for status', conditions[0], conditions)

    const conditionForMessage = conditions.find(_ => _.message) || conditions[0]

    return {
      state: conditions[0].reason || conditions[0].type,
      message: (conditionForMessage && conditionForMessage.message) || conditions[0].lastTransitionTime
    }
  }
}

/**
 * Determine whether a kube Deployment is ready
 *
 */
const getStatusOfDeployment = (kubeEntity: KubeResource, desiredFinalState: FinalState): KubeStatus => {
  const desireIsOffline = desiredFinalState === FinalState.OfflineLike

  if (!kubeEntity) {
    return {
      state: desireIsOffline ? States.Offline : States.Pending,
      message: 'resource not yet available'
    }
  } else {
    const readyCondition =
      kubeEntity.status &&
      kubeEntity.status.conditions &&
      kubeEntity.status.conditions.find(({ reason, type, status }) => {
        return reason === 'MinimumReplicasAvailable' || type === 'Ready' || status === 'True'
      })

    if (readyCondition) {
      return {
        state: desireIsOffline ? States.Pending : States.Online,
        message: readyCondition.lastUpdateTime // readyCondition.message
      }
    } else {
      const desiredReplicas: number = kubeEntity.spec.replicas
      const currentReplicas: number = (kubeEntity.status && kubeEntity.status.readyReplicas) || 0
      const maybeCondition = kubeEntity.status && kubeEntity.status.conditions && kubeEntity.status.conditions[0]
      const message = maybeCondition && maybeCondition.message

      if (currentReplicas >= desiredReplicas) {
        return {
          state: States.Online,
          message
        }
      } else if (currentReplicas === 0) {
        return {
          state: desireIsOffline ? States.Offline : States.Pending,
          message
        }
      } else {
        return {
          state: States.Pending,
          message
        }
      }
    }
  }
}

/**
 * Get the deployment status of the given resource name of the given kind
 *
 */
const getStatus = async (
  desiredFinalState: FinalState,
  apiVersion: string,
  kind: string,
  name: string,
  namespace?: string,
  context?: string
): Promise<KubeStatus> => {
  try {
    const cmd = `kubectl get ${contextOption(context)} ${kindForQuery(apiVersion, kind)} ${name} ${ns(
      namespace
    )} -o json`
    // debug('getStatus', cmd);
    const { REPL } = await import('@kui-shell/core/api/repl')
    const response = await REPL.qexec<KubeResource>(cmd, undefined, undefined, { raw: true })

    if (
      !response.status || // resource does not define a status; consider it Online
      kind === 'Secret' ||
      kind === 'Ingress' ||
      kind === 'ConfigMap' ||
      kind === 'PodSecurityPolicy' ||
      kind === 'ClusterRole' ||
      kind === 'CustomResourceDefinition' ||
      kind === 'HorizontalPodAutoscaler' ||
      kind === 'ClusterRoleBinding' ||
      kind === 'VirtualService' ||
      kind === 'ServiceAccount'
    ) {
      // some resource types don't have a notion of deployment state :(
      return genericOnlineMessage
    } else if (apiVersion && apiVersion.match(/^v/) && kind === 'Service' && response.status) {
      return genericOnlineMessage
    } else if (kind === 'ReplicaSet') {
      const hasReplicas = response.status.readyReplicas > 0
      return {
        state:
          desiredFinalState === FinalState.NotPendingLike ||
          (desiredFinalState === FinalState.OfflineLike && !hasReplicas) ||
          hasReplicas
            ? States.Online
            : States.Pending
      }
    } else if (kind === 'Deployment') {
      return getStatusOfDeployment(response, desiredFinalState)
    } else {
      // the Service controller currently puts the state field
      // at the top level, hence the state.state check
      const status: KubeStatus =
        getStatusFromConditions(response) ||
        (response.status && (response.status.state || response.status.phase)
          ? response.status
          : response.apiVersion.match(/istio\.io/)
          ? {
              state: States.Online,
              message: new Date().toUTCString()
            }
          : undefined)

      if (!status) {
        throw new TryLaterError('Status not yet available')
      } else {
        return status
      }
    }
  } catch (err) {
    if (err.code === 404) {
      return {
        state: States.Offline
      }
    } else if (err.message.match(/You must be logged in to the server/)) {
      return {
        state: States.Pending
      }
    } else {
      throw err
    }
  }
}

/**
 * Check the deployment status of an openwhisk entity
 *
 */
// const getOpenWhiskStatus = (type: string, fqn: string): Promise<IStatus> => REPL.qexec(`wsk ${type} get "${fqn}"`)
//   .then(() => ({ state: States.Online }))
//   .catch(err => {
//     if (err.statusCode === 404) {
//       return {
//         state: States.Offline
//       }
//     } else {
//       throw err
//     }
//   })

interface Watch {
  apiVersion: string
  kind: string
  name: string
  type: string
  fqn: string
  namespace?: string
  context?: string
  labels?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Watch a resource for its deployment status
 *
 */
export const watchStatus = async (watch: Watch, finalStateStr: string | FinalState, count = 120) => {
  const finalState: FinalState = typeof finalStateStr === 'string' ? FinalState[finalStateStr] : finalStateStr

  const { kind, name, namespace, context } = watch
  // debug('watchStatus', finalStateStr, FinalState[finalState], kind, name);

  try {
    // const [ status, detail ] = await Promise.all([
    const [status] = await Promise.all([
      getStatus(finalState, watch.apiVersion, kind, name, namespace, context)
      // type !== 'unknown' ? getOpenWhiskStatus(type, fqn) : undefined
    ])
    // debug('watchStatus status', type, status, /*detail,*/ kind, name);

    const state = status.state || status.phase

    // disparity check disabled for now
    const isDisparity = false // detail !== undefined && state !== States.Failed && state !== States.Pending && state !== detail.state;

    const newState = (isDisparity ? States.Disparity : state) || States.Offline
    // debug('watchStatus newState', newState);

    // other cells to update
    const others =
      newState === States.Disparity
        ? [{ key: 'message', value: 'Underlying resource has disappeared' }]
        : status.message
        ? [{ key: 'message', value: maybeAsDate(status.message) }]
        : status.startTime
        ? [{ key: 'message', value: maybeAsDate(status.startTime) }]
        : newState === States.Offline
        ? [
            {
              key: 'message',
              value: finalState === FinalState.OnlineLike ? 'resource not yet available' : 'resource is offline'
            }
          ]
        : newState === States.Pending || newState === States.Deploying || newState === States.Deleting
        ? [{ key: 'message', value: 'in progress' }]
        : undefined

    // are we done updating
    const done =
      newState === States.Failed ||
      (finalState === FinalState.NotPendingLike && !isPendingLike(newState)) ||
      (finalState === FinalState.OnlineLike && isOnlineLike(newState)) ||
      (finalState === FinalState.OfflineLike && isOfflineLike(newState))
    // || (!offlineOk && newState === States.Disparity);

    const getKubernetesResource = `kubectl get ${kindForQuery(watch.apiVersion, kind)} ${encodeComponent(
      name
    )} ${contextOption(context)} ${ns(namespace)} -o yaml`

    const onclick = getKubernetesResource

    // should we start a slowPoll?
    const slowPoll = done && finalState === FinalState.NotPendingLike

    if (done) {
      debug('watchStatus done', slowPoll, newState, watch.kind, watch.name, FinalState[finalState])
    }

    // this is the update spec
    return {
      outerCSS: done ? '' : rendering.outerCSS,
      value: newState,
      onclick,
      slowPoll: slowPoll && 5000,
      done: done && !slowPoll, // terminate completely if we are done and have chosen not to slowPoll

      css: rendering.cssForState(newState),
      others
    }
  } catch (err) {
    if (err instanceof TryLaterError) {
      if (count < 20) {
        debug('trying later', kind, name)
        return {
          value: States.Pending,
          others: [{ key: 'message', value: 'not found, rechecking' }]
        }
      } else {
        debug('giving up, considering as offline', kind, name)
        return {
          done: true,
          value: States.Offline,
          css: rendering.cssForState(States.Offline),
          others: [{ key: 'message', value: 'resource does not exist' }]
        }
      }
    } else {
      console.error('error in watch update', kind, name, err)
      return { done: true }
    }
  }
}
