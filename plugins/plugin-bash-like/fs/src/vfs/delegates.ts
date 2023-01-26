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

import Debug from 'debug'
import { basename } from 'path'
import { Writable } from 'stream'
import type { Arguments, CodedError } from '@kui-shell/core'

import type { DirEntry, VFS } from '.'

/** '/a/b/c' -> 3 */
function countSlashes(path: string) {
  let count = 0
  for (let idx = 0; idx < path.length; idx++) {
    if (path.charAt(idx) === '/') {
      count++
    }
  }
  return count
}

/** ('/a/b/c', 2) => '/a/b' */
function cropToSlashDepth(path: string, depth: number) {
  let count = 0
  for (let idx = 0; idx < path.length; idx++) {
    if (path.charAt(idx) === '/') {
      if (count++ === depth) {
        return path.slice(0, idx)
      }
    }
  }
  return path
}

/** Remove duplicates from an array of strings */
function removeDuplicates(args: { mountPath: VFS['mountPath']; isLocal: VFS['isLocal']; tags: VFS['tags'] }[]) {
  return args.filter(({ mountPath }, idx) => args.findIndex(_ => _.mountPath === mountPath) === idx)
}

const blankStats: DirEntry['stats'] = {
  size: 0,
  mtimeMs: 0,
  uid: 0,
  gid: 0,
  mode: 0
}

/**
 * `ls` handler for mounts
 *
 */
async function lsMounts(path: string): Promise<DirEntry[]> {
  if (!/[*/]$/.test(path)) {
    path = path + '/'
  }

  const { findMatchingMounts } = await import('./find')

  const depthOfPath = countSlashes(path)
  try {
    const mounts = await findMatchingMounts(path)
    if (mounts) {
      return removeDuplicates(
        mounts
          .filter(mount => !mount.isLocal)
          .map(mount => ({
            mountPath: cropToSlashDepth(mount.mountPath, depthOfPath),
            isLocal: mount.isLocal,
            tags: mount.tags
          }))
      ).map(({ mountPath, isLocal, tags }) => ({
        name: basename(mountPath),
        nameForDisplay: basename(mountPath),
        path: mountPath,
        stats: blankStats,
        dirent: {
          mount: { isLocal, tags, mountPath },
          isFile: false,
          isDirectory: true,
          isSymbolicLink: false,
          isSpecial: false,
          isExecutable: false,
          permissions: '',
          username: ''
        }
      }))
    }
  } catch (err) {
    console.error('tab completion vfs match mounts error', err)
    throw err
  }
}

function removeDuplicates2(vfses: DirEntry[]): DirEntry[] {
  // nice nodejs; set.add doesn't indicate whether something was added??
  const set = new Set()
  return vfses.filter(_ => {
    // some vfses may report directories with a trailing slash
    const canon = _.path.replace(/\/$/, '')

    return !set.has(canon) && set.add(canon)
  })
}

/**
 * ls delegate
 *
 */
export async function ls(...parameters: Parameters<VFS['ls']>): Promise<DirEntry[]> {
  const { cwd, flatten } = await import('@kui-shell/core/mdist/api/Util')
  const { absolute, multiFindMount } = await import('./find')

  const filepaths = parameters[1].length === 0 ? [cwd()] : parameters[1].map(absolute)

  const mounts = await multiFindMount(filepaths, true)
  const vfsContentP = Promise.all(
    mounts.map(async ({ filepaths, mount }) => {
      try {
        return await mount.ls(parameters[0], filepaths)
      } catch (err) {
        if (err.code !== 404) {
          // re: the regexp test, this is an imperfect solution to
          // https://github.com/IBM/kui/issues/7168
          if (!/globby is not defined/.test(err.message)) {
            const debug = Debug('plugin/bash-like/fs/vfs/delegates')
            debug(err)
          }
          throw err
        }
      }
    })
  ).then(flatten)

  // this maintains the mapping from input to mountContent: DirEntry[][]
  const mountContentPerInput = Promise.all(filepaths.map(lsMounts))

  // fire off the ls of Kui registered commands
  const { default: CommandsFS } = await import('./CommandsFS')
  const commandContentPromise = CommandsFS.ls(parameters[0], filepaths)

  // and this flattens that down to a DirEntry[]
  const mountContent = flatten(await mountContentPerInput)

  if (mounts.length === 0 && mountContent.length === 0) {
    const err: CodedError = new Error(`VFS not mounted: ${filepaths}`)
    err.code = 404
    throw err
  }

  // all matching Kui commands, i.e. CommandFS
  const commandContent = await commandContentPromise

  // over all vfs, including CommandFS
  const vfsContent = (await vfsContentP).filter(_ => _)

  // TODO: if no matches, we need to check whether the filepaths are
  // all directories (and no -d); only then is an empty response valid.
  // Otherwise, we need to report a 404.
  return removeDuplicates2(vfsContent.concat(commandContent).concat(mountContent)).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
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
  const { findMount } = await import('./find')
  const mount1 = await Promise.all(srcFilepaths.map(_ => findMount(_)))
  const mount2 = await findMount(dstFilepath)

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
  const { findMount } = await import('./find')
  const mount = await findMount(parameters[1])
  return mount.rm(parameters[0], parameters[1], parameters[2])
}

