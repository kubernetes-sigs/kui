/*
 * Copyright 2021 The Kubernetes Authors
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

import colors from 'colors/safe'
import { Arguments } from '@kui-shell/core'
import { doExecWithStdoutViaPty } from '@kui-shell/plugin-bash-like'

import Group from '../../Group'
import Options from '../options'

function check(args: Arguments): Promise<string | boolean> {
  return args.REPL.qexec<string>('ibmcloud ce project current-name')
}

async function fix(args: Arguments<Options>) {
  let passThroughErrorToUser = false
  const useThisProject = process.env['CE_PROJECT'] || args.parsedOptions['code-engine-project']
  const createProject = async () =>
    await args.REPL.qexec(`ibmcloud ce project create -n ${useThisProject || 'superproject'}`)

  try {
    const projects = JSON.parse(
      await doExecWithStdoutViaPty(Object.assign({}, args, { command: 'ibmcloud ce project list -o json' }))
    )

    if (Array.isArray(projects) && projects.length !== 0) {
      // then the user has at least one project
      if (useThisProject) {
        // then the user asked us to use a specific project; let us
        // see if it exists:
        const foundProject = projects.find(_ => _.name === useThisProject)

        if (foundProject && foundProject.state === 'active' && foundProject.selected) {
          // found it! and it is active and selected! nothing to do
          // await args.REPL.qexec(`ibmcloud ce project select -n ${useThisProject}`)
          console.log('Desired IBM CodeEngine project already selected ' + useThisProject)
        } else if (foundProject && foundProject.state === 'active') {
          // found it and it is active, but not selected
          console.log('Switching to IBM CodeEngine project ' + foundProject.name)
          await args.REPL.qexec(`ibmcloud ce project select -n ${foundProject.name}`)
        } else if (!process.env.CE_PROJECT_CREATE_IF_NEEDED || process.env.CE_PROJECT_CREATE_IF_NEEDED === 'false') {
          // did not find the user-specified project, do not create one
          passThroughErrorToUser = true
          throw new Error('Desired IBM Cloud CodeEngine project not found: ' + useThisProject)
        } else {
          // did not find the user-specified project, create one!
          console.log('Creating specified IBM CodeEngine project: ' + useThisProject)
          await createProject()
        }
      } else {
        // if we get here, then the user has existing projects, but
        // has not specified that we should use any particular one;
        // favor "superproject" if active, otherwise the first active one
        const firstActiveProject =
          projects.find(_ => _.state === 'active' && _.name === 'superproject') ||
          projects.find(_ => _.state === 'active')

        if (firstActiveProject && firstActiveProject.name) {
          // if we get here, then the user has an active project that we can use
          if (firstActiveProject.active) {
            console.log('Using IBM CodeEngine project ' + useThisProject)
          } else {
            console.log('Switching to IBM CodeEngine project ' + firstActiveProject.name)
            await args.REPL.qexec(`ibmcloud ce project select -n ${firstActiveProject.name}`)
          }
        } else {
          // if we get here, then the *user has no active projects*, so create one
          console.error('No active IBM CodeEngine projects, creating one')
          await createProject()
        }
      }
    } else {
      // if we get here, then the *user has no projects at all*, so create one
      console.log('No IBM CodeEngine projects, creating one')
      await createProject()
    }
  } catch (err) {
    if (!passThroughErrorToUser) {
      // conservatively create a new project
      await createProject()
    } else {
      // then we threw an error somewhere above; rethrow it here for
      // the user to see
      throw err
    }
  }

  return check(args)
}

export default {
  group: Group.Compute,
  label: (checkResult?: false | string) =>
    checkResult === undefined
      ? 'CodeEngine project'
      : !checkResult
      ? colors.red('not selected')
      : colors.yellow(checkResult),
  needsCloudLogin: true,
  onFail: 'ibmcloud ce project create --name <projectname=superproject>',
  fix,
  check
}
