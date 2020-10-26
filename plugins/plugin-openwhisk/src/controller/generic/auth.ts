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

import Debug from 'debug'
import needle from 'needle'

import {
  expandHomeDir,
  inBrowser,
  eventChannelUnsafe,
  Tab,
  Table,
  Row,
  UsageError,
  Arguments,
  RawResponse,
  Registrar
} from '@kui-shell/core'

import getClient from '../../client/get'
import * as namespace from '../../models/namespace'
import { apiHost, auth as authModel } from '../../models/auth'

const debug = Debug('plugins/openwhisk/cmds/auth')

/**
 * Location of the wskprops file
 *
 */
const wskpropsFile = (): string => {
  return expandHomeDir(process.env.WSK_CONFIG_FILE || '~/.wskprops')
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
    get: {
      strict: 'get',
      command: 'get'
    },
    list: {
      strict: 'list',
      command: 'list',
      title: 'List Auth Keys',
      header: 'List the OpenWhisk namespaces for which you have authorization keys',
      parents: ['auth'],
      related: ['host set']
    },
    switch: {
      strict: 'switch',
      command: 'switch',
      title: 'Switch Auth Keys',
      header: 'Switch to use an OpenWhisk namespace, by name',
      example: 'auth switch <namespace>',
      required: [
        {
          name: 'namespace',
          docs: 'an OpenWhisk namespace',
          entity: 'namespace'
        }
      ],
      optional: [
        {
          name: '--save',
          boolean: false,
          docs: 'switch the namespace and save it locally'
        }
      ],
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
        {
          command: 'us-east',
          docs: 'Use the IBM Cloud Washington D.C. installation'
        },
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
const informUserOfChange = (tab: Tab, subject?: string) => () => {
  setTimeout(
    async () =>
      eventChannelUnsafe.emit('/openwhisk/auth/change', {
        namespace: await namespace.current(tab),
        subject: subject
      }),
    0
  )

  return apiHost.get().then(async host => {
    return `You are now using the OpenWhisk host ${host}, and namespace ${await namespace.current(tab)}`
  })
}

/**
 * Notify other plugins of a host change event
 *
 */
const notifyOfHostChange = (tab: Tab, host: string) => async () => {
  eventChannelUnsafe.emit('/openwhisk/host/change', {
    namespace: await namespace.current(tab, { noNamespaceOk: true }),
    host: host
  })
}

/**
 * Read ~/.wskprops, and update its in-memory form to reflect the given AUTH
 *
 * @return resolves with the updated structure
 *
 */
const readFromLocalWskProps = (auth?: string, subject?: string) =>
  apiHost.get().then(
    apiHost =>
      new Promise((resolve, reject) => {
        // read from ~/.wskprops
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const propertiesParser = require('properties-parser')
        propertiesParser.read(wskpropsFile(), (err, wskprops) => {
          if (err) {
            if (err.code === 'ENOENT') {
              // the .wskprops file does not yet exist. manufacture
              // an in-memory form of the data we currently have
              debug('using blank wskprops')
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
            if (auth) wskprops.AUTH = auth
            if (subject) wskprops.SUBJECT = subject
            console.error(`updating existing wksprops ${JSON.stringify(wskprops)}`)
            resolve(wskprops)
          }
        })
      })
  )

/**
 * Write the given wskprops data structure to ~/.wskprops
 *
 * @return resolves with the wskprops data structure
 *
 */
const writeToLocalWskProps = (wskprops): Promise<string> =>
  new Promise((resolve, reject) => {
    let props = ''
    for (const key in wskprops) {
      props += `${key}=${wskprops[key]}\n`
    }
    console.error('writing wskprops file to %s %s', wskpropsFile(), wskprops.AUTH)
    require('fs').writeFile(wskpropsFile(), props, err => {
      if (err) reject(err)
      else resolve(wskprops.AUTH)
    })
  })

/**
 * Read-and-update an auth choice to ~/.wskprops
 *
 */
const updateLocalWskProps = (auth?: string, subject?: string): Promise<string> => {
  if (!inBrowser()) {
    return readFromLocalWskProps(auth, subject).then(writeToLocalWskProps)
  } else {
    return Promise.resolve(auth)
  }
}

/**
 * List registered namespaces
 *
 */
const list = async ({ REPL }: Arguments): Promise<Table> => {
  debug('list')

  const list = await namespace.list()
  if (list.length === 0) {
    throw new Error('No registered authorization keys. Try wsk auth add.')
  }

  const type = 'namespaces'
  const current = await REPL.qexec('wsk namespace current')

  const headerRow: Row = {
    type,
    name: 'CURRENT',
    outerCSS: 'header-cell very-narrow',
    attributes: [{ value: 'NAMESPACE', outerCSS: 'header-cell' }]
  }

  const body: Row[] = list.map(
    (ns): Row => {
      const row: Row = {
        type,
        name: ns.namespace,
        fontawesome: 'fas fa-check',
        outerCSS: 'very-narrow',
        css: 'selected-entity',
        rowCSS: ns.namespace === current && 'selected-row',
        onclick: undefined,
        attributes: [{ value: ns.namespace, onclick: undefined }]
      }

      const onclick = async () => {
        await REPL.qexec(`wsk auth switch ${REPL.encodeComponent(ns.namespace)}`)
        row.setSelected()
      }

      row.onclick = onclick // <-- clicks on the "check mark"
      row.attributes[0].onclick = onclick // <-- clicks on the namespace

      return row
    }
  )

  return { header: headerRow, body, noSort: true, title: type }
}

/** return the argv sliced after the index of verb */
const slice = (argv, verb) => argv.slice(argv.indexOf(verb) + 1)
const firstArg = (argv, verb) => argv[argv.indexOf(verb) + 1]

interface UseOptions {
  save?: boolean
}

/**
 * Switch to use a different namespace, by name, given by argv[2]
 *
 */
const use = (verb: string) => ({ argvNoOptions, parsedOptions, tab }: Arguments): Promise<string> =>
  namespace.get(firstArg(argvNoOptions, verb)).then(auth => {
    if (auth) {
      /**
       * e.g. auth switch [auth] (=> options.save is undefined)
       *      auth switch [auth] --save (=> options.save is true)
       *      auth switch [auth] --no-save (=> options.save is false)
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options = (parsedOptions as any) as UseOptions
      if (options.save === false) {
        return namespace.use(tab, auth).then(informUserOfChange(tab))
      } else {
        return updateLocalWskProps(auth)
          .then(auth => namespace.useAndSave(tab, auth))
          .then(informUserOfChange(tab))
      }
    } else {
      return namespace.list().then(namespaces => {
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
const clicky = (parent: HTMLElement, cmd: string, exec: (cmd: string) => void) => {
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
const addFn = (tab: Tab, key: string, subject: string): Promise<string> => {
  debug('add', key, subject)

  const previousAuth = authModel.get()
  return authModel
    .set(key)
    .then(() => namespace.init(tab, true)) // true means that we'll do the error handling
    .then(() => updateLocalWskProps(key, subject))
    .then(informUserOfChange(tab, subject))
    .catch(err => {
      if (err.statusCode === 401) {
        // then the key is bogus, restore the previousAuth
        return authModel.set(previousAuth).then(() => {
          err.error.error = 'The supplied authentication key was not recognized'
          throw err
        })
      } else {
        console.log(err)
        // otherwise, guide the user towards possibly helpful commands
        const dom = document.createElement('div')
        dom.appendChild(document.createTextNode('Please select a namespace, using '))
        clicky(dom, 'wsk auth list', tab.REPL.pexec)
        dom.appendChild(document.createTextNode(' or '))
        clicky(dom, 'wsk auth add', tab.REPL.pexec)
        throw new UsageError(dom)
      }
    })
}

interface HostConfig {
  host: string
  ignoreCerts: boolean
  isLocal: boolean
}

/**
 * Command impl for host set
 *
 */
const hostSet = async (command: Arguments) => {
  const { argvNoOptions, parsedOptions: options, execOptions, REPL } = command
  const argv = slice(argvNoOptions, 'set')

  let hostConfig: HostConfig = {
    host: argv[0] || options.host, // the new apihost to use
    ignoreCerts: !!(options.ignoreCerts || options.insecureSSL || options.insecure),
    isLocal: false // is this a local openwhisk?
  }

  if (!hostConfig.host || options.help) {
    throw new Error('Usage: host set <hostname>')
  } else if (hostConfig.host === '<your_api_host>') {
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
  if (hostConfig.host === 'dallas' || hostConfig.host === 'us-south') {
    // accept a short-hand for the Dallas Bluemix OpenWhisk
    hostConfig.host = 'https://us-south.functions.cloud.ibm.com'
  } else if (hostConfig.host === 'us-east') {
    // accept a short-hand for the London Bluemix OpenWhisk
    hostConfig.host = 'https://us-east.functions.cloud.ibm.com'
  } else if (hostConfig.host === 'london' || hostConfig.host === 'eu-gb') {
    // accept a short-hand for the London Bluemix OpenWhisk
    hostConfig.host = 'https://openwhisk.eu-gb.bluemix.net'
  } else if (hostConfig.host === 'frankfurt' || hostConfig.host === 'eu-de') {
    // accept a short-hand for the Frankfurt Bluemix OpenWhisk
    hostConfig.host = 'https://openwhisk.eu-de.bluemix.net'
  } else if (
    hostConfig.host === 'docker-machine' ||
    hostConfig.host === 'dm' ||
    hostConfig.host === 'mac' ||
    hostConfig.host === 'darwin' ||
    hostConfig.host === 'macos'
  ) {
    // local docker-machine host (this is usually macOS)
    hostConfig.host = 'http://192.168.99.100:10001'
    hostConfig.ignoreCerts = true
    hostConfig.isLocal = true
  } else if (hostConfig.host === 'vagrant') {
    // local vagrant
    hostConfig.host = 'https://192.168.33.13'
    hostConfig.ignoreCerts = true
    hostConfig.isLocal = true
  } else if (hostConfig.host === 'local' || hostConfig.host === 'localhost') {
    hostConfig = (await REPL.rexec<HostConfig>('wsk host pinglocal', execOptions)).content
  }

  const { host, ignoreCerts, isLocal } = await Promise.resolve(hostConfig)

  await apiHost
    .set(host, { ignoreCerts })
    .then(namespace.setApiHost)
    .then(() => updateLocalWskProps())
    .then(notifyOfHostChange(command.tab, host))

  const auths = await namespace.list()
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
    debug('using specified key')
    return REPL.qexec<string>(`wsk auth add ${specifiedKey}`)
  } else if (auths.length === 0) {
    if (isLocal && !process.env.LOCAL_OPENWHISK) {
      // fixed key for local openwhisk
      // when in travis (LOCAL_OPENWHISK), then we aren't using the
      // default key, hence the extra if guard
      debug('using fixed localhost key')
      const key =
        '23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP'
      return REPL.qexec<string>(`wsk auth add ${key}`)
    }

    // no keys, yet. enter a special mode requesting further assistance
    debug('no auth found')
    namespace.setNoNamespace(command.tab, false)
    return 'Before you can proceed, please provide an OpenWhisk auth key, using `wsk auth add`'
  } else if (auths.length === 1) {
    // if there's just one namespace, then select it
    debug('found exactly one auth')
    return REPL.qexec<string>(`wsk auth switch ${auths[0].namespace}`)
  } else {
    // otherwise, offer a list of them to the user
    debug('found multiple auths')
    namespace.setPleaseSelectNamespace()
    return list(command)
  }
}

/**
 * Ping a variety of localhost options to see if one is awake
 *
 */
const pingLocal = async (): Promise<RawResponse<HostConfig>> => {
  debug('pingLocal')

  // we will try a variety of options
  const variants = [
    'https://192.168.33.13',
    'https://192.168.33.16', // these are vagrant
    'https://172.17.0.1',
    'http://172.17.0.1:10001',
    'http://192.168.99.100:10001', // these are direct-to-controller
    'https://localhost'
  ]

  return new Promise((resolve, reject) => {
    const ping = idx => {
      const host = variants[idx]
      debug('ping', idx, host)

      debug('trying local', host)

      const tryNext = (err?: Error) => {
        if (err) {
          console.error(err)
        }
        if (idx === variants.length - 1) {
          const error = new Error('No local OpenWhisk host found')
          error['code'] = 404
          reject(error)
        } else {
          // nope! try the next one in the variants list
          ping(idx + 1)
        }
      }

      needle(
        'get',
        `${host}/ping`,
        {},
        {
          rejectUnauthorized: false,
          timeout: 500,
          open_timeout: 500
        }
      )
        .then(response => {
          if (response.statusCode >= 400) {
            tryNext()
          } else {
            debug('found local openwhisk', host)

            resolve({
              mode: 'raw',
              content: {
                host,
                ignoreCerts: true,
                isLocal: true
              }
            })
          }
        })
        .catch(err => {
          // for what it's worth, err.code === ECONNRESET is a good
          // indicator that the given host is not online
          debug('giving up on this host, trying the next', err.code, err)
          tryNext()
        })
    }

    // start the ping loop with the first variant
    ping(0)
  })
} /* pingLocal */

/**
 * Register command handlers
 *
 */
export default async (commandTree: Registrar) => {
  debug('init')

  commandTree.subtree('/wsk/host', { usage: usage.host.toplevel })
  commandTree.subtree('/wsk/auth', { usage: usage.auth.toplevel })

  const add = ({ argvNoOptions, tab }: Arguments) => addFn(tab, firstArg(argvNoOptions, 'add'), undefined)

  commandTree.listen('/wsk/auth/switch', use('switch'), {
    usage: usage.auth.switch
  })
  commandTree.listen('/wsk/auth/add', add, {
    usage: usage.auth.add
  })
  commandTree.listen('/wsk/auth/list', list, {
    usage: usage.auth.list
  })
  commandTree.listen('/wsk/auth/get', () => authModel.get(), {
    usage: usage.auth.get
  })

  /**
   * OpenWhisk API host: get and set commands
   *
   */
  commandTree.listen('/wsk/host/get', () => apiHost.get(), {
    usage: usage.host.get
  })
  commandTree.listen('/wsk/host/set', hostSet, {
    usage: usage.host.set
  })
  commandTree.listen('/wsk/host/pinglocal', pingLocal, {
    hidden: true
  })

  /**
   * An internal command that turns the current auth key into the corresponding openwhisk namespace
   *
   */
  commandTree.listen(
    '/wsk/auth/namespace/get',
    ({ execOptions }) => {
      // the api returns, as a historical artifact, an array of length 1
      return getClient(execOptions)
        .namespaces.list()
        .then(A => A[0])
    },
    { hidden: true }
  )

  return {
    add: addFn
  }
}
