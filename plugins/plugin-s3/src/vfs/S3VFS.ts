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

import { join } from 'path'
import { VFS } from '@kui-shell/plugin-bash-like/fs'

export const S3_TAG = 's3'
export const baseMountPath = '/s3'

export function mountPathFor(mountName: string) {
  return join(baseMountPath, mountName)
}

export type VFSWithError = VFS & { error: Error; publicOnly: boolean }

abstract class S3VFS {
  public readonly mountPath: string
  public readonly isLocal = false
  public readonly isVirtual = false
  public readonly tags = [S3_TAG]
  protected readonly s3Prefix: RegExp

  public constructor(mountName: string, private _error: Error = undefined, public readonly publicOnly = false) {
    this.mountPath = mountPathFor(mountName)
    this.s3Prefix = new RegExp(`^${this.mountPath}\\/?`)
  }

  public get error() {
    return this._error
  }

  public set error(error: Error) {
    this._error = error
  }
}

export default S3VFS
