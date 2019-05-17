
import { CommandRegistrar, IEvaluatorArgs } from "@kui-shell/core/models/command";
import sessionStore from '@kui-shell/core/models/sessionStore'

import * as Debug from 'debug'
import { getTabIndex, getCurrentTab } from '@kui-shell/core/webapp/cli'
const debug = Debug('plugins/bash-like/cmds/general')

const key = 'export'
/**
 * export command
 *
 */
const exportCommand = ({ command, parsedOptions, execOptions }: IEvaluatorArgs) => {
    const storage = JSON.parse(sessionStore().getItem(key)) || {}

    const tabId = getTabIndex(getCurrentTab());
    const curDic = storage[tabId] || {}
    const toBeParsed = parsedOptions._[1]

    // TO DO:
    // escape quoted equal sign
    const arr = toBeParsed.split('=')

    curDic[arr[0]] = arr[1]

    storage[tabId] = curDic
    sessionStore().setItem(key, JSON.stringify(storage))
    return true;
}

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
    commandTree.listen('/export', exportCommand, { usage: null, noAuthOk: true, requiresLocal: true })
}
