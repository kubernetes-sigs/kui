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

import REPL from '../models/repl'
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

/**
 * Plugins may register enumerators. A tab completion Enumerator takes
 * a CommandLine and a TabCompletionSpec and produceds an array of
 * CompletionResponse.
 *
 */
type Enumerator = (
  tab: { REPL: REPL },
  commandLine: CommandLine,
  spec: TabCompletionSpec
) => CompletionResponse[] | Promise<CompletionResponse[]>

/** An Enumerator paired with a priority to help with tie breakers */
type PrioritizedEnumerator = { enumerator: Enumerator; priority: number }
const enumerators: PrioritizedEnumerator[] = []

/** A plugin has offered a tab completion Enumerator */
export function registerEnumerator(enumerator: Enumerator, priority = 0) {
  enumerators.push({ enumerator, priority })
}

/**
 * Consult each registered enumerator to see what it has to offer in
 * the way of completions. Pick the one with highest priority, or the
 * first to register in the case of a tie-breaker.
 *
 */
export async function applyEnumerator(
  tab: { REPL: REPL },
  commandLine: CommandLine,
  spec: TabCompletionSpec
): Promise<CompletionResponse[]> {
  // this is a list of all offered completions, paired with the
  // priority of the registered enumerator
  const lists = (
    await Promise.all(
      enumerators.map(async _ => ({
        response: await _.enumerator(tab, commandLine, spec),
        priority: _.priority
      }))
    )
  ).filter(_ => _.response && _.response.length > 0)

  if (lists.length === 0) {
    // no enumerators had anything to suggest
  } else if (lists.length === 1) {
    // exactly one enumerator had something to suggest
    return lists[0].response
  } else {
    // in this case, more than one enumerator had something to
    // suggest. pick the one with highest priority, or the first to
    // register
    const bestList = lists.slice(1).reduce((best, list) => {
      if (best.priority < list.priority) {
        return list
      } else {
        return best
      }
    }, lists[0])

    return bestList.response
  }
}
