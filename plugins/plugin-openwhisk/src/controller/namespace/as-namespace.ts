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

import { Namespace as RawNamespace } from 'openwhisk'
import { encodeComponent, MultiModalResponse } from '@kui-shell/core'

import { asMetadata } from '../fqn'
import { apiVersion, Namespace } from '../../models/resource'

export function asNamespace(name: string, raw: RawNamespace): Namespace {
  const metadata = asMetadata(name, '_')

  return {
    apiVersion,
    kind: 'Namespace',
    metadata,
    onclick: {
      namespace: `wsk list ${encodeComponent('/' + metadata.namespace)}`
    },
    actions: raw.actions,
    packages: raw.packages,
    rules: raw.rules,
    triggers: raw.triggers,
    data: JSON.stringify(raw, undefined, 2)
  }
}

/**
 * Default respondWith function. This creates a response that will
 * present as a multi-modal view.
 *
 */
export default function aNamespaceResponse(
  name: string,
  raw: RawNamespace,
  defaultMode?: string
): MultiModalResponse<Namespace> {
  return Object.assign(asNamespace(name, raw), {
    modes: [],
    defaultMode
  })
}
