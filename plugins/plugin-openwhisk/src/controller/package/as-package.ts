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

import { PackageDesc, Package as RawPackage } from 'openwhisk'
import { Tab, Table, MultiModalResponse } from '@kui-shell/core'

import asTable from '../as-table'
import { apiVersion, Package, Metadata } from '../../models/resource'

export function asPackage(raw: RawPackage): Package {
  return {
    apiVersion,
    kind: 'Package',
    metadata: {
      name: raw.name,
      namespace: raw.namespace
    },
    binding: raw.binding as Metadata,
    annotations: raw.annotations,
    parameters: raw.parameters,
    version: raw.version,
    data: JSON.stringify(raw, undefined, 2),

    actions: raw.actions ? raw.actions.map(_ => ({ name: _.name })) : undefined,
    feeds: raw.feeds ? raw.feeds.map(_ => ({ name: _.name })) : undefined
  }
}

export function asPackageTable(tab: Tab, raw: PackageDesc[]): Promise<Table> {
  return asTable(tab, raw.map(asPackage))
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export default function asPackageResponse(raw: RawPackage, defaultMode?: string): MultiModalResponse<Package> {
  return Object.assign(asPackage(raw), {
    modes: [],
    defaultMode,
    toolbarText: {
      type: 'info',
      text: `This package has ${raw.actions ? raw.actions.length : 0} actions, and ${
        raw.feeds ? raw.feeds.length : 0
      } feeds`
    }
  })
}
