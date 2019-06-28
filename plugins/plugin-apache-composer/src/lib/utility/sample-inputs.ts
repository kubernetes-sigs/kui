/*
 * Copyright 2018 IBM Corporation
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
 * The sample compositions we want to offer users
 *
 */
export const sampleInputs = (cmd, partial = false) => {
  // generator of the command string; if the caller passed in a function, use it
  const gen = typeof cmd === 'function' ? cmd : () => cmd

  return [
    {
      name: 'hello.js',
      docs: 'hello world',
      command: `${gen('hello-demo')} @demos/hello.js`,
      partial
    },
    {
      name: 'if.js',
      docs: 'conditional execution',
      command: `${gen('if-demo')} @demos/if.js`,
      partial
    },
    {
      name: 'let.js',
      docs: 'introduce a value',
      command: `${gen('let-demo')} @demos/let.js`,
      partial
    },
    {
      name: 'retain.js',
      docs: 'forward values around untrusted code',
      command: `${gen('retain-demo')} @demos/retain.js`,
      partial
    },
    {
      name: 'try.js',
      docs: 'try/catch',
      command: `${gen('try-demo')} @demos/try.js`,
      partial
    }
  ]
}
