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

import Debug from 'debug'
import { Client } from 'minio'
import minimatch from 'minimatch'
import { createGunzip } from 'zlib'
import { createWriteStream } from 'fs'
import { basename, dirname, join } from 'path'

import { DirEntry, FStat, GlobStats, VFS, mount } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, CodedError, REPL, encodeComponent, expandHomeDir, flatten, i18n } from '@kui-shell/core'

import { username, uid, gid } from './username'
import findAvailableProviders, { Provider } from '../providers'

import setResponders from './responders'
import S3VFS, { S3_TAG, baseMountPath } from './S3VFS'

const strings = i18n('plugin-s3')
const debug = Debug('plugin-s3/vfs')

function isS3Provider(vfs: VFS): vfs is S3VFSResponder {
  return !!vfs && !!vfs.tags && vfs.tags.includes(S3_TAG)
}

/** '/a/b/c' -> 3 */
function countSlashes(path: string, dashD: boolean) {
  let count = 0
  for (let idx = 0; idx < path.length; idx++) {
    if (path.charAt(idx) === '/') {
      if (!dashD || idx < path.length - 1) {
        count++
      }
    }
  }
  return count
}

/**
 * ('/a/b/c', 0) => 'a/' or 'a/' depending on the arity of the third argument
 * ('/a/b/c', 1) => '/a/b' or 'b/'
 * ('/a/b/c', 2) => '/a/b/c' or 'c'
 */
function cropToSlashDepth(path: string, depth: number, segment: boolean) {
  let count = 0
  let lastSlashIdx = 0
  for (let idx = 0; idx < path.length; idx++) {
    if (path.charAt(idx) === '/') {
      if (count++ === depth) {
        return path.slice(segment ? lastSlashIdx : 0, idx + 1)
      }
      lastSlashIdx = idx + 1
    }
  }

  return path.slice(segment ? lastSlashIdx : 0)
}

class S3VFSResponder extends S3VFS implements VFS {
  private client: Client
  private listBucketsClient: Client

  public constructor(private readonly options: Provider) {
    super(options.mountName, options.error, options.publicOnly)
  }

  public async init() {
    const { options } = this
    const { Client } = await import('minio')

    if (options.error) {
      this.client = undefined
      this.listBucketsClient = undefined
    } else {
      try {
        // const agent = new Agent({ keepAlive: true, maxSockets: Infinity })
        this.client = new Client(options) // Object.assign(agent,options))
        this.listBucketsClient = options.listBuckets ? new Client(options.listBuckets) : this.client

        // for debugging minio
        // this.client['traceOn'](require('fs').createWriteStream('/tmp/miniolog'))
        // this.listBucketsClient['traceOn'](require('fs').createWriteStream('/tmp/miniolog-listBuckets'))

        // @starpit 20210206: I honestly don't know what's going on here, yet.
        // Linux randomly hangs in the network requests. But, oddly, when I
        // jigger the UI a bit, e.g. by opening a tab and closing it, the request
        // un-wedges. Which indicates that this is unrelated to the network, and
        // perhaps has more to do with ??? chromium bugs ???
        if (process.platform === 'linux') {
          this.client['traceOn'](require('fs').createWriteStream('/dev/null'))
        }
      } catch (error) {
        console.error('Error initializing minio client', error)
        this.error = error
        this.client = undefined
      }
    }
    debug('new s3 vfs responder', options.mountName, options.endPoint)

    return this
  }

  private dirEntryForDirectory(name: string, path: string): DirEntry {
    return {
      name,
      path,
      stats: {
        size: 0,
        mtimeMs: 0,
        mode: 0,
        uid,
        gid
      },
      nameForDisplay: name,
      dirent: {
        mount: { isLocal: this.isLocal, tags: this.tags },
        isFile: false,
        isDirectory: true,
        isSymbolicLink: false,
        isSpecial: false,
        isExecutable: false,
        permissions: '',
        username
      }
    }
  }

