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

import type { ParsedOptions } from '@kui-shell/core'

export { default as VFS, DirEntry } from './VFS'

// const debug = Debug('plugin-bash-like/fs/vfs')

export interface ParallelismOptions extends ParsedOptions {
  /** Parallelism */
  P: number

  /** Memory per task */
  m: string
  memory: string
}
