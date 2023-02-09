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

import { PVC, isBoundPVC } from '@kui-shell/plugin-kubectl-core'
import { Arguments, i18n, Tab, ModeRegistration } from '@kui-shell/core'

import { withKubeconfigFrom } from '../../../controller/kubectl/options'

const strings = i18n('plugin-kubectl')

/**
 * Show the bound Persistent Volume associated with a PersistentVolumeClaim
 *
 */
async function command(
  tab: Tab,
  { spec: { volumeName } }: PVC,
  args: Pick<Arguments, 'argvNoOptions' | 'parsedOptions'>
) {
  const { getCommandFromArgs } = await import('../../util/util')

  return withKubeconfigFrom(args, `${getCommandFromArgs(args)} get pv ${volumeName} -o yaml`)
}

/**
 * Add an Involved Object mode button
 *
 */
const mode: ModeRegistration<PVC> = {
  when: isBoundPVC,
  mode: {
    mode: 'boundPVC',
    kind: 'drilldown',
    showRelatedResource: true,
    label: strings('Show Bound Volume'),
    command
  }
}

export default mode
