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

import { Arguments, encodeComponent } from '@kui-shell/core'

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
      Object.assign(opts.execOptions, { quiet: opts.parsedOptions.i ? false : opts.execOptions.quiet })
    )
  }

  /** Remove filepath */
  public async rm(opts: Parameters<VFS['rm']>[0]): ReturnType<VFS['rm']> {
    await opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )
    return true
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

  /** grep for file content */
  public async grep(opts: Parameters<VFS['grep']>[0]): ReturnType<VFS['grep']> {
    return opts.REPL.qexec(
      `sendtopty ${opts.command.replace(/^vfs/, '')}`,
      undefined,
      undefined,
      Object.assign(opts.execOptions, { quiet: false })
    )

    /* const args = Object.assign({}, opts, {
      command: opts.command.replace(/^vfs/, '') + ' --color=never',
      argv: opts.argv.slice(1).concat(['--color=never']),
      argvNoOptions: opts.argvNoOptions.slice(1)
    })

    const result = await doExecWithStdoutViaPty(args)
    if (opts.parsedOptions.c) {
      return parseInt(result, 10)
    } else {
      return result.split(/\n/).filter(_ => _)
    } */
  }

  /** unzip a set of files */
  public async gunzip(...parameters: Parameters<VFS['gunzip']>): ReturnType<VFS['gunzip']> {
    const args = parameters[0]
    const suffix = args.parsedOptions.S || args.parsedOptions.suffix
    const filepaths = parameters[1]

    await Promise.all(
      filepaths.map(filepath =>
        args.REPL.qexec(
          `sendtopty gunzip ${args.argv.filter(_ => /^-/.test(_))} ${suffix ? `-S ${suffix}` : ''} ${encodeComponent(
            filepath
          )}`,
          undefined,
          undefined,
          Object.assign(args.execOptions, { quiet: false })
        )
      )
    )
  }
}

export default async () => {
  mount(new LocalVFS())
}
