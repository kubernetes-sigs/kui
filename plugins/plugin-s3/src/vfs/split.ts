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

/** /s3/minio/b/f => { bucketName: 'b', fileName: 'f' } */
export default function split(
  mountPath: string,
  filepath: string,
  subdir = ''
): { bucketName: string; fileName: string } {
  const s3PrefixIdx = mountPath.length + 1 // e.g. /s3/minio/ (the +1 is for the trailing slash)

  // after stripping off the common prefix of mountPath and filepath
  const leftover = (subdir ? subdir + '/' : '') + filepath.slice(s3PrefixIdx)
  const firstSlashIdx = leftover.indexOf('/')

  const bucketName = leftover.slice(0, firstSlashIdx < 0 ? leftover.length : firstSlashIdx)
  const fileName = firstSlashIdx >= 0 ? leftover.slice(firstSlashIdx + 1) : undefined

  return { bucketName, fileName }
}
