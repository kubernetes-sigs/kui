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

import { basename, join } from 'path'
import { Client, ClientOptions, CopyConditions } from 'minio'
import { DirEntry, FStat, VFS, mount } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, CodedError, REPL, flatten, inBrowser } from '@kui-shell/core'

import findProvider from '../providers'
import { username, uid, gid } from './username'

export abstract class S3VFS {
  public readonly mountPath = '/s3'
  public readonly isLocal = false

  protected readonly s3Prefix = new RegExp(`^${this.mountPath}\\/?`)
}

class S3VFSResponder extends S3VFS implements VFS {
  private readonly client: Client

  public constructor(private readonly options: ClientOptions) {
    super()
    this.client = new Client(options)
  }

  public async ls(_, filepaths: string[]) {
    return flatten(await Promise.all(filepaths.map(filepath => this.dirstat(filepath.replace(this.s3Prefix, '')))))
  }

  private async dirstat(filepath: string): Promise<DirEntry[]> {
    try {
      if (filepath.length === 0) {
        const buckets = await this.client.listBuckets()
        return buckets.map(({ name /* , creationDate */ }) => ({
          name,
          path: join(this.mountPath, name),
          stats: {
            size: 0,
            mtimeMs: 0,
            mode: 0,
            uid,
            gid
          },
          nameForDisplay: name,
          dirent: {
            isFile: false,
            isDirectory: true,
            isSymbolicLink: false,
            isSpecial: false,
            isExecutable: false,
            permissions: '',
            username
          }
        }))
      } else {
        const [, bucketName, prefix] = filepath.match(/([^/]+)\/?(.*)\*?/)
        const objectStream = await this.client.listObjects(bucketName, prefix)

        return new Promise((resolve, reject) => {
          const objects: DirEntry[] = []

          objectStream.on('end', () => resolve(objects))
          objectStream.on('close', () => resolve(objects))
          objectStream.on('error', err => {
            console.error('Error in S3Vfs.listObjects', err)
            const error: CodedError = new Error(err.message || 'Error listing s3 objects')
            error.code = err['httpstatuscode'] || err['code'] // missing types in @types/minio
            reject(error)
          })

          objectStream.on('data', ({ name, size, lastModified }) => {
            objects.push({
              name,
              path: join(this.mountPath, bucketName, name),
              stats: {
                size,
                mtimeMs: lastModified.getTime(),
                mode: 0,
                uid,
                gid
              },
              nameForDisplay: name,
              dirent: {
                isFile: true,
                isDirectory: false,
                isSymbolicLink: false,
                isSpecial: false,
                isExecutable: false,
                permissions: '',
                username
              }
            })
          })
        })
      }
    } catch (err) {
      console.error('Error in S3VFS.ls', err)
      return []
    }
  }

  private split(filepath: string): { bucketName: string; fileName: string } {
    const [, bucketName, fileName] = filepath.replace(this.s3Prefix, '').match(/([^/]+)\/?(.*)\*?/)
    return { bucketName, fileName }
  }

  private async fPutObject(srcFilepath: string, dstFilepath: string) {
    const { bucketName, fileName } = this.split(dstFilepath)
    const etag = await this.client.fPutObject(bucketName, fileName || basename(srcFilepath), srcFilepath, {})
    return `Created object with etag ${etag}`
  }

