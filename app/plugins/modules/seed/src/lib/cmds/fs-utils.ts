/*
 * Copyright 2018 IBM Corporation
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

import { lstat, readFile as _readFile } from 'fs'

export const pathExists = (filepath: string): Promise<boolean> => new Promise((resolve, reject) => {
  lstat(filepath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        resolve(false)
      } else {
        throw err
      }
    } else {
      resolve(true)
    }
  })
})

/**
 * Is the given filepath a directory?
 *
 */
export const isDirectory = (filepath: string): Promise<boolean> => new Promise((resolve, reject) => {
  lstat(filepath, (err, stats) => {
    if (err) {
      reject(err)
    } else {
      resolve(stats.isDirectory())
    }
  })
})

/**
 * Read the given file
 *
 */
export const readFile = (filepath: string): Promise<Buffer> => new Promise((resolve, reject) => {
  _readFile(filepath, (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})
