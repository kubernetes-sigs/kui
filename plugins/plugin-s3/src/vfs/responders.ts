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

import { Arguments } from '@kui-shell/core'
import { VFS } from '@kui-shell/plugin-bash-like/fs'

let _responders: VFS[] = []

export function responderFor({ argvNoOptions }: Pick<Arguments, 'argvNoOptions'>) {
  const mountPath = argvNoOptions[2]
  return _responders.find(_ => _.mountPath === mountPath)
}

export default function setResponders(responders: VFS[]) {
  _responders = responders.slice(0)
  return _responders
}
