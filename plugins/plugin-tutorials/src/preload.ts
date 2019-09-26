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

import { dirname } from 'path'

import { Util } from '@kui-shell/core'

export default async () => {
  // give visibility to our @demos directory on the module path
  Util.augmentModuleLoadPath(
    dirname(dirname(require.resolve('@kui-shell/plugin-tutorials/samples/@tutorials/getting-started/package.json')))
  )
}
