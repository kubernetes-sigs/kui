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
import { Tab } from '../webapp/cli'

const debug = Debug('webapp/views/jobs')

export class WatchableJob {
  private _id: number

  public get id() {
    return this._id
  }

  // eslint-disable-next-line no-useless-constructor
  public constructor(private tab: Tab, private handler: TimerHandler, private timeout: number) {}

  /**
   * Start the watchable job
   */
  private startWatching(handler: TimerHandler, timeout: number) {
    this._id = setInterval(handler, timeout)
  }

  /**
   * Start the watchable job and store it in the associated tab
   */
  public start() {
    this.startWatching(this.handler, this.timeout)
    this.tab.state.captureJob(this)
    debug(`start job ${this._id} with timeout ${this.timeout}`)
  }

  /**
   * Stop the running job
   */
  private stopWatching(id: number) {
    clearInterval(id)
  }

  /**
   * Abort the running job and remove it from the associated tab
   */
  public abort() {
    this.stopWatching(this._id)
    this.tab.state.removeJob(this)
    debug(`stop job ${this._id}`)
  }
}
