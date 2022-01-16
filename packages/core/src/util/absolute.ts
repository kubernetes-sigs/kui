/*
 * Copyright 2022 The Kubernetes Authors
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

import { isAbsolute, resolve } from 'path'

/**
 * Notes:
 *
 * - path.resolve() turns /kui/x into c:\kui\x. We just want to
 * absolute-ify a local filepath if it isn't already so.
 *
 * - this only works for local filepaths; if we wanted this to work
 * for all kui VFS, we would need to use `vfs ls`, which is
 * asynchronous.
 *
 * @return An absolute path for the given `path`, only if it is not already absolute
 */
export default function absolute(filepath: string): string {
  return isAbsolute(filepath) ? filepath : resolve(filepath)
}
