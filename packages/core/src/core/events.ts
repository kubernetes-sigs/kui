/*
 * Copyright 2017 IBM Corporation
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
/* eslint-disable no-dupe-class-members */
import { EventEmitter } from 'events'
import { Tab } from '../webapp/tab'

const eventChannelUnsafe = new EventEmitter()
eventChannelUnsafe.setMaxListeners(100)

export default eventChannelUnsafe

class EventBusBase {
  protected readonly eventBus: EventEmitter

  public constructor() {
    const eventBus = new EventEmitter()
    eventBus.setMaxListeners(100)
    this.eventBus = eventBus
  }
}

class WriteEventBus extends EventBusBase {
  public emit(channel: '/tab/new' | '/tab/close/request' | '/tab/close' | '/tab/offline', tab: Tab): void
  public emit(channel: '/tab/new/request'): void
  public emit(channel: '/tab/switch/request', idx: number): void
  public emit(channel: string, args?: any) {
    return this.eventBus.emit(channel, args)
  }

  public emitWithTabId(channel: '/tab/offline', tabId: string): void
  public emitWithTabId(channel: string, tabId: string) {
    return this.eventBus.emit(`${channel}/${tabId}`)
  }
}

class ReadEventBus extends WriteEventBus {
  public on(
    channel: '/tab/new' | '/tab/close/request' | '/tab/close' | '/tab/offline',
    listener: (tab: Tab) => void
  ): void

  public on(channel: '/tab/new/request', listener: () => void): void
  public on(channel: '/tab/switch/request', listener: (tabId: number) => void): void
  public on(channel: string, listener: any) {
    return this.eventBus.on(channel, listener)
  }

  public onWithTabId(channel: '/tab/offline', tabId: string, listener: (tabId: string) => void): void
  public onWithTabId(channel: string, tabId: string, listener: any) {
    return this.eventBus.on(`${channel}/${tabId}`, listener)
  }

  public offWithTabId(channel: '/tab/offline', tabId: string, listener: () => void): void
  public offWithTabId(channel: string, tabId: string, listener: any) {
    return this.eventBus.off(`${channel}/${tabId}`, listener)
  }

  public once(channel: '/tab/new', listener: (tab: Tab) => void): void
  public once(channel: string, listener: any) {
    return this.eventBus.once(channel, listener)
  }
}

class EventBus extends ReadEventBus {}
export const eventBus = new EventBus()

/**
 * Hook an event listener up to the family of standard user
 * interaction events.
 *
 */
export function wireToStandardEvents(listener: () => void) {
  eventBus.on('/tab/new', listener)
  eventBus.on('/tab/switch/request', listener)
  eventChannelUnsafe.on('/command/complete/fromuser', listener)
}
