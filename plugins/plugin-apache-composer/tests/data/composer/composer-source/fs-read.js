/*
 * Copyright 2017-2018 IBM Corporation
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

const composer = require('openwhisk-composer')
const path = require('path')

function foo() {
  const fs = require('fs')
  const authorMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'author-map.json'), 'utf8'))
  return composer.let({ am: authorMap }, p => {
    return am[p.author] === undefined ? {} : am[p.author]
  })
}

module.exports = composer.sequence(foo())
