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

export type WaitTimeAnnotation = { key: 'waitTime'; value: number }
export type InitTimeAnnotation = { key: 'initTime'; value: number }
export type LimitAnnotation = { key: 'limit'; value: { memory: number } }
type Annotation = WaitTimeAnnotation | InitTimeAnnotation | LimitAnnotation | { key: string; value: string }

export interface Activation {
  name: string
  start: number
  end?: number
  activationId: string
  statusCode: number
  version: string

  _duration?: number
  executionTime: number

  annotations: Annotation[]

  response: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: {
      error: string | { error?: string; message?: string }
    }
  }
}

export default Activation
