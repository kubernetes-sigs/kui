import {
  CommandRegistrar,
  IEvaluatorArgs
} from '@kui-shell/core/models/command'
import sessionStore from '@kui-shell/core/models/sessionStore'
import { getTabIndex, getCurrentTab } from '@kui-shell/core/webapp/cli'
import * as Debug from 'debug'

const debug = Debug('plugin/export')
const key = 'openwhisk.export'
/**
 * export command
 *
 */
const exportCommand = ({
  command,
  parsedOptions,
  execOptions
}: IEvaluatorArgs) => {
  const storage = JSON.parse(sessionStore().getItem(key)) || {}

  const tabId = getTabIndex(getCurrentTab())
  const curDic = storage[tabId] || {}
  const toBeParsed = parsedOptions._[1]

  // TO DO:
  // escape quoted equal sign
  // split by the first unquoted space
  const splitBySpace = toBeParsed.split(" (?=(([^'\"]*['\"]){2})*[^'\"]*$)")[0]

  const arr = splitBySpace.split('=')
  if (arr.length <= 1) {
    // bad assignment warning
    debug('badddddd')
    return false
  }
  curDic[arr[0]] = arr[1]

  storage[tabId] = curDic
  sessionStore().setItem(key, JSON.stringify(storage))
  return true
}

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/export', exportCommand, {
    usage: null,
    noAuthOk: true,
    requiresLocal: true
  })
}
