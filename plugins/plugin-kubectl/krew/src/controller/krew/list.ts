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

import { Arguments } from '@kui-shell/core'

import { isUsage, doHelp, KubeOptions, doExecWithTable } from '@kui-shell/plugin-kubectl'

export default (command: string) => (args: Arguments<KubeOptions>) => {
  if (isUsage(args)) {
    // special case: get --help/-h
    return doHelp(command, args)
  } else {
    // re: the usePty; oddly krew list only emits a subset of the
    // information if it sees a non-pty; so we have to force the use
    // of a pty

    // re: nameColumn; the krew list table diverges from the kubectl
    // standard, and instead uses PLUGIN as the "name" column key
    return doExecWithTable(args, undefined, command, {
      usePty: true,
      nameColumn: 'PLUGIN',
      verb: 'krew',
      entityType: 'info'
    })
  }
}
