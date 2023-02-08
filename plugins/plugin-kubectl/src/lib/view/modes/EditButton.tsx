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

import React from 'react'
import { Arguments, ModeRegistration, i18n } from '@kui-shell/core'
import { KubeResource, isCrudableKubeResource } from '@kui-shell/plugin-kubectl-core'

import { isEditable as isAlreadyEditable } from '../../../controller/kubectl/edit'

import Icons from '@kui-shell/plugin-client-common/mdist/components/spi/Icons'

const strings = i18n('plugin-client-common', 'editor')

/** Mode identifier */
const mode = 'edit-button'

/** Mode label; intentionally no i18n */
export const label = strings('Edit')

/** Should we decorate the given resource with an Edit button? */
function isEditable(resource: KubeResource) {
  return isCrudableKubeResource(resource) && !isAlreadyEditable(resource)
}

/**
 * The YAML mode applies to all KubeResources, and simply extracts the
 * raw `data` field from the resource; note how we indicate that this
 * raw data has a yaml content type.
 *
 */
const yamlMode: ModeRegistration<KubeResource> = {
  when: isEditable,
  mode: {
    mode,
    label,
    icon: <Icons icon="Edit" />,

    // we want to execute the command in place of the current block,
    // rather than in a new block
    inPlace: true,

    kind: 'drilldown' as const,
    command: async (_, resource: KubeResource, args: Pick<Arguments, 'argvNoOptions' | 'parsedOptions'>) => {
      const [{ fqnOf }, { withKubeconfigFrom }, { getCommandFromArgs }] = await Promise.all([
        import('../../../controller/kubectl/fqn'),
        import('../../../controller/kubectl/options'),
        import('../../util/util')
      ])

      return withKubeconfigFrom(args, `${getCommandFromArgs(args)} edit ${fqnOf(resource)}`)
    }
  }
}

export default yamlMode
