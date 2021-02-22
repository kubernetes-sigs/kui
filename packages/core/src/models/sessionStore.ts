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

interface SessionStorage {
  getItem: (key: string) => string
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

declare const kuiSessionStorage: SessionStorage

/**
 * This shim allows clients to define a sessionStorage scheme, if they
 * cannot provide window.sessionStorage.
 *
 */
export default (): SessionStorage =>
  typeof kuiSessionStorage !== 'undefined' ? kuiSessionStorage : window.sessionStorage
