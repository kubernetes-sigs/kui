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

import { Tab } from '../webapp/tab'
import { getImpl as getReplImpl } from '../repl/exec'
import { startInputQueueing } from '../webapp/queueing'

import mapTo from './registrar'

/**
 * Initialize the session for the given `Tab`. Await the response if
 * you need to block until all session initializers have completed.
 *
 */
export async function initializeSession(tab: Tab): Promise<void> {
  tab.state.ready = false

  getReplImpl(tab)
  const promise = mapTo(tab)
  startInputQueueing(tab)
  await promise

  tab.state.ready = true

  // to test the session init error handling:
  // throw new Error('artificial failure')
}
