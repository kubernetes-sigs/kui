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

import { Notebook, isNotebook } from '@kui-shell/core'
import { VFS, mount } from '@kui-shell/plugin-bash-like/fs'

import TrieVFS, { Leaf, Directory } from './TrieVFS'

interface Tutorial {
  name: string
  tutorial: Record<string, any> // FIXME type for snapshot

  path: string
  nameForDisplay: string
}

type NotebookLeaf = Leaf<Notebook | { srcFilepath: string }>
type NotebookEntry = Directory | NotebookLeaf

export class NotebookVFS extends TrieVFS<NotebookLeaf['data']> implements VFS {
  protected viewer() {
    return 'replay'
  }

  protected async nameForDisplay(name: string, entry: NotebookEntry): Promise<string> {
    const data = this.isLeaf(entry) ? await this.load(entry.data) : undefined
    return data && data.metadata ? data.metadata.name || name : name
  }

  protected async loadAsString(leaf: NotebookLeaf): Promise<string> {
    const notebook = await this.load(leaf.data)
    return /\.json$/.test(leaf.mountPath) ? JSON.stringify(notebook, undefined, 2) : notebook.toString()
  }

  /** Load Notebook data from bundles */
  private async load(data: NotebookLeaf['data']): Promise<Notebook> {
    if (isNotebook(data)) {
      return data
    } else {
      const { srcFilepath } = data

      const match1 = srcFilepath.match(/^plugin:\/\/plugin-(.*)\/notebooks\/(.*)\.json$/)
      const match2 = srcFilepath.match(/^plugin:\/\/client\/notebooks\/(.*)\.json$/)
      const match3 = srcFilepath.match(/^plugin:\/\/client\/(.*)\.md$/)
      const match = match1 || match2 || match3
      if (match) {
        try {
          const file = match1 ? match1[2] : match2 ? match2[1] : match3[1]
          const data = await (match1
            ? import(
                /* webpackExclude: /tsconfig\.json/ */ /* webpackChunkName: "plugin-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/plugin-' +
                  match1[1] +
                  '/notebooks/' +
                  file +
                  '.json'
              )
            : match2
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.json'
              )
            : import(
                /* webpackChunkName: "client-markdown" */ /* webpackMode: "lazy" */ '@kui-shell/client/' + file + '.md'
              ))

          return data.default
        } catch (err) {
          console.error(err)
          throw new Error(`Unable to load Notebook: ${err.message}`)
        }
      } else {
        throw new Error('Unsupported filepath for Notebook')
      }
    }
  }
}

const vfs = new NotebookVFS()
export default vfs

export function preload() {
  mount(vfs)
}
