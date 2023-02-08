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

import TrieSearch from 'trie-search'
import micromatch from 'micromatch'

import type { Arguments, CodedError } from '@kui-shell/core'
import type { FStat, VFS } from '..'

import { basename, dirname, join } from './posix'

const uid = -1
const gid = -1
const username = ''

export interface BaseEntry {
  mountPath: string
  isDirectory?: boolean
  isExecutable?: boolean
}

export type Directory = BaseEntry

export interface Leaf<D> {
  mountPath: string
  isExecutable?: boolean
  data: D
}

export abstract class TrieVFS<D, L extends Leaf<D> = Leaf<D>> implements VFS {
  public readonly isLocal = false
  public readonly isVirtual = true

  protected readonly prefix = new RegExp(`^${this.mountPath}\\/?`)

  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly mountPath = '/kui', protected readonly trie = new TrieSearch<Directory | L>()) {}

  protected abstract loadAsString(leaf: L): string | Promise<string>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected nameForDisplay(name: string, entry: Directory | L): string | Promise<string> {
    return name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected viewer(leaf: Leaf<D>) {
    return 'open'
  }

  protected isLeaf(entry: Directory | L): entry is L {
    return (entry as L).data !== undefined
  }

  /** Turn an ls-style glob into a nodejs-style regexp */
  private glob2RegExp(filepath: string): string {
    return filepath.replace(/\//g, '\\/').replace(/\*/g, '.*')
  }

  private dirPattern(filepath: string): RegExp {
    // /kui/kubernetes -> /\/kui\/kubernetes/[^/]+$/
    if (filepath.charAt(filepath.length - 1) === '/') {
      return new RegExp(`^${this.glob2RegExp(filepath)}[^/]+\\/?$`)
    } else {
      return this.dirPattern(filepath + '/')
    }
  }

  protected trieGet(filepath: string): BaseEntry[] {
    return this.trie.get(filepath)
  }

  /** Looks in the trie for any matches for the given filepath, handling the "contents of directory" case */
  private find(filepath: string, dashD = false, exact = false): (Directory | L)[] {
    const dirPattern = this.dirPattern(filepath)
    const matches = this.trieGet(filepath.replace(/[*{].*$/, '')) // trim off trailing globby bits when looking up in the trie
    const flexMatches = matches.filter(_ =>
      exact ? _.mountPath === filepath : micromatch.isMatch(_.mountPath, filepath) || dirPattern.test(_.mountPath)
    )

    if (dashD) {
      return matches.filter(_ => _.mountPath === filepath || _.mountPath === filepath + '/')
    } else if (exact) {
      return flexMatches
    } else {
      return flexMatches.filter(_ => !_.isDirectory || _.mountPath !== filepath)
    }
  }

  /** Looks in the trie for a single precise match */
  private async findExact(filepath: string, withData: boolean): Promise<FStat> {
    const possibleMatches = this.find(filepath, false, true)

    if (possibleMatches.length > 1) {
      const msg = 'Multiple matches'
      console.error(msg, possibleMatches)
      throw new Error(msg)
    } else if (possibleMatches.length === 0) {
      const flexMatches = this.find(filepath, false, false)
      if (filepath === this.mountPath || flexMatches.find(_ => _.mountPath.startsWith(filepath))) {
        // then this is either a match against the mount position or an interior directory
        return {
          viewer: 'ls',
          filepath,
          fullpath: filepath,
          size: 0,
          isDirectory: true
        }
      }
    } else {
      const entry = possibleMatches[0]
      const data = this.isLeaf(entry) ? await this.loadAsString(entry) : undefined
      const isDirectory = !this.isLeaf(entry)

      return {
        viewer: !this.isLeaf(entry) ? 'open' : this.viewer(entry),
        filepath: entry.mountPath,
        fullpath: entry.mountPath,
        size: data ? data.length : 0,
        isDirectory,
        isExecutable: this.isLeaf(entry) && entry.isExecutable,
        data: (withData && data) || undefined
      }
    }
  }

  private async enumerate({ entries }: { entries: (Directory | L)[] }) {
    return Promise.all(
      entries.map(async (mount: Directory | L) => {
        const name = basename(mount.mountPath)
        const nameForDisplay = await this.nameForDisplay(name, mount)
        const isDir = !this.isLeaf(mount)

        return {
          name,
          nameForDisplay,
          path: mount.mountPath,
          viewer: this.isLeaf(mount) ? this.viewer(mount) : undefined,
          stats: {
            size: 0,
            mtimeMs: 0,
            mode: 0,
            uid,
            gid
          },
          dirent: {
            mount: { isLocal: this.isLocal, mountPath: this.mountPath },
            isFile: !isDir,
            isDirectory: isDir,
            isSymbolicLink: false,
            isSpecial: false,
            isExecutable: this.isLeaf(mount) && mount.isExecutable,
            permissions: '',
            username
          }
        }
      })
    )
  }

  public async ls({ parsedOptions }: Parameters<VFS['ls']>[0], filepaths: string[]) {
    const { flatten } = await import('@kui-shell/core/mdist/api/Util')
    return flatten(
      await Promise.all(
        filepaths
          .map(filepath => ({ filepath, entries: this.find(filepath, parsedOptions.d) }))
          .filter(_ => _.entries.length > 0)
          .map(_ => this.enumerate(_))
      )
    )
  }

  /** Insert filepath into directory */
  public cp(_, srcFilepaths: string[], dstFilepath: string): Promise<string> {
    return Promise.all(
      srcFilepaths.map(async srcFilepath => {
        const match1 = srcFilepath.match(/^plugin:\/\/plugin-(.*)\/notebooks\/(.*)\.(md|json)$/)
        const match2 = srcFilepath.match(/^plugin:\/\/client\/notebooks\/(.*)\.(md|json|yml|yaml|txt|py)$/)
        const match3 = srcFilepath.match(/^plugin:\/\/client\/(.*)\.(md|json)$/)
        const match = match1 || match2 || match3
        if (match) {
          const dir = dirname(dstFilepath)
          if (!this.trieGet(dir)) {
            throw new Error(`Directory does not exist: ${dir}`)
          } else {
            const file = match1 ? match1[2] : match2 ? match2[1] : match3[1]
            const extension = '.' + (match1 ? match1[3] : match2 ? match2[2] : match3[2])
            const mountPath = join(dstFilepath, file + extension)
            this.trie.map(mountPath, { mountPath, data: { srcFilepath } })
          }
        } else {
          throw new Error(`Unable to copy given source into the VFS: ${srcFilepath}`)
        }
      })
    ).then(() => 'ok')
  }

  /** Remove filepath */
  public rm(): ReturnType<VFS['rm']> {
    throw new Error('Unsupported operation')
  }

  /** Fetch contents */
  public async fstat(
    opts: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    filepath: string,
    withData: boolean,
    enoentOk: boolean
  ): Promise<FStat> {
    const entry =
      (await this.findExact(filepath.replace(/\/$/, ''), withData)) || (await this.findExact(filepath + '/', withData))
    if (!entry) {
      if (enoentOk) {
        // i don't think it makes sense to ignore ENOENT for this VFS
      }

      const error: CodedError = new Error(`File not found: ${filepath}`)
      error.code = 404
      throw error
    } else {
      return entry
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async fwrite(opts: Pick<Arguments, 'REPL'>, filepath: string, data: string | Buffer) {
    throw new Error('Unsupported operation')
  }

  /** Fetch content slice */
  public async fslice(filename: string, offset: number, length: number): Promise<string> {
    const entry = await this.findExact(filename, true)
    if (entry.data) {
      const buffer = Buffer.from(entry.data)
      if (offset > buffer.length) {
        throw new Error(`notebook fslice: reach file end`)
      } else {
        const end = !length ? buffer.length : length + offset
        return buffer.slice(offset, end).toString()
      }
    } else {
      throw new Error(`fslice: data not found ${filename}`)
    }
  }

  /** Create a directory/bucket */
  public async mkdir(opts: Pick<Arguments, 'argvNoOptions'>): Promise<void> {
    const mountPath = opts.argvNoOptions[opts.argvNoOptions.indexOf('mkdir') + 1]
    this.trie.map(mountPath, { mountPath, isDirectory: true })
  }

  /** Remove a directory/bucket */
  public rmdir(): Promise<void> {
    throw new Error('Unsupported operation')
  }
}
