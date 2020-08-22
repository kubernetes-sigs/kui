/*
 * Copyright 2017-18 IBM Corporation
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

import Debug from 'debug'
const debug = Debug('plugins/core-support/preload')
debug('loading')

import { isHeadless, PreloadRegistration } from '@kui-shell/core'

/**
 * This is the module
 *
 */
const registration: PreloadRegistration = () => {
  const asyncs = []

  if (!isHeadless()) {
    asyncs.push(import('./lib/cmds/zoom').then(_ => _.preload()))
    asyncs.push(import('./lib/cmds/replay').then(_ => _.preload()))
  }

  asyncs.push(import('./tutorials/vfs').then(_ => _.preload()))
  return Promise.all(asyncs)
}

export default registration

debug('finished loading')
