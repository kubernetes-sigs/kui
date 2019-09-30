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

import { Entity } from '../models/entity'
import { MessageWithUsageModel } from '../core/usage-error'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isHTML(message: Entity | MessageWithUsageModel | Node): message is HTMLElement {
  return !!(message as HTMLElement).nodeName
}

export function isPromise<T, U>(content: U | Promise<T>): content is Promise<T> {
  const promise = content as Promise<T>
  return !!promise.then
}
