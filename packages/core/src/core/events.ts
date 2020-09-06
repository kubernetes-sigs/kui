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

import { ExecType } from '../models/command'
import { ScalarResponse } from '../models/entity'
import MultiModalResponse from '../models/mmr/types'
import NavResponse from '../models/NavResponse'
import Tab, { getPrimaryTabId } from '../webapp/tab'
import {
  CommandStartEvent,
  CommandCompleteEvent,
  CommandStartHandler,
  CommandCompleteHandler,
  SnapshotBlock
} from '../repl/events'

const eventChannelUnsafe = new EventEmitter()
eventChannelUnsafe.setMaxListeners(100)

export default eventChannelUnsafe

export type StatusStripeChangeEvent = {
  type: 'default' | 'blue' | 'yellow' | 'red'
  message?: string
}

export type SnapshotRequestEvent = {
  cb: (snapshot: SnapshotBlock[]) => void
  filter?: (evt: CommandStartEvent) => boolean
}

export type TabLayoutChangeEvent = { isSidecarNowHidden: boolean }
type TabLayoutChangeHandler = (evt: TabLayoutChangeEvent) => void

class EventBusBase {
  protected readonly eventBus: EventEmitter

  public constructor() {
    const eventBus = new EventEmitter()
    eventBus.setMaxListeners(100)
    this.eventBus = eventBus
  }
}

interface NewTabRequestEvent {
  /** Optionally force use of this tab UUID */
  uuid?: string

  /** Optionally specify color and message to display in the StatusStripe */
  statusStripeDecoration?: StatusStripeChangeEvent

  /** Optional tab title */
  title?: string

  /** Optionally specify to create the new tab without switching to it */
  background?: boolean
}

class WriteEventBus extends EventBusBase {
  public emit(channel: '/tab/new' | '/tab/close' | '/tab/offline', tab: Tab): void
  public emit(channel: '/tab/new/request', evt?: NewTabRequestEvent): void
  public emit(channel: '/tab/switch/request', idx: number): void
  public emit(channel: string, args?: any) {
    return this.eventBus.emit(channel, args)
  }

  /** User switching focus from one Split to another, within one Tab */
  public emitSplitSwitch(tab: Tab): void {
    this.eventBus.emit('/tab/switch/split', tab)
  }

  public emitTabLayoutChange(tabUUID: string, evt: TabLayoutChangeEvent = { isSidecarNowHidden: false }): void {
    setTimeout(() => this.eventBus.emit(`/tab/layout/change/${tabUUID}`, evt))
  }

  private emitCommandEvent(which: 'start' | 'complete', event: CommandStartEvent | CommandCompleteEvent) {
    this.eventBus.emit(`/command/${which}`, event)

    if (event.execType !== ExecType.Nested) {
      this.eventBus.emit(`/command/${which}/fromuser`, event)
      this.eventBus.emit(`/command/${which}/fromuser/${event.tab.uuid}`, event)

      const primary = getPrimaryTabId(event.tab)
      if (event.tab.uuid !== primary) {
        this.eventBus.emit(`/command/${which}/fromuser/${primary}`, event)
      }

      this.eventBus.emit(`/command/${which}/fromuser/${primary}/type/${event.execType}`, event)
    }
  }

  public emitCommandStart(event: CommandStartEvent): void {
    this.emitCommandEvent('start', event)
  }

  public emitCommandComplete(event: CommandCompleteEvent): void {
    this.emitCommandEvent('complete', event)

    if (event.execType !== ExecType.Nested) {
      this.eventBus.emit(`/command/complete/fromuser/${event.responseType}`, event)
      this.eventBus.emit(`/command/complete/fromuser/${event.responseType}/${event.tab.uuid}`, event)

      const primary = getPrimaryTabId(event.tab)
      if (primary !== event.tab.uuid) {
        this.eventBus.emit(`/command/complete/fromuser/${event.responseType}/${primary}`, event)
      }
    }
  }

  /** Indicate a new snapshotable element */
  public emitAddSnapshotable(): void {
    this.eventBus.emit('/snapshot/element/add')
  }

  /** Indicate a snapshotable element no longer exists */
  public emitRemoveSnapshotable(): void {
    this.eventBus.emit('/snapshot/element/remove')
  }

  /** Request a Snapshot of the given Tab */
  public emitSnapshotRequest(evt: SnapshotRequestEvent): void {
    this.eventBus.emit('/snapshot/request', evt)
  }

  /** Request a status stripe change */
  public emitStatusStripeChangeRequest(evt: StatusStripeChangeEvent): void {
    this.eventBus.emit('/status-stripe/change', evt)
  }

