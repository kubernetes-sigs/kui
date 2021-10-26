/*
 * Copyright 2019 The Kubernetes Authors
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

import { PreloadRegistrar, isHeadless, inProxy } from '@kui-shell/core'

import {
  mode1,
  mode2,
  mode3,
  drilldownButtonWithString,
  drilldownButtonWithFunction,
  mode5,
  badge1,
  badge2,
  badge3
} from './lib/modes'

export default async (registrar: PreloadRegistrar) => {
  if (!isHeadless()) {
    registrar.registerModes(drilldownButtonWithString, drilldownButtonWithFunction, mode1, mode2, mode5, mode3)
    registrar.registerBadges(badge1, badge2, badge3)
  }

  if (!isHeadless() || inProxy()) {
    // mount a fake VFS to test tab completion
    const [{ mount }, { NotebookVFS, notebookVFS }] = await Promise.all([
      import('@kui-shell/plugin-bash-like/fs'),
      import('@kui-shell/plugin-core-support')
    ])

    // make some a fake VFS (using NotebookVFS as the impl) for testing tab completion
    const vfsfun = new NotebookVFS('/tmpo')
    vfsfun.mkdir({ argvNoOptions: ['mkdir', '/tmpo/D1'] })
    vfsfun.mkdir({ argvNoOptions: ['mkdir', '/tmpo/D2'] })
    mount(vfsfun)

    // nested (still fake) VFS mounts
    const vfsnest1 = new NotebookVFS('/kuifake/fake1')
    vfsnest1.mkdir({ argvNoOptions: ['mkdir', '/kuifake/fake1/E1'] })
    vfsnest1.mkdir({ argvNoOptions: ['mkdir', '/kuifake/fake1/E2'] })
    const vfsnest2 = new NotebookVFS('/kuifake/fake2')
    vfsnest2.mkdir({ argvNoOptions: ['mkdir', '/kuifake/fake2/F1'] })
    vfsnest2.mkdir({ argvNoOptions: ['mkdir', '/kuifake/fake2/F2'] })
    mount(vfsnest1)
    mount(vfsnest2)

    // mount notebooks
    try {
      notebookVFS.mkdir({ argvNoOptions: ['mkdir', '/kui/test'] })
      notebookVFS.cp(undefined, ['plugin://client/notebooks/ls.json'], '/kui/test')
    } catch (err) {
      console.error('Error mounting test notebooks', err)
    }
  }
}
