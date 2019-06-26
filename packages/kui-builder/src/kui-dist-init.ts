#!/usr/bin/env node

/**
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

import { join, dirname } from 'path'
import * as colors from 'colors/safe'
import { copy, exists, mkdir, mkdirp, writeFile } from 'fs-extra'

/** simple message notifying the user that we are creating an asset */
const creating = (what: string): void => {
  console.log(colors.green('✓') + ' creating ' + what)
}

/** simple message notifying the user that we are NOT creating an asset */
const notCreating = (what: string): void => {
  console.log(colors.dim('-') + ' not creating ' + what)
}

/**
 * Copy a directory
 *
 * @param breadcrumb specifies a require-able breadcrumb within the
 * directory to the copied
 * @param target the path to the target directory
 *
 */
const copyDirectory = async (breadcrumb: string, target: string, force: boolean) => {
  const targetExists = await exists(target)
  if (!targetExists || force) {
    // note fs-extra's copy of directories copies the *contents*
    if (!targetExists) {
      await mkdir(target)
    }

    const source = dirname(require.resolve(breadcrumb))
    await copy(source, target, {
      preserveTimestamps: true
    })

    creating(target)
  } else {
    notCreating(target)
  }
}

export const main = async (argv: string[]) => {
  const force = !!argv.find(_ => _ === '-f' || _ === '--force')

  if (!(await exists('plugins'))) {
    await mkdir('plugins')
    creating('plugins directory')
  } else {
    notCreating('plugins directory')
  }

  if (!(await exists('packages/app/src'))) {
    await mkdirp('packages/app/src')
    creating('packages/app/src directory')
  } else {
    notCreating('packages/app/src directory')
  }

  if (!(await exists('packages/app/src/main.ts'))) {
    await writeFile('packages/app/src/main.ts', '// intentionally blank')
    creating('packages/app/src directory')
  } else {
    notCreating('packages/app/src directory')
  }

  copyDirectory('@kui-shell/builder/examples/plugin-sample/package.json', 'plugins/plugin-sample', force)
  copyDirectory('@kui-shell/builder/examples/build-configs/default/theme/theme.json', 'theme', force)

  creating('main entry in package.json')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pjson = require(join(__dirname, '../../../package.json'))
  pjson.main = 'node_modules/@kui-shell/core/main/main.js'
  writeFile('package.json', JSON.stringify(pjson, undefined, 2))
}

main(process.argv)
