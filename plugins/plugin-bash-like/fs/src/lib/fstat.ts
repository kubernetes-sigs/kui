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

import { readFile, stat } from 'fs'
import type { Arguments, ParsedOptions, CodedError } from '@kui-shell/core'

export interface FStat {
  viewer: string
  filepath: string
  fullpath: string
  isDirectory: boolean
  isExecutable?: boolean
  size: number
  data?: string
}

export interface FStatOptions extends ParsedOptions {
  'enoent-ok': boolean
  'with-data': boolean
}

function readData(fullpath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(fullpath, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}

/**
 * Kui command for fs.stat
 *
 */
export const fstat = async ({
  argvNoOptions,
  parsedOptions
}: Pick<Arguments<FStatOptions>, 'argvNoOptions' | 'parsedOptions'>) => {
  const { expandHomeDir } = await import('@kui-shell/core/mdist/api/Util')

  const filepath = argvNoOptions[1]
  const viewer = 'open'
  const fullpath = expandHomeDir(filepath)

  const prettyFullPath = fullpath.replace(new RegExp(`^${process.env.HOME}`), '~')

  return new Promise<FStat>((resolve, reject) => {
    const handleError = (err: CodedError<string>) => {
      if (err.code === 'ENOENT') {
        if (parsedOptions['enoent-ok']) {
          // file does not exist; caller told us that's ok
          resolve({
            viewer,
            filepath,
            fullpath: prettyFullPath,
            isDirectory: false,
            size: 0,
            data: ''
          })
        }

        const error: CodedError = new Error(err.message)
        error.stack = err.stack
        error.code = 404
        reject(error)
      } else {
        reject(err)
      }
    }

    // note: stat not lstat, because we want to follow the link
    stat(fullpath, async (err, stats) => {
      if (err) {
        handleError(err)
      } else {
        resolve({
          viewer,
          filepath,
          fullpath: prettyFullPath,
          isDirectory: stats.isDirectory(),
          size: stats.size,
          data:
            !stats.isDirectory() &&
            parsedOptions['with-data'] &&
            !filepath.endsWith('.gz') &&
            stats.size < 10 * 1024 * 1024
              ? await readData(fullpath)
              : ''
        })
      }
    })
  })
}
