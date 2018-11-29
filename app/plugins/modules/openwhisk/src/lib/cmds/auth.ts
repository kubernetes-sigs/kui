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

/**
 * This plugin introduces /wsk/auth, to help with switching between
 * OpenWhisk auth keys.
 *
 */

import * as Debug from 'debug'
const debug = Debug('plugins/openwhisk/cmds/auth')

import { inBrowser } from '../../../../../../build/core/capabilities'
import { clearSelection } from '../../../../../../build/webapp/views/sidecar'
import eventBus from '../../../../../../build/core/events'
import { partial } from '../../../../../../build/webapp/cli'
import repl = require('../../../../../../build/core/repl')
import namespace = require('../models/namespace')

/**
 * Location of the wskprops file
 *
 */
const wskpropsFile = (): string => {
  const expandHomeDir = require('expand-home-dir')
  return expandHomeDir('~/.wskprops')
}

/**
 * Usage models
 *
 */
const usage = {
  auth: {
    toplevel: {
      commandPrefix: 'wsk auth',
      title: 'Authorization Operations',
      header: 'Commands to switch, list, and remember OpenWhisk authorization keys',
      available: [],
      related: ['host']
    },
    list: {
      strict: 'list',
      command: 'list',
      title: 'List Auth Keys',
      header: 'List the OpenWhisk namespaces for which you have authorization keys',
      parents: ['auth'],
      related: ['host set']
    },
    'switch': {
      strict: 'switch',
      command: 'switch',
      title: 'Switch Auth Keys',
      header: 'Switch to use an OpenWhisk namespace, by name',
      example: 'auth switch <namespace>',
      required: [{ name: 'namespace', docs: 'an OpenWhisk namespace', entity: 'namespace' }],
      optional: [{ name: '--save', boolean: false, docs: 'switch the namespace and save it locally' }],
      parents: ['auth'],
      related: ['auth list', 'host set']
    },
    add: {
      strict: 'add',
      command: 'add',
      title: 'Add Auth Key',
      header: 'Install an OpenWhisk authorization key',
      example: 'wsk auth add <auth>',
      required: [{ name: 'auth', docs: 'an OpenWhisk authorization key' }],
      parents: ['auth'],
      related: ['auth switch', 'auth list', 'host set']
    }
  },
  host: {
    toplevel: {
      commandPrefix: 'wsk host',
      title: 'Host Operations',
      header: 'Commands to switch OpenWhisk API host',
      available: [],
      related: ['auth']
    },
    get: {
      strict: 'get',
      command: 'get',
      commandPrefix: 'wsk host',
      title: 'Get API Host',
      header: 'Print the current OpenWhisk API host',
      example: 'host get',
      parents: ['host']
    },
    set: {
      strict: 'set',
      command: 'set',
      commandPrefix: 'wsk host',
      title: 'Set API Host',
      header: 'Change the OpenWhisk API host to a chosen alternative',
      example: 'host set <which>',
      nRowsInViewport: 5,
      oneof: [
        { name: 'local', docs: 'Use a local OpenWhisk installation' },
        { command: 'us-east', docs: 'Use the IBM Cloud Washington D.C. installation' },
        { command: 'us-south', docs: 'Use the IBM Cloud Dallas installation' },
        { command: 'eu-gb', docs: 'Use the IBM Cloud London installation' },
        { command: 'eu-de', docs: 'Use the IBM Cloud Frankrut installation' },
        { command: 'hostname', docs: 'Use a given hostname or IP address' }
      ],
      parents: ['host']
    }
  }
}
usage.auth.toplevel.available = [usage.auth.add, usage.auth.list, usage.auth.switch]
usage.host.toplevel.available = [usage.host.get, usage.host.set]

/**
 * The message we will use to inform the user of a auth switch event
 *
 */
