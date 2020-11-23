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

import client from './client'
import { spawn } from 'child_process'

export default async function grep(): Promise<void> {
  console.log(process.env)
  const { SRC_BUCKET, SRC_OBJECT, JOB_INDEX, NSHARDS, PATTERN } = process.env

  const nShards = parseInt(NSHARDS, 10)
  const jobIndex = parseInt(JOB_INDEX, 10)
  // const SRC_FILE = `${SRC_OBJECT}.${JOB_INDEX.padStart(10, '0')}`

  const { size } = await client.statObject(SRC_BUCKET, SRC_OBJECT)
  const chunkSize = ~~(size / nShards)
  const offset = (jobIndex - 1) * chunkSize
  const length = jobIndex === nShards ? size - offset : chunkSize
  console.log(`we are grepping /${SRC_BUCKET}/${SRC_OBJECT} jobIndex=${jobIndex} offset=${offset} length=${length}`)

  const stream = await client.getPartialObject(SRC_BUCKET, SRC_OBJECT, offset, length)

  return new Promise<void>((resolve, reject) => {
    const grep = spawn('grep', [PATTERN], { stdio: ['pipe', 'pipe', 'inherit'] })
    grep.on('close', () => resolve())
    grep.on('error', reject)
    grep.stdout.on('data', data => {
      data
        .toString()
        .split(/\n/)
        .filter(_ => _)
        .forEach(_ => console.log(`GREP ${_}`))
    })
    stream.pipe(grep.stdin)
  })
}
