/*
 * Copyright 2018-19 IBM Corporation
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

import {
  Arguments,
  ParsedOptions,
  RawResponse,
  Registrar,
  CodedError,
  findFileWithViewer,
  expandHomeDir
} from '@kui-shell/core'

export interface FStat {
  viewer: string
  filepath: string
  fullpath: string
  isDirectory: boolean
  data?: string
}

interface Options extends ParsedOptions {
  'enoent-ok': boolean
  'with-data': boolean
}

/**
 * Kui command for fs.stat
 *
 */
const fstat = ({ argvNoOptions, parsedOptions }: Arguments<Options>) => {
  return new Promise<RawResponse<FStat>>((resolve, reject) => {
    const filepath = argvNoOptions[1]

    const { resolved: fullpath, viewer = 'open' } = findFileWithViewer(expandHomeDir(filepath))

    const prettyFullPath = fullpath.replace(new RegExp(`^${process.env.HOME}`), '~')

    // note: stat not lstat, because we want to follow the link
    stat(fullpath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          if (parsedOptions['enoent-ok']) {
            // file does not exist; caller told us that's ok
            resolve({
              mode: 'raw',
              content: {
                viewer,
                filepath,
                fullpath: prettyFullPath,
                isDirectory: false,
                data: ''
              }
            })
          }

          const error: CodedError = new Error(err.message)
          error.stack = err.stack
          error.code = 404
          reject(error)
        } else {
          reject(err)
        }
      } else if (stats.isDirectory() || !parsedOptions['with-data']) {
        resolve({
          mode: 'raw',
          content: {
            viewer,
            filepath,
            fullpath: prettyFullPath,
            isDirectory: stats.isDirectory()
          }
        })
      } else {
        readFile(fullpath, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve({
              mode: 'raw',
              content: {
                viewer,
                filepath,
                fullpath: prettyFullPath,
                data: data.toString(),
                isDirectory: false
              }
            })
          }
        })
      }
    })
  })
}

/**
 * Register command handlers
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen('/fstat', fstat, {
    hidden: true,
    requiresLocal: true,
    flags: {
      boolean: ['with-data', 'enoent-ok']
    }
  })
}