const informUserOfChange = (wsk, commandTree, subject) => () => {
  setTimeout(() => eventBus.emit('/auth/change', {
    namespace: namespace.current(),
    subject: subject
  }), 0)

  return wsk.apiHost.get().then(host => {
    clearSelection()
    return `You are now using the OpenWhisk host ${host}, and namespace ${namespace.current()}`
  })
}

/**
 * Notify other plugins of a host change event
 *
 */
const notifyOfHostChange = (host) => () => {
  eventBus.emit('/host/change', {
    namespace: namespace.current(),
    host: host
  })
}

/**
 * Read ~/.wskprops, and update its in-memory form to reflect the given AUTH
 *
 * @return resolves with the updated structure
 *
 */
const readFromLocalWskProps = (wsk, auth?: string, subject?: string) => wsk.apiHost.get().then(apiHost => new Promise((resolve, reject) => {
  // read from ~/.wskprops
  const propertiesParser = require('properties-parser')
  propertiesParser.read(wskpropsFile(), (err, wskprops) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // the .wskprops file does not yet exist. manufacture
        // an in-memory form of the data we currently have
        resolve({
          APIHOST: apiHost,
          AUTH: auth || ''
        })
      } else {
        reject(err)
      }
    } else {
      // we successfuly read the .wskprops file into an
      // in-memory struct; now update that struct
      wskprops.APIHOST = apiHost // in case this has also changed, via `host set`
      wskprops.AUTH = auth || wskprops.AUTH
      if (subject) wskprops.SUBJECT = subject
      resolve(wskprops)
    }
  })
}))

/**
 * Write the given wskprops data structure to ~/.wskprops
 *
 * @return resolves with the wskprops data structure
 *
 */
const writeToLocalWskProps = (wskprops): Promise<string> => new Promise((resolve, reject) => {
  let props = ''
  for (let key in wskprops) {
    props += `${key}=${wskprops[key]}\n`
  }
  require('fs').writeFile(wskpropsFile(), props, err => {
    if (err) reject(err)
    else resolve(wskprops.AUTH)
  })
})

/**
 * Read-and-update an auth choice to ~/.wskprops
 *
 */
const updateLocalWskProps = (wsk, auth?: string, subject?: string): Promise<string> => {
  if (!inBrowser()) {
    return readFromLocalWskProps(wsk, auth, subject).then(writeToLocalWskProps)
  } else {
    return Promise.resolve(auth)
  }
}

/**
 * List registered namespaces
 *
 */
const list = (wsk) => async () => {
  const type = 'namespaces'
  const list = await namespace.list(wsk)

  const headerRow = {
    type,
    noSort: true,
    name: 'NAMESPACE',
    outerCSS: 'header-cell'
  }

  const body = list.map(ns => Object.assign({}, ns, {
    type,
    name: ns.namespace,
    onclick: () => repl.pexec(`auth switch ${ns.namespace}`)
  }))

  return [headerRow].concat(body)
}

/** return the argv sliced after the index of verb */
const slice = (argv, verb) => argv.slice(argv.indexOf(verb) + 1)
const firstArg = (argv, verb) => argv[argv.indexOf(verb) + 1]

/**
 * Switch to use a different namespace, by name, given by argv[2]
 *
 */
const use = (commandTree, wsk, verb: string) => ({ argvNoOptions, parsedOptions }) => namespace.get(firstArg(argvNoOptions, verb)).then(auth => {
  if (auth) {
    /**
     * e.g. auth switch [auth] (=> options.save is undefined)
     *      auth switch [auth] --save (=> options.save is true)
     *      auth switch [auth] --no-save (=> options.save is false)
     */
    if (parsedOptions.save === false) {
      return namespace.use(auth, wsk)
        .then(informUserOfChange(wsk, commandTree, undefined))
    } else {
      return updateLocalWskProps(wsk, auth)
        .then(auth => namespace.useAndSave(auth, wsk))
        .then(informUserOfChange(wsk, commandTree, undefined))
    }
  } else {
    return namespace.list(wsk).then(namespaces => {
      const ns = firstArg(argvNoOptions, verb)
      console.error(`Namespace not found ${ns} ${JSON.stringify(namespaces)}`)
      throw new Error(`The details for this namespace were not found: ${ns}`)
    })
  }
})

