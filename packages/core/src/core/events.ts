/*
 * Copyright 2017 The Kubernetes Authors
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
import TabState from '../models/tab-state'
import Tab, { getPrimaryTabId } from '../webapp/tab'
import { CommandStartEvent, CommandCompleteEvent, CommandStartHandler, CommandCompleteHandler } from '../repl/events'

const eventChannelUnsafe = new EventEmitter()
eventChannelUnsafe.setMaxListeners(100)

export default eventChannelUnsafe

export type StatusStripeChangeEvent = {
  type: 'default' | 'blue' | 'yellow' | 'red'
  message?: string
}

export type SnapshotRequestEvent = {
  cb: (snapshot: Buffer) => void
  filter?: (evt: CommandStartEvent) => boolean
  opts?: {
    name?: string
    description?: string
    preferReExecute?: boolean
    shallow?: boolean
  }
}

export type TabLayoutChangeEvent = { isSidecarNowHidden: boolean; isWidthConstrained?: boolean }
type TabLayoutChangeHandler = (evt: TabLayoutChangeEvent) => void

class EventBusBase {
  protected readonly eventBus: EventEmitter

  public constructor() {
    const eventBus = new EventEmitter()
    eventBus.setMaxListeners(100)
    this.eventBus = eventBus
  }
}

export interface NewTabRequestEvent {
  /** Optionally specify color and message to display in the StatusStripe */
  statusStripeDecoration?: StatusStripeChangeEvent

  /** Optional tab title */
  title?: string

  /** Optionally specify to create the new tab without switching to it */
  background?: boolean

  /** Optionally execute a command in the new tab */
  cmdline?: string

  /** Optionally open a snapshot file in the new tab */
  snapshot?: Buffer

  /** Execute the command line with qexec or pexec? Default: pexec. */
  exec?: 'pexec' | 'qexec'

  /** Optionally execute a command when the tab is closed */
  onClose?: string
}

class WriteEventBus extends EventBusBase {
  public emit(channel: '/tab/new' | '/tab/close' | '/tab/offline', tab: Tab): void
  public emit(channel: '/tab/new/request', evt?: NewTabRequestEvent): void
  public emit(channel: '/tab/switch/request', idx: number): void
  public emit(channel: '/tab/switch/request/done', args: { idx: number; tab: TabState }): void
  public emit(channel: string, args?: any) {
    return this.eventBus.emit(channel, args)
  }

  /** User switching focus from one Split to another, within one Tab */
  public emitSplitSwitch(tab: Tab): void {
    this.eventBus.emit('/tab/switch/split', tab)
  }

  public emitTabLayoutChange(
    tabUUID: string,
    evt: TabLayoutChangeEvent = { isSidecarNowHidden: false, isWidthConstrained: false }
  ): void {
    setTimeout(() => this.eventBus.emit(`/tab/layout/change/${tabUUID}`, evt))
  }

  public emitEnvUpdate(key: string, value: string, tab: Tab) {
    this.eventBus.emit(`/env/update/${key}`, { value, tab })
  }

  private emitCommandEvent(
    which: 'start' | 'complete',
    event: CommandStartEvent | CommandCompleteEvent,
    isReplay: boolean
  ) {
    this.eventBus.emit(`/command/${which}`, event)

    if (event.execType !== ExecType.Nested) {
      const from = isReplay ? 'replay' : 'fromuser'

      this.eventBus.emit(`/command/${which}/${from}`, event)
      this.eventBus.emit(`/command/${which}/${from}/${event.tab.uuid}`, event)

      const primary = getPrimaryTabId(event.tab)
      if (event.tab.uuid !== primary) {
        this.eventBus.emit(`/command/${which}/${from}/${primary}`, event)
      }

      this.eventBus.emit(`/command/${which}/${from}/${primary}/type/${event.execType}`, event)
    }
  }

  public emitCommandStart(event: CommandStartEvent, isReplay = false): void {
    this.emitCommandEvent('start', event, isReplay)
  }

  public emitCommandComplete(event: CommandCompleteEvent, isReplay = false): void {
    this.emitCommandEvent('complete', event, isReplay)

    if (event.execType !== ExecType.Nested) {
      const from = isReplay ? 'replay' : 'fromuser'

      this.eventBus.emit(`/command/complete/${from}/${event.responseType}`, event)
      this.eventBus.emit(`/command/complete/${from}/${event.responseType}/${event.tab.uuid}`, event)

      const primary = getPrimaryTabId(event.tab)
      if (primary !== event.tab.uuid) {
        this.eventBus.emit(`/command/complete/${from}/${event.responseType}/${primary}`, event)
      }
    }
  }

