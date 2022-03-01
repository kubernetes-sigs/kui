/*
 * Copyright 2022 The Kubernetes Authors
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

import { dirname, join } from 'path'

import Input, { Tree } from '../Input'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/tests/data/guidebook-tree-model.md')), '..')

const importa: Tree = { name: 'importa.md', children: [{ name: 'echo AAA' }] }
const importc: Tree = { name: 'importc.md', children: [{ name: 'echo CCC' }] }
const importe: Tree = { name: 'importe.md', children: [{ name: 'Option 1: TabE1', children: [{ name: 'echo EEE' }] }] }
const importd: Tree = {
  name: 'importd.md',
  children: [
    { name: 'Option 1: SubTab1', children: [{ name: 'echo AAA' }, { name: 'echo AAA' }, { name: 'echo AAA' }] },
    { name: 'Option 2: SubTab2', children: [{ name: 'echo BBB' }] }
  ]
}
const importf: Tree = { name: 'importf.md', children: [importd] }

const IN1: Input = {
  input: join(ROOT, 'data', 'guidebook-tree-model.md'),
  tree: [
    {
      name: 'snippets-in-tab3.md',
      children: [importa, importe, importf, importd, importc]
    }
  ]
}

export default IN1
