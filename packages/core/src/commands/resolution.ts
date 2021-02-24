/*
 * Copyright 2017 The Kubernetes Authors
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

import { CommandHandlerWithEvents, CommandTreeResolution, KResponse, ParsedOptions } from '../models/command'

/**
 * A call to `read` may or may not have successfully resolved the
 * given `argv.` This method clarifies the situation.
 *
 */
export function isSuccessfulCommandResolution<T extends KResponse, O extends ParsedOptions>(
  resolution: CommandTreeResolution<T, O>
): resolution is CommandHandlerWithEvents<T, O> {
  return (resolution as CommandHandlerWithEvents<T, O>).eval !== undefined
}
