/*
 * Copyright 2017 IBM Corporation
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

import { Action } from '../../../models/resource'

export const ANON_KEY = 'anonymous-function'
export const ANON_KEY_FQN = 'anonymous-function-fqn'
export const ANON_CODE = 'anonymous-code'

/**
 * Is the given action entity an anonymous let
 *
 */
export const isAnonymousLet = (action: Action) => {
  if (action.annotations && action.annotations.find(kv => kv.key === ANON_KEY)) {
    const code = action.annotations.find(kv => kv.key === ANON_CODE)
    return code && code.value
  }
}

export const isAnonymousLetFor = (action: Action, parent: string) => {
  const annotation = action.annotations && action.annotations.find(kv => kv.key === ANON_KEY)
  const annotationFQN = action.annotations && action.annotations.find(kv => kv.key === ANON_KEY_FQN)
  return (annotation && annotation.value === parent) || (annotationFQN && annotationFQN.value === parent)
}
