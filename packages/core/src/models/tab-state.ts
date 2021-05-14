/*
 * Copyright 2019 The Kubernetes Authors
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

import { eventBus, StatusStripeChangeEvent } from '../core/events'
import { promiseEach } from '../util/async'

const debug = Debug('core/models/TabState')

type CaptureFn = (tabState: TabState) => void | Promise<void>
type RestoreFn = (tabState: TabState) => void | Promise<void>
type SwitchToFn = (currentTabState: TabState, nextTabState: TabState) => void | Promise<void>

interface TabStateRegistration {
  name: string
  apiVersion: string
  capture: CaptureFn
  restore: RestoreFn
  switchTo: SwitchToFn
}

const registrar: TabStateRegistration[] = []

export function registerTabState(registration: TabStateRegistration) {
  registrar.push(registration)
}

/**
 * State that we want to keep per tab
 *
 */
export default class TabState {
  /** is the tab ready for command execution? */
  public ready = false

  /** is the tab closed? */
  public closed: boolean

  /** state map
   * outer key is `TabStateRegistrar.name`, inner key is `TabStateRegistrar.apiVersion`
   * e.g. { 'plugins/plugin-core': {'v1': {'cwd': '/'}}}
   */
  private _state: Record<string, Record<string, any>> = {}

  /** functions to capture the states of tab */
  private captures: CaptureFn[] = []

  /** functions to restore the states of the tab */
  private restores: RestoreFn[] = []

  /** functions to capture this tab state and restore another tab state */
  private switchTos: SwitchToFn[] = []

  public constructor(
    public readonly uuid: string,
    private _desiredStatusStripeDecoration: StatusStripeChangeEvent = { type: 'default' },
    private _parent?: TabState
  ) {
    registrar.forEach(_ => {
      this.register(_.name, _.apiVersion, _.capture, _.restore, _.switchTo)
    })
  }

  public get state() {
    return this._state
  }

  private checkExistence(name: string, apiVersion: string) {
    if (!this.state[name]) {
      throw new Error(`${name} doesn't exist in tab state`)
    } else if (!this.state[name][apiVersion]) {
      throw new Error(`${name} doesn't have version ${apiVersion}`)
    } else {
      return true
    }
  }

  public register(name: string, apiVersion: string, capture: CaptureFn, restore: RestoreFn, switchTo: SwitchToFn) {
    // initialize the state
    if (!this.state[name]) {
      this.state[name] = { [apiVersion]: {} }
    } else if (!this.state[name][apiVersion]) {
      this._state[name][apiVersion] = {}
    } else {
      throw new Error(`${name} ${apiVersion} already registered`)
    }

    this.captures.push(capture)
    this.restores.push(restore)
    this.switchTos.push(switchTo)
  }

  public getState(name: string, apiVersion: string, key: string) {
    if (this.checkExistence(name, apiVersion)) {
      if (this.state[name][apiVersion][key] === undefined) {
        throw new Error(`${name} ${apiVersion} doesn't have state ${key}`)
      } else {
        return this.state[name][apiVersion][key]
      }
    }
  }

  public async setState(name: string, apiVersion: string, key: string, value: any) {
    if (this.checkExistence(name, apiVersion)) {
      this.state[name][apiVersion][key] = value
    }
  }

  /** Capture contextual global state */
  public capture() {
    this.captures.forEach(capture => capture(this))
  }

  /** Capture contextual global state and then restore `nextTabState` */
  public async switchTo(nextTabState: TabState) {
    await promiseEach(this.switchTos, async switchTo => {
      await switchTo(this, nextTabState)
    })
    nextTabState.updateStatusStripe()
  }

  /** Clone the captured state */
  public cloneWithUUID(uuid: string) {
    this.capture() // keep the function name, and mean capture all
    const clone = new TabState(uuid, this.desiredStatusStripeDecoration, this)
    clone.capture()
    debug('cloned tab state', clone.uuid, clone._state)
    return clone
  }

  /** Enforce our desired status stripe decorations */
  public updateStatusStripe() {
    if (this._parent) {
      this._parent.updateStatusStripe()
    } else {
      eventBus.emitStatusStripeChangeRequest(this.desiredStatusStripeDecoration)
    }
  }

  public get desiredStatusStripeDecoration() {
    return this._desiredStatusStripeDecoration
  }

  public set desiredStatusStripeDecoration(decor: StatusStripeChangeEvent) {
    this._desiredStatusStripeDecoration = decor
    if (this._parent) {
      this._parent.desiredStatusStripeDecoration = decor
    } else {
      this.updateStatusStripe()
    }
  }

  /**
   * Restore tab state
   *
   */
  public async restore() {
    this.restores.forEach(restore => restore(this))
    this.updateStatusStripe()
  }
}
