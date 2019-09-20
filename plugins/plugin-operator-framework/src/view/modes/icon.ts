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

import { BadgeSpec } from '@kui-shell/core/webapp/views/sidecar'
import { BadgeRegistration } from '@kui-shell/core/webapp/views/registrar/badges'

import { KubeResource } from '@kui-shell/plugin-k8s'

/**
 * e.g. ClusterServiceVersion
 *
 */
interface IconBearer extends KubeResource {
  spec: {
    // we need this, due to typescript's weak type detection
    // https://stackoverflow.com/a/47930521/5270773
    displayName?: string

    icon: {
      base64data: string
      mediatype: string
    }[]
  }
}

function isIconBearer(resource: KubeResource): resource is IconBearer {
  const bearer = resource as IconBearer
  return (
    bearer !== undefined &&
    bearer.spec !== undefined &&
    bearer.spec.icon !== undefined &&
    Array.isArray(bearer.spec.icon) &&
    bearer.spec.icon.length > 0 &&
    bearer.spec.icon[0].base64data !== undefined &&
    bearer.spec.icon[0].mediatype !== undefined
  )
}

/**
 * Show spec.customresourcedefinitions
 *
 */
export const iconBadge: BadgeRegistration<IconBearer> = {
  when: isIconBearer,
  badge: (resource: IconBearer): BadgeSpec => {
    const { mediatype, base64data } = resource.spec.icon[0]

    const image = document.createElement('img')
    image.setAttribute('src', `data:${mediatype};base64, ${base64data}`)

    return {
      title: 'icon',
      image
    }
  }
}
