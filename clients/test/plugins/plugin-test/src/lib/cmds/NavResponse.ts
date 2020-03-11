/*
 * Copyright 2020 IBM Corporation
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

/**
 * This file introduces a "test mmr name" command that opens the sidecar with
 * a plain text mode associated with a name metadata.
 *
 */

import { Registrar, NavResponse, Arguments, ParsedOptions } from '@kui-shell/core'

import { tableMode } from './content/modes'

interface Options extends ParsedOptions {
  switch?: boolean
}

const doNav = () => (args: Arguments<Options>): NavResponse => {
  if (args.parsedOptions.switch) {
    return {
      apiVersion: 'kui-shell/v1',
      kind: 'NavResponse',
      menus: [
        {
          'Test Nav 2': {
            kind: 'MultiModelResponse',
            metadata: { name: 'test nav 2' },
            modes: tableMode
          }
        }
      ],
      links: [
        { label: 'Home Page', href: 'http://kui.tools' },
        { label: 'switch', command: 'test nav' }
      ]
    }
  } else {
    return {
      apiVersion: 'kui-shell/v1',
      kind: 'NavResponse',
      menus: [
        {
          'Test Nav': {
            kind: 'MultiModelResponse',
            metadata: { name: 'test nav' },
            modes: tableMode
          }
        }
      ],
      links: [
        { label: 'Home Page', href: 'http://kui.tools' },
        { label: 'switch', command: 'test nav --switch' }
      ]
    }
  }
}

export default (commandTree: Registrar) => {
  commandTree.listen('/test/nav', doNav(), {
    inBrowserOk: true,
    usage: {
      docs: 'test NavResposne'
    }
  })
}
