/*
 * Copyright 2019 The Kubernetes Authors
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

const proc = require('process/browser')

const HOME = '~'
let cwd = HOME

/**
 * Browser-oriented shims for 'process'
 *
 */
module.exports = Object.assign(proc, {
  env: {
    HOME,
    IS_OFFLINE_CLIENT: 'true'
  },

  cwd: () => cwd,

  chdir: dir => (cwd = dir),

  stdout: {
    // yargs expects process.stdout to be defined
  }
})
