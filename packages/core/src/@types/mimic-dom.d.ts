/*
 * Copyright 2021 The Kubernetes Authors
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

interface SimpleElementMimic {
  rows: SimpleElementMimic[]
  cells: SimpleElementMimic[]
}

interface SimpleLocalStorage {
}

interface SimpleWindow {
  addEventListener?: () => void
  localStorage?: SimpleLocalStorage
  sessionStorage?: SimpleLocalStorage
  navigator?: { userAgent: string }
}

interface SimpleDocument {
  createElement: (tag: string) => SimpleElementMimic
  getElementById: (id: string) => SimpleElementMimic
  body: SimpleElementMimic
  addEventListener: () => void
  createTextNode: (text: string) => SimpleElementMimic
  querySelector: (sel: string) => SimpleElementMimic
}

declare module NodeJS  {
  interface Global {
    window: SimpleWindow
    localStorage: SimpleLocalStorage
    sessionStorage: SimpleLocalStorage
    document: SimpleDocument
  }
}
