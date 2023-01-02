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

import { guide } from 'madwizard/dist/fe/cli'

import { onRun } from './run'
import UpdateFunction from '../update'

export const RUNS_ERROR = 'No active runs'

interface RayJobInfo {
  status: 'RUNNING' | 'STOPPED' | 'PENDING' | 'ERROR'
  start_time: number
}

/**
 * Maintain the set of active runs for `this.profile`
 *
 */
export default class ProfileActiveRunWatcher {
  /** Our model */
  private _runs: { runId: string; timestamp: number }[] = []

  public constructor(
    private readonly updateFn: UpdateFunction,
    private readonly profile: string,
    public readonly rayAddress = ProfileActiveRunWatcher.initWatcher(profile),
    private readonly timer = setInterval(() => this.updateActiveJobs(), 3000)
  ) {
    onRun(() => this.updateActiveJobs())
  }

  /** Initialize the filesystem watcher to notify us of new or removed profiles */
  private static async initWatcher(profile: string) {
    const guidebook = 'ml/ray/cluster/connect'
    try {
      const { app } = await import('electron')
      const registerCleanup = ({ cleanExit }: { cleanExit: () => void }) => {
        const onExit = () => cleanExit()
        process.on('exit', onExit)
        process.on('SIGINT', onExit) // catch ctrl-c
        process.on('SIGTERM', onExit) // catch kill

        // use the electron API to register our onExit handler
        app.on('before-quit', onExit)
      }

      const resp = await guide(['madwizard', 'guide', guidebook], undefined, {
        profile,
        bump: false, // don't bump the lastUsedTime of the profile
        clean: false, // don't kill the port-forward subprocess! we'll manage that
        interactive: false,
        store: process.env.GUIDEBOOK_STORE,
        onBeforeRun: registerCleanup // use this hook to register our electron-based cleanup hook
      })

      if (resp) {
        registerCleanup(resp)

        if (resp.env && typeof resp.env.RAY_ADDRESS === 'string') {
          return resp.env.RAY_ADDRESS
        }
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  private updateActiveJobs() {
    this.rayAddress.then(async rayAddress => {
      if (rayAddress) {
        try {
          const needle = await import('needle')
          const jobs: Record<string, RayJobInfo> = await needle
            .default('get', `${rayAddress}/api/jobs/`)
            .then(_ => _.body)
          this.runs = Object.entries(jobs)
            .filter(([, info]) => info.status === 'RUNNING')
            .map(([runId, info]) => ({
              runId,
              timestamp: info.start_time
            }))
          this.updateFn()
        } catch (err) {
          console.error(err)
          this.runs = []
          this.updateFn()
        }
      }
    })
  }

  /** @return the current runs model */
  public get runs() {
    return this._runs
  }

  /** Overwrite the run model state */
  private set runs(runs: { runId: string; timestamp: number }[]) {
    this._runs = runs
  }
}
