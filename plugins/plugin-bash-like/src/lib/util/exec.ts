/*
 * Copyright 2018 The Kubernetes Authors
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

/** does the given strong span a large number of lines? */
export const reallyLong = str => str.split(/[\n\r]/).length > 20

export const handleNonZeroExitCode = (
  command: string,
  exitCode: number,
  rawOut: string,
  rawErr: string,
  execOptions,
  parentNode?: Element
) => {
  // e.g. `git` with no arguments yields an exit code of 1, but
  // dumps the usage to stdout, not stderr
  const stderr = rawErr.length === 0 ? rawOut : rawErr

  // note for below: 127 means command not found in POSIX land
  // 128 through (128+33) signify the 33 standard POSIX exit codes
  if (execOptions && execOptions.nested && exitCode < 127) {
    const error = new Error(stderr)
    error['code'] = exitCode
    throw error
  } else {
    const error = new Error(stderr)
    error['html'] = parentNode

    if (execOptions.stderr) error['code'] = parentNode
    else if (/File exists/i.test(stderr)) error['code'] = 409
    // re: i18n, this is for tests
    else if (exitCode !== 127 && /not found/i.test(stderr)) error['code'] = 404
    // re: i18n, this is for tests
    else error['code'] = exitCode

    throw error
  }
}
