/*
 * Copyright 2017-2019 IBM Corporation
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

import { Disambiguator, CatchAllHandler } from '../models/command'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PrescanUsage {}

interface PrescanCommandDefinition {
  route: string
  path: string
}

export type PrescanCommandDefinitions = PrescanCommandDefinition[]

export interface PrescanDocs {
  [key: string]: string
}

export interface PrescanModel {
  docs: PrescanDocs
  preloads: PrescanCommandDefinitions
  commandToPlugin: { [key: string]: string }
  topological: { [key: string]: string[] }
  flat: PrescanCommandDefinitions
  overrides: { [key: string]: string }
  usage: PrescanUsage
  disambiguator: Disambiguator
  catchalls: CatchAllHandler[]
}

/**
 * Merge two prescan models
 *
 * @return the merged result
 */
export function unify(modelA: PrescanModel, modelB: PrescanModel): PrescanModel {
  return {
    docs: Object.assign({}, modelA.docs, modelB.docs),
    preloads: modelA.preloads.concat(modelB.preloads),
    commandToPlugin: Object.assign({}, modelA.commandToPlugin, modelB.commandToPlugin),
    topological: Object.assign({}, modelA.topological, modelB.topological),
    flat: modelA.flat.concat(modelB.flat),
    overrides: Object.assign({}, modelA.overrides, modelB.overrides),
    usage: Object.assign({}, modelA.usage, modelB.usage),
    disambiguator: Object.assign({}, modelA.disambiguator, modelB.disambiguator),
    catchalls: modelA.catchalls.concat(modelB.catchalls)
  }
}
