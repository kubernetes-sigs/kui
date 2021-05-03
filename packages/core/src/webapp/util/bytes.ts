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

/** @return pretty-printed bytes */
export default function safePrettyPrintBytes(_bytes: string | number): string {
  try {
    const bytes = typeof _bytes === 'string' ? parseInt(_bytes, 10) : _bytes

    if (bytes < 1024) {
      return bytes.toFixed(2) + ' b'
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(0) + ' KiB'
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / 1024 / 1024).toFixed(0) + ' MiB'
    } else if (bytes < 1024 * 1024 * 1024 * 1024) {
      return (bytes / 1024 / 1024 / 1024).toFixed(0) + ' GiB'
    } else {
      return (bytes / 1024 / 1024 / 1024 / 1024).toFixed(0) + ' TiB'
    }
  } catch (err) {
    return _bytes.toString()
  }
}
