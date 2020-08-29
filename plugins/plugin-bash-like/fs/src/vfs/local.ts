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

import { Arguments } from '@kui-shell/core'

import { VFS, mount } from '.'
import { kuiglob, KuiGlobOptions } from '../lib/glob'
import { fstat, FStat } from '../lib/fstat'

class LocalVFS implements VFS {
  public readonly mountPath = '/'
  public readonly isLocal = true
  public readonly isVirtual = false

  public async ls(opts: Pick<Arguments<KuiGlobOptions>, 'tab' | 'REPL' | 'parsedOptions'>, filepaths: string[]) {
    return kuiglob({
      tab: opts.tab,
      argvNoOptions: ['kuiglob', ...filepaths],
      parsedOptions: opts.parsedOptions
    })
  }

  /** Insert filepath into directory */
  public async cp(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>): Promise<string> {
    return opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )
  }

  /** Remove filepath */
  public async rm(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>) {
    await opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )
  }

  /** Fetch contents */
  public async fstat(
    opts: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    filepath: string,
    withData: boolean,
    enoentOk: boolean
  ): Promise<FStat> {
    return fstat({
      argvNoOptions: ['fstat', filepath],
      parsedOptions: { 'with-data': withData, 'enoent-ok': enoentOk }
    })
  }

  /** Create a directory/bucket */
  public async mkdir(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>): Promise<void> {
    await opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )
  }

  /** Remove a directory/bucket */
  public async rmdir(opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>): Promise<void> {
    await opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )
  }
}

export default async () => {
  mount(new LocalVFS())
}
