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
 * API: tables
 *
 */

import * as TableModel from '../webapp/models/table'
import * as TableView from '../webapp/views/table'

export namespace Tables {
  export import Table = TableModel.Table
  export import Row = TableModel.Row
  export import Cell = TableModel.Cell
  export import isTable = TableModel.isTable

  export import MultiTable = TableModel.MultiTable
  export import isMultiTable = TableModel.isMultiTable

  export import TableStyle = TableModel.TableStyle

  export import formatWatchableTable = TableModel.formatWatchableTable // TODO why is this in TableModel?

  export import format = TableView.formatTable
}

export default Tables
