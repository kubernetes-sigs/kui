/*
 * Copyright 2018 The Kubernetes Authors
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

import { TrafficLight } from '@kui-shell/plugin-kubectl-core'

/**
 * Decorate certain values specially
 *
 */
export default {
  // helm lifecycle
  UNKNOWN: '',
  DEPLOYED: TrafficLight.Green,
  DELETED: '',
  SUPERSEDED: TrafficLight.Yellow,
  FAILED: TrafficLight.Red,
  DELETING: TrafficLight.Yellow,

  // kui manufactured; see formatTable.ts withNotFounds()
  Offline: TrafficLight.Red,

  // volumes
  Bound: TrafficLight.Green,

  // pod lifecycle
  'Init:0/1': TrafficLight.Yellow,
  PodScheduled: TrafficLight.Yellow,
  PodInitializing: TrafficLight.Yellow,
  Initialized: TrafficLight.Yellow,
  Terminating: TrafficLight.Yellow,
  ImagePullBackOff: TrafficLight.Red,
  ErrImagePull: TrafficLight.Red,
  Error: TrafficLight.Red,
  UnexpectedAdmissionError: TrafficLight.Red,
  OOMKilled: TrafficLight.Red,

  // 1/0 status
  1: TrafficLight.Green,
  0: TrafficLight.Red,
  '<none>': TrafficLight.Yellow,

  // kube lifecycle
  CrashLoopBackOff: TrafficLight.Red,
  Failed: TrafficLight.Red,
  PropagationFailed: TrafficLight.Red,
  Fail: TrafficLight.Red,
  Running: TrafficLight.Green,
  Pending: TrafficLight.Yellow,
  Succeeded: TrafficLight.Blue,
  Completed: TrafficLight.Gray, // successfully terminated; don't use a color
  Unknown: '',
  Propagated: TrafficLight.Green,
  Subscribed: TrafficLight.Green,

  // AWS events
  Ready: TrafficLight.Green,
  ProvisionedSuccessfully: TrafficLight.Green,

  // kube events
  Active: TrafficLight.Green,
  Online: TrafficLight.Green,
  NodeReady: TrafficLight.Green,
  Pulled: TrafficLight.Green,
  Rebooted: TrafficLight.Green,
  Started: TrafficLight.Green,
  Created: TrafficLight.Green,
  Scheduled: TrafficLight.Green,
  SuccessfulCreate: TrafficLight.Green,
  SuccessfulMountVol: TrafficLight.Green,
  ContainerCreating: TrafficLight.Yellow,
  Starting: TrafficLight.Yellow,
  NodeNotReady: TrafficLight.Yellow,
  Killing: TrafficLight.Red,
  Deleting: TrafficLight.Red,
  Pulling: TrafficLight.Yellow,
  BackOff: TrafficLight.Yellow,
  Unhealthy: TrafficLight.Red,
  FailedScheduling: TrafficLight.Red,
  FailedKillPod: TrafficLight.Red
}
