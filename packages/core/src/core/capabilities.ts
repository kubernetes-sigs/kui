/*
 * Copyright 2018 The Kubernetes Authors
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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import Debug from 'debug'
const debug = Debug('core/capabilities')
debug('loading')

import { isOffline } from '../api/Client'

export { CapabilityRegistration as Registration } from '../models/plugin'

/**
 * Are we running headless, in electron, or in a browser?
 *
 */
export enum Media {
  Unknown,
  Headless,
  Electron,
  Browser
}

/**
 * Current state of capabilities
 *
 */
class State {
  assertedLocalAccess = false

  hasLocalAccess = true

  // may change as media changes or assertLocalAccess is called
  hasProxy = false

  media = Media.Unknown
}
const state: State = new State()

/**
 * Update the media, e.g. to indicate that we are running in a browser
 * context versus an Electron context.
 *
 */
export const setMedia = (media: Media): void => {
  debug('setMedia %s', Media[media])
  state.media = media

  if (!state.assertedLocalAccess && media === Media.Browser) {
    state.hasLocalAccess = false
  }
}

/**
 * What is our presentation media?
 *
 */
export const getMedia = () => state.media
export const isHeadless = () => state.media === Media.Headless
export const inElectron = () => state.media === Media.Electron
export const inBrowser = () => {
  if (state.media === Media.Browser) {
    return true
  }

  if (
    isOffline() ||
    (!isHeadless() && typeof document !== 'undefined' && document.body.classList.contains('not-electron'))
  ) {
    setMedia(Media.Browser)
    return true
  } else {
    return false
  }
}

/**
 * Is Kui supported by a remote proxy?
 *
 */
export const hasProxy = () => state.hasProxy

/**
 * Assert that Kui is supported by a remote proxy
 *
 */
export const assertHasProxy = () => {
  state.hasProxy = true
}

/**
 * Are we the Kui proxy?
 *
 */
export const inProxy = () => {
  return process.env.KUI_REPL_MODE !== undefined
}

/**
 * Do we have access to a local system?
 *
 */
export const hasLocalAccess = (): boolean => {
  return state.hasLocalAccess
}

/**
 * Assert that we have local access, even if the default behavior
 * would indicate otherwise
 *
 */
export const assertLocalAccess = (): void => {
  state.hasLocalAccess = true
}