/**
 * fstat delegate
 *
 */
export async function fstat(...parameters: Parameters<VFS['fstat']>): ReturnType<VFS['fstat']> {
  const { findMount } = await import('./find')
  const mount = await findMount(parameters[1])
  return mount.fstat(parameters[0], parameters[1], parameters[2], parameters[3])
}

/**
 * fwrite delegate
 *
 */
export async function fwrite(...parameters: Parameters<VFS['fwrite']>): ReturnType<VFS['fwrite']> {
  const { findMount } = await import('./find')
  const mount = await findMount(parameters[1])
  return mount.fwrite(parameters[0], parameters[1], parameters[2], parameters[3])
}

/**
 * pipe delegate
 *
 */
export async function pipe(
  filepath: string,
  offset: number,
  length: number,
  stream: Writable
): ReturnType<VFS['pipe']> {
  const { findMount } = await import('./find')
  const mount = await findMount(filepath, undefined, true)

  if (!mount || !mount.pipe) {
    throw new Error(`pipe: can not find ${filepath}`)
  }

  return mount.pipe(filepath, offset, length, stream)
}

/**
 * fslice delegate
 *
 */
export async function fslice(
  filepath: string,
  offsetAsProvided: number,
  length: number,
  unit: 'bytes' | 'lines' = 'bytes',
  end?: number
): ReturnType<VFS['fslice']> {
  const { findMount } = await import('./find')
  const mount = await findMount(filepath, undefined, true)

  if (!mount) {
    throw new Error(`fslice: can not find ${filepath}`)
  }

  if (unit === 'bytes') {
    return mount.fslice(filepath, offsetAsProvided, length)
  } else {
    let offset = offsetAsProvided
    let dataRead = ''
    while (true) {
      try {
        const data = await mount.fslice(filepath, offset, end !== undefined ? end - offset : 4000)
        if (data) {
          dataRead = dataRead.concat(data)
          const lines = dataRead.split('\n')

          if (lines.length >= Math.abs(length)) {
            dataRead = (length < 0 ? lines.slice(length) : lines.slice(0, length)).join('\n')
            break
          } else {
            offset = Buffer.from(dataRead).length
          }
        } else {
          console.error('bash-like fslice: no data read')
          break
        }
      } catch (err) {
        const debug = Debug('plugin/bash-like/fs/vfs/delegates')
        debug(err)
        break
      }
    }

    return dataRead
  }
}

/**
 * mkdir delegate
 *
 */
export async function mkdir(...parameters: Parameters<VFS['mkdir']>): ReturnType<VFS['mkdir']> {
  const { findMount } = await import('./find')
  const mount = await findMount(parameters[1])
  return mount.mkdir(parameters[0], parameters[1])
}

/**
 * rmdir delegate
 *
 */
export async function rmdir(...parameters: Parameters<VFS['rmdir']>): ReturnType<VFS['rmdir']> {
  const { findMount } = await import('./find')
  const mount = await findMount(parameters[1])
  return mount.rmdir(parameters[0], parameters[1])
}
