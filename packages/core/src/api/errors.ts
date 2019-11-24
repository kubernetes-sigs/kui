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
 * API: error handling
 *
 */

import * as _Errors from '../models/errors'
import * as Usage from '../core/usage-error'

export namespace Errors {
  export import CodedError = _Errors.CodedError
  export import isCodedError = _Errors.isCodedError

  export import UsageModel = Usage.UsageModel
  export import UsageRow = Usage.UsageRow
  export import UsageError = Usage.UsageError
  export import isUsageError = Usage.isUsageError

  export import YargsParserConfiguration = Usage.YargsParserConfiguration
}

export { CodedError } from '../models/errors'

export default Errors
