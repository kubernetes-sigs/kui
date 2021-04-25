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

process.argv.shift()
process.argv.shift()

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
async function copySignableBits(buildPath, electronVersion, targetPlatform, targetArch, callback) {
  // copy in the headless build?
  if (process.env.KUI_HEADLESS_WEBPACK) {
    const source = process.env.HEADLESS_BUILDDIR
    const target = join(buildPath, '..', basename(source)) // buildPath is Contents/Resources/app on macOS
    console.log(`Copying in headless build for ${targetPlatform} ${targetArch} to ${target}`)
    await emptyDir(target)
    await copy(source, target)
  }

  callback()
}

// required positional arguments to our main:
const dir = process.argv[0]
const name = process.argv[1]
const platform = process.argv[2]
const arch = process.argv[3]
const icon = process.argv[4]

const args = {
  dir,
  name,
  platform,
  arch,
  icon,

  // required environmental parameters:
  appVersion: process.env.VERSION,
  buildVersion: process.env.VERSION,
  electronVersion: process.env.ELECTRON_VERSION,
  out: process.env.BUILDDIR,

  // optional environmental parameters
  prune: !process.env.NO_PRUNE,
  ignore: process.env.IGNORE,

  // default settings
  asar: !process.env.NO_ASAR && platform !== 'win32', // node-pty loading native modules versus asar :(
  overwrite: true,

  // and finally, this is the reason we are here:
  afterCopy: [copyNodePty, copySignableBits]
}

//
// macOS signing:
//
// Create a signing certificate In the lower-left corner of the
// signing certificates sheet, click the Add button (+) , and choose a
// certificate type from the pop-up menu.
//
if (process.env.OSX_SIGNING_IDENTITY) {
  args.osxSign = {
    identity: process.env.OSX_SIGNING_IDENTITY,
    'no-pre-auto-entitlements': process.env.NO_PRE_AUTO_ENTITLEMENTS === 'true',
    'provisioning-profile': process.env.PROVISIONING_PROFILE,
    platform: process.env.OSX_PLATFORM || 'darwin',
    'hardened-runtime': true,
    entitlements: join(__dirname, 'entitlements.plist'),
    'entitlements-inherit': join(__dirname, 'entitlements.plist'),
    'signature-flags': 'library',
    'gatekeeper-assess': false // see https://github.com/electron/electron-osx-sign/issues/196
  }
} else {
  console.error(
    'Not signing the macOS binary. Make sure to set these environment variables: OSX_SIGNING_IDENTITY, PROVISIONING_PROFILE'
  )
}

//
// macOS notarization: needs an AppleId, an app-specific password, a
// team short name, and an app bundle ID
//
// To generate an app-specific password: Sign in to your Apple ID
// account page. In the Security section, click Generate Password
// below App-Specific Passwords.
//
if (process.env.APPLEID && process.env.APPLEID_PASSWORD && process.env.APP_BUNDLE_ID && process.env.ASC_PROVIDER) {
  args.osxNotarize = {
    ascProvider: process.env.ASC_PROVIDER, // team short name
    appBundleId: process.env.APP_BUNDLE_ID, // app bundle id
    appleId: process.env.APPLEID, // login ID for your AppleID account
    appleIdPassword: process.env.APPLEID_PASSWORD // NOT the password for that account; this is an app-specific password
  }
} else {
  console.error(
    'Not notarizing the macOS binary. Make sure to set these environment variables: APPLEID, APPLEID_PASSWORD, APP_BUNDLE_ID, ASC_PROVIDER'
  )
}

if (process.env.APP_BUNDLE_ID) {
  args.appBundleId = process.env.APP_BUNDLE_ID // app bundle id
}

//
// invoke electron-packager, catching any errors it might throw
//
packager(args)
  .then(() => {
    console.log('success')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
