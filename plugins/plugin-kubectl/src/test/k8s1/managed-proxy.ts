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

import { execSync } from 'child_process'
import { Common, CLI } from '@kui-shell/test'

function getProxyPids(): number[] {
  return execSync(`ps aux | grep --color=never 'kubectl proxy --keepalive' | grep -v grep | awk '{print $2}'`)
    .toString()
    .split(/\n/)
    .filter(_ => _)
    .map(_ => parseInt(_, 10))
}

describe(`kubectl managed proxy ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  let pidsA: number[]
  it('should wait until we have one live kubectl proxy', async () => {
    try {
      await this.app.client.waitUntil(
        async () => {
          pidsA = getProxyPids()
          return pidsA.length > 0
        },
        { timeout: CLI.waitTimeout }
      )
    } catch (err) {
      await Common.oops(this, true)(err)
    }
  })

  it('should reload, and have a different set of proxy pids', async () => {
    await Common.refresh(this)

    let idx = 0
    await this.app.client.waitUntil(
      async () => {
        const pidsB = getProxyPids()

        const nBNotInA = pidsB.reduce((N, pidB) => (pidsA.includes(pidB) ? N : N + 1), 0)

        if (++idx > 5) {
          console.error(
            `still waiting for a different set of proxy pids; pidsA=${pidsA} pidsB=${pidsB} nBNotInA=${nBNotInA}`
          )
        }

        return nBNotInA > 0
      },
      { timeout: CLI.waitTimeout }
    )
  })
})
