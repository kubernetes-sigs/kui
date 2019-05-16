/*
 * Copyright 2019 IBM Corporation
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

// import * as Debug from 'debug'
// const debug = Debug('plugins/bash-like/pty/server')

import * as fs from 'fs'
import { promisify } from 'util'
import { dirname, join } from 'path'
import { exec, spawn } from 'child_process'
import { createServer, Server } from 'https'

import { Channel } from './channel'

import { CommandRegistrar } from '@kui-shell/core/models/command'

let portRange = 8083
const servers = []

/** handler for shell/pty exit */
type ExitHandler = (exitCode: number) => Promise<void>

/**
 * Allocate a port
 *
 */
const getPort = (): Promise<number> => new Promise(async (resolve, reject) => {
  const { createServer } = await import('net')

  const iter = () => {
    const port = portRange
    portRange += 1

    const server = createServer()
    server.listen(port, () => {
      server.once('close', function () {
        resolve(port)
      })
      server.close()
    })

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        iter()
      } else {
        reject(err)
      }
    })
  }

  iter()
})

// these bits are to avoid macOS garbage; those lines marked with //* here:
// $ bash -i -l -c ls
// * Restored session: Tue Apr  2 19:24:55 EDT 2019
//  [[ VALID OUTPUT ]]
// * Saving session...
// * ...saving history...
// * ...completed.
const touch = (filename: string) => {
  const open = promisify(fs.open)
  const close = promisify(fs.close)
  return open(filename, 'w').then(close)
}
let cacheHasBashSessionsDisable
const BSD = () => join(process.env.HOME, '.bash_sessions_disable')
export const disableBashSessions = async (): Promise<ExitHandler> => {
  if (process.platform === 'darwin') {
    if (cacheHasBashSessionsDisable === undefined) {
      cacheHasBashSessionsDisable = await promisify(fs.exists)(BSD())
    }

    if (!cacheHasBashSessionsDisable) {
      await touch(BSD())
      return enableBashSessions
    }
  }

  return async (exitCode: number) => { /* no-op */ }
}
const enableBashSessions = async (exitCode: number) => {
  await promisify(fs.unlink)(BSD())
}

/**
 * Determine, and cache, the user's login shell
 *
 */
let cachedLoginShell: string
const getLoginShell = async (): Promise<string> => new Promise((resolve, reject) => {
  if (cachedLoginShell) {
    resolve(cachedLoginShell)
  } else {
    exec('/bin/bash -c "echo $SHELL"', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        if (stderr) {
          console.error(stderr)
        }
        reject(err)
      } else {
        cachedLoginShell = stdout.trim()
        resolve(cachedLoginShell)
      }
    })
  }
})

/**
 *
 *
 */
export const onConnection = (exitNow: ExitHandler) => async (ws: Channel) => {
  // use require because of the wrong module name in
  // node-pty-prebuilt, see:
  // https://github.com/daviwil/node-pty-prebuilt/issues/10
  // const pty = require('node-pty-prebuilt')
  const pty = await import('node-pty')

  let shell

  // For all websocket data send it to the shell
  ws.on('message', async (data: string) => {
    // console.log('message', data)
    try {
      const msg = JSON.parse(data)

      switch (msg.type) {
        case 'exit':
          return exitNow(msg.exitCode)

        case 'exec':
          try {
            shell = pty.spawn(await getLoginShell(), ['-l', '-i', '-c', '--', msg.cmdline], {
              name: 'xterm-color',
              rows: msg.rows && parseInt(msg.rows, 10),
              cols: msg.cols && parseInt(msg.cols, 10),
              cwd: msg.cwd || process.cwd(),
              env: Object.assign({}, msg.env || process.env, { KUI: 'true' })
            })
            // termios.setattr(shell['_fd'], { lflag: { ECHO: false } })

            // send all PTY data out to the websocket client
            shell.on('data', (data) => {
              ws.send(JSON.stringify({ type: 'data', data }))
            })

            shell.on('exit', (exitCode: number) => {
              shell = undefined
              ws.send(JSON.stringify({ type: 'exit', exitCode }))
              // exitNow(exitCode)
            })

            ws.send(JSON.stringify({ type: 'state', state: 'ready' }))

          } catch (err) {
            console.error('could not exec', err)
          }
          break

        case 'data':
          try {
            if (shell) {
              return shell.write(msg.data)
            }
          } catch (err) {
            console.error('could not write to the shell', err)
          }
          break

        case 'resize':
          try {
            if (shell) {
              return shell.resize(msg.cols, msg.rows)
            }
          } catch (err) {
            console.error('could not resize pty', err)
          }
          break
      }
    } catch (err) {
      console.error(err)
    }
  })
}

