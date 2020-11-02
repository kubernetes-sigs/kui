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
import { Arguments } from '@kui-shell/core'

import { MinioConfig } from '../providers'
import { minioConfig } from '../vfs/responders'
import JobProvider, { JobOptions } from '../jobs/providers/CodeEngine2'

const debug = Debug('plugin-s3/forwarder')

class Job {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly runner: JobProvider,
    private readonly jobName: string,
    private readonly nTasks: number
  ) {}

  public show() {
    return this.runner.show(this.jobName, this.nTasks)
  }

  public wait() {
    return this.runner.wait(this.jobName, this.nTasks)
  }

  private async getLogsForTask(taskIdx: number): Promise<string> {
    const response = (await this.runner.logs(this.jobName, taskIdx)).replace(/\n+$/, '')
    const idx = response.lastIndexOf('\n')
    const lastLine = response.slice(idx + 1)

    return Buffer.from(JSON.parse(lastLine).result, 'base64').toString()
  }

  public async getLogs(): Promise<string[]> {
    return Promise.all(
      Array(this.nTasks)
        .fill(0)
        .map((_, idx) => this.getLogsForTask(idx + 1))
    )
  }
}

export async function run(commands: string[], repl: Arguments['REPL'], options: Partial<JobOptions> = {}) {
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

  return new Job(runner, jobName, nTasks)
}

export default async function runWithProgress(
  commands: string[],
  { REPL }: Pick<Arguments, 'REPL'>,
  options: Partial<JobOptions> = {}
) {
  const job = await run(commands, REPL, options)
  return job.show()
}

export async function runWithLogs(
  commands: string[],
  { REPL }: Pick<Arguments, 'REPL'>,
  options: Partial<JobOptions> = {}
) {
  const job = await run(commands, REPL, options)
  await job.wait()

  return job.getLogs()
}
