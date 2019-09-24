/*
 * Copyright 2017 IBM Corporation
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

import { REPL } from '@kui-shell/core'

const messages = {
  error: 'Error checking for updates'
}

const defaults = {
  DELAY_ON_START: 10 * 1000, // wait 10 seconds after the app starts before the first check
  INTERVAL_IN_MILLIS: 12 * 60 * 60 * 1000 // then check once every 12 hours
}

const npmProcessResponse = (exec = 'npm', name, stdout) => {
  // npm5 reports code=1 for "updates available"
  // then updates are available; `stdout` will be something
  // like this. strip off the last column, and any blank lines
  //
  // Package               Current   Wanted   Latest  Location
  // kui-shell  1.3.137  1.3.140  1.3.140
  //
  const lines = stdout.split(/\r?\n/)
  const header = lines[0]
  const Current = header.indexOf('Current')
  const Wanted = header.indexOf('Wanted')
  const Location = header.indexOf(' Location')

  return lines
    .filter(_ => _) // strip blank lines
    .map(line => line.substring(0, Location)) // strip last column
    .map(line => line.substring(0, Current + 'Current'.length) + line.substring(Wanted + 'Wanted'.length)) // strip Wanted column
    .concat(' ')
    .concat('To update, run the following command from the terminal:')
    .concat(`${exec} update ${name} -g`)
}

/**
 * Wrap the given string in a div
 *
 */
const wrapInDiv = (str, tag = 'div') => {
  if (typeof str === 'string') {
    const div = document.createElement(tag)
    div.innerText = str
    return div
  } else {
    const pre = document.createElement('div')
    pre.style.whiteSpace = 'pre-wrap'

    str.forEach(line => {
      pre.appendChild(wrapInDiv(line))
    })

    return pre
  }
}

/**
 * Check for available updates to the tool
 *
 */
const defaultBackupPlans = [
  {
    exec: 'npm',
    opts: {
      env: { PATH: `${process.env.PATH}:/usr/local/bin` } // /usr/local/bin might not be on PATH
    }
  }
]
const checkForUpdates = (quiet = false, exec = 'npm', opts = {}, backupPlans = defaultBackupPlans) =>
  new Promise((resolve, reject) => {
    try {
      const shellName = 'kui-shell'
      const spawn = require('child_process').exec
      spawn(`${exec} outdated -g ${shellName}`, opts, (err, stdout, stderr) => {
        if (err && stdout.length === 0) {
          if (backupPlans.length > 0) {
            // try one of the backup plans
            const plan = backupPlans.pop()
            checkForUpdates(quiet, plan.exec, plan.opts, backupPlans).then(resolve, reject)
          } else {
            if (err) {
              console.error(err)
            }
            if (stderr.length > 0) {
              console.error(`Updater stderr said: ${stderr}`)
            }
            if (stdout.length > 0) {
              console.log(`Updater stdout said: ${stdout}`)
            }
            resolve(messages.error)
          }
        } else if (stdout.length === 0) {
          // no updates available
          resolve(true)
        } else {
          // npm5 reports code=1 for "updates available"
          // then updates are available; `stdout` will be something
          // like this. strip off the last column, and any blank lines
          //
          // Package               Current   Wanted   Latest  Location
          // kui-shell  1.3.137  1.3.140  1.3.140
          //
          resolve(wrapInDiv(npmProcessResponse(exec, shellName, stdout)))
        }
      })
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

/**
 * Inform the user of the updater status, via the UI
 *
 */
const notifyOfAvailableUpdatesVisually = changes => {
  if (changes !== messages.error && changes !== true) {
    console.log('Updates available')

    const notificationArea = document.querySelector('#notification-area')
    let notificationWidget = notificationArea.querySelector('.updates-available-widget') as HTMLElement
    if (!notificationWidget) {
      notificationWidget = document.createElement('div')
      notificationWidget.className = 'updates-available-widget green-text graphical-clickable'
      notificationWidget.style.fontSize = '1.75em'
      notificationWidget.innerText = '\u2B06'
      notificationWidget.setAttribute('title', 'Updates available, click here to get update')
      notificationArea.appendChild(notificationWidget)

      // click handler for notification widget
      notificationWidget.onclick = () => REPL.pexec('updater check')
    }
  }

  return changes
}

const checkForUpdatesQuietly = () => checkForUpdates(true)

/**
 * Chain an update check with a visual notifier
 *
 */
const checkForUpdatesThenNotifyVisually = () => checkForUpdatesQuietly().then(notifyOfAvailableUpdatesVisually)

/**
 * The updater impl
 *
 */
class Updater {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(initialDelay, updateCheckIntervalInMillis) {
    setTimeout(checkForUpdatesThenNotifyVisually, initialDelay) // check for updates soon after startup
    setInterval(checkForUpdatesThenNotifyVisually, updateCheckIntervalInMillis) // then poll infrequently for updates
  }
}

/**
 * Install the command handlers and background checker
 *
 */
export default commandTree => {
  const updater = new Updater(defaults.DELAY_ON_START, defaults.INTERVAL_IN_MILLIS)

  commandTree.listen(
    `/updater/check`,
    () => checkForUpdates(), // intentionally squashing all arguments that might naturally flow in
    { docs: 'Check for updates' }
  )

  // commandTree.listen(`/updater/update`, () => updater.doUpdate(), { docs: 'Update to the latest version' })

  return updater
}
