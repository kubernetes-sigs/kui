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

import { Tab } from '@kui-shell/core/api/ui-lite'
import { ModeRegistration } from '@kui-shell/core/api/registrars'
import { Table } from '@kui-shell/core/api/table-models'
import { outerCSSForKey, cssForKey } from '@kui-shell/core/webapp/util/ascii-to-table'

import { KubeResource } from '@kui-shell/plugin-k8s'

/**
 * e.g. ClusterServiceVersion
 *
 */
interface CRDBearer extends KubeResource {
  spec: {
    customresourcedefinitions: {
      owned?: {
        version: string
        description: string
        displayName: string
        kind: string
        name: string
        resources: {
          kind: string
          name: string
          version: string
        }[]
        specDescriptors: {
          description: string
          displayName: string
          path: string
          'x-descriptors': string[]
        }[]
      }[]
    }
  }
}

function isCRDBearer(resource: KubeResource): resource is CRDBearer {
  const bearer = resource as CRDBearer
  return (
    bearer !== undefined &&
    bearer.spec !== undefined &&
    bearer.spec.customresourcedefinitions !== undefined &&
    bearer.spec.customresourcedefinitions.owned !== undefined
  )
}

function content(tab: Tab, resource: CRDBearer): Table {
  return {
    title: 'CRDs',
    header: {
      name: 'NAME',
      outerCSS: outerCSSForKey.NAME,
      css: cssForKey.NAME,
      attributes: [{ value: 'KIND' }, { value: 'VERSION', outerCSS: outerCSSForKey.AGE }, { value: 'DESCRIPTION' }]
    },
    body: resource.spec.customresourcedefinitions.owned.map(spec => ({
      name: spec.name,
      outerCSS: outerCSSForKey.NAME,
      css: cssForKey.NAME,
      attributes: [
        { key: 'KIND', value: spec.kind },
        {
          key: 'VERSION',
          value: spec.version,
          outerCSS: outerCSSForKey.AGE,
          css: cssForKey.AGE
        },
        { key: 'DESCRIPTION', value: spec.description, css: 'pre-wrap' }
      ]
    }))
  }
}

/**
 * Show spec.customresourcedefinitions
 *
 */
export const crdsMode: ModeRegistration<KubeResource> = {
  when: isCRDBearer,
  mode: {
    mode: 'CRDs',
    content
  }
}

export default crdsMode
