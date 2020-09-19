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

export default async function copyWithSharding() {
  console.log(process.env)
  const { SRC_BUCKET, DST_BUCKET, SRC_OBJECT, JOB_INDEX, NSHARDS } = process.env

  const nShards = parseInt(NSHARDS, 10)
  const jobIndex = parseInt(JOB_INDEX, 10)
  const DST_FILE = `${SRC_OBJECT}.${JOB_INDEX.padStart(10, '0')}`

  const { size } = await client.statObject(SRC_BUCKET, SRC_OBJECT)
  const length = ~~(size / nShards) + (jobIndex === nShards - 1 ? size % nShards : 0)
  const offset = jobIndex * length
  console.log(
    `sharding /${SRC_BUCKET}/${SRC_OBJECT} to /${DST_BUCKET}/${DST_FILE} at offset=${offset} length=${length}`
  )

  const stream = await client.getPartialObject(SRC_BUCKET, SRC_OBJECT, offset, length)

  return client.putObject(DST_BUCKET, DST_FILE, stream)
}
