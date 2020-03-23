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

/**
 * Resource status/states
 *
 */
type State = string
const States = {
  // online-like
  Available: 'Available',
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
  States.Available,
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
const isOfflineLike = (state: State): boolean => !!stateGroups[FinalState.OfflineLike][state]

/** isPendingLike is the remainder of isOnlineLike and isOfflineLike */
const isPendingLike = (state: State): boolean => !isOnlineLike(state) && !isOfflineLike(state)

export function isDone(newState: State, finalState: FinalState): boolean {
  const done =
    newState === States.Failed ||
    (finalState === FinalState.NotPendingLike && !isPendingLike(newState)) ||
    (finalState === FinalState.OnlineLike && isOnlineLike(newState)) ||
    (finalState === FinalState.OfflineLike && isOfflineLike(newState))

  return done
}
