/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('core/capabilities')

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

/** map from provider to credentials */
type ICredentialsMap = { [key: string]: any }

/**
 * Current state of capabilities
 *
 */
class State {
  assertedLocalAccess = false
  hasLocalAccess = true // may change as media changes or assertLocalAccess is called
  media = Media.Unknown
  validCredentials: ICredentialsMap = {} // map to the credentials
}
let state: State = new State()

/**
 * What is our presentation media?
 *
 */
export const getMedia = () => state.media
export const isHeadless = () => state.media === Media.Headless
export const inElectron = () => state.media === Media.Electron
export const inBrowser = () => state.media === Media.Browser

/**
 * Update the media, e.g. to indicate that we are running in a browser
 * context versus an Electron context.
 *
 */
export const setMedia = (media: Media): void => {
  debug('setMedia %s', Media[media])
  state.media = media

  if (!state.assertedLocalAccess && inBrowser()) {
    state.hasLocalAccess = false
  }
}

/**
 * Yes, we have valid credentials to interface with the given
 * provider
 *
 */
export const setHasAuth = (provider: string, creds: any): void => {
  debug('setHasAuth', provider, creds)
  state.validCredentials[provider] = creds
}

/**
 * Return a map of all valid credentials
 *
 */
export const getValidCredentials = (): ICredentialsMap => state.validCredentials

/**
 * Inject the credentials map
 *
 */
export const setValidCredentials = (creds: ICredentialsMap): void => {
  state.validCredentials = creds
}

/**
 * Do we have valid credentials to interface with the given provider?
 *
 */
export const hasAuth = (provider: string): boolean => !!state.validCredentials[provider]

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
