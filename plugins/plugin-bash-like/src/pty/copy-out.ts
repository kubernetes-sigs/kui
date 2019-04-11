/*
 * Copyright 2019 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('plugins/bash-like/pty/copy-out')

import * as fs from 'fs'
import { exec } from 'child_process'
import { basename, dirname, join } from 'path'
import { dir as tmpDir } from 'tmp'
import { exists, lstat, copy, ensureDir, readdir, remove, writeFile, stat } from 'fs-extra'

/**
 * Copy one file out of the electron ASAR
 *
 */
export const copyOutFile = (src: string): Promise<string> => new Promise((resolve, reject) => {
  debug('copyOutFile', src)

  tmpDir(async (err, stage) => {
    if (err) {
      reject(err)
    } else {
      try {
        debug('stage', stage)

        const nmDist = join(stage, 'node_modules')
        await ensureDir(nmDist)
        const nmSrc = dirname(dirname(require.resolve('ws/package.json')))

        const requiredModules = ['ws', 'node-pty-prebuilt', 'nan', 'async-limiter']
        const copyNodeModules = requiredModules.map(async _ => {
          const src = join(nmSrc, _)
          const dest = join(nmDist, _)
          await ensureDir(dest)
          return copyRecursive(src, dest).catch(err => {
            if (err.code === 'ENOENT') {
              // don't complain about not finding one of the
              // requiredModules, as npm might've installed it as a
              // sub-dependence of one of the others
            } else {
              throw err
            }
          })
        })

        const dest = join(stage, basename(src))
        const copyServerJs = copy(src, dest)

        await Promise.all([ copyServerJs, ...copyNodeModules ])

        resolve(dest)
      } catch (err) {
        reject(err)
      }
    }
  })
})

/** flatten an array of arrays */
const flatten = A => [].concat.apply([], A)

/**
 * Look ma, it's cp -R.
 * @param {string} src The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
const copyRecursive = async (src: string, dest: string) => {
  const doesExist = await exists(src)
  const stats = doesExist && await stat(src)
  const isDirectory = doesExist && stats.isDirectory()

  if (doesExist && isDirectory) {
    await ensureDir(dest)
    const files = await readdir(src)

    return flatten(files.map(file => copyRecursive(join(src, file), join(dest, file))))
  } else {
    return copy(src, dest)
  }
}

/** plain file copy that is ASAR-friendly */
const copyFile = (src: string, target: string): Promise<string> => new Promise<string>(async (resolve, reject) => {
  debug('copyFile', src, target)

  let targetFile = target

  // if target is a directory a new file with the same name will be created
  if (await exists(target)) {
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
