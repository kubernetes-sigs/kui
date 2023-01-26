/*
 * Copyright 2018 The Kubernetes Authors
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

import type { ExecOptions, REPL } from '@kui-shell/core'

export default async function cwd(execOptions: ExecOptions, repl: REPL): Promise<string> {
  const [{ expandHomeDir, cwd }, { encodeComponent }] = await Promise.all([
    import('@kui-shell/core/mdist/api/Util'),
    import('@kui-shell/core/mdist/api/Exec')
  ])

  return (
    execOptions.cwd ||
    (!(await repl.rexec<{ dirent: { mount: { isLocal: boolean } } }>(`vfs ls -d ${encodeComponent(cwd())}`)).content[0]
      .dirent.mount.isLocal
      ? expandHomeDir('~')
      : cwd())
  )
}
