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

// DO NOT USE IMPORT
// as it conflicts with the kui-builder kui-link-source-assets.sh
// the typescript compiler moves the json files into the builddir, if we use import
import { CommandRegistrar, ExecType } from '@kui-shell/core/models/command'
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  name: gettingStartedDocs
} = require('@kui-shell/plugin-tutorials/samples/@tutorials/getting-started/package.json')
const {
  name: kubernetesBasicsDocs
} = require('@kui-shell/plugin-tutorials/samples/@tutorials/kubernetes-basics/package.json')
const { name: codingBasicsDocs } = require('@kui-shell/plugin-tutorials/samples/@tutorials/coding-basics/package.json')
const { name: combinatorsDocs } = require('@kui-shell/plugin-tutorials/samples/@tutorials/combinators/package.json')
/* eslint-enable @typescript-eslint/no-var-requires */

import { qexec } from '@kui-shell/core/core/repl'

/**
 * Here we register as a listener for "shortcut" commands, that make
 * it a bit easier to launch of some of the entry-level tutorials.
 *
 */
export default async (commandTree: CommandRegistrar) => {
  // kubernetes coding basics shortcut
  commandTree.listen(
    '/tutorial/kubernetes/starter',
    () => qexec('tutorial play @tutorials/kubernetes-basics --top-level'),
    {
      usage: { command: 'basics', docs: kubernetesBasicsDocs },
      needsUI: true,
      inBrowserOk: true,
      noAuthOk: true
    }
  )

  // coding basics shortcut
  commandTree.listen('/tutorial/composer/basics', () => qexec('tutorial play @tutorials/coding-basics --top-level'), {
    usage: { command: 'basics', docs: codingBasicsDocs },
    needsUI: true,
    inBrowserOk: true,
    noAuthOk: true
  })

  // combinators shortcut
  commandTree.listen('/tutorial/combinators', () => qexec('tutorial play @tutorials/combinators --top-level'), {
    usage: { command: 'started', docs: combinatorsDocs },
    needsUI: true,
    inBrowserOk: true,
    noAuthOk: true
  })
}