/**
 * If we haven't been given an https server instance, create one
 *
 */
const createDefaultServer = (): Server => {
  return createServer({
    key: fs.readFileSync('.keys/key.pem', 'utf8'),
    cert: fs.readFileSync('.keys/cert.pem', 'utf8'),
    passphrase: process.env.PASSPHRASE,
    requestCert: false,
    rejectUnauthorized: false
  })
}

/**
 * Spawn the shell
 * Compliments of http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
 */
let cachedWss
let cachedPort
export const main = async (N: number, server?: Server, preexistingPort?: number) => {
  if (cachedWss) {
    return cachedPort
  } else {
    const WebSocket = await import('ws')

    return new Promise(async resolve => {
      const idx = servers.length
      const cleanupCallback = await disableBashSessions()
      const exitNow = async (exitCode: number) => {
        await cleanupCallback(exitCode)
        const { wss, server } = servers.splice(idx, 1)[0]
        wss.close()
        if (server) {
          server.close()
        }
        // process.exit(exitCode)
      }

      if (preexistingPort) {
        cachedWss = new WebSocket.Server({ noServer: true })
        servers.push({ wss: cachedWss })

        server.on('upgrade', function upgrade (request, socket, head) {
          console.log('upgrade')
          cachedWss.handleUpgrade(request, socket, head, function done (ws) {
            console.log('handleUpgrade')
            cachedWss.emit('connection', ws, request)
          })
        })

        cachedPort = preexistingPort
        resolve({ port: cachedPort, exitNow })

      } else {
        cachedPort = await getPort()
        const server = createDefaultServer()
        server.listen(cachedPort, async () => {
          cachedWss = new WebSocket.Server({ server })
          servers.push({ wss: cachedWss, server })
          resolve({ port: cachedPort, exitNow })
        })
      }
    }).then(({ port, exitNow }) => {
      cachedWss.on('connection', onConnection(exitNow))
      return port
    })
  }
}

/**
 * Register command handlers
 *
 */
let count = 0
// const children = []
let cachedSelf
let selfHome
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/bash/websocket/open', ({ execOptions }) => new Promise(async (resolve, reject) => {
    const N = count++

    /**
     * Return a websocket URL for the given port
     *
     */
    const resolveWithHost = (port: number) => {
      const host = execOptions['host'] || `localhost:${port}`
      resolve(`wss://${host}/bash/${N}`)
    }

    if (execOptions.isProxied) {
      console.log(`do we have a port? ${execOptions['port']}`)
      return main(N, execOptions['server'], execOptions['port']).then(resolveWithHost).catch(reject)
    } else {
      const { ipcRenderer } = await import('electron')

      if (!ipcRenderer) {
        const error = new Error('electron not available')
        error['code'] = 127
        return reject(error)
      }

      ipcRenderer.send('/exec/invoke', JSON.stringify({
        module: '@kui-shell/plugin-bash-like/pty/server',
        hash: N
      }))

      const channel = `/exec/response/${N}`
      ipcRenderer.once(channel, (event, arg) => {
        const message = JSON.parse(arg)
        if (!message.success) {
          reject(message.error)
        } else {
          const port = message.returnValue
          resolveWithHost(port)
        }
      })

      // path to the build version of ourself
      /*if (!cachedSelf) {
        let self = require.resolve('@kui-shell/plugin-bash-like/pty/server')
        if (/\.asar\//.test(self)) {
        const { copyOutFile } = await import('./copy-out') // why the dynamic import? being browser friendly here
        cachedSelf = await copyOutFile(self)
        selfHome = dirname(cachedSelf)
        } else {
        const { copyOutFile } = await import('./copy-out') // why the dynamic import? being browser friendly here
        await copyOutFile(self)
        cachedSelf = self
        selfHome = dirname(dirname(dirname(require.resolve('@kui-shell/prescan'))))
        }
        }

        // reinvoke ourselves in a separate process
        const child = spawn('node', [cachedSelf, N], {
        cwd: selfHome,
        env: process.env
        })
        children.push(child)

        child.stdout.on('data', data => {
        const readyPattern = /^ready (\d+)\s*$/
        const match = data.toString().match(readyPattern)
        if (match) {
        const port = match[1]
        resolve(`ws://localhost:${port}/bash/${N}`)
        }
        })

        child.stderr.on('data', data => {
        console.error(data.toString())
        })

        child.on('close', (exitCode: number) => {
        // debug('exitCode', exitCode)
        children.splice(N, 1)
        })*/
    }
  }), { noAuthOk: true })
}

// this is the entry point when we re-invoke ourselves as a separate
// process (see just above)
/* if (require.main === module) {
   main(parseInt(process.argv[2], 10))
   } */
