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
const debug = Debug('plugins/tekton/get/step')

import { CodedError } from '@kui-shell/core/models/errors'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'

import { parse, read } from '../../read'

const usage = {
  command: 'step',
  strict: 'step',
  required: [
    { name: 'taskName', docs: 'Name of the enclosing task' },
    { name: 'stepName', docs: 'Name of the step' }
  ],
  optional: [
    { name: '--file', alias: '-f', docs: 'Path to resource specification', positional: true }
  ]
}

const getStep = async ({ argvNoOptions, parsedOptions }: IEvaluatorArgs) => {
  const taskName = argvNoOptions[argvNoOptions.indexOf('step') + 1]
  const stepName = argvNoOptions[argvNoOptions.indexOf('step') + 2]
  const filepath = parsedOptions.f

  const task: Record<string, any> = (await parse(read(filepath)))
    .find(_ => _.kind === 'Task' && _.metadata.name === taskName)

  if (!task) {
    const err: CodedError = new Error('task not found')
    err.code = 404
    throw err
  } else {
    const step = task.spec.steps && task.spec.steps.find(_ => _.name === stepName)
    if (!step) {
      const err: CodedError = new Error('step not found')
      err.code = 404
      throw err
    } else {
      return {
        type: 'custom',
        isEntity: true,
        prettyType: 'step',
        name: stepName,
        packageName: taskName,
        contentType: 'yaml',
        content: step
      }
    }
  }
}

export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/tekton/get/step', getStep, { usage, noAuthOk: true })
}
