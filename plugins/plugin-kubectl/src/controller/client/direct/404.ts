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

import { Row, Table } from '@kui-shell/core'
import { TrafficLight } from '@kui-shell/plugin-kubectl-core'

import { rowWith, standardStatusHeader } from './unify'

/**
 * @return a Row for the given name in `names` with an Offline status.
 *
 */
function fabricate404Row(name: string, kind: string): Row {
  return rowWith(name, kind, 'Offline', TrafficLight.Red)
}

/**
 * @return a Table with one row per given name in `names`, each row
 * with an Offline status.
 *
 */
export default function fabricate404Table(names: string[], kind: string): Table {
  return {
    header: standardStatusHeader,
    body: names.map(name => fabricate404Row(name, kind))
  }
}
