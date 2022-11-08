/*
 * Copyright 2019 The Kubernetes Authors
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

export interface Abortable {
  abort(signal?: string): void
}

export interface Resizable {
  resize(rows: number, cols: number): void
}

export function isResizable(job: Partial<Resizable>): job is Resizable {
  return typeof job.resize === 'function'
}

export interface FlowControllable {
  xon(): void
  xoff(): void
  write(data: string): void
}

export type Suspendable = Omit<FlowControllable, 'write'>

/** in the future, a WatchableJob may be more than Abortable, e.g. Suspendable */
export type WatchableJob = Abortable & Partial<Suspendable>

export function isSuspendable(watch: Partial<Suspendable>) {
  return watch.xon && watch.xoff
}

export type Job = Abortable & FlowControllable & Partial<Resizable>
