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

import { Capabilities } from '@kui-shell/core'
// import { notebookVFS } from '@kui-shell/plugin-core-support'

export default async function preloadS3Plugin() {
  // intentionally async prefetch of a slow-loading npm
  import('minio')

  const vfsPromise = Capabilities.inBrowser()
    ? import('./vfs/browser').then(_ => _.default())
    : import('./vfs').then(_ => _.default())

  /* if (!Capabilities.isHeadless()) {
    // mount notebooks
    notebookVFS.mkdir({ argvNoOptions: ['mkdir', '/kui/s3'] })
    notebookVFS.cp(undefined, ['plugin://plugin-s3/notebooks/welcome.json'], '/kui/s3/')
  } */

  await vfsPromise
}
