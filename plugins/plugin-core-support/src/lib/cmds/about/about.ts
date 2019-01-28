/*
 * Copyright 2017-2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('plugins/core-support/about')
debug('loading')

import * as colors from 'colors/safe'
import * as path from 'path'

import { isHeadless, inElectron } from '@kui-shell/core/core/capabilities'
import * as repl from '@kui-shell/core/core/repl'

import usage from './usage'
import { version } from '@kui-shell/settings/package.json'
import { theme as settings } from '@kui-shell/core/core/settings'

/** path to app/ directory */
const ourRootDir = path.dirname(require.resolve('@kui-shell/plugin-core-support/package.json'))
const settingsDir = path.dirname(require.resolve('@kui-shell/settings/package.json'))

/**
 * The repl allows plugins to provide their own window, via the
 * `bringYourOwnWindow` attribute. Here, we define our
 * bringYourOwnWindow behavior, for the `about` command.
 *
 */
const aboutWindow = async () => { /* bringYourOwnWindow impl */
  debug('aboutWindow')

  // note that this cannot be a top-level import, because the
  // about-window npm does not behave nicely in headless mode
  const openAboutWindow = (await import('about-window')).default

  const about = openAboutWindow({
    product_name: settings.productName,
    icon_path: path.join(settingsDir, '..', settings.largeIcon),
    package_json_dir: settingsDir,
    // use_inner_html: true,
    css_path: [
      path.join(settingsDir, '../content/css/themes/', settings.cssTheme),
      path.join(ourRootDir, 'web/css/about.css')
    ],
    win_options: { width: 600, height: 600 }
  })

  // remove the click handler from the title element
  about.webContents.on('did-finish-load', () => {
    about.webContents.executeJavaScript("const t = document.querySelector('.title'), c=t.cloneNode(false); while (t.hasChildNodes()) c.appendChild(t.firstChild); t.parentNode.replaceChild(c, t);")
  })
}

/**
 * Return, textually, the current version of the tool
 *
 */
const getVersion = () => {
  debug('getVersion')
  return version
}

/**
 * Report the current version, and availability of updates
 *    For headless, return a textual concatenation of the two.
 */
const reportVersion = ({ argv }) => {
  debug('reportVersion')

  const checkForUpdates = argv.find(_ => _ === '-u' || _ === '--update-check')
  const version = getVersion()

  if (!checkForUpdates) {
    // we were asked only to report the installed version
    return version
  }

  //
  // otherwise, we were asked to check for updates
  //
  if (isHeadless()) {
    console.log('You are currently on version ' + colors.blue(version))
    process.stdout.write(colors.dim('Checking for updates... '))
  }

  return repl.qexec('updater check')
    .then(updates => {
      if (updates === true) {
        // then we're up to date, so just report the version
        if (isHeadless()) {
          return 'you are up to date!'
        } else {
          return version
        }
      } else {
        // then updates are available, so report the updates available message
        if (isHeadless()) {
          // above, we left with a process.stdout.write, so
          // now we need to clear a newline see shell issue
          // #194
          console.log('')
          console.log('')
        }
        return updates
      }
    })
}

/**
 * Here we install the command handlers for /version and /about
 *
 */
export default (commandTree, prequire) => {
  debug('init')

  // for menu
  if (!commandTree) {
    return aboutWindow()
  }

  // these commands don't require any auth
  const noAuthOk = true

  /**
   * Print out the current version of the tool, as text
   *
   */
  commandTree.listen('/version', // the command path
    reportVersion, // the command handler
    { noAuthOk, // the command options
      usage: usage.version })

  /**
   * Open a graphical window displaying more detail about the tool
   *
   */
  commandTree.listen('/about', () => {
    if (inElectron()) {
      aboutWindow()
      return true // tell the REPL we succeeded
    } else {
      // TODO, what should we show if we aren't in electron?
      return repl.qexec('version')
    }
  }, {
    hidden: true, // don't list about in the help menu
    needsUI: true, // about requires a window
    bringYourOwnWindow: aboutWindow, // about will manage its own window
    noAuthOk // about doesn't require openwhisk authentication
  })

  debug('init done')
}
