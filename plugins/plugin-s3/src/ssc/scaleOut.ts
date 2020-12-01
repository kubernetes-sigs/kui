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

import Debug from 'debug'
import { REPL } from '@kui-shell/core'

import { minioConfig } from '../vfs'
import { MinioConfig } from '../providers'
import JobProvider, { JobOptions } from '../jobs/providers/CodeEngine2'

const debug = Debug('plugin-s3/forwarder')

export default async function scaleOut(commands: string[], repl: REPL, options: Partial<JobOptions> = {}) {
  const mc = minioConfig()

  const start = Date.now()
  //  const commands = rawCommands.map(
  const cmdlines = commands.map(command =>
    Object.keys(mc.aliases).reduce(
      (cmdline, alias) => cmdline.replace(new RegExp(alias.replace(/\\/, '\\\\'), 'g'), alias.replace(/\//g, '_')),
      command.replace(/^(\s*ssc)?(\s+)/, '$1').replace(/(\s*)(ls|cp|mv|rm|cat|pipe)(\s)/g, '$1mc $2$3')
    )
  )
  debug('cmdlines', commands, cmdlines)

  mc.aliases = Object.keys(mc.aliases).reduce((aliases, alias) => {
    aliases[alias.replace(/\//g, '_')] = mc.aliases[alias]
    return aliases
  }, {} as MinioConfig['aliases'])

  const nTasks = cmdlines.length
  const runner = new JobProvider(repl, mc)
  const jobName = await runner.run('starpit/sh', Object.assign({ cmdlines, nTasks, nShards: nTasks }, options))
  const end = Date.now()
  debug('job scheduling latency', require('pretty-ms')(end - start), jobName)
  return runner.wait(jobName, nTasks)
}
