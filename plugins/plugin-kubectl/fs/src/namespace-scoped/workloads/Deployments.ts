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

import { basename, join } from 'path'
import { flatten } from '@kui-shell/core'
import { DirEntry, VFS } from '@kui-shell/plugin-bash-like/fs'
import { KubeItems, Pod, Deployment, getPodsCommand } from '@kui-shell/plugin-kubectl'

import KubeSemanticFilesystem, { direntryForResource } from '../../KubeSemanticFilesystem'

abstract class Pseudo<FS extends VFS> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly kind: string) {}

  public vfs(vfs: FS, resourceName: string): Pick<VFS, 'isLocal' | 'mountPath'> {
    return {
      isLocal: false,
      mountPath: join(vfs.mountPath, resourceName, this.kind)
    }
  }

  public direntry(vfs: FS, resourceName: string) {
    return {
      name: this.kind,
      nameForDisplay: this.kind,
      path: this.vfs(vfs, resourceName).mountPath,
      stats: { size: 0, mtimeMs: 0, uid: 0, gid: 0, mode: 0 },
      dirent: {
        isFile: false,
        isDirectory: true,
        isSymbolicLink: false,
        isSpecial: false,
        isExecutable: false,
        permissions: '',
        username: '',
        mount: { isLocal: vfs.isLocal, mountPath: vfs.mountPath }
      }
    }
  }

  public abstract ls(args: Parameters<VFS['ls']>[0], vfs: FS, deploy: Deployment): Promise<DirEntry[]>
}

class PodPseudo<FS extends VFS> extends Pseudo<FS> {
  public constructor() {
    super('pods')
  }

  public async ls(args: Parameters<VFS['ls']>[0], vfs: FS, deploy: Deployment): Promise<DirEntry[]> {
    const pods = (await args.REPL.qexec<KubeItems<Pod>>(getPodsCommand(deploy) + ' -o json')).items
    const pvfs = this.vfs(vfs, deploy.metadata.name)
    return pods.map(pod => direntryForResource(pvfs, pod, true))
  }
}

const pseudos = {
  pods: new PodPseudo<DeploymentsFS>()
}

export default class DeploymentsFS extends KubeSemanticFilesystem<Deployment> {
  public constructor(contextPath: string, contextName: string, ns: string) {
    super(contextPath, contextName, ns, 'deployments', 'workloads')
  }

  protected get isFile() {
    return false
  }

  public async ls(args: Parameters<VFS['ls']>[0], filepaths: string[]) {
    const breakdown = filepaths.reduce(
      (P, _) => {
        const onbase = this.basename(_)
        const pseudo = pseudos[basename(_)]
        if (pseudo) {
          const resourceName = onbase.slice(0, onbase.indexOf('/'))
          P.pseudos.push({ resourceName, pseudo })
        } else if (onbase) {
          P.namedDeployments.push(_)
        } else {
          P.rest.push(_)
        }
        return P
      },
      { namedDeployments: [], pseudos: [], rest: [] }
    )

    const list1 = breakdown.rest.length === 0 ? [] : await super.ls(args, breakdown.rest)
    const list2 =
      breakdown.namedDeployments.length === 0 ? [] : await this.lsDeployments(args, breakdown.namedDeployments)
    const list3 = breakdown.pseudos.length === 0 ? [] : await this.lsPseudos(args, breakdown.pseudos)

    return list1.concat(list2).concat(list3)
  }

  private async lsPseudos(
    args: Parameters<VFS['ls']>[0],
    pseudos: { resourceName: string; pseudo: Pseudo<DeploymentsFS> }[]
  ): Promise<DirEntry[]> {
    const deployments = await super.enumerate(
      args,
      pseudos.map(_ => _.resourceName)
    )
    return flatten(await Promise.all(pseudos.map((_, idx) => _.pseudo.ls(args, this, deployments[idx]))))
  }

  private async lsDeployments(args: Parameters<VFS['ls']>[0], resourceNames: string[]): Promise<DirEntry[]> {
    const deployments = await super.enumerate(args, resourceNames)
    return flatten(await Promise.all(deployments.map(_ => this.dirEntriesForDeployment(args, _))))
  }

  private async dirEntriesForDeployment(args: Parameters<VFS['ls']>[0], deploy: Deployment): Promise<DirEntry[]> {
    return Object.keys(pseudos).map(kind => pseudos[kind].direntry(this, deploy.metadata.name))
  }
}
