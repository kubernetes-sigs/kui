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

import { gunzipSync, gzipSync } from 'zlib'

/**
 * @return a base64-encoded and gzip-compressed version of the given
 * `plaintext`
 *
 */
export function base64PlusGzip(plaintext: string, compress = true): string {
  if (!compress) {
    return Buffer.from(plaintext).toString('base64')
  }

  return Buffer.from(gzipSync(plaintext)).toString('base64')
}

/** @return the reverse of `base64PlusGzip` */
export function decodeBase64PlusGzip(data: string, compressed = true): Buffer {
  if (!compressed) {
    return Buffer.from(data, 'base64')
  } else {
    return gunzipSync(Buffer.from(data, 'base64'))
  }
}