  /** Request a Snapshot of the given Tab */
  public emitSnapshotRequest(evt: SnapshotRequestEvent, tabId: string): void {
    this.eventBus.emit(`/snapshot/request/${tabId}`, evt)
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
  public on(channel: '/tab/switch/request/done', listener: (tabId: number, tabState: TabState) => void): void
  public on(channel: string, listener: any) {
    return this.eventBus.on(channel, listener)
  }

  public off(channel: string, listener: any) {
    return this.eventBus.off(channel, listener)
  }

  public onRemoveSnapshotable(listener: () => void) {
    this.eventBus.on('/snapshot/element/remove', listener)
  }

  /** Snapshot the Block state of the given Tab */
  public onSnapshotRequest(listener: (evt: SnapshotRequestEvent) => void, tabId: string) {
    this.eventBus.on(`/snapshot/request/${tabId}`, listener)
  }

  /** Snapshot the Block state of the given Tab */
  public offSnapshotRequest(listener: (evt: SnapshotRequestEvent) => void, tabId: string) {
    this.eventBus.off(`/snapshot/${tabId}`, listener)
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

  public onEnvUpdate(key: string, listener: (args: { value: string; tab: Tab }) => void): void {
    this.eventBus.on(`/env/update/${key}`, listener)
  }

  public offEnvUpdate(key: string, listener: (value: string) => void): void {
    this.eventBus.off(`/env/update/${key}`, listener)
  }

  private onCommand<Handler extends CommandStartHandler | CommandCompleteHandler>(
    which: 'start' | 'complete',
    splitId: string,
    splitHandler: Handler,
    onReplay = false
  ): void {
    if (onReplay) {
      this.eventBus.on(`/command/${which}/replay/${splitId}`, splitHandler)
    } else {
      this.eventBus.on(`/command/${which}/fromuser/${splitId}`, splitHandler)
    }
  }

  private offCommand(
    which: 'start' | 'complete',
    splitId: string,
    splitHandler: CommandStartHandler | CommandCompleteHandler
  ): void {
    this.eventBus.off(`/command/${which}/fromuser/${splitId}`, splitHandler)
  }

  public onAnyCommandStart(handler: CommandStartHandler) {
    this.eventBus.on('/command/start/fromuser', handler)
  }

  public offAnyCommandStart(handler: CommandStartHandler) {
    this.eventBus.off('/command/start/fromuser', handler)
  }

  public onAnyCommandComplete(handler: CommandCompleteHandler | (() => void)) {
    this.eventBus.on('/command/complete/fromuser', handler)
  }

  public offAnyCommandComplete(handler: CommandCompleteHandler | (() => void)) {
    this.eventBus.off('/command/complete/fromuser', handler)
  }

  public onCommandStart(splitId: string, splitHandler: CommandStartHandler, onReplay = false): void {
    this.onCommand('start', splitId, splitHandler, onReplay)
  }

  public onceCommandStarts(tabId: string, handler: CommandStartHandler): void {
    this.eventBus.once(`/command/start/fromuser/${tabId}`, handler)
  }

  private onResponseType(
    responseType: 'ScalarResponse' | 'MultiModalResponse' | 'NavResponse',
    splitId: string,
    splitHandler: CommandCompleteHandler,
    onReplay = true
  ): void {
    this.eventBus.on(`/command/complete/fromuser/${responseType}/${splitId}`, splitHandler)

    // if you don't want the sidecar to open on replay, comment this out:
    if (onReplay) {
      this.eventBus.on(`/command/complete/replay/${responseType}/${splitId}`, splitHandler)
    }
  }

  private offResponseType(
    responseType: 'ScalarResponse' | 'MultiModalResponse' | 'NavResponse',
    splitId: string,
    splitHandler: CommandCompleteHandler
  ): void {
    this.eventBus.off(`/command/complete/fromuser/${responseType}/${splitId}`, splitHandler)
  }

  public onScalarResponse(splitId: string, splitHandler: CommandCompleteHandler<ScalarResponse>): void {
    this.onResponseType('ScalarResponse', splitId, splitHandler)
  }

  public offScalarResponse(splitId: string, splitHandler: CommandCompleteHandler<ScalarResponse>): void {
    this.offResponseType('ScalarResponse', splitId, splitHandler)
  }

  public onMultiModalResponse(
    tabId: string,
    handler: CommandCompleteHandler<MultiModalResponse, 'MultiModalResponse'>,
    onReplay?: boolean
  ): void {
    this.onResponseType('MultiModalResponse', tabId, handler, onReplay)
  }

  public offMultiModalResponse(
    tabId: string,
    handler: CommandCompleteHandler<MultiModalResponse, 'MultiModalResponse'>
  ): void {
    this.offResponseType('MultiModalResponse', tabId, handler)
  }

  public onNavResponse(
    tabId: string,
    handler: CommandCompleteHandler<NavResponse, 'NavResponse'>,
    onReplay?: boolean
  ): void {
    this.onResponseType('NavResponse', tabId, handler, onReplay)
  }

  public offNavResponse(tabId: string, handler: CommandCompleteHandler<NavResponse, 'NavResponse'>): void {
    this.offResponseType('NavResponse', tabId, handler)
  }

  public onCommandComplete(splitId: string, splitHandler: CommandCompleteHandler, onReplay = false): void {
    this.onCommand('complete', splitId, splitHandler, onReplay)
  }

  public offCommandStart(splitId: string, splitHandler: CommandStartHandler): void {
    this.offCommand('start', splitId, splitHandler)
  }

  public offCommandComplete(splitId: string, splitHandler: CommandCompleteHandler): void {
    this.offCommand('complete', splitId, splitHandler)
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
  eventBus.on('/tab/switch/request/done', listener)
  eventBus.onSplitSwitch(listener)
}

/**
 * Unhook
 *
 */
export function unwireToTabEvents(listener: (tab?: Tab | number) => void) {
  eventBus.off('/tab/new', listener)
  eventBus.off('/tab/switch/request/done', listener)
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
