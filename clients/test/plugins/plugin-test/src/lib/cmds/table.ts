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

/**
 * This file introduces a "test table" command that presents a table in the REPL.
 *
 */

// Notes: this is part of the Kui core API
import { Commands } from '@kui-shell/core'

import tableContent from './content/table-with-drilldown'

/**
 * Here is where we register our command.
 *
 */
export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/test/table', () => tableContent(), {
    usage: {
      docs: 'A showcase of the Table view'
    }
  })
}
