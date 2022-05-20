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

import Input from '../Input'
import { importg } from './6'
import { importd } from './1'

const filename = 'guidebook-tree-model7.md'

export const tree: Input['tree'] = (command: string) => [
  {
    name: command === 'guide' ? filename : 'Tasks',
    children: [importg('importgg.md'), importd]
  }
]

const IN7: Input = {
  input: require.resolve(`@kui-shell/plugin-client-common/tests/data/${filename}`),
  tree
}

export default IN7
