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

/**
 * This goal of this code is to invoke electron-packager with an
 * `afterCopy` script: `copyNodePty`. That afterCopy handler copies in
 * a prebuilt `pty.node` binary for the target platform.
 *
 * Why do we maintain our own prebuilt node-pty?
 * 1) node-pty-prebuilt is no longer maintained
 *
 * 2) the presumed replacement, node-pty-prebuilt-multiarch, is not
 * being kept up-to-date; for example, as of this writing, it does not
 * have a prebuilt binary for electron 6 darwin; it is also running a
 * back-level compared to the main `node-pty` release series
 *
 * 3) triggering a rebuild of node-pty-prebuilt-multiarch is a bit
 * strange; we have found that a simple `npm rebuild` at the top level
 * is not sufficient; instead, we have to copy our npmrc into the
 * node-pty-prebuilt-multiarch directory, and run in `npm install`
 * from that directory
 *
 * 4) the prebuilt binaries are small enough not to worry about: 8-12k
 * each
 *
 * 5) we can ride off the main node-pty release series, pinning at our
 * discretion
 *
 */

const { arch: osArch } = require('os')
const { createGunzip } = require('zlib')
const { basename, join } = require('path')
const packager = require('electron-packager')
const { copy, emptyDir } = require('fs-extra')
const { createReadStream, createWriteStream, readdir } = require('fs')

const sign = require('./sign')
const notarize = require('./notarize')

const nodePty = 'node-pty-prebuilt-multiarch'

/** afterCopy hook to copy in the platform-specific node-pty build */
async function copyNodePty(buildPath, electronVersion, targetPlatform, targetArch, callback) {
  if (process.platform === targetPlatform && targetArch === osArch()) {
    // if the current platform matches the target platform, there is
    // nothing to do
    callback()
  } else {
    const target = `${targetPlatform}-${targetArch}`
    const sourceDir = join(process.env.BUILDER_HOME, 'dist/electron/vendor', nodePty, 'build', target, 'electron')

    readdir(sourceDir, async (err, files) => {
      if (err) {
        callback(err)
      } else {
        try {
          await Promise.all(
            files.map(
              sourceFileGz =>
                new Promise((resolve, reject) => {
                  const source = join(sourceDir, sourceFileGz)
                  const target = join(
                    buildPath,
                    'node_modules',
                    nodePty,
                    'build/Release',
                    sourceFileGz.replace(/\.gz$/, '')
                  )
                  console.log(`node-pty source: ${source}`)
                  console.log(`node-pty target: ${target}`)

                  createReadStream(source)
                    .pipe(createGunzip())
                    .pipe(createWriteStream(target))
                    .on('error', reject)
                    .on('finish', resolve)
                })
            )
          )
          callback()
        } catch (err) {
          callback(err)
        }
      }
    })
  }
}

/** afterCopy hook to copy in headless build, etc. things that need to be codesigned */
function copySignableBits(baseArgs /*: { dir: string, name: string, platform: string, arch: string, icon: string } */) {
  return async (buildPath, electronVersion, targetPlatform, targetArch, callback) => {
    // copy in launcher? it is important to copy this in before
    // signing and notarizing, otherwise macOS/windows, when launching
    // the app, will see unsigned content in the application bundle
    try {
      if (baseArgs.launcher) {
        const source = baseArgs.launcher
        const target = join(buildPath, '..', basename(source)) // e.g. buildPath is Contents/Resources/app on macOS
        console.log(`Copying in launcher for ${targetPlatform} ${targetArch} from ${source} to ${target}`)
        await copy(source, target)
      }
    } catch (err) {
      console.error(`Error copying in launcher for ${targetPlatform} ${targetArch}`)
      console.error(err)
      callback(err)
    }

    // copy in the headless build?
    if (process.env.KUI_HEADLESS_WEBPACK) {
      const source = process.env.HEADLESS_BUILDDIR
      const target = join(buildPath, '..', basename(source)) // e.g. buildPath is Contents/Resources/app on macOS
      console.log(`Copying in headless build for ${targetPlatform} ${targetArch} to ${target}`)
      await emptyDir(target)
      await copy(source, target)
    }

    callback()
  }
}

/**
 * Use electron-packager to create the application package
 *
 */
function package(baseArgs /*: { dir: string, name: string, platform: string, arch: string, icon: string } */) {
  const args = Object.assign(baseArgs, {
    // where to store the builds
    out: process.env.BUILDDIR,

    // version settings
    appVersion: process.env.VERSION,
    buildVersion: process.env.VERSION,
    electronVersion: process.env.ELECTRON_VERSION,

    // do we want electron-packager to do an npm prune -o production?
    prune: !process.env.NO_PRUNE,

    // a regexp that will let us exclude specified files from the
    // final tarball
    ignore: process.env.IGNORE,

    // default settings
    overwrite: true,

    // asar is desirable, as it packs the zillions of node_modules
    // files into a single file; faster installation on users'
    // machines; but we have to be careful w.r.t. native modules
    asar: {
      unpack: '*.{node,dll}' // <-- avoids loading/signing issues with native modules
    },

    // lifecycle hooks to copy in our extra bits
    afterCopy: [copyNodePty, copySignableBits(baseArgs)]
  })

  if (process.env.APP_BUNDLE_ID) {
    // this part of electron-packager seems weird; we need to set the
    // macOS bundleID here (i.e. HERE ALSO!! we of course need to pass
    // it to the osx signer, below), otherwise the packager places a generic
    // bundleId in the macOS App (something like
    // com.electron.<myElectronAppName>)
    args.appBundleId = process.env.APP_BUNDLE_ID
  }

  return packager(args)
}

// required positional arguments to our main:
process.argv.shift()
process.argv.shift()
const dir = process.argv[0]
const name = process.argv[1]
const platform = process.argv[2]
const arch = process.argv[3]
const icon = process.argv[4]
const launcher = process.argv[5]

//
// invoke electron-packager, catching any errors it might throw
//
package({ dir, name, platform, arch, icon, launcher })
  .then(sign(name, platform))
  .then(notarize(name, platform))
  .then(() => {
    console.log('success')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
