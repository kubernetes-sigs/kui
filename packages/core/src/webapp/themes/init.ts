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

import Capabilities from '@kui-shell/core/api/capabilities'
import { switchToPersistedThemeChoice } from './persistence'

const debug = Debug('core/webapp/themes/init')

/**
 * Install the persistence theme choice
 *
 */
export default () => {
  if (!Capabilities.isHeadless()) {
    if (Capabilities.inBrowser() || !document.body.hasAttribute('kui-theme')) {
      debug('loading theme')
      return switchToPersistedThemeChoice()
    }
  }
}
