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
import { v4 as uuidgen } from 'uuid'

import { Tab } from '../webapp/cli'
import { theme } from './settings'
import { hasReachedFinalState, findFinalStateFromCommand } from '../webapp/views/table'
import { MetadataBearing as ResourceWithMetadata } from '../models/entity'
import { Pusher, ResourceChangeFn, AllResourcesDeletedFn } from '../webapp/models/watch'

const debug = Debug('webapp/views/jobs')

export type ResourceWatchJob = {
  /** help manage the jobs poll */
  getId: () => number
  /** init the resouce watch, and update the DOM according to `updated` and `deleted` functions */
  init: (tab: Tab, updated: ResourceChangeFn, deleted: ResourceChangeFn | AllResourcesDeletedFn) => void //
  /** abort the resource watch */
  abort(): void
}

const fastPolling = 500 // initial polling rate for watching OnlineLike or OfflineLike state
const mediumPolling = 3000 // initial polling rate for watching a steady state
const finalPolling = (theme && theme.tablePollingInterval) || 5000 // final polling rate (do not increase the interval beyond this!)
debug('polling intervals', fastPolling, mediumPolling, finalPolling)

/**
 * help calcuate the ladder polling interval
 *
 */
function createLadderInterval(expectedFinalState: string) {
  // establish the initial watch interval,
  // if we're on resource creation/deletion, do fast polling, otherwise we do steady polling
  const initalPollingInterval =
    expectedFinalState === 'OfflineLike' || expectedFinalState === 'OnlineLike' ? fastPolling : mediumPolling

  // increase the table polling interval until it reaches the steady polling interval, store the ladder in an array
  const ladder = [initalPollingInterval]
  let current = initalPollingInterval

  // increment the polling interval
  while (current < finalPolling) {
    if (current < 1000) {
      current = current + 250 < 1000 ? current + 250 : 1000
      ladder.push(current)
    } else {
      ladder.push(current)
      current = current + 2000 < finalPolling ? current + 2000 : finalPolling
      ladder.push(current)
    }
  }

  debug('ladder', ladder)
  return ladder
}

export class PollWatcherJob implements ResourceWatchJob {
  private pollCommand: string
  private pollLimit: number
  private pollInterval: number[]

  private _id: number
  private tab: Tab

  private updated: ResourceChangeFn
  private deleted: AllResourcesDeletedFn

  public getId() {
    return this._id
  }

  /**
   * Instantiates a PollWatcherJob class and creates a ladder poll interval
   */
  public constructor(pollCommand: string, pollLimit?: number, pollInterval?: number[]) {
    this.pollCommand = pollCommand
    this.pollLimit = pollLimit || 100000
    this.pollInterval = pollInterval || createLadderInterval(findFinalStateFromCommand(pollCommand))
  }

  /**
   * Init the poll watcher and store the job in the associated tab
   */
  public init(tab: Tab, updated: ResourceChangeFn, deleted: AllResourcesDeletedFn) {
    this.tab = tab
    this.updated = updated
    this.deleted = deleted
    this._id = setInterval(this.watchIt.bind(this) as TimerHandler, this.pollInterval.shift() + ~~(100 * Math.random()))
    this.tab.state.captureJob(this)
  }

  /**
   * Abort the running job
   */
  public abort() {
    clearInterval(this._id)
    this.tab.state.removeJob(this)
    debug(`stop job ${this._id}`)
  }

  /**
   * Reschedule the poll job, based on `pollInterval`
   */
  private reschedule() {
    if (this.pollInterval.length > 0) {
      this.abort()
      new PollWatcherJob(this.pollCommand, this.pollLimit, this.pollInterval).init(this.tab, this.updated, this.deleted)
    }
  }

  /**
   * Poll data, and call `updated` and `deleted` functions accordingly
   */
  private async poll() {
    debug(`refresh with ${this.pollCommand}`)

    try {
      const { qexec } = await import('../repl/exec')
      const response = await qexec<ResourceWithMetadata>(this.pollCommand)
      this.updated(response)
      hasReachedFinalState(response) ? this.abort() : this.reschedule()
    } catch (err) {
      this.deleted(err)
      throw err
    }
  }

  /**
   * Restrict the poll job with limit
   */
  private watchIt() {
    if (--this.pollLimit < 0) {
      console.error('watchLimit exceeded')
      this.abort()
    } else {
      Promise.resolve(this.poll()).catch(() => this.abort())
    }
  }
}

export class PushWatchJob implements ResourceWatchJob {
  private pusher: Pusher
  private _id: number
  private tab: Tab

  public getId() {
    return this._id
  }

  /**
   * Instantiates a PushJob class and creates a poll interval
   */
  public constructor(pusher: Pusher) {
    this.pusher = pusher
  }

  /**
   * Initiate the push watcher and register to a context
   */
  public init(tab: Tab, updated: ResourceChangeFn, deleted: ResourceChangeFn) {
    this.tab = tab
    this.pusher.init(updated, deleted, this) // async here?
    this._id = parseInt(uuidgen())
    this.tab.state.captureJob(this)
  }

  /**
   * Abort the push watcher and remove it from the context
   */
  public abort() {
    this.pusher.abort(this)
    this.tab.state.removeJob(this)
  }
}
