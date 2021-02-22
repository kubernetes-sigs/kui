/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, Registrar, CodedError } from '@kui-shell/core'

import Options from './options'
import { fetchTask } from '../../lib/read'

const usage = {
  command: 'step',
  strict: 'step',
  required: [
    { name: 'pipelineName', docs: 'Name of the enclosing pipeline' },
    { name: 'taskName', docs: 'Name of the enclosing task' },
    { name: 'stepName', docs: 'Name of the step' }
  ],
  optional: [{ name: '--file', alias: '-f', docs: 'Path to resource specification' }]
}

const getStep = async ({ tab, argvNoOptions, parsedOptions }: Arguments<Options>) => {
  const pipelineName = argvNoOptions[argvNoOptions.indexOf('step') + 1]
  const taskName = argvNoOptions[argvNoOptions.indexOf('step') + 2]
  const stepName = argvNoOptions[argvNoOptions.indexOf('step') + 3]

  // either we fetch the model from a given file (given a filepath), or from the cluster
  const task = await fetchTask(tab, pipelineName, taskName, parsedOptions.f)

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

export default (commandTree: Registrar) => {
  commandTree.listen('/tekton/get/step', getStep, { usage })
}
