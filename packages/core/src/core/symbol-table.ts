/*
 * Copyright 2019 The Kubernetes Authors
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

import { Tab, getPrimaryTabId } from '../webapp/tab'
import sessionStore from '../models/sessionStore'

/**
 * the key in localStorage to get the symbol table
 *
 */
export class SymbolTable {
  private readonly symbolTableSessionStorageKey = 'kui.symbol_table'

  private getSymbolTable() {
    return JSON.parse(sessionStore().getItem(this.symbolTableSessionStorageKey)) || {}
  }

  public read(tab: Tab): Record<string, string> {
    return this.getSymbolTable()[getPrimaryTabId(tab)] || {}
  }

  public write(tab: Tab, curDic: Record<string, string>) {
    const storage = this.getSymbolTable()
    storage[getPrimaryTabId(tab)] = curDic
    sessionStore().setItem(this.symbolTableSessionStorageKey, JSON.stringify(storage))
  }
}

export default new SymbolTable()
