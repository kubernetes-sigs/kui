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

import { TrieVFS, VFS, mount } from '@kui-shell/plugin-bash-like/fs'

type NotebookLeaf = TrieVFS.Leaf<{ srcFilepath: string }>
// type NotebookEntry = TrieVFS.Directory | NotebookLeaf

export class NotebookVFS extends TrieVFS.TrieVFS<NotebookLeaf['data']> implements VFS {
  protected viewer() {
    return 'replay'
  }

  protected async nameForDisplay(name: string): Promise<string> {
    return name
  }

  protected async loadAsString(leaf: NotebookLeaf): Promise<string> {
    const notebook = await this.load(leaf.data)
    return /\.json$/.test(leaf.mountPath) ? JSON.stringify(notebook, undefined, 2) : notebook.toString()
  }

  /** Load Notebook data from bundles */
  private async load(data: NotebookLeaf['data']): Promise<string> {
    const { srcFilepath } = data

    const match1 = srcFilepath.match(/^plugin:\/\/plugin-(.*)\/notebooks\/(.*)\.(md|json)$/)
    const match2 = srcFilepath.match(/^plugin:\/\/client\/notebooks\/(.*)\.(md|json|yml|yaml|txt|py)$/)
    const match3 = srcFilepath.match(/^plugin:\/\/client\/(.*)\.(md|json)$/)
    const match = match1 || match2 || match3
    if (match) {
      try {
        const file = match1 ? match1[2] : match2 ? match2[1] : match3[1]
        const extension = match1 ? match1[3] : match2 ? match2[2] : match3[2]
        const data = await (match1
          ? extension === 'md'
            ? import(
                /* webpackExclude: /tsconfig\.json/ */ /* webpackChunkName: "plugin-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/plugin-' +
                  match1[1] +
                  '/notebooks/' +
                  file +
                  '.md'
              )
            : import(
                /* webpackExclude: /tsconfig\.json/ */ /* webpackChunkName: "plugin-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/plugin-' +
                  match1[1] +
                  '/notebooks/' +
                  file +
                  '.json'
              )
          : match2
          ? extension === 'md'
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.md'
              )
            : extension === 'yml'
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.yml'
              )
            : extension === 'yaml'
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.yaml'
              )
            : extension === 'txt'
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.txt'
              )
            : extension === 'py'
            ? import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.py'
              )
            : import(
                /* webpackChunkName: "client-notebooks" */ /* webpackMode: "lazy" */ '@kui-shell/client/notebooks/' +
                  file +
                  '.json'
              )
          : extension === 'md'
          ? import(
              /* webpackChunkName: "client-markdown" */ /* webpackMode: "lazy" */ '@kui-shell/client/' + file + '.md'
            )
          : import(
              /* webpackChunkName: "client-markdown" */ /* webpackMode: "lazy" */ '@kui-shell/client/' + file + '.json'
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

const vfs = new NotebookVFS()
export default vfs

export function preload() {
  mount(vfs)
}
