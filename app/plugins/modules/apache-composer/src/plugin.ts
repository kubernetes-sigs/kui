import * as Debug from 'debug'
const debug = Debug('plugin/apache-composer/init')
import commands from './lib/controller/commands'
import * as usage from './usage'

export default async (commandTree, prequire) => {
  debug('initializing')

  commandTree.subtree('/composer', { usage: usage.composer })

  const app = commandTree.subtree('/wsk/app', { usage: usage.app })
  commandTree.subtreeSynonym('/composer/app', app)

  const session = commandTree.subtree('/wsk/session', { usage: usage.session })
  commandTree.subtreeSynonym('/composer/session', session)

  // CRUD commands
  await commands(commandTree, prequire)

  debug('init done')
}
