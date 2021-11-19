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

import { Capabilities, Store } from '@kui-shell/core'

const localStorageKey = {
  auth: 'kui.k8s.auth'
}

/**
 * Model update
 *
 */
export const setAuth = (kubeconfigString: string, ca: string, cafile: string): void => {
  const auth = {
    kubeconfig: kubeconfigString,
    ca: ca,
    cafile
  }

  Capabilities.setHasAuth('k8s', auth)
  Store().setItem(localStorageKey.auth, JSON.stringify(auth))
}

/**
 * Model restore on browser reload
 *
 */
export const restoreAuth = (): void => {
  const maybe = Store().getItem(localStorageKey.auth)
  if (maybe) {
    try {
      Capabilities.setHasAuth('k8s', JSON.parse(maybe))
    } catch (err) {
      console.error('error parsing k8s auth from localStorage', err)
    }
  }
}
