/*
 * Copyright 2021 The Kubernetes Authors
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

import React from 'react'
import SplitPosition from './SplitPosition'

export interface InjectorOptions {
  /** @deprecated */
  maximized?: boolean

  /** Use inverse colors in the split? */
  inverseColors?: boolean

  /**
   * Force this new split to have (or not) an active input,
   * independent of what the default behavior would otherwis
   * say?
   */
  hasActiveInput?: boolean
}

/**
 * Inject the given React `node` in the given `SplitPosition`. Use the
 * given `uuid` to determine whether we have already injected this
 * content or not.
 *
 */
type Injector = (
  uuid: string,
  node: React.ReactNode,
  position: SplitPosition,
  count: number,
  opts?: InjectorOptions
) => void

/** Update the properties of an existing split */
type Modifier = (
  /** id of split to modify */
  uuid: string,

  /** The actual content */
  node: React.ReactNode,

  /** Modification options */
  opts: InjectorOptions
) => React.ReactNode

interface InjectProvider {
  inject: Injector
  modify: Modifier
}

export default React.createContext<InjectProvider>(undefined)
