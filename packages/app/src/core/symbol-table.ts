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

import { Tab, getTabId } from '@kui-shell/core/webapp/cli'
import sessionStore from '@kui-shell/core/models/sessionStore'

/**
 * the key in localStorage to get the symbol table
 *
 */
class SymbolTable {
  private static readonly symbolTableSessionStorageKey = 'kui.symbol_table'

  private static getSymbolTable() {
    return JSON.parse(sessionStore().getItem(this.symbolTableSessionStorageKey)) || {}
  }

  static read(tab: Tab): Record<string, string> {
    return this.getSymbolTable()[getTabId(tab)] || {}
  }

  static write(tab: Tab, curDic: Record<string, string>) {
    const storage = this.getSymbolTable()
    storage[getTabId(tab)] = curDic
    sessionStore().setItem(this.symbolTableSessionStorageKey, JSON.stringify(storage))
  }
}

export default SymbolTable
