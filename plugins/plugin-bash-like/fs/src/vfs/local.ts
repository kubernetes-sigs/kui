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

import { createGunzip } from 'zlib'
import { createReadStream } from 'fs'
import { Arguments, CodedError, encodeComponent, expandHomeDir, findFileWithViewer } from '@kui-shell/core'

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

  /** Fetch content slice */
  public async fslice(filepath: string, offset: number, _length: number): Promise<string> {
    const { resolved: fullpath } = findFileWithViewer(expandHomeDir(filepath))

    return new Promise((resolve, reject) => {
      let data = ''

      // re: end = _length - 1, this is because the end option is inclusive and _length is not
      if (filepath.endsWith('.gz')) {
        createReadStream(fullpath, { start: offset, end: _length ? _length - 1 : Infinity })
          .pipe(createGunzip())
          .on('error', (err: CodedError<string>) => {
            if (err.code === 'Z_BUF_ERROR') {
              // this may happen when reading a part of a gzip file
              resolve(data)
            } else {
              reject(err)
            }
          })
          .on('end', () => resolve(data))
          .on('data', d => (data += d))
      } else {
        createReadStream(fullpath, { start: offset, end: _length ? _length - 1 : Infinity })
          .on('error', reject)
          .on('end', () => {
            resolve(data)
          })
          .on('data', d => (data += d))
      }
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
  }

  private async zip(
    args: Parameters<VFS['gunzip']>[0],
    filepaths: Parameters<VFS['gunzip']>[1],
    cmd: 'gzip' | 'gunzip'
  ): ReturnType<VFS['gunzip']> {
    const suffix = args.parsedOptions.S || args.parsedOptions.suffix

    await Promise.all(
      filepaths.map(filepath =>
        args.REPL.qexec(
          `sendtopty ${cmd} ${args.argv.filter(_ => /^-/.test(_))} ${suffix ? `-S ${suffix}` : ''} ${encodeComponent(
            filepath
          )}`,
          undefined,
          undefined,
          Object.assign(args.execOptions, { quiet: false })
        )
      )
    )
  }

  /** zip a set of files */
  public gzip(...parameters: Parameters<VFS['gzip']>): ReturnType<VFS['gzip']> {
    return this.zip(parameters[0], parameters[1], 'gzip')
  }

  /** unzip a set of files */
  public gunzip(...parameters: Parameters<VFS['gunzip']>): ReturnType<VFS['gunzip']> {
    return this.zip(parameters[0], parameters[1], 'gunzip')
  }
}

export default async () => {
  mount(new LocalVFS())
}
