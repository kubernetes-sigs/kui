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

/**
 * This is a cheap form of isFakeDom for use by repl/exec.ts
 *
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isFakeDom(dom: any): boolean {
  return dom && Object.prototype.hasOwnProperty.call(dom, '_isFakeDom')
}
