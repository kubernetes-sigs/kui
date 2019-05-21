/*
 * Copyright 2019 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('plugins/tekton/get/task')

import { CodedError } from '@kui-shell/core/models/errors'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'

import { parse, read } from '../../read'

const usage = {
  command: 'task',
  strict: 'task',
  required: [
    { name: 'taskName', docs: 'Name of the task' }
  ],
  optional: [
    { name: '--file', alias: '-f', docs: 'Path to resource specification', positional: true }
  ]
}

const getTask = async ({ command, argvNoOptions, parsedOptions }: IEvaluatorArgs) => {
  const taskName = argvNoOptions[argvNoOptions.indexOf('task') + 1]
  const filepath = parsedOptions.f

  const model: Record<string, any> = await parse(read(filepath))
  const pipeline: Record<string, any> = model.find(_ => _.kind === 'Pipeline')
  const task: Record<string, any> = model.find(_ => _.kind === 'Task' && _.metadata.name === taskName)

  if (!task) {
    const err: CodedError = new Error('task not found')
    err.code = 404
    throw err
  } else {
    return {
      type: 'custom',
      isEntity: true,
      prettyType: 'task',
      name: taskName,
      packageName: pipeline && pipeline.metadata.name,
      contentType: 'yaml',
      content: task
    }
  }
}

export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/tekton/get/task', getTask, { usage, noAuthOk: true })
}
