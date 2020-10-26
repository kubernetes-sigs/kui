/*
 * Copyright 2017-2019 IBM Corporation
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

// import { REPL, Util } from '@kui-shell/core'

// import { clientOptions, getClient } from '../client/get'

/** api gateway actions */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/*
const api = {
  get: (options, argv: string[]) => {
    if (!options) return
    const maybeVerb = argv[1]
    const split = options.name.split('/')
    let path = options.name
    if (split.length > 0) {
      options.name = `/${split[1]}`
      path = `/${split[2]}`
    }
    return {
      postprocess: res => {
        // we need to present the user with an entity of some
        // sort; the "api create" api does not return a usual
        // entity, as does the rest of the openwhisk API; so
        // we have to manufacture something reasonable here
        const { apidoc } = res.apis[0].value
        const { basePath } = apidoc
        const apipath = apidoc.paths[path]
        const verb = maybeVerb || Object.keys(apipath)[0]
        const { action: name, namespace } = apipath[verb]['x-openwhisk']

        // our "something reasonable" is the action impl, but
        // decorated with the name of the API and the verb
        return REPL.qexec(`wsk action get "/${namespace}/${name}"`).then(action =>
          Object.assign(action, {
            name,
            namespace,
            packageName: `${verb} ${basePath}${path}`
          })
        )
      }
    }
  },
  create: (options, argv: string[]) => {
    if (argv && argv.length === 3) {
      options.basepath = options.name
      options.relpath = argv[0]
      options.operation = argv[1]
      options.action = argv[2]
    } else if (argv && argv.length === 2) {
      options.relpath = options.name
      options.operation = argv[0]
      options.action = argv[1]
    } else if (options && options['config-file']) {
      // fs.readFileSync(options['config-file'])
      throw new Error('config-file support not yet implemented')
    }

    return {
      preprocess: (_, execOptions) => {
        // we need to confirm that the action is web-exported
        const ow = getClient(execOptions)

        // this is the desired action impl for the api
        const name = argv[argv.length - 1]
        return ow.actions
          .get(Object.assign({ name }, clientOptions))
          .then(action => {
            const isWebExported = action.annotations.find(({ key }) => key === 'web-export')
            if (!isWebExported) {
              const error = new Error(
                `Action '${name}' is not a web action. Issue 'wsk action update "${name}" --web true' to convert the action to a web action.`
              )
              error['code'] = 412 // precondition failed
              throw error
            }
          })
          .then(() => _) // on success, return whatever preprocess was given as input
          .catch(err => {
            if (err.statusCode === 404) {
              const error = new Error(`Unable to get action '${name}': The requested resource does not exist.`)
              error['code'] = 404 // not found
              throw error
            } else {
              throw err
            }
          })
      },
      postprocess: ({ apidoc }) => {
        const { basePath } = apidoc
        const path = Object.keys(apidoc.paths)[0]
        const api = apidoc.paths[path]
        const verb = Object.keys(api)[0]
        const { action: name, namespace } = api[verb]['x-openwhisk']

        // manufacture an entity-like object
        return REPL.qexec(`wsk action get "/${namespace}/${name}"`).then(action =>
          Object.assign(action, {
            name,
            namespace,
            packageName: `${verb} ${basePath}${path}`
          })
        )
      }
    }
  },
  list: () => {
    return {
      // turn the result into an entity tuple model
      postprocess: res => {
        // main list for each api
        return Util.flatten(
          (res.apis || []).map(({ value }) => {
            // one sublist for each path
            const basePath = value.apidoc.basePath
            const baseUrl = value.gwApiUrl

            return Util.flatten(
              Object.keys(value.apidoc.paths).map(path => {
                const api = value.apidoc.paths[path]

                // one sub-sublist for each verb of the api
                return Object.keys(api).map(verb => {
                  const { action, namespace } = api[verb]['x-openwhisk']
                  const name = `${basePath}${path}`
                  const url = `${baseUrl}${path}`
                  const actionFqn = `/${namespace}/${action}`

                  // here is the entity for that api/path/verb:
                  return {
                    name,
                    namespace,
                    onclick: () => {
                      return REPL.pexec(`wsk api get ${REPL.encodeComponent(name)} ${verb}`)
                    },
                    attributes: [
                      { key: 'verb', value: verb },
                      {
                        key: 'action',
                        value: action,
                        onclick: () => REPL.pexec(`wsk action get ${REPL.encodeComponent(actionFqn)}`)
                      },
                      {
                        key: 'url',
                        value: url,
                        fontawesome: 'fas fa-external-link-square-alt',
                        css: 'clickable clickable-blatant',
                        onclick: () => window.open(url, '_blank')
                      },
                      {
                        key: 'copy',
                        fontawesome: 'fas fa-clipboard',
                        css: 'clickable clickable-blatant',
                        onclick: evt => {
                          const target = evt.currentTarget
                          require('electron').clipboard.writeText(url)

                          const svg = target.querySelector('svg')
                          svg.classList.remove('fa-clipboard')
                          svg.classList.add('fa-clipboard-check')

                          setTimeout(() => {
                            const svg = target.querySelector('svg')
                            svg.classList.remove('fa-clipboard-check')
                            svg.classList.add('fa-clipboard')
                          }, 1500)
                        }
                      }
                    ]
                  }
                })
              })
            )
          })
        )
      }
    }
  }
}
*/
