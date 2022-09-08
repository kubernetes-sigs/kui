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

/**
 * This file introduces a "test mmr name" command that opens the sidecar with
 * a plain text mode associated with a name metadata.
 *
 */

import { Registrar, NavResponse, Arguments, ParsedOptions } from '@kui-shell/core'

import { tableMode } from './content/modes'

interface Options extends ParsedOptions {
  switch?: boolean
  noLinks?: boolean
}

const navResponseWithoutLinks = (): NavResponse => ({
  apiVersion: 'kui-shell/v1',
  kind: 'NavResponse',
  menus: [{ label: 'Test Nav Without Links', items: tableMode }]
})

function navResponseWithBreadcrumbs(): NavResponse {
  return Object.assign(navResponseWithoutLinks(), {
    breadcrumbs: [{ label: 'breadcrumb1', command: 'test string' }, { label: 'breadcrumb2' }]
  })
}

const doNav =
  () =>
  (args: Arguments<Options>): NavResponse => {
    if (args.parsedOptions.breadcrumb) {
      return navResponseWithBreadcrumbs()
    }

    if (args.parsedOptions.noLinks) {
      return navResponseWithoutLinks()
    }

    if (args.parsedOptions.switch) {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'NavResponse',
        menus: [{ label: 'Test Nav 2', items: tableMode }],
        links: [
          { label: 'Home Page', href: 'http://kui.tools' },
          { label: 'switch', command: 'test nav' }
        ]
      }
    } else {
      return {
        apiVersion: 'kui-shell/v1',
        kind: 'NavResponse',
        menus: [{ label: 'Test Nav', items: tableMode }],
        links: [
          { label: 'Home Page', href: 'http://kui.tools' },
          { label: 'switch', command: 'test nav --switch' }
        ]
      }
    }
  }

export default (commandTree: Registrar) => {
  commandTree.listen('/test/nav', doNav(), {
    usage: {
      docs: 'test NavResposne'
    }
  })
}
