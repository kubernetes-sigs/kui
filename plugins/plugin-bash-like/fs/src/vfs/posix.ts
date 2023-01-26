/*
 * Copyright 2020 The Kubernetes Authors
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

import { basename as defaultBasename, dirname as defaultDirname, join as defaultJoin, posix } from 'path'

/**
 * This file offers a thin facade over path.posix. Webpack at least as
 * of 4.44, does not browserify path in a way that preserves the
 * path posix API.
 *
 * Luckily, its default behavior does what we need. Hence all of the
 * inBrowser checks that dispatch to the default impl.
 *
 */

/** @return path.basename behavior */
export function basename(filepath: string): string {
  const { inBrowser } = require('@kui-shell/core/mdist/api/Capabilities')
  return inBrowser() ? defaultBasename(filepath) : posix.basename(filepath)
}

/** @return path.dirname behavior */
export function dirname(filepath: string): string {
  const { inBrowser } = require('@kui-shell/core/mdist/api/Capabilities')
  return inBrowser() ? defaultDirname(filepath) : posix.dirname(filepath)
}

/** @return path.join behavior */
export function join(a: string, b: string): string {
  const { inBrowser } = require('@kui-shell/core/mdist/api/Capabilities')
  return inBrowser() ? defaultJoin(a, b) : posix.join(a, b)
}
