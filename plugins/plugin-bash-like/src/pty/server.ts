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

import Debug from 'debug'
import * as fs from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import { exec } from 'child_process'
import { createServer, Server } from 'https'
import { parse as parseCookie } from 'cookie'

// for types
import { Socket } from 'net'
import { IncomingMessage } from 'http'

import { Channel } from './channel'
import { StdioChannelKuiSide } from './stdio-channel'

import { CodedError, ExecOptions, Registrar } from '@kui-shell/core'

const debug = Debug('plugins/bash-like/pty/server')

let portRange = 8083
const servers = []

/** handler for shell/pty exit */
export type ExitHandler = (exitCode: number) => void

/**
 * Verify a session's validity
 *
 */
interface Session {
  uid: number
  gid: number
  token: string
}
export interface SessionCookie {
  key: string
  session: Session
}
const verifySession = (expectedCookie: SessionCookie) => {
  return ({ req }: { req: IncomingMessage }, cb: (ok: boolean, code?: number, why?: string) => void) => {
    const cookies = parseCookie(req.headers.cookie || '')
    const sessionToken = cookies[expectedCookie.key]
    if (sessionToken) {
      try {
        const actualSession: Session = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'))
        if (actualSession.token === expectedCookie.session.token) {
          cb(true) // eslint-disable-line standard/no-callback-literal
          return
        } else {
          console.error('token found, but mismatched values', expectedCookie, actualSession)
        }
      } catch (err) {
        console.error('error parsing session token', sessionToken, err)
      }
    }

    // intentional fall-through for invalid session
    console.error('invalid session for websocket upgrade', expectedCookie, cookies[expectedCookie.key], cookies)
    cb(false, 401, 'Invalid authorization for websocket upgrade') // eslint-disable-line standard/no-callback-literal
  }
}

/**
 * Allocate a port
 *
 */
