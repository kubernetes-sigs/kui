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

const { join } = require('path')
const { notarize: notarizeForOSX } = require('electron-notarize')

function notarizationOptionsForOSX(name /*: string */) {
  return (appDir /*: string */) => {
    const appPath = join(appDir, `${name}.app`)

    return {
      appPath,
      tool: 'notarytool',
      teamId: process.env.ASC_PROVIDER, // team short name
      ascProvider: process.env.ASC_PROVIDER, // team short name
      appBundleId: process.env.APP_BUNDLE_ID, // app bundle id
      appleId: process.env.APPLEID, // login ID for your AppleID account
      appleIdPassword: process.env.APPLEID_PASSWORD // NOT the password for that account; this is an app-specific password
    }
  }
}

/**
 * Application notarization
 *
 * For macOS, this requires:
 *   - process.env.APPLEID an AppleId
 *   - process.env.APPLEID_PASSWORD an app-specific password
 *   - process.env.ASC_PROVIDER a team short
 *   - process.env.APP_BUNDLE_ID an app bundle ID
 *
 * Notes: To generate an app-specific password for macOS: Sign in to
 * your Apple ID account page. In the Security section, click Generate
 * Password below App-Specific Passwords.
 *
 */
function notarize(name /*: string*/, platform /*: string */) {
  return async (apps /*: string[] */) => {
    if (process.platform === 'darwin') {
      if (
        process.env.APPLEID &&
        process.env.APPLEID_PASSWORD &&
        process.env.APP_BUNDLE_ID &&
        process.env.ASC_PROVIDER
      ) {
        await Promise.all(apps.map(notarizationOptionsForOSX(name)).map(notarizeForOSX))
      } else {
        console.error(
          'Not notarizing the macOS binary. Make sure to set these environment variables: APPLEID, APPLEID_PASSWORD, APP_BUNDLE_ID, ASC_PROVIDER'
        )
      }
    }

    return apps
  }
}

module.exports = notarize
