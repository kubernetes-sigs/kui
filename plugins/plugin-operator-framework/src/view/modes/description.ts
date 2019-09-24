/*
 * Copyright 2019 IBM Corporation
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

import * as Debug from 'debug'
import * as marked from 'marked'

import { Tab } from '@kui-shell/core'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { ModeRegistration } from '@kui-shell/core/webapp/views/registrar/modes'

import { Resource, KubeResource } from '@kui-shell/plugin-k8s'

const debug = Debug('plugin/operator-framework/view/modes/description')

/**
 * e.g. ClusterServiceVersion
 *
 */
interface DescriptionBearer extends KubeResource {
  spec: {
    description: string
  }
}

function isDescriptionBearer(resource: KubeResource): resource is DescriptionBearer {
  const bearer = resource as DescriptionBearer
  return bearer !== undefined && bearer.spec !== undefined && bearer.spec.description !== undefined
}

/**
 * Show spec.customresourcedefinitions
 *
 */
export const descriptionMode: ModeRegistration<KubeResource> = {
  when: isDescriptionBearer,
  mode: (command: string, resource: Resource): SidecarMode => {
    try {
      return {
        mode: 'Description',
        leaveBottomStripeAlone: true,
        direct: {
          plugin: 'operator-framework/dist/index',
          operation: 'renderAndViewDescription',
          parameters: { command, resource }
        }
      }
    } catch (err) {
      debug('error rendering description button')
      console.error(err)
    }
  }
}

interface Parameters {
  command: string
  resource: Resource<DescriptionBearer>
}

export const renderAndView = (tab: Tab, parameters: Parameters) => {
  const { command, resource } = parameters
  debug('renderAndView', command, resource)

  const container = document.createElement('div')
  container.innerHTML = marked(resource.resource.spec.description)
  return container
}
