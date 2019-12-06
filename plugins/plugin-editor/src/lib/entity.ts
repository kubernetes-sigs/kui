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

import { ResourceWithMetadata } from '@kui-shell/core'

import { Persister } from './persisters'

interface ExecSpec {
  kind: string
  code: string
}

interface KeyValuePair {
  key: string
  value: string
}

interface Getter {
  getEntity: () => object
}

export interface Entity extends ResourceWithMetadata {
  type: string
  name: string
  version?: string
  isNew?: boolean
  namespace?: string
  noZoom?: boolean
  viewName?: string
  extract?: (raw: string, entity: Entity) => Entity
  extractName?: (raw: string) => string // re-extract name from raw source, e.g. after a save or revert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock?: any // set to false if you don't want a lock icon
  filepath?: string
  exec: ExecSpec
  persister?: Persister
  gotoReadonlyView?: (Getter) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  annotations: KeyValuePair[]
}

export default Entity
