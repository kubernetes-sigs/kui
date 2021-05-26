#!/usr/bin/env node

/**
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

import { join, dirname } from 'path'
import * as colors from 'colors/safe'
import { exec } from 'child_process'
import { copy, pathExists, mkdir, mkdirp, writeFile } from 'fs-extra'

/** simple message notifying the user that we are creating an asset */
const creating = (what: string, how = 'creating'): void => {
  console.log(colors.green('✓') + ` ${how} ${what}`)
}

/** simple message notifying the user that we are NOT creating an asset */
const notCreating = (what: string): void => {
  console.log(colors.dim('-') + ' not creating ' + what)
}

const tsconfig = {
  extends: './node_modules/@kui-shell/builder/tsconfig-base.json',
  references: [{ path: 'plugins/plugin-sample' }]
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
  const targetExists = await pathExists(target)
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

  if (!(await pathExists('plugins'))) {
    await mkdir('plugins')
    creating('plugins directory')
  } else {
    notCreating('plugins directory')
  }

  if (!(await pathExists('packages/app/src'))) {
    await mkdirp('packages/app/src')
    creating('packages/app/src directory')
  } else {
    notCreating('packages/app/src directory')
  }

  if (!(await pathExists('packages/app/src/main.ts'))) {
    await writeFile('packages/app/src/main.ts', '// intentionally blank')
    creating('packages/app/src directory')
  } else {
    notCreating('packages/app/src directory')
  }

  if (!(await pathExists('tsconfig.json'))) {
    await writeFile('tsconfig.json', JSON.stringify(tsconfig, undefined, 2))
    creating('tsconfig.json')
  } else {
    notCreating('tsconfig.json')
  }

  copyDirectory('@kui-shell/builder/examples/plugin-sample/package.json', 'plugins/plugin-sample', force)

  creating('reconfiguring package.json')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pjson = require(join(__dirname, '../../../../package.json'))
  pjson.main = 'node_modules/@kui-shell/core/dist/main/main.js'
  if (!pjson.devDependencies) {
    pjson.devDependencies = {}
  }
  pjson.devDependencies.mocha = '6.1.4'
  pjson.devDependencies['@types/mocha'] = '5.2.7'
  pjson.devDependencies['@types/node'] = '12.0.10'
  pjson.devDependencies.electron = '6.0.8'
  pjson.devDependencies.spectron = '8.0.0'
  pjson.devDependencies.typescript = '3.6.3'
  if (!pjson.dependencies) {
    pjson.dependencies = {}
  }
  pjson.dependencies['@kui-shell/plugin-sample'] = 'file:./plugins/plugin-sample'
  if (!pjson.scripts) {
    pjson.scripts = {}
  }
  pjson.scripts.init = 'if [ ! -e node_modules/@kui-shell/prescan.json ]; then kui-compile; fi'
  pjson.scripts.compile = 'kui-compile'
  pjson.scripts.watch = 'tsc --build . --watch'
  pjson.scripts['watch:webpack'] = 'kui-watch-webpack'
  pjson.scripts['pty:rebuild'] = 'cd node_modules/node-pty && npm run install'
  pjson.scripts['pty:electron'] =
    'if [ ! -e node_modules/node-pty/.npmrc ]; then cp node_modules/@kui-shell/builder/npmrc node_modules/node-pty/.npmrc && npm run pty:rebuild; fi'
  pjson.scripts['pty:nodejs'] =
    'if [ -e node_modules/node-pty/.npmrc ]; then rm -f node_modules/node-pty/.npmrc; npm run pty:rebuild; fi'
  pjson.scripts.start = 'npm run -s init && npm run -s pty:electron && electron . shell'
  await writeFile('package.json', JSON.stringify(pjson, undefined, 2))

  creating('npm install', 'running')
  await new Promise<void>((resolve, reject) => {
    exec('npm install', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        reject(stderr)
      } else {
        resolve()
      }
    })
  })
}

main(process.argv)
