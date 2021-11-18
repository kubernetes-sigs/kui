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

import { dirname } from 'path'
import { commandsTrie, Util } from '@kui-shell/core'

import { VFS } from '..'
import { TrieVFS, Leaf, Directory, BaseEntry } from './TrieVFS'

class CommandsFS extends TrieVFS<string> {
  public constructor() {
    super('/', commandsTrie)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected isLeaf(entry: Directory | Leaf<string>): entry is Leaf<string> {
    return super.isLeaf(entry) || !entry.isDirectory
  }

  protected loadAsString() {
    return ''
  }

  protected trieGet(filepath: string): BaseEntry[] {
    return this.fillInParents(filepath, Array.from(new Set(this.trie.get(filepath))).map(this.direntry))
  }

  private parentsOf(mountPath: string, enclosing: string): BaseEntry[] {
    const parents = []
    mountPath = dirname(mountPath)
    while (mountPath.length >= enclosing.length) {
      parents.push({ mountPath: mountPath + '/', isDirectory: true })
      if (mountPath === '/') {
        break
      }
      mountPath = dirname(mountPath)
    }

    return parents
  }

  private fillInParents(filepath: string, entries: BaseEntry[]) {
    const parents = Util.flatten(entries.map(_ => this.parentsOf(_.mountPath, filepath.replace(/\/$/, ''))))
    return entries.concat(parents)
  }

  private direntry(mountPath: string) {
    return {
      mountPath,
      isDirectory: false,
      isExecutable: true
    }
  }

  protected viewer() {
    // we want to execute the command directly, not via some helper command
    return ''
  }

  public async ls(args: Parameters<VFS['ls']>[0], filepaths: string[]) {
    const entries = await super.ls(args, filepaths)
    if (entries.length > 0) {
      // remove duplicates, ugh
      const seen: Record<string, boolean> = {}
      return entries.filter(_ => {
        if (!seen[_.path]) {
          seen[_.path] = true
          return true
        } else {
          return false
        }
      })
    } else {
      return entries
    }
  }
}

export default new CommandsFS()
