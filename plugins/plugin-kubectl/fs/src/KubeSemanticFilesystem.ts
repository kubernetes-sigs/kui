/*
 * Copyright 2021 The Kubernetes Authors
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

// TODO clean this up
/* eslint-disable @typescript-eslint/no-unused-vars */

import minimatch from 'minimatch'
import { basename, dirname, join } from 'path'

import { Arguments } from '@kui-shell/core'
import { FStat, DirEntry, VFS } from '@kui-shell/plugin-bash-like/fs'
import { kubectl, KubeItems, KubeResource } from '@kui-shell/plugin-kubectl'

import root from './root'
import { waitForInitDone } from './preload'

export function direntryForResource(
  vfs: Pick<VFS, 'mountPath' | 'isLocal'>,
  resource: KubeResource,
  isFile: boolean
): DirEntry {
  const { name } = resource.metadata

  return {
    name,
    nameForDisplay: name,
    path: join(vfs.mountPath, name),
    stats: {
      size: 0,
      mtimeMs: Array.isArray(resource.status.conditions)
        ? resource.status.conditions.reduce((max, _) => Math.max(max, new Date(_.lastTransitionTime).getTime()), 0)
        : new Date(resource.metadata.creationTimestamp).getTime(),
      uid: 0,
      gid: 0,
      mode: 0
    },
    dirent: {
      isFile,
      isDirectory: !isFile,
      isSymbolicLink: false,
      isSpecial: false,
      isExecutable: false,
      permissions: '',
      username: '',
      mount: { isLocal: vfs.isLocal, mountPath: vfs.mountPath }
    }
  }
}

export default abstract class KubeSemanticFilesystem<R extends KubeResource = KubeResource> implements VFS {
  public readonly mountPath: string
  public readonly isLocal = false
  public readonly isVirtual = true

  protected readonly mountPattern: RegExp

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    contextPath: string,
    private readonly contextName: string,
    private readonly ns: string,
    private readonly kind: string,
    subdir?: string
  ) {
    this.mountPath = join(root, contextPath, subdir || '', kind)
    this.mountPattern = new RegExp(`^${this.mountPath}\\/?`)
  }

  protected kindFor(filepath: string): string {
    return basename(dirname(filepath))
  }

  protected basename(filepath: string): string {
    return filepath.replace(this.mountPattern, '')
  }

  protected notAGlob(filepath: string) {
    return !/[*?{}]/.test(filepath)
  }

  /** Add any --context/etc. options to the given command line */
  private withContext(cmdline: string, kube = kubectl) {
    return `${kube} ${cmdline} --context ${this.contextName} --namespace ${this.ns}`
  }

  protected async enumerate({ REPL }: Parameters<VFS['ls']>[0], filepaths: string[]): Promise<KubeItems<R>['items']> {
    const patterns = !filepaths ? undefined : filepaths.map(_ => this.basename(_)).filter(Boolean)

    const { items } = await REPL.qexec<KubeItems<R>>(this.withContext(`get ${this.kind} -o json`))
    if (items) {
      return items.filter(_ =>
        !patterns || patterns.length === 0 ? true : patterns.find(pattern => minimatch(_.metadata.name, pattern))
      )
    } else {
      return []
    }
  }

  protected toDirEntries(items: KubeItems<R>['items']): DirEntry[] {
    return items.map(resource => this.direntryForResource(resource))
  }

  public async ls(args: Parameters<VFS['ls']>[0], filepaths: string[]) {
    await waitForInitDone
    return this.toDirEntries(await this.enumerate(args, filepaths))
  }

  /** Insert filepath into directory */
  public cp(_, srcFilepaths: string[], dstFilepath: string): Promise<string> {
    throw new Error('Unsupported operation')
  }

  /** Remove filepath */
  public async rm(args: Parameters<VFS['rm']>[0], filepath: string, recursive?: boolean): ReturnType<VFS['rm']> {
    if (this.notAGlob(filepath)) {
      await args.REPL.qexec(this.withContext(`delete ${this.kind} ${this.basename(filepath)}`))
    } else {
      const matches = await this.ls({ tab: args.tab, REPL: args.REPL, parsedOptions: {} }, [filepath])
      await Promise.all(matches.map(glob => this.withContext(`delete ${this.kind} ${this.basename(glob.path)}`)))
    }
    return true
  }

  /** Fetch contents */
  public async fstat(
    { REPL }: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    filepath: string,
    withData: boolean,
    enoentOk: boolean
  ): Promise<FStat> {
    const name = filepath.slice(this.mountPath.length + 1)
    return {
      viewer: this.withContext(`${this.kindFor(filepath)} -o yaml`, 'kvfs-get'),
      filepath,
      fullpath: filepath,
      size: 0,
      isDirectory: false,
      data: undefined
    }
  }

  /** Fetch content slice */
  public async fslice(filename: string, offset: number, length: number): Promise<string> {
    throw new Error('Unsupported operation')
    return undefined // eslint-disable-line no-unreachable
  }

  public async fwrite(opts: Pick<Arguments, 'REPL'>, filepath: string, data: string | Buffer) {
    throw new Error('Unsupported operation')
  }

  /** Create a directory/bucket */
  public async mkdir(opts: Pick<Arguments, 'argvNoOptions'>): Promise<void> {
    throw new Error('Unsupported operation')
  }

  /** Remove a directory/bucket */
  public rmdir(): Promise<void> {
    throw new Error('Unsupported operation')
  }

  protected get isFile() {
    return true
  }

  protected direntryForResource(resource: KubeResource): DirEntry {
    return direntryForResource(this, resource, this.isFile)
  }
}
