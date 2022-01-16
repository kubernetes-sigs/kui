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

const os = require('os')
const path = require('path')
const shell = require('shelljs')
const pkg = require(path.join(process.cwd(), 'package.json'))
const { cacheRoot, mirrorOptions } = require('./electron-get-options')

async function downloadPatchedElectron() {
  const electronGet = require('@electron/get')
  console.log('downloading patched electron')
  const zipPath = await electronGet.download(pkg.devDependencies.electron, {
    cacheRoot,
    mirrorOptions
  })
  console.log('downloaded patched electron to', zipPath)
  const unzipDirPath = path.join(process.cwd(), 'node_modules/electron/dist')
  shell.rm('-rf', unzipDirPath)
  shell.exec(`unzip -q "${zipPath}" -d "${unzipDirPath}"`)
}

downloadPatchedElectron()
