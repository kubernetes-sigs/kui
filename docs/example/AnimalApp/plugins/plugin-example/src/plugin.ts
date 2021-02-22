/*
 * Copyright 2020 The Kubernetes Authors
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

import { Registrar } from '@kui-shell/core'
import helloCatDogTerminal from './commands/hello-cat-dog-terminal'
import helloCatNav from './commands/hello-catnav'
import helloSidecat from './commands/hello-sidecat'

export default async (kui: Registrar) => {
  await Promise.all([helloCatDogTerminal(kui), helloSidecat(kui), helloCatNav(kui)])
}
