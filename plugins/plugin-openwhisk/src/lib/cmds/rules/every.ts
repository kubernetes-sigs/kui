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

/**
 * This plugin introduces /wsk/rules/every, to simplify the creation
 * of periodic rules.
 *
 *   every 5s do foo
 *   every 3h 5m do foo
 *
 */

import * as parse from 'parse-duration'

import { REPL } from '@kui-shell/core'

const MILLIS_PER_SECOND = 1000

/**
 * Command handler
 *
 */
const doEvery = async ({ argv }) => {
  const actionName = argv[argv.length - 1]
  const timeSpec = argv.slice(1, argv.length - 2)
  const timeSpecString = timeSpec.join(' ')
  const duration = parse(timeSpecString)

  const durationInSeconds = duration / MILLIS_PER_SECOND
  const cron = `*/${durationInSeconds} * * * * *`

  const triggerName = `every_${timeSpec.join('_')}`
  const ruleName = `${triggerName}_do_${actionName}`
  const safeTimeSpec = timeSpecString.replace(/"/, '').replace(/'/, '') // no quotes

  try {
    await REPL.qexec(`wsk trigger get ${triggerName}`, null, null, {
      noRetry: true
    })
  } catch (err) {
    if (err.statusCode === 404) {
      await REPL.qexec(
        `wsk trigger create ${triggerName} --feed /whisk.system/alarms/alarm -a pretty "every ${safeTimeSpec}" -p cron "${cron}"`
      )
    } else {
      throw err
    }
  }

  return REPL.qexec(`wsk rule update ${ruleName} ${triggerName} ${actionName}`)
}

/**
 * Register the command
 *
 */
export default commandTree => {
  // install the routes
  commandTree.listen('/wsk/every', doEvery, {
    docs: 'Execute an OpenWhisk action periodically; e.g. "every 5 sec do foo"'
  })
  // commandTree.listen('/wsk/never', doEvery, { docs: 'Remove a periodic execution; e.g. "never 5 sec do foo"' })
}
