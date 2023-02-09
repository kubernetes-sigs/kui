/*
 * Copyright 2023 The Kubernetes Authors
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

import { Arguments, i18n, Tab, ModeRegistration } from '@kui-shell/core'
import { KubeResource, Pod, isPod, isPVCVolume } from '@kui-shell/plugin-kubectl-core'

import { withKubeconfigFrom } from '../../../controller/kubectl/options'

const strings = i18n('plugin-kubectl')

/**
 * Show the PersistentVolumeClaim associated with a Pod
 *
 */
async function command(tab: Tab, pod: Pod, args: Pick<Arguments, 'argvNoOptions' | 'parsedOptions'>) {
  const { getCommandFromArgs } = await import('../../util/util')

  const pvcVolumes = pod.spec.volumes.filter(isPVCVolume)
  const dashO = pvcVolumes.length === 1 ? '-o yaml' : '' // skip directly to drilldown if there's just one

  return withKubeconfigFrom(
    args,
    `${getCommandFromArgs(args)} get pvc ${pvcVolumes.map(_ => _.persistentVolumeClaim.claimName).join(' ')} ${dashO}`
  )
}

function hasPVCs(resource: KubeResource): resource is Pod {
  return isPod(resource) && Array.isArray(resource.spec.volumes) && !!resource.spec.volumes.find(isPVCVolume)
}

/**
 * Add an Involved Object mode button
 *
 */
const mode: ModeRegistration<Pod> = {
  when: hasPVCs,
  mode: {
    mode: 'associatedPVCs',
    kind: 'drilldown',
    showRelatedResource: true,
    label: strings('Show Volume Claims'),
    command
  }
}

export default mode
