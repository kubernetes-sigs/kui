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

import { Common } from '@kui-shell/test'
import { createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { clickPrevious, create, logs, wait } from './helpers'

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))
const inputBuffer = readFileSync(join(ROOT, 'data/k8s/crashy.yaml'))
const inputEncoded = inputBuffer.toString('base64')

const podName = 'kui-crashy'
const containerName = 'crashy'

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  describe(`${command} Logs previous tab ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const ns = createNS()

    const createPodWithoutWaiting = create.bind(this, ns, command)
    const waitForPod = wait.bind(this, ns, command, podName)
    const kubectlLogs = logs.bind(this, ns, command, podName, containerName, 'warning', false)
    const kubectlLogsPrevious = logs.bind(this, ns, command, podName, containerName, 'warning', true)
    const clickPreviousToggle = clickPrevious.bind(this)

    /* Here comes the test */
    allocateNS(this, ns, command)

    createPodWithoutWaiting(inputEncoded, podName)
    waitForPod(2)

    kubectlLogsPrevious()
    clickPreviousToggle('warning', false) // click toggle and expect previous=false

    kubectlLogs()
    clickPreviousToggle('warning', true) // click toggle and expect previous=true

    deleteNS(this, ns, command)
  })
})
