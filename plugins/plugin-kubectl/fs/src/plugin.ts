/*
 * Copyright 2021 The Kubernetes Authors
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

import { basename } from 'path'
import { Registrar } from '@kui-shell/core'
import { getAsMMRTransformer as viewTransformer } from '@kui-shell/plugin-kubectl'

export default async function register(registrar: Registrar) {
  registrar.listen('/kvfs-get', async args => {
    const cmdline = args.command.replace(
      /^kvfs-get( .+)? (\/.+)$/,
      (_, p1, p2) => `kubectl get${p1 || ''} ${basename(p2)}`
    )
    return viewTransformer(args, await args.REPL.qexec(cmdline))
  })
}
