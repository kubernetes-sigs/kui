/*
 * Copyright 2020 The Kubernetes Authors
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

import Debug from 'debug'
import { onQuit, offQuit } from '@kui-shell/core'
import { ChildProcess } from 'child_process'

import { onKubectlConfigChangeEvents, offKubectlConfigChangeEvents } from '../../kubectl/config'

/** We know how to launch a kubectl proxy for... */
type SupportedCommand = 'oc' | 'kubectl'

const debug = Debug('plugin-kubectl/client/proxy')

/** Maximum number of times we try start the kubectl proxy */
const maxRetries = 1000

// Kubectl Proxy State
type State = {
  /** Kubernetes context name */
  context: string

  /** kubectl proxy port */
  port: number

  /** kubectl proxy process */
  process: ChildProcess

  /** handler that will be invoked when the process exits */
  onQuitHandler: () => void

  /** handler that will be invoked on kubernetes config change events */
  onConfigChangeHandler: Parameters<typeof onKubectlConfigChangeEvents>[0]
}

/** State of current kubectl proxy */
const currentProxyState: Record<SupportedCommand, Record<string, Promise<State>>> = {
  oc: undefined,
  kubectl: undefined
}

/**
 * Unregister onQuit handlers
 *
 */
function unregisterOnQuit(onQuitHandler: State['onQuitHandler']) {
  try {
    if (typeof onQuitHandler === 'function') {
      offQuit(onQuitHandler)
    }
  } catch (err) {
    console.error('Error unregistering kubectl proxy onQuit', err)
  }
}

/**
 * Stop kubectl proxy for the given kubectl proxy state
 *
 */
function stopProxy(this: State) {
  try {
    // kill the proxy process
    if (this.process) {
      debug('killing kubectl proxy', this.port)
      this.process.kill()
    }

    // unregister event handlers
    unregisterOnQuit(this.onQuitHandler)

    if (typeof this.onConfigChangeHandler === 'function') {
      offKubectlConfigChangeEvents(this.onConfigChangeHandler)
    }
  } catch (err) {
    console.error('Error stopping kubectl proxy', err)
  }
}

/**
 * Register onQuit handlers, to make sure that we kill any extant
 * kubectl proxy processes.
 *
 */
function registerOnQuit(state: Omit<State, 'onQuitHandler' | 'onConfigChangeHandler'>): State {
  try {
    const onQuitHandler = stopProxy.bind(state)
    onQuit(onQuitHandler)

    // kill our instance if there is a change to our context
    const onConfigChangeHandler: State['onConfigChangeHandler'] = (eventType, _2, newContext: string) => {
      if (eventType === 'LoginToContext' && state.context === newContext) {
        onQuitHandler()
      }
    }
    onKubectlConfigChangeEvents(onConfigChangeHandler)

    return Object.assign(state, { onQuitHandler, onConfigChangeHandler })
  } catch (err) {
    console.error('Error registering kubectl proxy onQuit', err)
  }
}

/**
 * Launch kubectl proxy for the current context.
 *
 * @return the State of the kubectl proxy
 *
 */
async function startProxy(command: SupportedCommand, context: string): Promise<State> {
  const { spawn } = await import('child_process')
  return new Promise<State>((resolve, reject) => {
    const iter = (port = 8001, retryCount = 0) => {
      try {
        debug(`attempting to spawn kubectl proxy on port=${port} context=${context || 'default'}`)
        const args = ['proxy', '--keepalive=120s', '--port', port.toString()]
        if (context) {
          args.push('--context')
          args.push(context)
        }
        const process = spawn(command, args)
        let myState: State

        // to make sure we don't smash the global variable on exit
        let iGotRetried = false

        process.on('error', err => {
          console.error('Error spawning kubectl proxy', err)
          reject(err)
        })

        process.stdout.on('data', data => {
          const msg = data.toString()
          debug('stdout', msg)
          if (/Starting to serve/.test(msg)) {
            // success!
            debug('succeessfully spawned kubectl proxy on port', port)
            myState = registerOnQuit({ process, port, context })
            resolve(myState)
          }
        })

        let stderr = ''
        process.stderr.on('data', data => {
          const msg = data.toString()
          if (/address already in use/.test(msg) && retryCount < maxRetries) {
            iGotRetried = true // so we don't smash the global on exit
            iter(port + 1, retryCount + 1)
          } else {
            debug('stderr', msg)
            stderr += msg
          }
        })

        process.on('exit', (code, signal) => {
          debug('kubectl proxy has exited with code', code || signal)
          if (currentProxyState[command] !== undefined && retryCount >= maxRetries) {
            // then we are still trying to initialize, and haven't
            // exceeded our port retry loop count
            console.error(`kubectl proxy exited unexpectedly with exitCode=${code || signal}`)
            reject(new Error(stderr))
          } else if (currentProxyState[command]) {
            // then we thought we had a stable kubectl proxy process, but it went and died on its own
            debug('marking proxy as terminated')
            if (myState) {
              myState.process = undefined
            }
            if (!iGotRetried) {
              currentProxyState[command] = undefined
            }
          }
        })
      } catch (err) {
        console.error('Error establishing kubectl proxy', err)
        reject(err)
        // proxyForContext = undefined
      }
    }

    iter()
  })
}

/** Wrapper around `startProxy` that deals with the currentProxyState variable */
function initProxyState(command: SupportedCommand, context: string) {
  if (!currentProxyState[command]) {
    const myProxyState = startProxy(command, context)
    currentProxyState[command] = { [context]: myProxyState }
  } else if (!currentProxyState[command][context]) {
    const myProxyState = startProxy(command, context)
    currentProxyState[command][context] = myProxyState
  }

  return currentProxyState[command][context]
}

/** Is the current kubectl proxy viable? */
function isProxyActive(command: SupportedCommand, context: string) {
  return currentProxyState[command] !== undefined && currentProxyState[command][context] !== undefined
}

interface KubectlProxyInfo {
  baseUrl: string
}

/** @return information about the current kubectl proxy */
export default async function getProxyState(command: SupportedCommand, context: string): Promise<KubectlProxyInfo> {
  if (!isProxyActive(command, context)) {
    initProxyState(command, context)
  }

  return {
    baseUrl: !isProxyActive(command, context)
      ? undefined
      : `http://localhost:${(await currentProxyState[command][context]).port}`
  }
}
