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
const packager = require('electron-packager')
const { basename, dirname, join } = require('path')
const { serialHooks } = require('electron-packager/src/hooks')
const { copy, emptyDir, mkdirp, remove } = require('fs-extra')
const { createReadStream, createWriteStream, readdir } = require('fs')
const { exec } = require('child_process')

const sign = require('./sign')
const notarize = require('./notarize')

const nodePty = 'node-pty'

/**
 * Ignore these files when bundling the ASAR (this is a regexp, not
 * glob pattern) see the electron-packager docs for --ignore
 */
const ignore = [
  /~$/,
  /\/.log$/, // not sure, but some giant logs from typescript? "Adding typings to cache..."
  /\.ts$/,
  /\.vscode/,
  /\.github/,
  /\.git/,
  /lerna\.json/,
  /@types/,
  /tsconfig\.json/,
  /webpack\.config\.json/,
  /\.cache/,
  /\.map$/,
  /bak\.json/,
  /packages/,
  /plugins/,
  /\.scss$/,
  /\.woff$/,
  /CHANGELOG\.md/,
  /tsconfig\..*/,
  /package-lock\.json/,
  /\/docs/,
  ...(process.env.KUI_KEEP_NODE_MODULES
    ? []
    : [
        new RegExp(
          `/node_modules/(?!(@electron|@electron/remote|node-pty/build|@kui-shell/build${
            process.env.KUI_KEEP_NODE_MODULE ? '|' + process.env.KUI_KEEP_NODE_MODULE : ''
          }))`
        )
      ]),
  /^\/tools/,
  /^\/bin/,
  /^\/design/,
  /^\/dist\/webpack/
]

/**
 * afterCopy hook to build webpack bundles.
 *
 * @param this baseArgs from package() below
 *
 */
async function buildWebpack(buildPath, electronVersion, targetPlatform, targetArch) {
  const CLIENT_HOME = this.dir

  console.log('buildPath', buildPath)

  const asyncs /*: Promise<void>[]*/ = []

  const env = Object.assign({}, process.env, {
    CLIENT_HOME,
    MODE: 'production',
    TARGET: 'electron-renderer',
    KUI_STAGE: buildPath,
    KUI_MAIN: `${CLIENT_HOME}/node_modules/@kui-shell/react`,
    KUI_BUILDER_HOME: `${CLIENT_HOME}/node_modules/@kui-shell/builder`
  })

  const buildHeadless = () => {
    console.log('Building headless bundles via webpack')
    return new Promise((resolve, reject) => {
      exec(
        `npx --no-install webpack-cli --mode=production --config "${CLIENT_HOME}/node_modules/@kui-shell/webpack/headless-webpack.config.js"`,
        { env },
        (err, stdout, stderr) => {
          console.log('stdout', stdout)
          if (err) {
            console.error(err)
            reject(stderr)
          } else {
            resolve()
          }
        }
      )
    })
  }

  // generate prescan model; to do so we need a headless build
  await buildHeadless()
  await new Promise((resolve, reject) => {
    exec(`npx --no-install kui-prescan`, { env, cwd: env.CLIENT_HOME }, (err, stdout, stderr) => {
      console.log('stdout', stdout)
      if (err) {
        console.error(err)
        reject(stderr)
      } else {
        resolve()
      }
    })
  })

  // re-build headless now that we have the prescan
  asyncs.push(buildHeadless())

  console.log('Building electron bundles via webpack')
  asyncs.push(
    new Promise((resolve, reject) => {
      exec(
        `npx --no-install webpack-cli --mode=production --config "${CLIENT_HOME}/node_modules/@kui-shell/webpack/webpack.config.js"`,
        { env },
        (err, stdout, stderr) => {
          console.log('stdout', stdout)
          if (err) {
            console.error(err)
            reject(stderr)
          } else {
            resolve()
          }
        }
      )
    })
  )

  await Promise.all(asyncs)
}

