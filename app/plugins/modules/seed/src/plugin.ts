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

const usage = {
  seed: {
    breadcrumb: 'Seed',
    title: 'Manage IBM Resources',
    header: 'Manage IBM resources using the Kubernetes object model.',
    example: 'seed <command>',
    commandPrefix: 'seed',
    available: [
            { command: 'get', docs: 'Get a seed object', dir: true },
            { command: 'init', docs: 'Initialize your cluster for use with Seed' },
            { command: 'inspect', docs: 'View the logs of the Seed resource brokers' },
            { command: 'status', docs: 'Summarize the status of Seed in your cluster' },
            { command: 'upgrade', docs: 'Upgrade your cluster to the latest Seed release' }
    ],
    nRowsInViewport: 5,
    related: [ 'kubectl', 'helm' ]
  },

  get: {
    breadcrumb: 'Get',
    title: 'Get Seed Object',
    header: 'Get the object model of a Seed object.',
    example: 'seed get <command>',
    commandPrefix: 'seed get',
    available: [
            { command: 'crds', docs: 'Show a list of Seed resource controllers' },
            { command: 'demos', docs: 'Show a list of Seed demo resources' },
            { command: 'deployments', docs: 'Show the status of your Seed deployments' }
    ],
    nRowsInViewport: 5,
    parent: [ 'seed' ]
  }
}

import crds from './lib/cmds/crds'
import demos from './lib/cmds/demos'
import deployments from './lib/cmds/deployments'
import init from './lib/cmds/init'
import logs from './lib/cmds/logs'
import status from './lib/cmds/status'
import upgrade from './lib/cmds/upgrade'

export default async (commandTree, prequire) => {
  commandTree.subtree('/seed', { usage: usage.seed })
  commandTree.subtree('/seed/get', { usage: usage.get })

  await crds(commandTree, prequire)
  await demos(commandTree, prequire)
  await deployments(commandTree, prequire)
  await init(commandTree, prequire)
  await logs(commandTree, prequire)
  await status(commandTree, prequire)
  await upgrade(commandTree, prequire)
}
