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

import { Arguments, CodedError, Table, flatten } from '@kui-shell/core'
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
  srcFilepaths: string[],
  dstFilepath: string
): ReturnType<VFS['cp']> {
  const mount1 = srcFilepaths.map(_ => findMount(_))
  const mount2 = findMount(dstFilepath)

  if (mount2.isLocal) {
    // pull out the local-to-local copies
    const localSrc = mount1.map((_, idx) => (_.isLocal ? srcFilepaths[idx] : undefined)).filter(_ => _)
    const nonLocalSrc = mount1
      .map((_, idx) => (!_.isLocal ? { filepath: srcFilepaths[idx], mount: _ } : undefined))
      .filter(_ => _)

    const tasks =
      localSrc.length === 0
        ? []
        : [
            mount2.cp(
              opts,
              localSrc,
              dstFilepath,
              localSrc.map(() => true),
              true,
              mount1,
              mount2
            )
          ]

    if (nonLocalSrc.length > 0) {
      const mountThatManagesTheCopy = nonLocalSrc[0].mount // TODO
      const dstIsSelf = mount2 === mountThatManagesTheCopy
      tasks.push(
        mountThatManagesTheCopy.cp(
          opts,
          nonLocalSrc.map(_ => _.filepath),
          dstFilepath,
          nonLocalSrc.map(_ => _.mount === mountThatManagesTheCopy),
          dstIsSelf,
          mount1,
          mount2
        )
      )
    }
    const responses = await Promise.all(tasks)
    if (responses.length === 1 && responses[0] === true) {
      return true
    } else {
      return responses.join(', ')
    }
  } else {
    const mountThatManagesTheCopy = mount2
    const srcIsSelf = mount1.map(mount => mount === mountThatManagesTheCopy)
    const dstIsSelf = mount2 === mountThatManagesTheCopy
    return mountThatManagesTheCopy.cp(opts, srcFilepaths, dstFilepath, srcIsSelf, dstIsSelf, mount1, mount2)
  }
}

/**
 * rm delegate
 *
 */
export async function rm(...parameters: Parameters<VFS['rm']>): ReturnType<VFS['rm']> {
  const mount = findMount(parameters[1])
  return mount.rm(parameters[0], parameters[1], parameters[2])
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

/*
 * grep delegate
 *
 */
export async function grep(...parameters: Parameters<VFS['grep']>): ReturnType<VFS['grep']> {
  const mounts = multiFindMount(parameters[2], false)
  if (mounts.length === 0) {
    const err: CodedError = new Error(`VFS not mounted: ${parameters[2]}`)
    err.code = 404
    throw err
  }

  const matches = (
    await Promise.all(mounts.map(({ filepaths, mount }) => mount.grep(parameters[0], parameters[1], filepaths)))
  ).filter(_ => _ !== true)

  if (matches.length > 0) {
    if (parameters[0].parsedOptions.c) {
      const N = (matches as number[]).reduce((sum, count) => sum + count, 0)
      return N
    } else {
      return flatten(matches as string[][])
    }
  }
}

/** Collect an array of tables into a single table */
function collectTables(responses: (void | Table)[]): void | Table {
  if (responses) {
    return responses.reduce((T, t) => {
      if (!T) {
        return t
      } else if (t) {
        T.body.splice(T.body.length - 1, 0, ...t.body)
        return T
      }
    }, undefined as Table)
  }
}

/*
 * gzip delegate
 *
 */
export async function gzip(...parameters: Parameters<VFS['gzip']>): ReturnType<VFS['gzip']> {
  const mounts = multiFindMount(parameters[1], true)
  if (mounts.length === 0) {
    const err: CodedError = new Error(`VFS not mounted: ${parameters[1]}`)
    err.code = 404
    throw err
  }

  const responses = await Promise.all(mounts.map(({ filepaths, mount }) => mount.gzip(parameters[0], filepaths)))
  return collectTables(responses)
}

/*
 * gunzip delegate
 *
 */
export async function gunzip(...parameters: Parameters<VFS['gunzip']>): ReturnType<VFS['gunzip']> {
  const mounts = multiFindMount(parameters[1], true)
  if (mounts.length === 0) {
    const err: CodedError = new Error(`VFS not mounted: ${parameters[1]}`)
    err.code = 404
    throw err
  }

  const responses = await Promise.all(mounts.map(({ filepaths, mount }) => mount.gunzip(parameters[0], filepaths)))
  return collectTables(responses)
}
