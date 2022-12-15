/*
 * Copyright 2020 The Kubernetes Authors
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

import { Arguments, REPL } from '@kui-shell/core'
import {
  KubeOptions,
  KubeItems,
  KubeResource,
  getNamespace,
  isKubeResource,
  doExecWithStdout,
  doExecWithRadioTable
} from '@kui-shell/plugin-kubectl'

import Project, { ProjectStatus } from '../../../model/Project'

/** onSelect handler for the RadioTable view model */
async function onSelectProject(this: REPL, name: string) {
  await this.pexec(`odo project set ${this.encodeComponent(name)}`)
}

/**
 * Transform the KubeItems<Project> resource to a RadioTable view model.
 *
 */
export function projectListView(args: Arguments<KubeOptions>, response: KubeResource | true) {
  if (args.parsedOptions.o !== 'json' && isKubeResource(response)) {
    // the user requested a RadioTable view
    const projects = JSON.parse(response.kuiRawData).items as Project[]
    const defaultSelectedIdx = projects.findIndex(_ => _.status.active)
    const opts = {
      title: 'Projects',
      nameColumnTitle: 'PROJECT'
    }

    return (
      doExecWithRadioTable<ProjectStatus, Project>(
        projects,
        defaultSelectedIdx,
        onSelectProject.bind(args.REPL),
        opts
      ) || response
    )
  } else {
    // otherwise, the user did not request a RadioTable view
    return response
  }
}

/**
 * Always fetch the JSON data, even if the user did not request it.
 *
 * We will then transform the JSON KubeItems<Project> model into a
 * `RadioTable` view model via the `projectListView` viewTransformer.
 *
 */
function getRawData(args: Arguments<KubeOptions>): Promise<string> {
  if (args.parsedOptions.o !== 'json') {
    args.command += ' -o json'
    args.argv.push('-o')
    args.argv.push('-json')

    args.argvNoOptions.push('-o')
    args.argvNoOptions.push('-json')
  }

  return doExecWithStdout(args, undefined, 'odo')
}

/** Fetch the KubeItems<Project> model */
export async function projectList(args: Arguments<KubeOptions>) {
  const kuiRawData = await getRawData(args)
  const list = JSON.parse(kuiRawData) as KubeItems<ProjectStatus, Project>

  return Object.assign(list, {
    metadata: {
      name: args.command,
      namespace: await getNamespace(args)
    },
    modes: [],
    kuiRawData,
    isSimulacrum: true, // this is not a real crudable resource
    isKubeResource: true,
    originatingCommand: args
  })
}
