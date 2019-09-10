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

import { inBrowser } from '@kui-shell/core/core/capabilities'
import { CommandRegistrar } from '@kui-shell/core/models/command'

const usagePerCommand = require('./usage')

import commands from './controller/commands'
import compile from './controller/compile'
import install from './controller/install'
import list from './controller/list'
import home from './controller/home'
import remove from './controller/remove'

const toUsage = (models, { commandPrefix, title, docs, breadcrumb = title }) => {
  const usage = {
    breadcrumb,
    title,
    docs,
    example: `${commandPrefix} <command>`,
    commandPrefix,
    available: [],
    nRowsInViewport: 4 // the default is 3, but we have 4, so just show them all
  }

  for (const command in models) {
    usage.available.push(models[command])
  }

  return usage
}

export default async (commandTree: CommandRegistrar) => {
  if (!inBrowser()) {
    commandTree.subtree('/plugin', {
      usage: toUsage(usagePerCommand, {
        commandPrefix: 'plugin',
        title: 'Plugin management',
        docs: 'Commands for managing installed plugins'
      })
    })

    await Promise.all([
      commands(commandTree),
      compile(commandTree),
      install(commandTree),
      install(commandTree),
      list(commandTree),
      home(commandTree),
      remove(commandTree)
    ])
  }
}
