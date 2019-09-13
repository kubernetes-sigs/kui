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

import { CommandRegistrar } from '@kui-shell/core/models/command'

import flowView from '../view/flow'
import { parse, read } from '../lib/read'

const usage = {
  command: 'flow',
  strict: 'flow',
  docs: 'Preview a Tekton pipeline',
  required: [
    {
      name: 'pipeline.yml',
      file: true,
      docs: 'path to a pipeline description file'
    }
  ]
}

/**
 * This is the command handler that generates a tekton flow preview
 * from a given file.
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen(
    '/tekton/flow',
    async ({ argvNoOptions, tab }) => {
      const filepath = argvNoOptions[argvNoOptions.indexOf('flow') + 1]
      const raw = await read(filepath)
      const jsons = await parse(raw)

      // return a kui view
      const runs = undefined
      return flowView(tab, jsons, runs, raw, filepath)
    },
    { usage, noAuthOk: true, inBrowserOk: true }
  )
}
