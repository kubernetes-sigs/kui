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

/* eslint-disable @typescript-eslint/no-unused-vars */
import TrieSearch from 'trie-search'
import micromatch from 'micromatch'
import { basename, dirname, join } from './posix'
import { FStat, VFS, mount } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, CodedError, flatten, Notebook } from '@kui-shell/core'

interface Tutorial {
  name: string
  tutorial: Record<string, any> // FIXME type for snapshot

  path: string
  nameForDisplay: string
}

interface BaseEntry {
  mountPath: string
  isDirectory?: boolean
}

type Directory = BaseEntry

interface Leaf extends BaseEntry {
  data: Notebook
}

type Entry = Leaf | Directory

function isLeaf(entry: Entry): entry is Leaf {
  return (entry as Leaf).data !== undefined
}

const uid = -1
const gid = -1
const username = ''

export class NotebookVFS implements VFS {
  public readonly isLocal = false
  public readonly isVirtual = true

  protected readonly prefix = new RegExp(`^${this.mountPath}\\/?`)

  private readonly trie: TrieSearch<Directory | Leaf> = new TrieSearch()

  // eslint-disable-next-line no-useless-constructor
  public constructor(public readonly mountPath = '/kui') {}

  /** Turn an ls-style glob into a nodejs-style regexp */
  private glob2RegExp(filepath: string): string {
    return filepath.replace(/\//g, '\\/').replace(/\*/g, '.*')
  }

  private dirPattern(filepath: string): RegExp {
    // /kui/kubernetes -> /\/kui\/kubernetes/[^/]*$/
    if (filepath.charAt(filepath.length - 1) === '/') {
      return new RegExp(`^${this.glob2RegExp(filepath)}[^/]+$`)
    } else {
      return this.dirPattern(filepath + '/')
    }
  }

  /** Looks in the trie for any matches for the given filepath, handling the "contents of directory" case */
  private find(filepath: string, dashD = false, exact = false): Entry[] {
    const dirPattern = this.dirPattern(filepath)
    const flexMatches = this.trie
      .get(filepath.replace(/\*.*$/, ''))
      .filter(_ =>
        exact ? _.mountPath === filepath : micromatch.isMatch(_.mountPath, filepath) || dirPattern.test(_.mountPath)
      )
    if (dashD) {
      return flexMatches.filter(_ => _.isDirectory)
    } else if (exact) {
      return flexMatches
    } else {
      return flexMatches.filter(_ => _.mountPath !== filepath)
    }
  }

  /** Looks in the trie for a single precise match */
  private findExact(filepath: string, withData: boolean): FStat {
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
      return {
        viewer: 'replay',
        filepath: entry.mountPath,
        fullpath: entry.mountPath,
        size: isLeaf(entry)
          ? /\.json$/.test(entry.mountPath)
            ? JSON.stringify(entry.data, undefined, 2).length
            : entry.data.toString().length
          : 0,
        isDirectory: !isLeaf(entry),
        data:
          withData && isLeaf(entry)
            ? /\.json$/.test(entry.mountPath)
              ? JSON.stringify(entry.data, undefined, 2)
              : entry.data.toString()
            : undefined
      }
    }
  }

  private enumerate({ entries }: { entries: Entry[] }) {
    return entries.map((mount: Entry) => {
      const name = basename(mount.mountPath)
      const nameForDisplay = isLeaf(mount) && mount.data.metadata ? mount.data.metadata.name || name : name
      const isDir = !isLeaf(mount)

      return {
        name,
        nameForDisplay,
        path: mount.mountPath,
        stats: {
          size: 0,
          mtimeMs: 0,
          mode: 0,
          uid,
          gid
        },
        dirent: {
          mount: { isLocal: this.isLocal },
          isFile: !isDir,
          isDirectory: isDir,
          isSymbolicLink: false,
          isSpecial: false,
          isExecutable: false,
          permissions: '',
          username
        }
      }
    })
  }

  public async ls({ parsedOptions }: Parameters<VFS['ls']>[0], filepaths: string[]) {
    return flatten(
      filepaths
        .map(filepath => ({ filepath, entries: this.find(filepath, parsedOptions.d) }))
        .filter(_ => _.entries.length > 0)
        .map(_ => this.enumerate(_))
    )
  }

  /** Insert filepath into directory */
  public cp(_, srcFilepaths: string[], dstFilepath: string): Promise<string> {
    return Promise.all(
      srcFilepaths.map(srcFilepath => {
        const match1 = srcFilepath.match(/^plugin:\/\/plugin-(.*)\/notebooks\/(.*)\.json$/)
        const match2 = srcFilepath.match(/^plugin:\/\/client\/notebooks\/(.*)\.json$/)
        const match3 = srcFilepath.match(/^plugin:\/\/client\/(.*)\.md$/)
        const match = match1 || match2 || match3
        if (match) {
          try {
            // require versus import to work with babelized headless
            const file = match1 ? match1[2] : match2 ? match2[1] : match3[1]
            const data = match1
              ? require('@kui-shell/plugin-' + match1[1] + '/notebooks/' + file + '.json')
              : match2
              ? require('@kui-shell/client/notebooks/' + file + '.json')
              : require('@kui-shell/client/' + file + '.md').default

            const extension = match1 || match2 ? '.json' : '.md'

            const dir = dirname(dstFilepath)
            if (!this.trie.get(dir)) {
              throw new Error(`Directory does not exist: ${dir}`)
            } else {
              const mountPath = join(dstFilepath, file + extension)
              this.trie.map(mountPath, { mountPath, data })
            }

            return
          } catch (err) {
            console.error(err)
            throw new Error(`Unable to copy given source into the notebooks VFS: ${srcFilepath}. ${err.message}`)
          }
        } else {
          throw new Error(`Unable to copy given source into the notebooks VFS: ${srcFilepath}`)
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
    const entry = this.findExact(filepath, withData)
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

  public async fwrite(opts: Pick<Arguments, 'REPL'>, filepath: string, data: string | Buffer) {
    throw new Error('Unsupported operation')
  }

  /** Fetch content slice */
  public async fslice(filename: string, offset: number, length: number): Promise<string> {
    const entry = this.findExact(filename, true)
    if (entry.data) {
      const buffer = Buffer.from(entry.data)
      if (offset > buffer.length) {
        throw new Error(`notebook fslice: reach file end`)
      } else {
        return buffer.slice(offset, length + offset).toString()
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

const vfs = new NotebookVFS()
export default vfs

export function preload() {
  mount(vfs)
}
