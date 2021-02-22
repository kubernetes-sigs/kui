/*
 * Copyright 2017-19 The Kubernetes Authors
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

function defaultFromClient() {
  try {
    return require('@kui-shell/client/config.d/exec.json').defaultContext
  } catch (err) {
    console.log('could not find client config')
  }
}

/**
 * Parse a serialized command context
 *
 */
function parseCommandContext(str: string): string[] {
  if (str) {
    try {
      // let's assume str is of the form '["a", "b"]'
      return JSON.parse(str)
    } catch (err1) {
      // ok, that didn't work; let's see if it's of the form '/a/b'
      try {
        return str.split('/').filter(_ => _)
      } catch (err2) {
        console.error(`Could not parse command context ${str}`, err1, err2)
      }
    }
  }
  return undefined
}

/**
 * The default command execution context. For example, if the
 * execution context is /foo/bar, and there is a command /foo/bar/baz,
 * then the issuance of a command "baz" will resolve to /foo/bar/baz.
 *
 * The default can be overridden either by changing the next line, or
 * by calling `setDefaultCommandContext`.
 *
 */
let _defaultContext: string[] = parseCommandContext(process.env.KUI_COMMAND_CONTEXT) || defaultFromClient() || []

/**
 * The command context model, defaulting to the _defaultContext, which
 * can be overridden via `setDefaultCommandContext`.
 *
 */
export const Context = {
  current: _defaultContext
}

/**
 * When commands are executed, the command resolver will use a
 * fallback prefix. This routine tries to discover, from the
 * environment, what the default fallback prefix should be.
 *
 */
export const setDefaultCommandContext = (commandContext: string[]) => {
  Context.current = _defaultContext = commandContext
}

export function getCurrentContext() {
  return Context.current
}
