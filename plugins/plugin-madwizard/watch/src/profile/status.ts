/*
 * Copyright 2022 The Kubernetes Authors
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
import { spawn } from 'child_process'

import UpdateFunction from '../update'
import respawnCommand from '../respawn'

/** Watches a given profile for changing status */
export default class ProfileStatusWatcher {
  private headReadiness = 'pending'
  private workerReadiness = 'pending'
  // private readonly _job: ReturnType<typeof spawn>

  public constructor(
    /** The profile to watch */
    private readonly profile: string,

    /** How to update the Tray menu with changes */
    private readonly updateFunction: UpdateFunction
  ) {
    /* this._job = */ this.initJob(profile)
  }

  public get readiness() {
    return this.headReadiness === 'pending' || this.workerReadiness === 'pending'
      ? 'pending'
      : this.headReadiness === 'error' || this.workerReadiness === 'error'
      ? 'error'
      : this.isOffline(this.headReadiness) && this.isOffline(this.workerReadiness)
      ? 'offline'
      : !this.isReady(this.headReadiness) && !this.isReady(this.workerReadiness)
      ? 'pending'
      : 'success'
  }

  private isOffline(readiness: string) {
    const match = readiness.match(/^(\d)+\/(\d)+$/)
    return match && match[1] === '0'
  }

  private isReady(readiness: string) {
    const match = readiness.match(/^(\d)+\/(\d)+$/)
    return match && match[1] === match[2]
  }

  public get head() {
    return { label: `Head nodes: ${this.headReadiness}` }
  }

  public get workers() {
    return { label: `Worker nodes: ${this.workerReadiness}` }
  }

  private async initJobWithDelay(profile: string, delayMillis = 0) {
    if (delayMillis) {
      // delayed start
      await new Promise(resolve => setTimeout(resolve, delayMillis))
    }
    return this.initJob(profile)
  }

  private async initJob(profile: string) {
    const { argv, env } = await respawnCommand([
      'guide',
      '-q',
      '-y',
      '--no-bump', // don't bump the lastUsedTime of the profile
      '--profile',
      profile,
      'ml/ray/cluster/kubernetes/is-ready'
    ])
    Debug('madwizard')('Watcher start', profile, argv)
    const job = spawn(argv[0], argv.slice(1), { env, stdio: ['pipe', 'pipe', 'inherit'], detached: true })

    // make sure to kill that watcher subprocess when we exit
    const onExit = () => {
      if (job.pid) {
        try {
          Debug('madwizard')('killing process group ' + -job.pid)
          process.kill(-job.pid, 'SIGKILL') // kill the process group e.g. for pipes
        } catch (err) {
          Debug('madwizard')('error killing process group ' + -job.pid, err)
        }
      }

      try {
        Debug('madwizard')('killing process ' + job.pid)
        job.kill('SIGKILL')
      } catch (err) {
        Debug('madwizard')('error killing process ' + job.pid, err)
      }
    }

    process.on('exit', onExit)
    process.on('SIGINT', onExit) // catch ctrl-c
    process.on('SIGTERM', onExit) // catch kill

    // use the electron API to register our onExit handler
    const { app } = await import('electron')
    app.on('before-quit', onExit)

    job.on('error', () => {
      Debug('madwizard')('Watcher error', profile)
      this.headReadiness = 'error'
      this.workerReadiness = 'error'
      // WARNING: DO NOT initJob() here, that will be handled in the
      // "close" handler. If you do so here (too), then an exponential
      // cascade of subprocess spawning may result.
    })

    job.on('close', async exitCode => {
      Debug('madwizard')('Watcher exited with code', exitCode)
      this.initJobWithDelay(profile, 2000) // restart after a delay
    })

    job.stdout.on('data', data => {
      const headBefore = this.headReadiness
      const workersBefore = this.workerReadiness

      data
        .toString()
        .split(/\n/)
        .forEach((line: string) => {
          const match = line.match(/^(head|workers)\s+(\S+)$/)
          Debug('madwizard')('profile status watcher line', this.profile, line, match)
          if (!match) {
            // console.error('Bogus line emitted by ray cluster readiness probe', line)
          } else {
            if (match[1] === 'head') {
              this.headReadiness = match[2]
            } else if (match[1] === 'workers') {
              this.workerReadiness = match[2]
            } else {
              console.error('Bogus line emitted by ray cluster readiness probe', line)
            }
          }
        })

      if (this.headReadiness !== headBefore || this.workerReadiness !== workersBefore) {
        Debug('madwizard')('profile status watcher change', this.profile)
        this.updateFunction()
      }
    })

    return job
  }
}
