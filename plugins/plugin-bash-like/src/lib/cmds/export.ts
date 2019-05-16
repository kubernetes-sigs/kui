
import { CommandRegistrar, IEvaluatorArgs } from "@kui-shell/core/models/command";
import sessionStore from '@kui-shell/core/models/sessionStore'

import * as Debug from 'debug'
const debug = Debug('plugins/bash-like/cmds/general')

const key = 'export'
/**
 * export command
 *
 */
const exportCommand = ({ command, parsedOptions, execOptions }: IEvaluatorArgs) => {
    const curDic = JSON.parse(sessionStore().getItem(key)) || {}
    const toBeParsed = parsedOptions._[1]

    // TO DO:
    // escape quoted equal sign
    const arr = toBeParsed.split('=')

    const k = arr[0]
    const val = arr[1]
    debug(k, val)
    curDic[k] = val
    sessionStore().setItem(key, JSON.stringify(curDic))
    debug("hereeee", window.sessionStorage.getItem('export'))
    return true;
}

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
    commandTree.listen('/export', exportCommand, { usage: null, noAuthOk: true, requiresLocal: true })
}
