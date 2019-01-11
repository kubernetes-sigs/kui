#!/usr/bin/env node

/*
 * Copyright 2017 IBM Corporation
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

require('module-alias/register')

const compile = require('../../build/core/plugin-assembler').default
const path = require('path')

if (process.argv[2] === 'cleanup') {
  // nothing to do
} else {
  // determine the output directory
  const idx = process.argv.findIndex(_ => _ === '-d')
  const externalOnly = idx >= 0
  const rootDir = externalOnly // dir points to the final location of .pre-scanned
    ? process.argv[idx + 1] //    save the model to the given directory
    : path.join(__dirname, '../../app') //    save the model to the built-in directory

  compile(rootDir, externalOnly)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
