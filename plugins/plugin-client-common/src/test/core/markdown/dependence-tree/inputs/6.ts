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

import Input, { Tree } from '../Input'
import { importa, importd } from './1'

const filename = 'guidebook-tree-model6.md'

const messageForMacOS = 'echo MMM'
const messageForLinux = 'echo LLL'
const messageForWindows = 'echo WWW'

const messageForElectron =
  process.platform === 'linux' ? messageForLinux : process.platform === 'darwin' ? messageForMacOS : messageForWindows

// here, we will squash away the choice
const importgForElectron: (name: string) => Tree = (name: string) => ({
  name,
  children: [{ name: messageForElectron }]
})

// here, we won't squash away the choice
const importgForBrowser: (name: string) => Tree = (name: string) => ({
  name,
  children: [
    { name: 'Option 1: MacOS', children: [{ name: messageForMacOS }] },
    { name: 'Option 2: Linux', children: [{ name: messageForLinux }] },
    { name: 'Option 3: Windows', children: [{ name: messageForWindows }] }
  ]
})

export const importg: (name?: string) => Tree = (name = 'importg.md') =>
  (process.env.MOCHA_RUN_TARGET || 'electron') === 'electron' ? importgForElectron(name) : importgForBrowser(name)

const tree: Input['tree'] = (command: string) => [
  {
    name: command === 'guide' ? filename : 'Tasks',
    children: [importg(), importa(), importd]
  }
]

const IN6: Input = {
  input: require.resolve(`@kui-shell/plugin-client-common/tests/data/${filename}`),
  tree
}

export default IN6
