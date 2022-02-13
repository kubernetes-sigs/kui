/*
 * Copyright 2022 The Kubernetes Authors
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

const events = new EventEmitter()

export type ReadinessHandler = (readyForExecution: boolean) => void

export function emitCodeBlockReadiness(codeBlockId: string, readyForExecution: boolean) {
  events.emit(`/ready/broadcast/${codeBlockId}`, readyForExecution)
}
export function onCodeBlockReadiness(codeBlockId: string, handler: ReadinessHandler) {
  events.on(`/ready/broadcast/${codeBlockId}`, handler)
}
export function offCodeBlockReadiness(codeBlockId: string, handler: ReadinessHandler) {
  events.off(`/ready/broadcast/${codeBlockId}`, handler)
}

export function emitGetCodeBlockReadiness(codeBlockId: string, handler: ReadinessHandler) {
  events.emit(`/ready/get/${codeBlockId}`, handler, codeBlockId)
}
export function onGetCodeBlockReadiness(
  codeBlockId: string,
  getHandler: (handler: ReadinessHandler, codeBlockId: string) => void
) {
  events.on(`/ready/get/${codeBlockId}`, getHandler)
}
export function offGetCodeBlockReadiness(
  codeBlockId: string,
  getHandler: (handler: ReadinessHandler, codeBlockId: string) => void
) {
  events.off(`/ready/get/${codeBlockId}`, getHandler)
}
