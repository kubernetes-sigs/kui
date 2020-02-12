/*
 * Copyright 2017 IBM Corporation
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

import { EventEmitter } from 'events'

const eventBus = new EventEmitter()
eventBus.setMaxListeners(100)

export default eventBus

/**
 * Hook an event listener up to the family of standard user
 * interaction events.
 *
 */
export function wireToStandardEvents(listener: () => void) {
  eventBus.on('/tab/new', listener)
  eventBus.on('/tab/switch', listener)
  eventBus.on('/command/complete/fromuser', listener)
}
