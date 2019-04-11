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
import { createServer } from 'net'
import { dirname, join } from 'path'
import { exec, spawn } from 'child_process'

let portRange = 8082
const servers = []

/** allocate a port */
const getPort = () => new Promise((resolve, reject) => {
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

// thes bits are to avoid macOS garbage; those lines marked with //* here:
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
type CleanupCallback = () => void
let cacheHasBashSessionsDisable
const BSD = () => join(process.env.HOME, '.bash_sessions_disable')
const disableBashSessions = async (): Promise<CleanupCallback> => {
  if (process.platform === 'darwin') {
    if (cacheHasBashSessionsDisable === undefined) {
      cacheHasBashSessionsDisable = await promisify(fs.exists)(BSD())
    }

    if (!cacheHasBashSessionsDisable) {
      await touch(BSD())
      return enableBashSessions
    }
  }

  return () => { /* no-op */ }
}
const enableBashSessions = async () => {
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
 * Spawn the shell
 * Compliments of http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
 */
export const main = async (N: number) => {
  const WebSocket = await import('ws')
  const pty = require('node-pty-prebuilt') // use require because of the wrong moudle name in node-pty-prebuilt, see: https://github.com/daviwil/node-pty-prebuilt/issues/10
  // const termios = await import('termios')

  const port = await getPort()
  const wss = new WebSocket.Server({ port })

  const cleanupCallback = await disableBashSessions()

  const idx = servers.length
  servers.push(wss)
  wss.on('connection', async (ws) => {
    const exitNow = (exitCode: number) => {
      cleanupCallback()
      wss.close()
      servers.splice(idx, 1)
      process.exit(exitCode)
    }

    let shell

    // For all websocket data send it to the shell
    ws.on('message', async (data: string) => {
      const msg = JSON.parse(data)

      switch (msg.type) {
        case 'exit':
          return exitNow(msg.exitCode)

        case 'exec':
          try {
            shell = pty.spawn(await getLoginShell(), ['-l', '-i', '-c', '--', msg.cmdline], {
              name: 'xterm-color',
              cwd: msg.cwd || process.cwd(),
              env: msg.env || process.env
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
            return shell.write(msg.data)
          } catch (err) {
            console.error('could not write to the shell', err)
            break
          }

        case 'resize':
          try {
            if (shell) {
              return shell.resize(msg.cols, msg.rows)
            }
          } catch (err) {
            console.error('could not resize pty', err)
            break
          }
      }
    })
  })

  console.log(`ready ${port}`)
}

/**
 * Register command handlers
 *
 */
let count = 0
const children = []
let cachedSelf
let selfHome
export default (commandTree, prequire) => {
  commandTree.listen('/bash/websocket/open', ({ execOptions }) => new Promise(async resolve => {
    const N = count++

    // path to the build version of ourself
    if (!cachedSelf) {
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
    })
  }), { noAuthOk: true })
}

// this is the entry point when we re-invoke ourselves as a separate
// process (see just above)
if (require.main === module) {
  main(parseInt(process.argv[2], 10))
}
