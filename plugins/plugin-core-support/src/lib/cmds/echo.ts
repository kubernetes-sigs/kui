/*
 * Copyright 2018 The Kubernetes Authors
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

import { Arguments, Capabilities, Registrar } from '@kui-shell/core'

function echo({ argvNoOptions }: Pick<Arguments, 'argvNoOptions'>) {
  return argvNoOptions.slice(1).join(' ') || true
}

export default (registrar: Registrar) => {
  // For debugging the command line parser. This avoids the PTY.
  registrar.listen('/kuiecho', echo)

  // and, in a browser deployment without a backing proxy (and hence
  // without PTY support), we should also register as a handler for
  // `echo`
  if (Capabilities.inBrowser() && !Capabilities.hasProxy()) {
    registrar.listen('/echo', echo)
  }
}
