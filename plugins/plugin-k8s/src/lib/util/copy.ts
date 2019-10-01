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

/**
 * Note: we can't use fs-extra's copy, because it isn't compatible
 * with copying files out of an electron asar. Thus, we carefully
 * employ the plain 'fs' when reading source files (which may come
 * from an asar).
 *
 */

import Debug from 'debug'

import * as fs from 'fs'
import { pathExists, lstat, ensureDir, remove, writeFile } from 'fs-extra'
import { basename, join } from 'path'
import { dir as tmpDir, file as tmpFile } from 'tmp'

import { isDirectory } from './util'
const debug = Debug('k8s/cmds/copy')
debug('loading')

type CopyOutHandler = (src: string) => string

/**
 * Copy one file
 *
 */
const copyFile = (src, target) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    debug('copyFile', src, target)

    let targetFile = target

    // if target is a directory a new file with the same name will be created
    if (await pathExists(target)) {
      if ((await lstat(target)).isDirectory()) {
        targetFile = join(target, basename(src))
      }
    }

    fs.readFile(src, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(writeFile(targetFile, data))
      }
    })
  })

/**
 * Copy the src directory to the target directory
 *
 */
export const copy = async (src, target) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    debug('copy', src, target)

    const targetFolder = join(target, basename(src))
    await ensureDir(targetFolder)

    fs.readdir(src, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(
          Promise.all(
            files.map(
              file =>
                new Promise((resolve, reject) => {
                  const srcFile = join(src, file)

                  fs.lstat(srcFile, (err, stats) => {
                    if (err) {
                      reject(err)
                    } else if (stats.isDirectory()) {
                      resolve(copy(srcFile, targetFolder))
                    } else {
                      resolve(copyFile(srcFile, targetFolder))
                    }
                  })
                })
            )
          )
        )
      }
    })
  })

/**
 * Copy the srcDir to a temporary location T, and invoke the given
 * function as fn(T). If fn is not defined, then return T.
 *
 */
export const copyOutDirectory = (srcDir: string, fn?: CopyOutHandler): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    debug('copyOutDirectory', srcDir)

    tmpDir(async (err, path, cleanupCallback) => {
      if (err) {
        cleanupCallback()
        reject(err)
      } else {
        const targetDir = join(path, basename(srcDir))

        try {
          debug('we need to copy out of the asar', srcDir, path)

          await copy(srcDir, path)
          debug('copy-out of complete')

          if (fn) {
            resolve(await fn(targetDir))
          } else {
            resolve(targetDir)
          }
        } catch (err) {
          reject(err)
        } finally {
          if (fn) {
            await remove(targetDir)
            cleanupCallback()
          }
        }
      }
    })
  })

/**
 * Copy the src file to a non-asar directory, and return that filepath.
 *
 */
export const copyOutFile = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    debug('copyOutFile', src)

    tmpFile(async (err, path, fd, cleanupCallback) => {
      if (err) {
        cleanupCallback()
        reject(err)
      } else {
        await copyFile(src, path)
        resolve(path)
      }
    })
  })

export const copyOut = async (src: string, fn?: CopyOutHandler): Promise<string> => {
  if (await isDirectory(src)) {
    return copyOutDirectory(src, fn)
  } else {
    return copyOutFile(src)
  }
}
