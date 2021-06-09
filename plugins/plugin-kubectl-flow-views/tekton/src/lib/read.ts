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

import Debug from 'debug'
import { Tab } from '@kui-shell/core'
import { KubeResource, fetchFileString } from '@kui-shell/plugin-kubectl'
import { Task } from '../model/resource'

const debug = Debug('plugins/tekton/lib/read')

const knownKinds = /PipelineResource|Pipeline|Task/

/**
 * Parse a resource spec
 *
 */
export const parse = async (raw: string | PromiseLike<string>): Promise<KubeResource[]> => {
  const { loadAll } = await import('js-yaml')
  return loadAll(await raw).filter(_ => knownKinds.test(_.kind))
}

/**
 * Read in a resource spec from a path
 *
 */
export const read = async (tab: Tab, filepath: string): Promise<string> => {
  const data = await fetchFileString(tab.REPL, filepath)
  if (data.length === 1 && data[0]) {
    return data[0]
  } else {
    throw new Error(`Failed to fetch ${filepath}`)
  }
}

/**
 * Fetch the Pipeline and Task models
 *
 */
export const fetchTask = async (tab: Tab, pipelineName: string, taskName: string, filepath: string): Promise<Task> => {
  if (filepath) {
    const model: KubeResource[] = await parse(read(tab, filepath))
    const task = taskName
      ? model.find(_ => _.kind === 'Task' && _.metadata.name === taskName)
      : model.filter(_ => _.kind === 'Task')
    return task as Task
  } else if (!taskName) {
    const pipeline = await tab.REPL.pexec<KubeResource>(
      `kubectl get Pipeline ${tab.REPL.encodeComponent(pipelineName)}`
    ).catch(err => {
      // want Pipeline.tekton.dev but that is much slower
      debug('got error fetching pipeline', err)
      return { spec: { tasks: [] } }
    })
    const referencedTasks: Record<string, boolean> = pipeline.spec.tasks.reduce((M, _) => {
      M[_.taskRef.name] = true
      return M
    }, {})
    debug('referencedTasks', referencedTasks)

    return tab.REPL.qexec(`kubectl get Task`, undefined, undefined, {
      // want Task.tekton.dev but that is much sloewr
      filter: listOfTasks => listOfTasks.filter(_ => referencedTasks[_.name])
    })
  } else {
    return tab.REPL.pexec(`kubectl get Task ${tab.REPL.encodeComponent(taskName)}`) // want Task.tekton.dev but that is much slower
  }
}
