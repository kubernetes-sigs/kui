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

const globby = require('globby')
const { join } = require('path')
const { signAsync: signForOSX } = require('electron-osx-sign')

/** Specify e.g. any native modules that need to be signed */
const binaries = (app /*: string */) => globby.sync(join(app, '**', '*.{dll,node}'))

function signingOptionsForOSX(name /*: string */) {
  return (appDir /*: string */) => {
    const app = join(appDir, `${name}.app`)

    return {
      app,
      identity: process.env.OSX_SIGNING_IDENTITY,
      'no-pre-auto-entitlements': process.env.NO_PRE_AUTO_ENTITLEMENTS === 'true',
      'provisioning-profile': process.env.PROVISIONING_PROFILE,
      platform: process.env.OSX_PLATFORM || 'darwin',
      'hardened-runtime': true,
      entitlements: join(__dirname, 'entitlements.plist'),
      'entitlements-inherit': join(__dirname, 'entitlements.plist'),
      'signature-flags': 'library',
      'gatekeeper-assess': false, // see https://github.com/electron/electron-osx-sign/issues/196
      binaries: binaries(app)
    }
  }
}

/**
 * Application signing
 *
 * For macOS, this requires:
 *    - process.env.OSX_SIGNING_IDENTITY a signing cerification
 *
 * Notes: To get the necessary info for macOS: Create a signing
 * certificate, in the lower-left corner of the signing certificates
 * sheet, click the Add button (+), and choose a certificate type from
 * the pop-up menu.
 *
 */
function sign(name /*: string*/, platform /*: string */) {
  return async (apps /*: string[]*/) => {
    // a) only sign for darwin targets; and b) signing only works on darwin hosts
    if (platform === 'darwin' && process.platform === 'darwin') {
      if (process.env.OSX_SIGNING_IDENTITY) {
        await Promise.all(apps.map(signingOptionsForOSX(name)).map(signForOSX))
      } else {
        console.error(
          'Not signing the macOS binary. Make sure to set these environment variables: OSX_SIGNING_IDENTITY, PROVISIONING_PROFILE'
        )
      }
    }

    return apps
  }
}

module.exports = sign
