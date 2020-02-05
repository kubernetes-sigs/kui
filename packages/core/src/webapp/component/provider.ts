/*
 * Copyright 2020 IBM Corporation
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

import { Tab } from '../tab'
import REPL from '../../models/repl'
import { Entity } from '../../models/entity'

import KuiComponent from './component'

interface Filter<T extends Entity> {
  when: (entity: T) => boolean
}

interface Render<T extends Entity> {
  render: (entity: T, tab: Tab, repl: REPL, command?: string) => KuiComponent | Promise<KuiComponent>
}

interface Priority {
  priority: number
}

type KuiComponentProvider<T extends Entity> = Filter<T> & Render<T> & Partial<Priority>

export default KuiComponentProvider