  private async fGetObject(srcFilepath: string, dstFilepath: string) {
    // NOTE: intentionally not lstat; we want what is referenced by
    // the symlink
    const { stat } = await import('fs')

    const { bucketName, fileName } = this.split(srcFilepath)

    const dst = await new Promise<string>((resolve, reject) => {
      stat(dstFilepath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(dstFilepath)
          } else {
            reject(err)
          }
        } else {
          resolve(stats.isDirectory() ? join(dstFilepath, fileName) : dstFilepath)
        }
      })
    })

    await this.client.fGetObject(bucketName, fileName, dst)
    return `Fetched object to ${dst}`
  }

  private async fCopyObject(srcFilepath: string, dstFilepath: string) {
    const { bucketName: srcBucket, fileName: srcFile } = this.split(srcFilepath)
    const { bucketName: dstBucket, fileName: dstFile } = this.split(dstFilepath)

    const { etag } = await this.client.copyObject(
      dstBucket,
      dstFile || srcFile,
      `/${srcBucket}/${srcFile}`,
      new CopyConditions()
    )
    return `Copied to object with etag ${etag}`
  }

  /** Insert filepath into directory */
  public async cp(
    _,
    srcFilepath: string,
    dstFilepath: string,
    srcIsLocal: boolean,
    dstIsLocal: boolean
  ): Promise<string> {
    try {
      if (srcIsLocal) {
        return await this.fPutObject(srcFilepath, dstFilepath)
      } else if (dstIsLocal) {
        return await this.fGetObject(srcFilepath, dstFilepath)
      } else {
        return await this.fCopyObject(srcFilepath, dstFilepath)
      }
    } catch (err) {
      const error: CodedError = new Error(err.message)
      error.code = err['httpstatuscode'] || err['code'] // missing types in @types/minio
      throw error
    }
  }

  /** @return recursive list of objects in `bucketName` */
  private async objectsIn(bucketName: string) {
    try {
      const stream = await this.client.listObjects(bucketName, undefined, true)

      return new Promise<string[]>((resolve, reject) => {
        const objects: string[] = []
        stream.on('error', reject)
        stream.on('end', () => resolve(objects))
        stream.on('data', ({ name }) => objects.push(name))
      })
    } catch (err) {
      const error: CodedError = new Error(err.message)
      error.code = err['httpstatuscode'] || err['code'] // missing types in @types/minio
      throw error
    }
  }

  /** rm -rf */
  private async rimraf(bucketName: string) {
    await this.client.removeObjects(bucketName, await this.objectsIn(bucketName))
    await this.client.removeBucket(bucketName)
  }

  /** Remove filepath */
  public async rm(_, filepath: string, recursive = false) {
    try {
      const { bucketName, fileName } = this.split(filepath)
      if (!fileName) {
        if (!recursive) {
          throw new Error(`rm: ${bucketName} is a bucket`)
        } else {
          this.rimraf(bucketName)
        }
      } else {
        await this.client.removeObject(bucketName, fileName)
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /** Fetch contents */
  public fstat(_, filepath: string): Promise<FStat> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const { bucketName, fileName } = this.split(filepath)

        const stream = await this.client.getObject(bucketName, fileName)
        let data = ''
        stream.on('error', reject)
        stream.on('data', chunk => (data += chunk))

        stream.on('end', () => {
          resolve({
            viewer: 'open',
            filepath,
            fullpath: filepath,
            isDirectory: false,
            data
          })
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  /** Create a directory/bucket */
  public async mkdir(_, filepath: string): Promise<void> {
    const { bucketName } = this.split(filepath)

    try {
      await this.client.makeBucket(bucketName, '') // '': use default region
    } catch (err) {
      // for some reason, the core repl does not like minio's error
      if (/Invalid bucket name/.test(err.message)) {
        if (bucketName.length <= 2) {
          throw new Error(err.message + `. Bucket names must have at least 3 characters.`)
        } else if (bucketName.length > 63) {
          throw new Error(err.message + `. Bucket names must have no more than 63 characters.`)
        } else if (/_/.test(bucketName)) {
          throw new Error(err.message + `. Bucket names must not contain underscore.`)
        } else if (/-$/.test(bucketName)) {
          throw new Error(err.message + `. Bucket names must not end with a dash.`)
        } else if (/\./.test(bucketName)) {
          throw new Error(err.message + `. Bucket names must not contain dots.`)
        }
      }
      throw new Error(err.message)
    }
  }

  /** Remove a directory/bucket */
  public async rmdir(_, filepath: string): Promise<void> {
    const { bucketName } = this.split(filepath)

    try {
      await this.client.removeBucket(bucketName)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

class S3VFSForwarder extends S3VFS implements VFS {
  /** Directory listing */
  public async ls(opts: Pick<Arguments, 'tab' | 'REPL' | 'parsedOptions'>, filepaths: string[]): Promise<DirEntry[]> {
    return (
      await opts.REPL.rexec<DirEntry[]>(`vfs-s3 ls ${filepaths.map(_ => opts.REPL.encodeComponent(_)).join(' ')}`)
    ).content
  }

  /** Insert filepath into directory */
  public cp(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    srcFilepath: string,
    dstFilepath: string,
    srcIsLocal: boolean,
    dstIsLocal: boolean
  ): Promise<string> {
    return opts.REPL.qexec<string>(
      `vfs-s3 cp ${opts.REPL.encodeComponent(srcFilepath)} ${opts.REPL.encodeComponent(
        dstFilepath
      )} ${srcIsLocal.toString()} ${dstIsLocal.toString()}`
    )
  }

  /** Remove filepath */
  public async rm(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    filepath: string,
    recursive?: boolean
  ): Promise<void> {
    await opts.REPL.qexec(`vfs-s3 rm ${opts.REPL.encodeComponent(filepath)} ${!!recursive}`)
  }

  /** Fetch contents */
  public async fstat(
    opts: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    filepath: string,
    withData?: boolean,
    enoentOk?: boolean
  ): Promise<FStat> {
    return (
      await opts.REPL.rexec<FStat>(`vfs-s3 fstat ${opts.REPL.encodeComponent(filepath)} ${!!withData} ${!!enoentOk}`)
    ).content
  }

  /** Create a directory/bucket */
  public async mkdir(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    filepath: string
  ): Promise<void> {
    await opts.REPL.qexec(`vfs-s3 mkdir ${opts.REPL.encodeComponent(filepath)}`)
  }

  /** remove a directory/bucket */
  public async rmdir(
    opts: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions'>,
    filepath: string
  ): Promise<void> {
    await opts.REPL.qexec(`vfs-s3 mkdir ${opts.REPL.encodeComponent(filepath)}`)
  }
}

export let responder: VFS

export default async () => {
  mount(async (repl: REPL) => {
    try {
      const client = await findProvider(repl)

      if (inBrowser()) {
        return new S3VFSForwarder()
      } else {
        responder = new S3VFSResponder(client)
        return responder
      }
    } catch (err) {
      console.error('Error initializing s3 vfs', err)
    }
  })
}
