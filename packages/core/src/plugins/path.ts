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

/**
 * Turns plugin-X/dist/entry.js into X. This helps us with webpack
 * dynamic imports. We can then use:
 * `import('@kui-shell/plugin-' + webpackPath(path) + '/mdist/preload.js')`
 * which will guide webpack towards a smaller set of possibly touched files.
 *
 */
export function webpackPath(path: string) {
  return path.replace(/^plugin-/, '').replace(/\/mdist\/.*\.js$/, '')
}

/**
 * For electron-main (i.e. "headless"), right now we are stil using
 * commonjs imports, so we don't need to be as clever. At some point,
 * we will probably switch over to using webpack with an electron-main
 * target. At that point, this will go away.
 *
 */
export function mainPath(path: string) {
  return '@kui-shell/' + path
}
