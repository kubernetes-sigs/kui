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

import cd from './lib/cd'
import ls from './lib/ls'
import edit from './lib/edit'
import head from './lib/head'
import tail from './lib/tail'
import open from './lib/open'
import fwrite from './lib/fwrite'
import mkTemp from './lib/mkTemp'
import vfs from './vfs/controller'
import { plugin as tabCompletion } from './lib/tab-completion'

import type { Registrar } from '@kui-shell/core'

/**
 * This is the module
 *
 */
export default async (registrar: Registrar) => {
  await Promise.all([
    cd(registrar),
    ls(registrar),
    edit(registrar),
    head(registrar),
    tail(registrar),
    open(registrar),
    fwrite(registrar),
    mkTemp(registrar),
    vfs(registrar),
    tabCompletion(registrar)
  ])
}
