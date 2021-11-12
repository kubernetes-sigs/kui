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
import { PassThrough, Writable } from 'stream'
import { Arguments, CodedError, Util } from '@kui-shell/core'

import { VFS, mount } from '.'
import { kuiglob, KuiGlobOptions } from '../lib/glob'
import { fstat, FStat } from '../lib/fstat'
import { _fwrite } from '../lib/fwrite'

class LocalVFS implements VFS {
  public readonly mountPath = '/'
  public readonly isLocal = true
  public readonly isVirtual = false

  public async ls(opts: Pick<Arguments<KuiGlobOptions>, 'tab' | 'REPL' | 'parsedOptions'>, filepaths: string[]) {
    return kuiglob(this, {
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

  /** Write data to a files */
  public async fwrite(
    opts: Pick<Arguments, 'REPL'>,
    filepath: string,
    data: string | Buffer,
    options: { append?: boolean } = {}
  ): Promise<void> {
    return _fwrite(filepath, data, options)
  }

  /** Pipe a content slice to the given `stream` */
  public pipe(filepath: string, offset: number, _length: number, stream: Writable): Promise<void> {
    const fullpath = Util.expandHomeDir(filepath)

    return new Promise((resolve, reject) => {
      // re: end = _length - 1, this is because the end option is inclusive and _length is not
      if (filepath.endsWith('.gz')) {
        createReadStream(fullpath, { start: offset, end: _length ? offset + _length - 1 : Infinity })
          .pipe(createGunzip())
          .pipe(stream)
          .on('error', (err: CodedError<string>) => {
            if (err.code === 'Z_BUF_ERROR') {
              // this may happen when reading a part of a gzip file
              resolve()
            } else {
              reject(err)
            }
          })
          .on('end', () => resolve())
      } else {
        createReadStream(fullpath, { start: offset, end: _length ? offset + _length - 1 : Infinity })
          .pipe(stream)
          .on('error', reject)
          .on('end', resolve)
      }
    })
  }

  /** Fetch content slice */
  public async fslice(filepath: string, offset: number, length: number): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let data = ''
      const passthrough = new PassThrough()
      passthrough.on('error', reject)
      passthrough.on('data', d => (data += d.toString()))
      await this.pipe(filepath, offset, length, passthrough)
      resolve(data)
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
