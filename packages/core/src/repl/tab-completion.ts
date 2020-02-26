/*
 * Copyright 2017-19 IBM Corporation
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

import { Tab } from '../webapp/tab'
import { flatten } from '../core/utility'
import { CommandLine } from '../models/command'

/**
 * A registrar for enumerators
 *
 */
export interface TabCompletionSpec {
  /**
   * The prefix of the to-be-completed parameter that has been typed
   * so far.
   */
  toBeCompleted: string

  /**
   * An index into CommandLine.argv, or -1 if it is the trailing
   * argument that is to be completed.
   */
  toBeCompletedIdx: number
}

export type CompletionResponse = string | { completion: string; addSpace: boolean; docs?: string; label?: string }
export function isStringResponse(response: CompletionResponse): response is string {
  return response === undefined || typeof response === 'string'
}

type Enumerator = (
  tab: Tab,
  commandLine: CommandLine,
  spec: TabCompletionSpec
) => CompletionResponse[] | Promise<CompletionResponse[]>

const enumerators: Enumerator[] = []

export function registerEnumerator(enumerator: Enumerator) {
  enumerators.push(enumerator)
}

export async function applyEnumerator(
  tab: Tab,
  commandLine: CommandLine,
  spec: TabCompletionSpec
): Promise<CompletionResponse[]> {
  const lists = await Promise.all(enumerators.map(_ => _(tab, commandLine, spec)))
  return flatten(lists.map(x => x)).filter(x => x)
}
