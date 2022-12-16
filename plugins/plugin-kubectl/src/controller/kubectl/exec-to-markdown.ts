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

import { Arguments, NavResponse, i18n } from '@kui-shell/core'

import { KubeOptions } from './options'

const strings = i18n('plugin-kubectl')

export default async function (args: Arguments<KubeOptions>, exec?: string): Promise<NavResponse> {
  const cmd = args.argv[0]

  const { doExecWithStdout } = await import('./exec')
  const raw = await doExecWithStdout(args, undefined, exec)

  const content = raw.replace(/^ (.*)/gm, '        $1') // code blocks: indentation >= 8

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'NavResponse',
    breadcrumbs: [{ label: cmd }],
    links: [],
    menus: [
      {
        label: strings('Usage'),
        items: [
          {
            mode: strings('Introduction'),
            content,
            contentType: 'text/markdown'
          }
        ]
      }
    ]
  }
}
