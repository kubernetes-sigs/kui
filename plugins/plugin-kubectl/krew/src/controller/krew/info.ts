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

import { isUsage, doHelp, KubeOptions, doExecWithStdout } from '@kui-shell/plugin-kubectl'

const strings = i18n('plugin-kubectl', 'krew')

export default (command: string) => async (args: Arguments<KubeOptions>) => {
  if (isUsage(args)) {
    // special case: get --help/-h
    return doHelp(command, args)
  } else {
    // re: the usePty; oddly krew list only emits a subset of the
    // information if it sees a non-pty; so we have to force the use
    // of a pty

    // re: nameColumn; the krew list table diverges from the kubectl
    // standard, and instead uses PLUGIN as the "name" column key
    const stdout = await doExecWithStdout(args)

    const keys = stdout.match(/^\S+:/gm)
    const indices = keys.map(key => {
      return stdout.indexOf(key)
    })
    const values = indices.map((keyIdx, idx, A) => {
      return stdout.slice(keyIdx + keys[idx].length, A[idx + 1]).trim()
    })
    const kv = keys.reduce((M, key, idx) => {
      M[key] = values[idx]
      return M
    }, {})

    const uri = !kv['URI:'] ? [] : [{ label: strings('Download'), href: kv['URI:'] }]
    const homepage = !kv['HOMEPAGE:'] ? [] : [{ label: strings('Home Page'), href: kv['HOMEPAGE:'] }]
    const links = uri.concat(homepage)

    const menus = [
      {
        label: strings('Plugin'),
        items: [
          {
            mode: 'overview',
            label: strings('Overview'),
            content: keys
              .filter(_ => _ !== 'HOMEPAGE:' && _ !== 'CAVEATS:' && _ !== 'URI:')
              .reduce((M, key) => {
                return (
                  M +
                  `
  ### ${key}
  ${key === 'NAME:' ? '#### ' : ''}${key === 'SHA256:' ? '`' : ''}${kv[key]}${key === 'SHA256:' ? '`' : ''}`
                )
              }, ''),
            contentType: 'text/markdown'
          }
        ].concat(
          !kv['CAVEATS:']
            ? []
            : [
                {
                  mode: 'caveats',
                  label: strings('Caveats'),
                  contentType: 'text/markdown',
                  content: kv['CAVEATS:']
                    .replace(/^\\\n/, '')
                    .replace(/\n\/$/, '')
                    .replace(/ \| /g, '')
                    .replace(/(export \S+=.*)/g, '`$1`')
                    .replace(/(%USERPROFILE\S+)/g, '`$1`')
                    .replace(/\n\s+\$(.*)/g, '\n   ```\n$1\n   ```\n')
                }
              ]
        )
      }
    ]

    const response: NavResponse = {
      apiVersion: 'kui-shell/v1',
      kind: 'NavResponse',
      menus,
      links,
      breadcrumbs: [{ label: 'krew', command: `kubectl krew list` }, { label: 'info' }, { label: values[0] }]
    }

    return response
  }
}
