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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

/**
 * API: arguments to command handlers
 *
 */

import * as _Entity from '../models/entity'
import _History from '../models/history'
import { clearSelection, currentSelection } from '../webapp/views/sidecar-visibility'
import _Store from '../models/store'
import _SymbolTable from '../core/symbol-table'
import TabState from '../models/tab-state'

export namespace Models {
  export import ResourceWithMetadata = _Entity.MetadataBearing
  export import isResourceByReference = _Entity.isMetadataBearingByReference

  export namespace Selection {
    export const current = currentSelection
    export const clear = clearSelection
  }

  export const History = _History

  export const Store = _Store

  export const SymbolTable = _SymbolTable

  export const Tab = {
    State: TabState
  }
}

// export some of the common types, to allow for imports that avoid dynamic requires
// see https://github.com/IBM/kui/issues/3222
export { MetadataBearing as ResourceWithMetadata } from '../models/entity'

export { Watchable } from '../webapp/models/watch'

export default Models
