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

import { join } from 'path'

import Input, { Tree } from '../Input'
import { importa, importe, importd } from './1'

const snippetsInTab5: Tree = {
  name: 'snippets-in-tab5.md',
  children: [{ name: 'Option 2: Tab2', children: [{ name: 'echo XXX' }] }]
}

const filename = 'guidebook-tree-model4.md'

const IN4: Input = {
  input: require.resolve(join('@kui-shell/plugin-client-common/tests/data', filename)),
  tree: (command: string) => [
    {
      name: command === 'guide' ? filename : 'Tasks',
      children: [importd, importa, importe, snippetsInTab5]
    }
  ]
}

export default IN4