  public emitWithTabId(channel: '/tab/offline' | '/tab/close/request', tabId: string, tab?: Tab): void {
    this.eventBus.emit(`${channel}/${tabId}`, tabId, tab)
  }
}

class ReadEventBus extends WriteEventBus {
  public on(
    channel: '/tab/new' | '/tab/close/request' | '/tab/close' | '/tab/offline',
    listener: (tab: Tab) => void
  ): void

  public on(channel: '/tab/new/request', listener: (evt: NewTabRequestEvent) => void): void
  public on(channel: '/tab/switch/request', listener: (tabId: number) => void): void
  public on(channel: string, listener: any) {
    return this.eventBus.on(channel, listener)
  }

  public off(channel: string, listener: any) {
    return this.eventBus.off(channel, listener)
  }

  /** Listen for snapshotable elements coming and going */
  public onAddSnapshotable(listener: () => void) {
    this.eventBus.on('/snapshot/element/add', listener)
  }

  public onRemoveSnapshotable(listener: () => void) {
    this.eventBus.on('/snapshot/element/remove', listener)
  }

  /** Snapshot the Block state of the given Tab */
  public onSnapshotRequest(listener: (evt: SnapshotRequestEvent) => void) {
    this.eventBus.on(`/snapshot/request`, listener)
  }

  /** Snapshot the Block state of the given Tab */
  public offSnapshotRequest(listener: (evt: SnapshotRequestEvent) => void) {
    this.eventBus.off('/snapshot', listener)
  }

  /** Request a status stripe change */
  public onStatusStripeChangeRequest(listener: (evt: StatusStripeChangeEvent) => void): void {
    this.eventBus.on('/status-stripe/change', listener)
  }

  /** Request a status stripe change */
  public offStatusStripeChangeRequest(listener: (evt: StatusStripeChangeEvent) => void): void {
    this.eventBus.off('/status-stripe/change', listener)
  }

  /** User switching focus from one Split to another, within one Tab */
  public onSplitSwitch(listener: (tab?: Tab | number) => void): void {
    this.eventBus.on('/tab/switch/split', listener)
  }

  /** User switching focus from one Split to another, within one Tab */
  public offSplitSwitch(listener: (tab?: Tab | number) => void): void {
    this.eventBus.off('/tab/switch/split', listener)
  }

  public onTabLayoutChange(tabUUID: string, listener: TabLayoutChangeHandler): void {
    this.eventBus.on(`/tab/layout/change/${tabUUID}`, listener)
  }

  public offTabLayoutChange(tabUUID: string, listener: TabLayoutChangeHandler): void {
    this.eventBus.off(`/tab/layout/change/${tabUUID}`, listener)
  }

  private onCommand(
    which: 'start' | 'complete',
    splitId: string,
    splitHandler: CommandStartHandler | CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.eventBus.on(`/command/${which}/fromuser/${splitId}`, splitHandler)

    if (tabId) {
      this.eventBus.on(`/command/${which}/fromuser/${tabId}/type/${ExecType.ClickHandler}`, tabHandler)
    }
  }

  private offCommand(
    which: 'start' | 'complete',
    splitId: string,
    splitHandler: CommandStartHandler | CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.eventBus.off(`/command/${which}/fromuser/${splitId}`, splitHandler)

    if (tabId) {
      this.eventBus.off(`/command/${which}/fromuser/${tabId}/type/${ExecType.ClickHandler}`, tabHandler)
    }
  }

  public onAnyCommandStart(handler: CommandStartHandler) {
    this.eventBus.on('/command/start/fromuser', handler)
  }

  public offAnyCommandStart(handler: CommandStartHandler) {
    this.eventBus.off('/command/start/fromuser', handler)
  }

  public onAnyCommandComplete(handler: CommandStartHandler | (() => void)) {
    this.eventBus.on('/command/complete/fromuser', handler)
  }

  public offAnyCommandComplete(handler: CommandStartHandler | (() => void)) {
    this.eventBus.off('/command/complete/fromuser', handler)
  }

  public onCommandStart(
    splitId: string,
    splitHandler: CommandStartHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.onCommand('start', splitId, splitHandler, tabId, tabHandler)
  }

  public onceCommandStarts(tabId: string, handler: CommandStartHandler): void {
    this.eventBus.once(`/command/start/fromuser/${tabId}`, handler)
  }

  private onResponseType(
    responseType: 'ScalarResponse' | 'MultiModalResponse' | 'NavResponse',
    splitId: string,
    splitHandler: CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.eventBus.on(`/command/complete/fromuser/${responseType}/${splitId}`, splitHandler)

    if (tabId) {
      this.eventBus.on(`/command/complete/fromuser/${responseType}/${tabId}`, tabHandler)
    }
  }

