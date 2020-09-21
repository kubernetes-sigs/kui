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

import { Entity } from './entity'

export interface XtermResponse {
  apiVersion: 'kui-shell/v1'
  kind: 'XtermResponse'
  rows: XtermResponseCell[][]
  code?: number
}

export interface XtermResponseCell {
  innerText: string
  textContent: string
  classList?: string[]
  style?: Record<string, string>
}

export function isXtermResponse(entity: Entity): entity is XtermResponse {
  const response = entity as XtermResponse
  return response.apiVersion === 'kui-shell/v1' && response.kind === 'XtermResponse'
}

export function isXtermErrorResponse(entity: Entity): boolean {
  return isXtermResponse(entity) && entity.code !== undefined && entity.code !== 0
}
