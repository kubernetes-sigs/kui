/*
 * Copyright 2018 IBM Corporation
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

import { join, basename, dirname } from 'path'

const debug = require('debug')('tutorial.utils')

/** enclosing directory for tutorials */
const top = dirname(require.resolve('@kui-shell/plugin-tutorials/package.json'))
export const contentDir = join(top, 'samples/@tutorials')

/** enclosing directory for a given tutorial */
export const projectHome = projectName => join(contentDir, projectName)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const readJSON = (projectHome: string, fileName: string): Promise<any> =>
  new Promise((resolve, reject) => {
    debug('readJSON')

    try {
      if (projectHome.indexOf('@tutorials') >= 0) {
        const projectName = basename(projectHome)
        debug('reading built-in', projectName, fileName)

        // WARNING: webpack requires that the path prefix be an explicit string :(
        // DO NOT try to be clever here
        resolve(require('@kui-shell/plugin-tutorials/samples/@tutorials/' + projectName + '/' + fileName))
      } else {
        debug('reading external', projectHome, fileName)
        resolve(join(projectHome, fileName))
      }
    } catch (err) {
      reject(err)
    }
  })

/**
 * Read the module metadata
 *
 */
export const readProject = async (projectHome: string) => {
  debug('readProject', projectHome)

  if (basename(projectHome) === 'package.json') {
    // maybe the user specified the filepath of the package.json?
    return readProject(dirname(projectHome))
  }

  return Promise.all([readJSON(projectHome, 'package.json'), readJSON(projectHome, 'tutorial.json')]).then(
    ([config, tutorial]) => {
      return {
        config: Object.assign({}, { projectName: config.name }, config), // for configs that don't define projectName, use the name field
        tutorial,
        projectHome
      }
    }
  )
}
