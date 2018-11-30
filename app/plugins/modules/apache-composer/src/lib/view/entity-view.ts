import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/entity-view')
import * as repl from '../../../../../../build/core/repl'
import { isHeadless } from '../../../../../../build/core/capabilities'
import * as util from '../utility/ast'
const defaultMode = 'visualization'
// import * as wskFlowUtil from '../../../../wskflow/plugin/lib/util'
/**
 * Format the given activation record for display as a session
 *
 */
export const formatSessionResponse = activation => {
  activation.prettyType = 'sessions'

    // entity onclick handler
  activation.onclick = () => repl.pexec(`app get "/${path}"`)

    // add our visualization view mode
  if (!activation.modes) activation.modes = []
  activation.modes.find(({ mode }) => mode === 'logs').label = 'trace'

  const path = activation.annotations.find(({ key }) => key === 'path').value

  activation.modes.push({
    mode: defaultMode,
    label: 'Session Flow',
    direct: entity => repl.pexec(`session flow ${activation.activationId}`)
  })

  debug('session response', activation)
  return activation
}

export const formatCompositionEntity = execOptions => response => {
  return isHeadless() ? response : repl.qfexec(`app get "${response.name}"`, undefined, undefined, execOptions)
}

export const formatCompositionResult = (result, options) => {
  if (options.result || options.r) return result
  else return isHeadless() ? result.response.result : repl.qfexec(`activation get ${result.activationId}`)
}

export const formatDeleteResult = response => {
  response.type = 'composition' // to distinguish composition with action in CLI
  return response
}

export const formatSessionGet = response => {
  debug('session get response', response)
  if (response && response.annotations && response.annotations.find(({ key, value }) => key === 'conductor' && value)) {
    debug('activation is session')
    return formatSessionResponse(response)
  } else {
    debug('activation is not session')
    return response
  }
}

export const visualizeComposition = async (response, execOptions) => {
  debug('Visualizing Composition', response)

  const action = response.message || response
  // const execOptions = opts.execOptions

  debug('execOptions', execOptions)

  if (util.hasAst(action) && !isHeadless()) {
    const doVisualize = execOptions.override || !execOptions.nested
    const options = execOptions.originalOptions || {}
    // use require rather than import here to prevent from prequiring wskflow module in headless mode
    const content = await require('../../../../wskflow/plugin/lib/util').decorateAsApp({ action, doVisualize, options: Object.assign({}, execOptions, options) })
    const input = `/${response.namespace}/${response.name}`

    if (doVisualize) {
      debug('visualze composition')

      return Object.assign(action, {
        type: 'custom',
        viewName: action.type,
        content,
        input,
        isEntity: true
      })
    } else {
      return response
    }
  } else {
    return response
  }
}

// TODO format a list view?
export const formatSessionList = (result) => {
  return { sessionId: result.activationId, name: result.name, status: result.response.status, duration: result.duration }
}
