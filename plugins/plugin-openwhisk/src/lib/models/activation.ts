/*
 * Copyright 2018 IBM Corporation
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

import { OpenWhiskEntity } from './openwhisk-entity'

/** does a string look like an OpenWhisk activation id? */
export const isActivationIdPattern = /^[a-fA-f0-9]{32}/
export const isActivationId = (str: string) => str.match(isActivationIdPattern)

export interface Activation extends OpenWhiskEntity {
  activationId: string
  originalActivationId?: string
  entity?: OpenWhiskEntity
  logs: string[]
  sessionId?: string
  start: number
  end: number
  duration: number
  response?: {
    status?: string
    success: boolean
    result: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  statusCode: number
}

export function isActivationSpec(response: Activation | OpenWhiskEntity): response is Activation {
  const activation = response as Activation
  return activation.response !== undefined && activation.activationId !== undefined
}

export function isAsyncActivationSpec(response: Activation | OpenWhiskEntity): response is Activation {
  const activation = response as Activation
  return activation.response === undefined && activation.activationId !== undefined
}