/**
 * Make a dom that suggests a command to the user
 *
 */
const clicky = (parent: HTMLElement, cmd: string, exec) => {
  const dom = document.createElement('span')
  dom.className = 'clickable clickable-blatant'
  dom.innerText = cmd
  dom.onclick = () => exec(cmd)
  parent.appendChild(dom)
}

/**
 * Command impl for auth add
 *
 */
const addFn = (commandTree, wsk, prequire, key: string, subject: string) => {
  debug('add', key, subject)

  const previousAuth = wsk.auth.get()
  return wsk.auth.set(key)
    .then(() => namespace.init(prequire, true)) // true means that we'll do the error handling
    .then(() => updateLocalWskProps(wsk, key, subject))
    .then(informUserOfChange(wsk, commandTree, subject))
    .catch(err => {
      if (err.statusCode === 401) {
        // then the key is bogus, restore the previousAuth
        return wsk.auth.set(previousAuth)
          .then(() => {
            err.error.error = 'The supplied authentication key was not recognized'
            throw err
          })
      } else {
        console.log(err)
        // otherwise, guide the user towards possibly helpful commands
        const dom = document.createElement('div')
        dom.appendChild(document.createTextNode('Please select a namespace, using '))
        clicky(dom, 'wsk auth list', repl.pexec)
        dom.appendChild(document.createTextNode(' or '))
        clicky(dom, 'wsk auth add', partial)
        return dom
      }
    })
}

/**
 * Command impl for host set
 *
 */