  private offResponseType(
    responseType: 'ScalarResponse' | 'MultiModalResponse' | 'NavResponse',
    splitId: string,
    splitHandler: CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.eventBus.off(`/command/complete/fromuser/${responseType}/${splitId}`, splitHandler)

    if (tabId) {
      this.eventBus.off(`/command/complete/fromuser/${responseType}/${tabId}`, tabHandler)
    }
  }

  public onScalarResponse(
    splitId: string,
    splitHandler: CommandCompleteHandler<ScalarResponse>,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.onResponseType('ScalarResponse', splitId, splitHandler, tabId, tabHandler)
  }

  public offScalarResponse(
    splitId: string,
    splitHandler: CommandCompleteHandler<ScalarResponse>,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.offResponseType('ScalarResponse', splitId, splitHandler, tabId, tabHandler)
  }

  public onMultiModalResponse(
    tabId: string,
    handler: CommandCompleteHandler<MultiModalResponse, 'MultiModalResponse'>
  ): void {
    this.onResponseType('MultiModalResponse', tabId, handler)
  }

  public offMultiModalResponse(
    tabId: string,
    handler: CommandCompleteHandler<MultiModalResponse, 'MultiModalResponse'>
  ): void {
    this.offResponseType('MultiModalResponse', tabId, handler)
  }

  public onNavResponse(tabId: string, handler: CommandCompleteHandler<NavResponse, 'NavResponse'>): void {
    this.onResponseType('NavResponse', tabId, handler)
  }

  public offNavResponse(tabId: string, handler: CommandCompleteHandler<NavResponse, 'NavResponse'>): void {
    this.offResponseType('NavResponse', tabId, handler)
  }

  public onCommandComplete(
    splitId: string,
    splitHandler: CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.onCommand('complete', splitId, splitHandler, tabId, tabHandler)
  }

  public offCommandStart(
    splitId: string,
    splitHandler: CommandStartHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.offCommand('start', splitId, splitHandler, tabId, tabHandler)
  }

  public offCommandComplete(
    splitId: string,
    splitHandler: CommandCompleteHandler,
    tabId?: string,
    tabHandler = splitHandler
  ): void {
    this.offCommand('complete', splitId, splitHandler, tabId, tabHandler)
  }

  public onWithTabId(
    channel: '/tab/offline' | '/tab/close/request',
    tabId: string,
    listener: (tabId: string, tab: Tab) => void
  ): void {
    this.eventBus.on(`${channel}/${tabId}`, listener)
  }

  public offWithTabId(
    channel: '/tab/offline' | '/tab/close/request',
    tabId: string,
    listener: (tabId: string, tab: Tab) => void
  ): void {
    this.eventBus.off(`${channel}/${tabId}`, listener)
  }

  public onceWithTabId(
    channel: '/tab/offline' | '/tab/close/request',
    tabId: string,
    listener: (tabId: string, tab: Tab) => void
  ): void {
    this.eventBus.once(`${channel}/${tabId}`, listener)
  }

  public once(channel: '/tab/new', listener: (tab: Tab) => void): void
  public once(channel: string, listener: any) {
    return this.eventBus.once(channel, listener)
  }
}

class EventBus extends ReadEventBus {}
export const eventBus = new EventBus()

/**
 * Hook an event listener up to tab events.
 *
 */
export function wireToTabEvents(listener: (tab?: Tab | number) => void) {
  eventBus.on('/tab/new', listener)
  eventBus.on('/tab/switch/request', listener)
  eventBus.onSplitSwitch(listener)
}

/**
 * Unhook
 *
 */
export function unwireToTabEvents(listener: (tab?: Tab | number) => void) {
  eventBus.off('/tab/new', listener)
  eventBus.off('/tab/switch/request', listener)
  eventBus.offSplitSwitch(listener)
}

/**
 * Hook an event listener up to the family of standard user
 * interaction events.
 *
 */
export function wireToStandardEvents(listener: (tab?: Tab | number) => void) {
  wireToTabEvents(listener)
  eventBus.onAnyCommandComplete(listener)
  eventChannelUnsafe.on('/terminal/clear', listener)
}

/**
 * Unhook
 *
 */
export function unwireToStandardEvents(listener: (tab?: Tab | number) => void) {
  unwireToTabEvents(listener)
  eventBus.offAnyCommandComplete(listener)
  eventChannelUnsafe.off('/terminal/clear', listener)
}
