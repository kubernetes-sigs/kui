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

import { basename } from 'path'
import { Readable } from 'stream'
import { spawn } from 'child_process'
import { createWriteStream } from 'fs'

import client from './client'

type Command = 'gzip' | 'gunzip'

/** S3 => istream -> gzip -> */
function gzipStream(command: Command, istream: Readable, dstBucket: string, dstObject: string) {
  return new Promise((resolve, reject) => {
    try {
      const gzip = spawn(command, ['-c'], { stdio: ['pipe', 'pipe', 'inherit'] })
      // const tagP = client.putObject(dstBucket, dstObject, gzip.stdout)

      const tmp = '/tmp/kui-tmp.gz'
      const tstream = createWriteStream(tmp)

      gzip.on('close', async () => {
        console.log('gzip done, now waiting on tag')

        tstream.close()
        const tagP = client.fPutObject(dstBucket, dstObject, tmp, {})

        const tag = await tagP
        console.log('tag done', tag)
        resolve(tag)
      })
      gzip.on('error', reject)
      gzip.stdout.pipe(tstream)
      istream.pipe(gzip.stdin)
    } catch (err) {
      console.error('Error in gzipStream', err)
      reject(err)
    }
  })
}

async function gzipShards(command: Command, srcBucket: string, srcObject: string, jobIndex: number, nShards: number) {
  const { size } = await client.statObject(srcBucket, srcObject)
  const chunkSize = ~~(size / nShards)
  const offset = (jobIndex - 1) * chunkSize
  const length = jobIndex === nShards ? size - offset : chunkSize
  console.log(`${command} on /${srcBucket}/${srcObject} jobIndex=${jobIndex} offset=${offset} length=${length}`)

  const dstBucket = srcBucket
  const shard = `${srcObject}-${jobIndex}`
  const dstObject = command === 'gzip' ? `${shard}.gz` : basename(shard)
  console.log('gzipShard', dstBucket, dstObject)

  const istream = await client.getPartialObject(srcBucket, srcObject, offset, length)
  return gzipStream(command, istream, dstBucket, dstObject)
}

async function gzipEntireFile(command: Command, srcBucket: string, srcObject: string) {
  const istream = await client.getObject(srcBucket, srcObject)
  const dstBucket = srcBucket
  const dstObject = command === 'gzip' ? `${srcObject}.gz` : basename(srcObject)
  console.log('gzipEntireFile', dstBucket, dstObject)
  await gzipStream(command, istream, dstBucket, dstObject)
  console.log('gzipEntireFile done')
}

export default async function gzip(this: Command) {
  console.log(process.env)
  const { SRC_BUCKET, SRC_OBJECT, SRC_BUCKETS, SRC_OBJECTS, JOB_INDEX, NSHARDS } = process.env

  const nShards = parseInt(NSHARDS, 10)
  const jobIndex = parseInt(JOB_INDEX, 10)

  if (nShards === 1) {
    const srcBucket = SRC_BUCKETS.split(/,/)[jobIndex - 1]
    const srcObject = SRC_OBJECTS.split(/,/)[jobIndex - 1]
    console.log(`srcBucket=${srcBucket} srcObject=${srcObject}`)
    return gzipEntireFile(this, srcBucket, srcObject)
  } else {
    return gzipShards(this, SRC_BUCKET, SRC_OBJECT, jobIndex, nShards)
  }
}
