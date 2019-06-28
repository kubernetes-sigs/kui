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

const path = require('path')
const electronInstaller = require('electron-winstaller')

const BUILDDIR = path.join(__dirname, '..', process.env.BUILDDIR)
const { PRODUCT_NAME, SETUP_ICON: setupIcon } = process.env

const appDirectory = path.join(BUILDDIR, `${PRODUCT_NAME}-win32-x64`)
const outputDirectory = path.join(BUILDDIR, 'installers/win32-x64')

console.log('Windows squirrel build started')

electronInstaller
  .createWindowsInstaller({
    appDirectory,
    outputDirectory,
    setupIcon,
    name: 'kui',
    setupExe: `${PRODUCT_NAME}.exe`,
    exe: 'kui'
  })
  .then(() => {
    console.log('Windows squirrel build succeeded')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
