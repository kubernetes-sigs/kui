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

const { name: gettingStartedDocs } = require('@kui-plugin-src/tutorials/@tutorials/getting-started/package.json')
const { name: codingBasicsDocs } = require('@kui-plugin-src/tutorials/@tutorials/coding-basics/package.json')
const { name: combinatorsDocs } = require('@kui-plugin-src/tutorials/@tutorials/combinators/package.json')

import repl = require('@kui/core/repl')

/**
 * Here we register as a listener for "shortcut" commands, that make
 * it a bit easier to launch of some of the entry-level tutorials.
 *
 */
module.exports = (commandTree, prequire) => {
    // getting started shortcut
  commandTree.listen('/getting/started',
                       () => repl.qexec('tutorial play @tutorials/getting-started'),
                       { usage: { cmd: 'started', docs: gettingStartedDocs }, needsUI: true, noAuthOk: true })

    // coding basics shortcut
  commandTree.listen('/tutorial/coding/basics',
                       () => repl.qexec('tutorial play @tutorials/coding-basics'),
                       { usage: { cmd: 'basics', docs: codingBasicsDocs }, needsUI: true, noAuthOk: true })

    // combinators shortcut
  commandTree.listen('/tutorial/combinators',
                       () => repl.qexec('tutorial play @tutorials/combinators'),
                       { usage: { cmd: 'started', docs: combinatorsDocs }, needsUI: true, noAuthOk: true })
}