/** afterCopy hook to copy in the platform-specific node-pty build */
function copyNodePty(buildPath, electronVersion, targetPlatform, targetArch) {
  return new Promise((resolve, reject) => {
    console.log('copying node pty')
    const target = `${targetPlatform}-${targetArch}`
    const sourceDir = join(process.env.BUILDER_HOME, 'dist/electron/vendor', nodePty, 'build', target, 'electron')
    console.log('sourceDir', sourceDir)

    readdir(sourceDir, async (err, files) => {
      if (err) {
        reject(err)
      } else {
        try {
          await Promise.all(
            files.map(async sourceFileGz => {
              const source = join(sourceDir, sourceFileGz)
              const target = /spawn-helper/.test(sourceFileGz)
                ? join(buildPath, 'dist/build/Release', sourceFileGz.replace(/\.gz$/, ''))
                : join(buildPath, 'node_modules', nodePty, 'build/Release', sourceFileGz.replace(/\.gz$/, ''))
              console.log(`node-pty source: ${source}`)
              console.log(`node-pty target: ${target}`)

              await mkdirp(dirname(target))

              return new Promise((resolve, reject) => {
                createReadStream(source)
                  .pipe(createGunzip())
                  .pipe(createWriteStream(target, { mode: 0o755 }))
                  .on('error', reject)
                  .on('finish', resolve)
              })
            })
          )
          resolve()
        } catch (err) {
          reject(err)
        }
      }
    })
  })
}

/** afterCopy hook to copy in headless build, etc. things that need to be codesigned */
async function copySignableBits(buildPath, electronVersion, targetPlatform, targetArch) {
  // copy in launcher? it is important to copy this in before
  // signing and notarizing, otherwise macOS/windows, when launching
  // the app, will see unsigned content in the application bundle
  if (this.launcher) {
    const source = this.launcher
    const target = join(buildPath, '..', basename(source)) // e.g. buildPath is Contents/Resources/app on macOS
    console.log(`Copying in launcher for ${targetPlatform} ${targetArch} from ${source} to ${target}`)
    await copy(source, target)
    // NO!!! TODO find a better way to remove kubect-kui await remove(source)
  }

  // copy in the headless build
  const source = process.env.HEADLESS_BUILDDIR
  const target = join(buildPath, 'dist', basename(source)) // e.g. buildPath is Contents/Resources/app on macOS
  console.log(`Copying in headless build for ${targetPlatform} ${targetArch} to ${target}`)
  await emptyDir(target)
  await copy(source, target)
}
/**
 * Use electron-packager to create the application package
 *
 */
function package(baseArgs /*: { dir: string, name: string, platform: string, arch: string, icon: string } */) {
  const client = join(baseArgs.dir, 'node_modules', '@kui-shell', 'client')
  const iconSpecifiedByClient = require(join(client, 'config.d', 'icons')).filesystem[baseArgs.platform]

  const args = Object.assign(baseArgs, {
    // where to store the builds
    out: process.env.BUILDDIR,

    icon: join(client, iconSpecifiedByClient),

    // version settings
    appVersion: process.env.VERSION,
    buildVersion: process.env.VERSION,
    electronVersion: process.env.ELECTRON_VERSION,

    // do we want electron-packager to do an npm prune -o production?
    prune: !process.env.NO_PRUNE,

    // a regexp that will let us exclude specified files from the
    // final tarball
    ignore,

    // default settings
    overwrite: true,

    // asar is desirable, as it packs the zillions of node_modules
    // files into a single file; faster installation on users'
    // machines; but we have to be careful w.r.t. native modules
    asar: false,

    // lifecycle hooks to copy in our extra bits
    afterCopy: [serialHooks([buildWebpack.bind(baseArgs), copyNodePty, copySignableBits.bind(baseArgs)])]
  })

  console.log('args', args)
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
const launcher = process.argv[4]

const download = undefined
// const download = platform !== 'darwin' ? undefined : require('../electron-get-options')
// ^^^^ in case you need to hack electron download options in the future

//
// invoke electron-packager, catching any errors it might throw
//
package({ dir, name, platform, arch, launcher, download })
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
