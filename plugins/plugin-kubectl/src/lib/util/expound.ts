/*
 * Copyright 2020 The Kubernetes Authors
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

import { Util } from '@kui-shell/core'
import { capitalize } from '../view/modes/table-to-map'

/** job -> [job, jobs, Job, Jobs] */
function expoundKind(kind: string, short?: string) {
  return Util.flatten([kind, `${kind}s`].concat(short ? [short] : []).map(kind => [kind, capitalize(kind)]))
}

/**
 * Expound on the variant ways to express the given kind. For example,
 * singular versus plural, with or without the api group, etc.
 *
 */
export default function expound(kind: string, short?: string, version?: string, group?: string): string[] {
  if (!version) {
    return expoundKind(kind, short)
  } else {
    return Util.flatten(expoundKind(kind, short).map(kind => [kind, `${kind}.${group}`, `${kind}.${version}.${group}`]))
  }
}
