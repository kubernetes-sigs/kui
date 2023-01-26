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

import { dirname } from 'path'
import type { Arguments, CodedError, RawResponse, Registrar } from '@kui-shell/core'

export type FwriteOptions = {
  append?: boolean
  a?: boolean
}

export async function _fwrite(_fullpath: string, data: string | Buffer, options: { append?: boolean } = {}) {
  const { mkdir, writeFile, appendFile } = await import('fs')
  const fullpath = _fullpath.replace(/"/g, '') // trim double quotes

  await new Promise<boolean>((resolve, reject) => {
    const errorHandler = (err: NodeJS.ErrnoException) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const error: CodedError = new Error(err.message)
          error.stack = err.stack
          error.code = 404
          reject(error)
        } else {
          reject(err)
        }
      } else {
        resolve(true)
      }
    }

    const write = (path: string, data: string | Buffer) => {
      if (options.append) {
        return appendFile(path, data, errorHandler)
      } else {
        return writeFile(path, data, errorHandler)
      }
    }

    const dir = dirname(fullpath)
    if (dir !== '.') {
      mkdir(dir, { recursive: true }, () => {
        return write(fullpath, data)
      })
    } else {
      write(fullpath, data)
    }
  })
}

/**
 * Kui command for fs.write
 *
 */
const fwrite = async ({ argvNoOptions, execOptions, parsedOptions }: Arguments<FwriteOptions>) => {
  const fullpath = argvNoOptions[1]
  const data = execOptions.data as string | Buffer
  const append = parsedOptions && (parsedOptions.append || parsedOptions.a)

  await _fwrite(fullpath, data, { append })
  return true
}

async function fwriteTemp(args: Arguments): Promise<RawResponse<string>> {
  const { mkTemp } = await import('./mkTemp')
  const data = args.execOptions.data as string | Buffer

  const { content: tmp } = await mkTemp()
  await _fwrite(tmp, data)

  return { mode: 'raw', content: tmp }
}

/**
 * Register command handlers
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/fwrite', fwrite, {
    hidden: true,
    requiresLocal: true
  })

  registrar.listen('/fwriteTemp', fwriteTemp, {
    hidden: true,
    requiresLocal: true
  })
}
