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

import type { Arguments, RawResponse, Registrar } from '@kui-shell/core'

export async function mkTemp(): Promise<RawResponse<string>> {
  const { file: tmpFile } = await import('tmp')

  return new Promise((resolve, reject) => {
    tmpFile({ prefix: 'kui-' }, (err, tmp) => {
      if (err) {
        reject(err)
      } else {
        resolve({ mode: 'raw', content: tmp })
      }
    })
  })
}

async function rmTemp(args: Arguments) {
  const { unlink } = await import('fs')

  return new Promise((resolve, reject) => {
    unlink(args.argvNoOptions[1], err => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

/**
 * Register command handlers
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/mkTemp', mkTemp, {
    hidden: true,
    requiresLocal: true
  })

  registrar.listen('/rmTemp', rmTemp, {
    hidden: true,
    requiresLocal: true
  })
}
