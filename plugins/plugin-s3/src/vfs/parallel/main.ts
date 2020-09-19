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

import grep from './grep'
import copyShard from './copy-shard'
import gzip from './gzip'
// import listBuckets from './list-buckets'

import ParallelOperation from './operations'

type Handler = () => Promise<void | string>
const ops: Record<ParallelOperation, Handler> = {
  copyShard,
  // listBuckets,
  grep,
  gzip: gzip.bind('gzip'),
  gunzip: gzip.bind('gunzip')
}

function nope() {
  return 'no OPERATION env var specified'
}

async function dispatch() {
  try {
    const result = await (ops[process.env.OPERATION] || nope)()
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

dispatch()
