import * as Debug from 'debug'
const debug = Debug('plugin/apache-composer/init')
import sessionList from './lib/controller/cmd/session-list'
import sessionGet from './lib/controller/cmd/session-get'
import invoke from './lib/controller/cmd/app-invoke'
import appDelete from './lib/controller/cmd/app-delete'
import appCreate from './lib/controller/cmd/app-create'
import appGet from './lib/controller/cmd/app-get'
import appList from './lib/controller/cmd/app-list'
import appConfig from './lib/controller/cmd/app-config'
import * as usage from './usage'

export default async (commandTree, prequire) => {
  debug('initializing')

  commandTree.subtree('/composer', { usage: usage.composer })

  const app = commandTree.subtree('/wsk/app', { usage: usage.app })
  commandTree.subtreeSynonym('/composer/app', app)

  const session = commandTree.subtree('/wsk/session', { usage: usage.session })
  commandTree.subtreeSynonym('/composer/session', session)

  // CRUD commands
  await sessionList(commandTree, prequire)
  await sessionGet(commandTree, prequire)
  await invoke(commandTree, prequire)
  await appDelete(commandTree, prequire)
  await appCreate(commandTree, prequire)
  await appList(commandTree, prequire)
  await appGet(commandTree, prequire)
  await appConfig(commandTree, prequire)

  debug('init done')
}
