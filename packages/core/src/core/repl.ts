/*
 * Copyright 2017-19 IBM Corporation
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
 * The Read-Eval-Print Loop (REPL)
 *
 */

import encodeComponent from '../repl/encode'
export { encodeComponent }

import { split, _split, Split } from '../repl/split'
export { split, _split, Split }

export { exec, click, semicolonInvoke, qexec, pexec, rexec, getImpl, setEvaluatorImpl } from '../repl/exec'

export { ReplEval, DirectReplEval } from '../repl/types'