const getPort = (): Promise<number> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    const { createServer } = await import('net')

    const iter = () => {
      const port = portRange
      portRange += 1

      const server = createServer()
      server.listen(port, () => {
        server.once('close', function() {
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
let cacheHasBashSessionsDisable: boolean
const BSD = () => join(process.env.HOME, '.bash_sessions_disable')
const enableBashSessions = async () => {
  await promisify(fs.unlink)(BSD())
}
export const disableBashSessions = async (): Promise<ExitHandler> => {
  if (process.platform === 'darwin') {
    if (cacheHasBashSessionsDisable === undefined) {
      // eslint-disable-next-line node/no-deprecated-api
      cacheHasBashSessionsDisable = await promisify(fs.exists)(BSD())
    }

    if (!cacheHasBashSessionsDisable) {
      await touch(BSD())
      return enableBashSessions
    }
  }

  return async () => {
    /* no-op */
  }
}

/**
 * Determine, and cache, the user's login shell
 *
 */
const bashShellOpts = ['-l', '-i', '-c', '--']
const shellOpts = process.platform === 'win32' ? [] : bashShellOpts
type Shell = { shellExe: string; shellOpts: string[] }
let cachedLoginShell: Shell
export const getLoginShell = (): Promise<Shell> => {
  return new Promise((resolve, reject) => {
    if (cachedLoginShell) {
      debug('returning cached login shell', cachedLoginShell)
      resolve(cachedLoginShell)
    } else if (process.env.SHELL) {
      // Note how we intentionally assume bash here, even on windows
      resolve({ shellExe: process.env.SHELL, shellOpts: bashShellOpts })
    } else {
      const defaultShell = process.platform === 'win32' ? 'powershell.exe' : '/bin/bash'

      if (process.env.TRAVIS_JOB_ID !== undefined || process.platform === 'win32') {
        debug('using defaultShell for travis')
        cachedLoginShell = { shellExe: defaultShell, shellOpts }
        resolve(cachedLoginShell)
      } else {
        try {
          exec(`${defaultShell} -l -c "echo $SHELL"`, (err, stdout, stderr) => {
            if (err) {
              console.error('error in getLoginShell subroutine', err)
              if (stderr) {
                console.error(stderr)
              }
              reject(err)
            } else {
              cachedLoginShell = { shellExe: stdout.trim() || defaultShell, shellOpts }
              debug('login shell', cachedLoginShell)
              resolve(cachedLoginShell)
            }
          })
        } catch (err) {
          console.error('error in exec of getLoginShell subroutine', err)
          resolve({ shellExe: defaultShell, shellOpts })
        }
      }
    }
  })
}

/**
 * Use precomputed shell aliases
 *
 */
let shellAliases: Record<string, string> = {}
export function setShellAliases(aliases: Record<string, string>) {
  shellAliases = aliases
}

/**
 *
 *
 */
export const onConnection = (exitNow: ExitHandler, uid?: number, gid?: number) => async (ws: Channel) => {
  debug('onConnection', uid, gid, ws)

  // for now, we need to use a dynamic import here, because the plugin
  // compiler does not work versus node-pty's eager loading of the
  // native modules -- we compile the native modules against electron,
  // but the plugin compiler uses the platform nodejs :(
  const { spawn } = await import('node-pty-prebuilt-multiarch')

  // re: importing node-pty twice: this is clumsy because typescript
  // doesn't support module imports for dynamic imports, and node-pty
  // exports IPty under a module of its creation
  // @see https://github.com/microsoft/TypeScript/issues/22445
  let shell: import('node-pty-prebuilt-multiarch').IPty

  // For all websocket data send it to the shell
  ws.on('message', async (data: string) => {
    try {
      const msg: {
        type: string
        data?: string
        cmdline?: string
        exitCode?: number
        env?: Record<string, string>
        cwd?: string
        rows?: number
        cols?: number

        uuid?: string // for request-response
        execOptions?: ExecOptions
      } = JSON.parse(data)

      switch (msg.type) {
        case 'exit':
          return exitNow(msg.exitCode)

        case 'request': {
          const { internalBeCarefulExec: exec } = await import('@kui-shell/core')
          if (msg.env) {
            process.env = msg.env
          }

          const terminate = (str: string) => {
            ws.send(str)
            // ws.send(`___kui_exit___ ${msg.uuid}`)
          }

          try {
            const response = await exec(msg.cmdline, Object.assign({}, msg.execOptions, { rethrowErrors: true }))
            debug('got response')
            terminate(
              JSON.stringify({
                type: 'object',
                uuid: msg.uuid,
                response
              })
            )
          } catch (error) {
            debug('got error', error.message)
            const err: CodedError = error
            terminate(
              JSON.stringify({
                type: 'object',
                uuid: msg.uuid,
                response: {
                  code: err.code || err.statusCode,
                  statusCode: err.statusCode, // see https://github.com/IBM/kui/issues/3318
                  message: err.message,
                  stack: err.stack
                }
              })
            )
          }
          break
        }

        case 'exec': {
          const env = Object.assign({}, msg.env || process.env, { KUI: 'true' })

          if (process.env.DEBUG && (!msg.env || !msg.env.DEBUG)) {
            // don't pass DEBUG unless the user asked for it!
            delete env.DEBUG
          }

          try {
            const end = msg.cmdline.indexOf(' ')
            const cmd = msg.cmdline.slice(0, end < 0 ? msg.cmdline.length : end) // FIXME quoted first arg
            const aliasedCmd = shellAliases[cmd]
            const cmdline = aliasedCmd ? msg.cmdline.replace(new RegExp(`^${cmd}`), aliasedCmd) : msg.cmdline

            const { shellExe, shellOpts } = await getLoginShell()
            shell = spawn(shellExe, shellOpts.concat([cmdline]), {
              uid,
              gid,
              name: 'xterm-color',
              rows: msg.rows,
              cols: msg.cols,
              cwd: msg.cwd || process.cwd(),
              env
            })
            // termios.setattr(shell['_fd'], { lflag: { ECHO: false } })

            // send all PTY data out to the websocket client
            shell.on('data', (data: string) => {
              ws.send(JSON.stringify({ type: 'data', data, uuid: msg.uuid }))
            })

            shell.on('exit', (exitCode: number) => {
              shell = undefined
              ws.send(JSON.stringify({ type: 'exit', exitCode, uuid: msg.uuid }))
              // exitNow(exitCode)
            })

            ws.send(JSON.stringify({ type: 'state', state: 'ready', uuid: msg.uuid }))
          } catch (err) {
            console.error('could not exec', err)
          }
          break
        }

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
            console.error(`error in resize ${msg.cols} ${msg.rows}`)
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
 * vague origins: http://krasimirtsonev.com/blog/article/meet-evala-your-terminal-in-the-browser-extension
 */
let cachedWss: Server
let cachedPort: number
export const main = async (
  N: string,
  server?: Server,
  preexistingPort?: number,
  expectedCookie?: SessionCookie
): Promise<number | { wss: Server; port: number }> => {
  if (cachedWss) {
    return cachedPort
  } else {
    const WebSocket = await import('ws')

    // eslint-disable-next-line no-async-promise-executor
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
        // if we were given a session cookie, then use the
        // verifyClient functionality of WebSocket.Server to enforce
        // the session's validity
        const wss = new WebSocket.Server({
          noServer: true,
          verifyClient: expectedCookie && verifySession(expectedCookie)
        })
        servers.push({ wss })

        // only handle upgrades for the "N" index we own
        const doUpgrade = (request: IncomingMessage, socket: Socket, head: Buffer) => {
          const match = request.url.match(/\/bash\/([0-9a-z-]+)/)
          const yourN = match && match[1] // do we own this upgrade?
          if (yourN === N) {
            server.removeListener('upgrade', doUpgrade)
            wss.handleUpgrade(request, socket, head, function done(ws: WebSocket) {
              wss.emit('connection', ws, request)
            })
          }
        }
        server.on('upgrade', doUpgrade)

        resolve({ wss, port: cachedPort, exitNow })
      } else {
        cachedPort = await getPort()
        const server = createDefaultServer()
        server.listen(cachedPort, async () => {
          const wss: Server = (cachedWss = new WebSocket.Server({ server }))
          servers.push({ wss: cachedWss, server })
          resolve({ wss, port: cachedPort, exitNow })
        })
      }
    }).then(({ wss, port, exitNow }: { wss: Server; port: number; exitNow: ExitHandler }) => {
      if (!expectedCookie) {
        debug('listening for connection')
        wss.on(
          'connection',
          onConnection(
            exitNow,
            expectedCookie && expectedCookie.session.uid,
            expectedCookie && expectedCookie.session.gid
          )
        )
      }
      return { wss, port }
    })
  }
}

/**
 * Register command handlers
 *
 */
// const children = []
export default (commandTree: Registrar) => {
  commandTree.listen(
    '/bash/websocket/stdio',
    () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        try {
          await new StdioChannelKuiSide().init(() => {
            console.error('done with stdiochannel')
            resolve()
          })
        } catch (err) {
          reject(err)
        }
      }),
    { noAuthOk: true }
  )

  // Notes: this is a placeholder, simplify to make the command
  // resolver happy; the real implementation is to be found in the
  // proxy server, e.g. packages/proxy/app/routes/exec.js
  commandTree.listen('/bash/websocket/open', () => {
    throw new Error('Unsupported operation')
  })
}
