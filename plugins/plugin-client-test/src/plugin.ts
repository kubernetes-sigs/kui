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

import { Registrar } from '@kui-shell/core'

import sayHello from './lib/cmds/say-hello'
import streamHello from './lib/cmds/stream-hello'
import echoArray from './lib/cmds/echo-array'
import style from './lib/cmds/style'
import mmrName from './lib/cmds/mmr-name'
import mmrNamespace from './lib/cmds/mmr-namespace'
import mmrKind from './lib/cmds/mmr-kind'
import mmrMode from './lib/cmds/mmr-mode'
import mmrModeViaRegistration from './lib/cmds/mmr-mode-via-registration'
import nav from './lib/cmds/NavResponse'
import noSemi from './lib/cmds/semicolon'
import table from './lib/cmds/table'
import pipeStageParsing from './lib/cmds/pipe-stage-parsing'
import watchUntil from './lib/cmds/watch-until'

export default async (registrar: Registrar) => {
  // commands
  await Promise.all([
    sayHello(registrar),
    streamHello(registrar),
    echoArray(registrar),
    style(registrar),
    mmrName(registrar),
    mmrNamespace(registrar),
    mmrKind(registrar),
    mmrMode(registrar),
    mmrModeViaRegistration(registrar),
    nav(registrar),
    noSemi(registrar),
    pipeStageParsing(registrar),
    watchUntil(registrar),
    table(registrar)
  ])

  // so we can test ls /test and see bin
  registrar.listen('/test/bin/testing-subdirectory', () => 'hello world from subdirectory')
}