  private dirEntryForDirectoryPath(path: string): DirEntry {
    return this.dirEntryForDirectory(basename(path), path)
  }

  public async ls({ parsedOptions }: Parameters<VFS['ls']>[0], filepaths: string[]) {
    return flatten(
      await Promise.all(filepaths.map(filepath => this.dirstat(filepath.replace(this.s3Prefix, ''), parsedOptions.d)))
    )
  }

  /** Throw an error informing the user that they may only access public resources */
  private failIfPublicOnly() {
    if (this.options.publicOnly) {
      throw new Error('No credentials found. You may only access public buckets.')
    }
  }

  /** Degenerate case for `ls /s3`: list all buckets */
  private async listBuckets(): Promise<DirEntry[]> {
    this.failIfPublicOnly()

    const allBuckets = ((await this.listBucketsClient['listBuckets2']({ query: 'extended' })) as any) as {
      name: string
      locationConstraint: string
    }[]
    const visibleBuckets = this.options.bucketFilter ? allBuckets.filter(_ => this.options.bucketFilter(_)) : allBuckets

    return visibleBuckets.map(({ name /* , creationDate */ }) => ({
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
        mount: { isLocal: this.isLocal, tags: this.tags },
        isFile: false,
        isDirectory: true,
        isSymbolicLink: false,
        isSpecial: false,
        isExecutable: false,
        permissions: '',
        username
      }
    }))
  }

  private async listBucketsMatching(pattern: string): Promise<DirEntry[]> {
    const allBuckets = await this.listBuckets()
    return allBuckets.filter(_ => minimatch(_.name, pattern))
  }

  /** Enumerate matching objects */
  private async listObjects(filepath: string, dashD = false): Promise<DirEntry[]> {
    const [, bucketName, bucketNameSlash, prefix, wildcardSuffix] = filepath.match(/([^/*{]+)(\/?)([^*{]*)(.*)/)

    const pattern =
      prefix.length === 0 && (wildcardSuffix.length === 0 || wildcardSuffix === '*')
        ? '*' // e.g. ls /s3/myBucket
        : wildcardSuffix // e.g. ls /s3/myBucket/he*lo

    if ((!bucketNameSlash || (!prefix && !wildcardSuffix)) && dashD) {
      // !bucketNameSlash: ls -d /s3/myBuck*
      // !prefix && !wildcardSuffix: ls -d /s3/myBucket/
      // in either case, with a dashD, we want just to list buckets
      return this.listBucketsMatching(filepath.replace(/\/$/, ''))
    } else if (!bucketNameSlash) {
      // listing entries in one or more buckets
      const buckets = wildcardSuffix
        ? (await this.listBucketsMatching(filepath)).map(_ => _.name) // ls /s3/myBuck*
        : [filepath] // ls /s3/myBucket

      // we now have matching buckets; next, enumerate objects in those buckets
      // should we be passing displayFullPath here, for the wildcard case?
      return flatten(
        await Promise.all(buckets.map(bucketName => this.listObjectsMatching(bucketName, prefix, pattern, dashD)))
      )
    } else {
      // ls /s3/myBucket/myObj*
      return this.listObjectsMatching(bucketName, prefix, pattern, dashD)
    }
  }

  /** Capture a stream of objects to an array */
  private objectStreamToArray(
    bucketName: string,
    displayFullPath: boolean,
    objectStream: ReturnType<Client['listObjects']>
  ): Promise<DirEntry[]> {
    return new Promise<DirEntry[]>((resolve, reject) => {
      const objects: DirEntry[] = []
      objectStream.on('end', () => resolve(objects))
      objectStream.on('close', () => resolve(objects))

      objectStream.on('error', err => {
        debug('Error in S3Vfs.listObjects', err)
        const error: CodedError = new Error(err.message || 'Error listing s3 objects')
        error.code = err['httpstatuscode'] || err['code'] // missing types in @types/minio
        reject(error)
      })

      objectStream.on('data', data => {
        const { prefix, name = prefix, size = 0, lastModified } = data

        // Note: "folders" will have a trailing slash already
        const isDirectory = /\/$/.test(name)

        const path = join(this.mountPath, bucketName, name)

        objects.push({
          name,
          path,
          nameForDisplay: displayFullPath ? path : basename(name),
          stats: {
            size,
            mtimeMs: lastModified ? lastModified.getTime() : Date.now(),
            mode: 0,
            uid,
            gid
          },
          dirent: {
            mount: { isLocal: this.isLocal, tags: this.tags },
            isFile: !isDirectory,
            isDirectory,
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

  /** Enumerate objects with a suffix wildcard, e.g. C* */
  private async listObjectsMatching(
    bucketName: string,
    prefix: string,
    pattern: string,
    dashD: boolean
  ): Promise<DirEntry[]> {
    try {
      // only issue the (potentially very expensive) recursive scan to
      // s3 if the glob pattern has "**"
      const recursive = /\*\*/.test(pattern)
      const displayFullPath = recursive

      const toArray = this.objectStreamToArray.bind(this, bucketName, displayFullPath)
      const prefixEndsWithSlash = prefix.charAt(prefix.length - 1) === '/'

      const [A1, A2] = await Promise.all([
        // list objects, assuming bucketName/prefix is an object
        toArray(this.client.listObjects(bucketName, prefix, recursive)),

        // list objects, guessing that bucketName/prefix/ is a folder
        dashD || prefixEndsWithSlash || (!prefix && pattern === '*')
          ? ([] as DirEntry[])
          : toArray(this.client.listObjects(bucketName, prefix + '/', recursive))
      ])
      const allObjects = A1.concat(A2)

      if (!prefixEndsWithSlash && A2.length > 0) {
        // The user uttered `ls /s3/minio/bucket/folder`, but our
        // second query, the one that guessed "folder" is really a
        // "folder/", got back results! This means our guess was
        // correct. So let us update the prefix variable to reflect
        // this
        prefix = prefix + '/'

        if (!pattern && !dashD) {
          // ls /s3/minio/bucket/folder, and we found that "folder" is
          // an actual folder -> add '*' to the pattern, since we want
          // to enumerate the contents of the bucket
          pattern = '*'
        }
      } else if (prefixEndsWithSlash && !pattern && !dashD) {
        // ls /s3/minio/bucket/folder/ -> add '*' to the pattern,
        // since we want to enumerate the contents of the folder
        pattern = '*'
      }

      const slashDepth = countSlashes(prefix, dashD)
      const matches = allObjects
        .map(_ => {
          // minio does not report separate objects for folders, so we
          // need to do a match against a cropped form of the name
          // e.g. if object.name is `/s3/minio/bucketName/f1/f2/objName`, and
          // prefix is f1 since we won't get a separate callback for
          // `f1/`... we need to splice out the "prefixName", which
          // would be "f1/" in this case, and match against that. thanks
          // minio!
          const prefixName = this.options.understandsFolders ? _.name : cropToSlashDepth(_.name, slashDepth, false)

          const matchAgainst = prefix + (pattern || '')
          const dashDMatch =
            dashD &&
            matchAgainst.charAt(matchAgainst.length - 1) !== '/' &&
            minimatch(prefixName, prefix + (pattern || '') + '/')
          if (dashDMatch || minimatch(prefixName, matchAgainst)) {
            if (this.options.understandsFolders) {
              // easy, if we get separate objects for folders, then a simply glob match suffices
              return Object.assign(_, {
                name: basename(_.name)
              })
            } else {
              // minio makes this more complicated, since it does not
              // report separate objects for folders; see the long comment
              // just above; continuing the above example,
              // e.g. for depth-0 prefix, i.e. ls of bucket, `name` here will be `f1/`
              //      for depth-1 prefix, i.e. ls of folder-in-bucket, `name` will be `f2/`
              //      for depth-2 prefix, i.e. ls of folder-in-folder-in-bucket, `name` will be `objName`
              // thanks again minio for making this complicated!
              const name = cropToSlashDepth(_.name, slashDepth, true)
              const path = join(this.mountPath, bucketName, prefixName)
              const isDirectory = name.charAt(name.length - 1) === '/'

              return Object.assign(_, {
                name: basename(name),
                path,
                nameForDisplay: displayFullPath ? path : basename(name),
                dirent: !isDirectory
                  ? _.dirent
                  : Object.assign(_.dirent, {
                      mount: { isLocal: this.isLocal, tags: this.tags },
                      isFile: false,
                      isDirectory: true
                    })
              })
            }
          }
        })
        .filter(_ => _)

      if (!this.options.understandsFolders) {
        // because of cropToSlashDepth, with minio we may get
        // duplicates, e.g. when doing ls -d on a folder that contains
        // objects
        const M = matches.reduce((M, match) => {
          M[match.path] = (M[match.path] || 0) + 1
          return M
        }, {})
        return matches.filter(match => {
          return --M[match.path] === 0
        })
      } else {
        return matches
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  /** Enumerate the objects specified by the given filepath */
  private async dirstat(filepath: string, dashD: boolean): Promise<DirEntry[]> {
    try {
      if (filepath.length === 0) {
        // then the user has asked to list buckets in a region
        if (dashD) {
          // not sure why they'd do this, but this would be e.g. `ls -d /s3/ibm/default`
          // we already know the region exists, ... so... just return that?
          return [this.dirEntryForDirectoryPath(this.mountPath)]
        }

        return this.listBuckets().catch(err => {
          // console.error(err)
          throw new Error(err.message)
        })
      } else {
        const start = Date.now()
        const res = await this.listObjects(filepath, dashD)
        const end = Date.now()
        debug('dirstat latency', end - start)
        return res
      }
    } catch (err) {
      debug('Error in S3VFS.ls', err)
      throw err
    }
  }

  /** /s3/minio/b/f => { bucketName: 'b', fileName: 'f' } */
  public split(filepath: string): { bucketName: string; fileName: string } {
    const s3PrefixIdx = this.mountPath.length + 1 // e.g. /s3/minio/ (the +1 is for the trailing slash)
    const firstSlashIdx = filepath.indexOf('/', s3PrefixIdx)

    const bucketName = filepath.slice(s3PrefixIdx, firstSlashIdx < 0 ? filepath.length : firstSlashIdx)
    const fileName = firstSlashIdx >= 0 ? filepath.slice(firstSlashIdx + 1) : undefined

    return { bucketName, fileName }
  }

  /** @return whether the given filepath is an s3 folder */
  private async isFolder(bucketName: string, fileName: string): Promise<boolean> {
    try {
      if (!fileName || /\/$/.test(fileName)) {
        return true
      } else {
        await this.client.statObject(bucketName, fileName ? fileName + '/' : undefined)
        return true
      }
    } catch (err) {
      if (!this.options.understandsFolders) {
        // sigh, minio fails with stat'ing a folder (check: AWS, too? COS seems to be ok)
        try {
          return await new Promise((resolve, reject) => {
            try {
              const stream = this.client.listObjects(bucketName, fileName)
              stream.on('error', err => {
                console.error(err)
                resolve(false)
              })
              stream.on('end', () => {
                // if we get here, then the list gave back nothing
                resolve(false)
              })
              stream.on('data', data => {
                const name = data.name || data.prefix
                if (name) {
                  resolve(name.charAt(name.length - 1) === '/')
                }
              })
            } catch (err) {
              reject(err)
            }
          })
        } catch (err2) {
          console.error(err2)
        }
      }
    }

    return false
  }

  /**
   * Upload one or more object. We consult the `vfs ls` API to
   * enumerate the source files. If parsedOptions.P is provided, we
   * set the uploaded objects to public.
   *
   */
  private async fPutObject(
    { REPL, parsedOptions }: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    srcFilepaths: string[],
    dstFilepath: string
  ) {
    const sources = REPL.rexec<GlobStats[]>(`vfs ls ${srcFilepaths.map(_ => encodeComponent(_)).join(' ')}`)
    const { bucketName, fileName } = this.split(dstFilepath)
    const dstIsFolder = await this.isFolder(bucketName, fileName)

    // make public?
    const metadata = parsedOptions.P
      ? {
          'x-amz-acl': 'public-read'
        }
      : {}

    const etagsP = Promise.all(
      (await sources).content.map(_ => {
        const dstFileName = fileName ? (dstIsFolder ? join(fileName, basename(_.path)) : fileName) : basename(_.path)
        return this.client.fPutObject(bucketName, dstFileName, _.path, metadata)
      })
    )

    const etags = await etagsP

    if (parsedOptions.P) {
      const endPoint = /^http/.test(this.options.endPoint) ? this.options.endPoint : `https://${this.options.endPoint}`
      const srcs = (await sources).content
      const folder = dstIsFolder ? fileName : dirname(fileName)
      const dstDir = !folder ? bucketName : join(bucketName, folder)
      if (srcs.find(_ => /index.html$/.test(_.path)) || /index.html$/.test(fileName)) {
        const path = join(dstDir, 'index.html')
        return strings('Published website as', `${endPoint}/${path}`)
      } else if (etags.length === 1) {
        const path = join(dstDir, basename(srcs[0].path))
        return strings('Published object as', `${endPoint}/${path}`)
      } else {
        const path = dstDir
        return strings('Published N objects to', etags.length, `${endPoint}/${path}`)
      }
    } else if (etags.length === 1) {
      return strings('Created object with etag', etags[0])
    } else {
      return strings('Created objects with etags', etags.join(', '))
    }
  }

  /** Download object from provider */
  private async fGetObject(
    { REPL }: Pick<Arguments, 'REPL' | 'parsedOptions'>,
    srcFilepaths: string[],
    dstFilepath: string
  ) {
    const sources = REPL.rexec<GlobStats[]>(`vfs ls ${srcFilepaths.map(_ => encodeComponent(_)).join(' ')}`)
    dstFilepath = expandHomeDir(dstFilepath)

    // NOTE: intentionally not lstat; we want what is referenced by
    // the symlink
    const { stat } = await import('fs')

    const dstIsDirectory = await new Promise<boolean>((resolve, reject) => {
      stat(dstFilepath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // copying to new file
            resolve(false)
          } else {
            // some other error
            reject(err)
          }
        } else {
          resolve(stats.isDirectory())
        }
      })
    })

    if (!dstIsDirectory && srcFilepaths.length > 1) {
      throw new Error('Destination is not a directory')
    }

    const fetched = await Promise.all(
      (await sources).content
        .map(_ => _.path)
        .map(async srcFilepath => {
          const { bucketName, fileName } = this.split(srcFilepath)
          const dst = dstIsDirectory ? join(dstFilepath, basename(fileName)) : dstFilepath

          // we could use fGetObject; this is a bit cheaper, and more bash comformant
          const stream = await this.client.getObject(bucketName, fileName)

          return new Promise((resolve, reject) => {
            const file = createWriteStream(dst)
            file
              .on('error', reject)
              .on('ready', () => stream.pipe(file).on('error', reject))
              .on('finish', () => resolve(basename(srcFilepath)))
          })
        })
    )

    const N = fetched.length
    return `Fetched ${fetched.slice(0, N - 2).join(', ')}${N <= 2 ? '' : ', '}${fetched
      .slice(N - 2)
      .join(N === 2 ? ' and ' : ', and ')} to ${dstFilepath}`
  }

  /** Copy within one provider */
  private async intraCopyObject(
    args: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions' | 'createErrorStream'>,
    srcFilepaths: string[],
    dstFilepath: string
  ) {
    const sources = args.REPL.rexec<GlobStats[]>(`vfs ls ${srcFilepaths.map(_ => encodeComponent(_)).join(' ')}`)

    const etags = await Promise.all(
      (await sources).content
        .map(_ => _.path)
        .map(async srcFilepath => {
          const { bucketName: srcBucket, fileName: srcFile } = this.split(srcFilepath)
          const { bucketName: dstBucket, fileName: dstFile } = this.split(dstFilepath)

          const dstIsFolder = !dstFile || (await this.isFolder(dstBucket, dstFile))
          const dstName = dstIsFolder ? join(dstFile || '.', basename(srcFile)) : dstFile
          debug('intra-client copy src', srcFilepath, srcBucket, srcFile)
          debug('intra-client copy dst', dstFilepath, dstBucket, dstName)

          const { etag } = await this.client.copyObject(dstBucket, dstName, `/${srcBucket}/${srcFile}`, null)
          return etag
        })
    )

    const N = etags.length
    return N === 0
      ? 'Source files not found'
      : `Copied to ${N === 1 ? 'object' : 'objects'} with ${N === 1 ? 'etag' : 'etags'} ${etags.join(', ')}`
  }

  /** Copy between one provider and another */
  private async interCopyObject(
    args: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions' | 'createErrorStream'>,
    srcs: { srcFilepath: string; provider: S3VFSResponder }[],
    dstFilepath: string
  ) {
    const sources = args.REPL.rexec<GlobStats[]>(
      `vfs ls ${srcs
        .map(_ => _.srcFilepath)
        .map(_ => encodeComponent(_))
        .join(' ')}`
    )

    if ((await sources).content.length === 0) {
      throw new Error('Nothing to copy')
    }

    const { bucketName: dstBucket, fileName: dstFile } = this.split(dstFilepath)
    const dstIsFolder = !dstFile || (await this.isFolder(dstBucket, dstFile))

    debug('inter-copy-object sources', (await sources).content)
    const etags = await Promise.all(
      (await sources).content
        .map(_ => _.path)
        .map(async (srcFilepath, idx) => {
          const { provider: srcProvider } = srcs[idx]
          const { bucketName: srcBucket, fileName: srcFile } = srcProvider.split(srcFilepath)

          const dstName = dstIsFolder ? join(dstFile || '.', basename(srcFile)) : dstFile
          debug('inter-client copy src', srcFilepath, srcBucket, srcFile)
          debug('inter-client copy dst', dstFilepath, dstBucket, dstFile)

          const stream = await srcProvider.client.getObject(srcBucket, srcFile)
          const etag = await this.client.putObject(dstBucket, dstName, stream)
          return etag
        })
    )

    const N = etags.length
    return N === 0
      ? 'Source files not found'
      : `Copied to ${N === 1 ? 'object' : 'objects'} with ${N === 1 ? 'etag' : 'etags'} ${etags.join(', ')}`
  }

  public async fwrite(opts: Pick<Arguments, 'REPL'>, fullpath: string, data: string | Buffer) {
    const { bucketName, fileName } = this.split(fullpath)

    if (!bucketName || !fileName) {
      throw new Error(`s3 fwrite usage error: must write to bucket/filename`)
    }

    await this.client.putObject(bucketName, fileName, data)
  }

  /** Insert filepath into directory */
  public async cp(
    args: Pick<Arguments, 'command' | 'REPL' | 'parsedOptions' | 'execOptions' | 'createErrorStream'>,
    srcFilepaths: string[],
    dstFilepath: string,
    srcIsSelf: boolean[],
    dstIsSelf: boolean,
    srcProvider: VFS[]
    /* , dstProvider: VFS */
  ) {
    try {
      const selfSrc = srcFilepaths.filter((_, idx) => srcIsSelf[idx])
      const otherNonS3Src = srcFilepaths.filter((_, idx) => !srcIsSelf[idx] && !isS3Provider(srcProvider[idx]))
      const otherS3Src = srcFilepaths
        .map((srcFilepath, idx) => {
          const provider = srcProvider[idx]
          if (!srcIsSelf[idx] && isS3Provider(provider)) {
            return { srcFilepath, provider }
          }
        })
        .filter(_ => _)

      if (dstIsSelf) {
        // copying into or between s3 buckets
        const copyInTasks = otherNonS3Src.length === 0 ? [] : [this.fPutObject(args, otherNonS3Src, dstFilepath)]
        const intraClientCopyTasks = selfSrc.length === 0 ? [] : [this.intraCopyObject(args, selfSrc, dstFilepath)]
        const interClientCopyTasks =
          otherS3Src.length === 0 ? [] : [this.interCopyObject(args, otherS3Src, dstFilepath)]

        return await Promise.all([...copyInTasks, ...intraClientCopyTasks, ...interClientCopyTasks])
      } else {
        // copying out of an s3 bucket
        return this.fGetObject(args, srcFilepaths, dstFilepath)
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
  private async rimraf(bucketName: string): Promise<string> {
    const buckets = await this.listBucketsMatching(bucketName)
    await Promise.all(
      buckets.map(async ({ name: bucketName }) => {
        await this.client.removeObjects(bucketName, await this.objectsIn(bucketName))
        await this.client.removeBucket(bucketName)
      })
    )

    return buckets.length === 1
      ? strings('Removed bucket X and its contents', buckets[0].name)
      : strings('Removed N buckets and their contents', buckets.length)
  }

  /** Remove filepath */
  public async rm(_, filepath: string, recursive = false): ReturnType<VFS['rm']> {
    try {
      const { bucketName, fileName } = this.split(filepath)
      if (!fileName) {
        // removing a bucket
        if (!recursive) {
          // can't rm a bucket
          throw new Error(`rm: ${bucketName} is a bucket`)
        } else {
          // but we can rm -r a bucket
          return this.rimraf(bucketName)
        }
      } else {
        // removing files
        const objects = await this.listObjects(filepath.replace(this.s3Prefix, ''))
        if (objects.length === 0) {
          throw new Error(`rm: ${filepath}: no such file or directory`)
        }
        await this.client.removeObjects(
          bucketName,
          objects.map(_ => _.path.replace(this.s3Prefix, '').replace(new RegExp(`^${bucketName}/`), ''))
        )
        return `Removed ${objects.length} objects`
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  private async getPartialObject(bucketName: string, fileName: string, offset: number, length: number) {
    try {
      const stream = await this.client.getPartialObject(bucketName, fileName, offset, length)
      return stream
    } catch (err) {
      if (err.code === 'InvalidRange') {
        debug('fslice failed; read the rest of the file', err)
        return this.client.getPartialObject(bucketName, fileName, offset)
      } else {
        throw err
      }
    }
  }

  /** Fetch content slice */
  public async fslice(filepath: string, offset: number, length: number): Promise<string> {
    const { bucketName, fileName } = this.split(filepath)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!fileName) {
        reject(new Error('s3 fslice: no filename provided'))
      } else {
        try {
          let data = ''
          const stream = await this.getPartialObject(bucketName, fileName, offset, length)

          if (filepath.endsWith('.gz')) {
            stream
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
              .on('data', chunk => (data += chunk))
          } else {
            stream
              .on('error', reject)
              .on('end', () => resolve(data))
              .on('data', chunk => (data += chunk))
          }
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  /** Fetch contents */
  public async fstat({ parsedOptions }: Parameters<VFS['fstat']>[0], filepath: string): Promise<FStat> {
    if (filepath.replace(/\/$/, '') === this.mountPath) {
      return Promise.resolve({
        viewer: 'open',
        filepath,
        size: 0,
        fullpath: filepath,
        isDirectory: true
      })
    }

    const { bucketName, fileName } = this.split(filepath)
    if (!fileName) {
      return {
        viewer: 'ls',
        filepath,
        size: 0,
        fullpath: filepath,
        isDirectory: true
      }
    } else {
      try {
        const stats = await this.client.statObject(bucketName, fileName)
        const isDirectory = /\/$/.test(fileName) // by s3 convention, folders end with a slash

        return {
          viewer: 'open',
          filepath,
          fullpath: filepath,
          size: stats.size,
          isDirectory,
          data:
            !isDirectory && parsedOptions['with-data'] && !filepath.endsWith('.gz') && stats.size < 1024 * 1024
              ? await this.readData(bucketName, fileName)
              : ''
        }
      } catch (err) {
        if (err.code === 'NotFound') {
          // folder?
          try {
            /* const stats = */ await this.client.statObject(bucketName, fileName + '/')
            return {
              viewer: 'open',
              filepath,
              fullpath: filepath,
              size: 0,
              isDirectory: true
            }
          } catch (err) {
            debug('not a folder, either')
          }
        }

        // fall-through: report original error
        throw err
      }
    }
  }

  /** @return the data for the specified object */
  private async readData(bucketName: string, fileName: string): Promise<string> {
    const stream = await this.client.getObject(bucketName, fileName)
    return new Promise((resolve, reject) => {
      try {
        let data = ''
        stream.on('error', reject)
        stream.on('data', chunk => (data += chunk))
        stream.on('end', () => resolve(data))
      } catch (err) {
        reject(err)
      }
    })
  }

  /** Create a directory/bucket */
  public async mkdir(_, filepath: string): Promise<void> {
    const { bucketName, fileName } = this.split(filepath)

    if (!fileName) {
      await this.makeBucket(bucketName)
    } else {
      await this.makeFolder(bucketName, fileName)
    }
  }

  /** Make a new "folder" within the given bucket */
  private async makeFolder(bucketName: string, fileName: string): Promise<void> {
    if (!/\/$/.test(fileName)) {
      fileName = fileName + '/'
    }

    await this.client.putObject(bucketName, fileName, '')
  }

  /** Make a new top-level bucket */
  private async makeBucket(bucketName: string): Promise<void> {
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
      if (bucketName) {
        // remove top-level bucket
        await this.client.removeBucket(bucketName)
      } else {
        // remove "folder" within a given bucket
        const fp = !/\/$/.test(filepath) ? filepath + '/' : filepath
        const objects = await this.listObjects(fp.replace(this.s3Prefix, ''))
        if (objects.length > 0) {
          throw new Error(strings('rmdir: X: Directory is not empty', filepath))
        } else {
          await this.client.removeObject(bucketName, fp)
        }
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }
}

export let waitForInitDone: Promise<void>

export default function initS3Mounts() {
  const init = (resolveA?: () => void) => {
    // eslint-disable-next-line promise/param-names
    waitForInitDone = new Promise((resolveB, reject) => {
      if (typeof resolveA === 'function') {
        resolveA()
      }

      setTimeout(() => {
        mount(async (repl: REPL) => {
          try {
            const providers = await findAvailableProviders(repl, init)
            debug(
              'available s3 providers',
              providers.map(_ => _.mountName)
            )

            const vfses = setResponders(
              providers,
              await Promise.all(providers.map(provider => new S3VFSResponder(provider).init()))
            )

            resolveB()
            return vfses
          } catch (err) {
            console.error('Error initializing s3 vfs', err)
            reject(err)
          }
        }, baseMountPath)
      })
    })
  }

  return new Promise(resolve => init(() => resolve(undefined)))
}
