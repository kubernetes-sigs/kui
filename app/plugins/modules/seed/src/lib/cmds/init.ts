/*
 * Copyright 2018 IBM Corporation
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

const debug = require('debug')('seed/init')

import { opts, initPrereqs, initCluster } from './prereq'
import repl = require('../../../../../../build/core/repl')

import { helmName } from './constants'

import { safeDump } from 'js-yaml'

/**
 * Command usage model
 *
 */
const usage = {
  title: 'initialize cluster',
  command: 'init',
  strict: 'init',
  docs: `Initialize your kubernetes cluster with Seed capability`,
  optional: [
    { name: '--set', docs: 'set values on the command line key1=val1,key2=val2)' },
    { name: '--repo-token', alias: '-t', docs: 'Also add a repository token' },
    { name: '--force', alias: '-f', boolean: true, docs: 'Force a re-initialization' },
    { name: '--namespace', alias: '-n', docs: 'Initialize a specified namespace' }
  ]
}

/**
 * Register the command
 *
 */
export default (commandTree, prequire) => {
  commandTree.listen('/seed/init', async ({ parsedOptions: options }) => {
    await Promise.all([
      initPrereqs(options, true, !!options.force),
      options.t ? repl.qexec(`seed add token "${options.t}"`) : true,
      initCluster(options, !!options.force)
    ])

    return repl.qexec(`seed status ${opts(options)}`)
  }, { usage })

  commandTree.listen('/seed/add/token', async ({ argvNoOptions, parsedOptions }) => {
    // 8cbb59c47639e3f9d23359981a5c5baaf4b5eaea

    const token = argvNoOptions[argvNoOptions.indexOf('token') + 1]
    const repo = (parsedOptions.repo || 'raw.github.ibm.com')

    const spec = safeDump({
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: repo
      },
      type: 'Opaque',
      data: {
        token: Buffer.from(token).toString('base64')
      }
    })

    try {
      await repl.qexec(`kubectl delete -f !spec`, undefined, undefined, {
        parameters: {
          spec
        }
      })
    } catch (err) {
      if (err.statusCode !== 404) {
        console.error(err)
        // don't let this stop us, but log the error
      }
    }

    return repl.qexec(`kubectl create -f !spec`, undefined, undefined, {
      parameters: {
        spec
      }
    })
  })
}