const hostSet = (wsk) => ({ argvNoOptions, parsedOptions: options }) => {
  const argv = slice(argvNoOptions, 'set')
  let host = argv[0] || options.host // the new apihost to use
  let ignoreCerts = options.ignoreCerts || options.insecureSSL || options.insecure
  let isLocal = false // is this a local openwhisk?

  if (!host || options.help) {
    throw new Error('Usage: host set <hostname>')
  } else if (host === '<your_api_host>') {
    // clicking on the host in the upper right prefills some content;
    // if the user hits return, we want the operation to be cancelled
    // see shell issue #192
    throw new Error('Operation cancelled')
  }

  //
  // this command accepts short-hands for a
  // couple of common scenarios. we check for
  // those here
  //
  if (host === 'dallas' || host === 'us-south') {
    // accept a short-hand for the Dallas Bluemix OpenWhisk
    host = 'https://openwhisk.ng.bluemix.net'
  } else if (host === 'us-east') {
    // accept a short-hand for the London Bluemix OpenWhisk
    host = 'https://us-east.functions.cloud.ibm.com'
  } else if (host === 'london' || host === 'eu-gb') {
    // accept a short-hand for the London Bluemix OpenWhisk
    host = 'https://openwhisk.eu-gb.bluemix.net'
  } else if (host === 'frankfurt' || host === 'eu-de') {
    // accept a short-hand for the Frankfurt Bluemix OpenWhisk
    host = 'https://openwhisk.eu-de.bluemix.net'
  } else if (host === 'docker-machine' || host === 'dm' || host === 'mac' || host === 'darwin' || host === 'macos') {
    // local docker-machine host (this is usually macOS)
    host = 'http://192.168.99.100:10001'
    ignoreCerts = true
    isLocal = true
  } else if (host === 'vagrant') {
    // local vagrant
    host = 'https://192.168.33.13'
    ignoreCerts = true
    isLocal = true
  } else if (host === 'local' || host === 'localhost') {
    // try a variety of options
    const variants = [
      'https://192.168.33.13', 'https://192.168.33.16', // these are vagrant
      'https://172.17.0.1',
      'http://172.17.0.1:10001', 'http://192.168.99.100:10001' // these are direct-to-controller
    ]
    const needle = require('needle')

    host = new Promise((resolve, reject) => {
      const ping = idx => {
        debug('ping', idx)
        const host = variants[idx]

        debug('trying local', host)

        const tryNext = (err?: Error) => {
          if (err) {
            console.error(err)
          }
          if (idx === variants.length - 1) {
            reject(new Error('No local OpenWhisk host found'))
          } else {
            // nope! try the next one in the variants list
            ping(idx + 1)
          }
        }

        needle('get', `${host}/ping`, {}, {
          rejectUnauthorized: false,
          timeout: 500
        }).then(response => {
          if (response.statusCode >= 400) {
            tryNext()
          } else {
            ignoreCerts = true
            isLocal = true
            resolve(host)
          }
        })
      }
      ping(0)
    })
  }

  return Promise.resolve(host).then(host => wsk.apiHost.set(host, { ignoreCerts })
                                    .then(namespace.setApiHost)
                                    .then(() => updateLocalWskProps(wsk))
                                    .then(notifyOfHostChange(host))
                                    .then(() => namespace.list(wsk).then(auths => {
                                      debug('got auths', auths)
                                      //
                                      // after switching hosts, we'll need to get a new AUTH key. either:
                                      //
                                      //    1. the user provided one on the CLI (specifiedKey), or
                                      //    2. the user has not yet registered any keys for this host
                                      //    3. there is exactly one key (that the user has previously registered with a wsk auth add command)
                                      //       in this case, we use that singleton auth key without question
                                      //    4. there user has previously registered more than one; in this case, we list them
                                      //
                                      const specifiedKey = argv[1] || options.auth || options.key
                                      if (specifiedKey) {
                                        // use `wsk auth add` to register the key for this host
                                        return repl.qfexec(`wsk auth add ${specifiedKey}`)
                                      } else if (auths.length === 0) {
                                        if (isLocal) {
                                          // fixed key for local openwhisk
                                          return repl.qfexec('wsk auth add 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP')
                                        }
                                        // no keys, yet. enter a special mode requesting further assistance
                                        namespace.setNoNamespace(false)
                                        const dom = document.createElement('div')
                                        const clicky = document.createElement('span')
                                        const cmd = 'wsk auth add <AUTH_KEY>'

                                        clicky.className = 'clickable clickable-blatant'
                                        clicky.innerText = cmd
                                        clicky.onclick = () => partial(cmd)

                                        dom.appendChild(document.createTextNode('Before you can proceed, please provide an OpenWhisk auth key, using '))
                                        dom.appendChild(clicky)
                                        return dom
                                      } else if (auths.length === 1) {
                                        // if there's just one namespace, then select it
                                        return repl.qfexec(`auth switch ${auths[0].namespace}`)
                                      } else {
                                        // otherwise, offer a list of them to the user
                                        namespace.setPleaseSelectNamespace()
                                        return list(wsk)
                                      }
                                    })))
}

/**
 * Register command handlers
 *
 */
export default async (commandTree, wsk, prequire) => {
  debug('init')

  commandTree.subtree('/wsk/host', { usage: usage.host.toplevel })
  commandTree.subtree('/wsk/auth', { usage: usage.auth.toplevel })

  const add = ({ argvNoOptions }) => addFn(commandTree, wsk, prequire, firstArg(argvNoOptions, 'add'), undefined)

  commandTree.listen('/wsk/auth/switch', use(commandTree, wsk, 'switch'), { usage: usage.auth.switch, noAuthOk: true })
  commandTree.listen('/wsk/auth/add', add, { usage: usage.auth.add, noAuthOk: true })
  commandTree.listen('/wsk/auth/list', list(wsk), { usage: usage.auth.list, noAuthOk: true })

  /**
   * OpenWhisk API host: get and set commands
   *
   */
  commandTree.listen('/wsk/host/get', () => wsk.apiHost.get(), { usage: usage.host.get, noAuthOk: true })
  commandTree.listen('/wsk/host/set', hostSet(wsk), { usage: usage.host.set, noAuthOk: true })

  return {
    add: addFn
  }
}
