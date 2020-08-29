/*
 * Copyright 2020 IBM Corporation
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

import { Arguments, CodedError, flatten } from '@kui-shell/core'
import { VFS, findMount, multiFindMount } from '.'

/**
 * ls delegate
 *
 */
export async function ls(...parameters: Parameters<VFS['ls']>): Promise<ReturnType<VFS['ls']>> {
  const mounts = multiFindMount(parameters[1], true)
  if (mounts.length === 0) {
    const err: CodedError = new Error(`VFS not mounted: ${parameters[1]}`)
    err.code = 404
    throw err
  }

  return flatten(await Promise.all(mounts.map(({ filepaths, mount }) => mount.ls(parameters[0], filepaths))))
}

/**
 * cp delegate
 *
 */
export async function cp(
  opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
  srcFilepath: string,
  dstFilepath: string
): ReturnType<VFS['cp']> {
  const mount1 = findMount(srcFilepath)
  const mount2 = findMount(dstFilepath)
  const mountThatManagesTheCopy = mount1.isLocal ? mount2 : mount1
  return mountThatManagesTheCopy.cp(opts, srcFilepath, dstFilepath, mount1.isLocal, mount2.isLocal)
}

/**
 * rm delegate
 *
 */
export async function rm(...parameters: Parameters<VFS['rm']>): ReturnType<VFS['rm']> {
  const mount = findMount(parameters[1])
  await mount.rm(parameters[0], parameters[1], parameters[2])
}

/**
 * fstat delegate
 *
 */
export async function fstat(...parameters: Parameters<VFS['fstat']>): ReturnType<VFS['fstat']> {
  const mount = findMount(parameters[1])
  return mount.fstat(parameters[0], parameters[1], parameters[2], parameters[3])
}

/**
 * mkdir delegate
 *
 */
export async function mkdir(...parameters: Parameters<VFS['mkdir']>): ReturnType<VFS['mkdir']> {
  const mount = findMount(parameters[1])
  return mount.mkdir(parameters[0], parameters[1])
}

/**
 * rmdir delegate
 *
 */
export async function rmdir(...parameters: Parameters<VFS['rmdir']>): ReturnType<VFS['rmdir']> {
  const mount = findMount(parameters[1])
  return mount.rmdir(parameters[0], parameters[1])
}
