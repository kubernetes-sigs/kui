/*
 * Copyright 2018 IBM Corporation
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

if (process.cwd() === '/') {
  // ugh, on macos, dock- and finder-launched apps have a cwd of /
  try {
    process.chdir(require('@kui-shell/core/util/home').default('~'))
    process.env.PWD = process.cwd()
  } catch (err) {
    console.error(err)
  }
}

require('@kui-shell/core').boot()
