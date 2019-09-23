#!/usr/bin/env node

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

const { join } = require('path')
const { exec } = require('child_process')

if (process.platform === 'darwin') {
  console.log('commencing seticon')
  exec(join(__dirname, 'seticon.sh'), { stdio: 'inherit' }, (err, stdout, stderr) => {
    if (err) {
      console.error('error in seticon', err.message)
      console.error(stderr)
      console.error(stdout)
      process.exit(err.code)
    } else {
      console.log(stdout)
      console.log('done')
    }
  })
} else {
  console.log('skipping seticon')
}
