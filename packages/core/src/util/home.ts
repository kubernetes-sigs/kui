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

import { join } from 'path'
import { homedir as home } from 'os'

import { inBrowser } from '../core/capabilities'

const _homedir = home()

export const expandHomeDir = function(path: string): string {
  const homedir = (_homedir === '/' && process.env.HOME) || _homedir

  if (!path || !path.slice) {
    return path
  } else if (path === '~') {
    return homedir
  } else if (path.slice(0, 2) !== '~/' && path.slice(0, 2) !== '~\\') {
    return path
  } else {
    return join(homedir, path.slice(2))
  }
}

export default expandHomeDir

export const cwd = () =>
  process.env.VIRTUAL_CWD || (inBrowser() ? process.env.PWD || process.env.HOME || '/' : process.cwd().slice(0))
