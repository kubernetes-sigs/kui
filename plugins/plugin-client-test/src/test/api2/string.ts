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
 * This file tests "test string" command that expects a simple `hello world`
 * string response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/say-hello.ts
 *
 */

import { Common, CLI, Selectors, TestStringResponse } from '@kui-shell/test'

/**
 * pty streaming
 *
 */
/* const pty = (prefix = 'XXX') => `${prefix} hi`
const repeat = (str: string, n: number, joiner = '\n') =>
  Array(n)
    .fill(str)
    .join(joiner)
new TestStringResponse({
  command: 'test stream pty --grumble 1',
  expect: pty(),
  exact: true,
  streaming: true
}).string()
new TestStringResponse({
  command: 'test stream pty --grumble 5',
  expect: repeat(pty(), 5),
  exact: true,
  streaming: true
}).string()
new TestStringResponse({
  command: 'test stream pty --grumble 8 --prefix MMM',
  expect: repeat(pty('MMM'), 8),
  exact: true,
  streaming: true
}).string() */

/**
 * string response with no arguments
 *
 */
new TestStringResponse({
  command: 'test echo-array',
  expect: '[3,4,5]',
  exact: true
}).string()
new TestStringResponse({
  command: 'test string',
  expect: 'hello world',
  exact: true
}).string()
new TestStringResponse({
  command: 'test stream string',
  expect: 'hello world',
  exact: true,
  streaming: true
}).string()

/**
 * string response with pass-through of command line option
 *
 */
new TestStringResponse({
  command: 'test string --grumble 3',
  expect: 'hello world 3',
  exact: true
}).string()
new TestStringResponse({
  command: 'test stream string --grumble 3',
  expect: 'hello world 3',
  exact: true,
  streaming: true
}).string()

/**
 * HTMLElement response
 *
 */
new TestStringResponse({
  command: 'test html dom',
  expect: 'yyyyy',
  exact: true
}).string()
new TestStringResponse({
  command: 'test stream html dom',
  expect: 'yyyyy',
  exact: true,
  streaming: true
}).string()

/**
 * MixedResponse; i.e. a mix of HTML and string output
 *
 */
new TestStringResponse({
  command: 'test mixed',
  expect: 'yyyyy',
  exact: false
}).string()
new TestStringResponse({
  command: 'test mixed',
  expect: 'hello world',
  exact: false
}).string()
new TestStringResponse({
  command: 'test mixed --grumble 999',
  expect: 'hello world 999',
  exact: false
}).string()
new TestStringResponse({
  command: 'test stream mixed',
  expect: 'yyyyy',
  exact: false,
  streaming: true
}).string()
new TestStringResponse({
  command: 'test stream mixed',
  expect: 'hello world',
  exact: false,
  streaming: true
}).string()
new TestStringResponse({
  command: 'test stream mixed --grumble 999',
  expect: 'hello world 999',
  exact: false,
  streaming: true
}).string()

/**
 * Time pretty printing
 *
 */
/* new TestStringResponse({
  command: 'test time1',
  expect: 'Today at',
  exact: false
}).string()
new TestStringResponse({
  command: 'test time2',
  expect: 'Today at',
  exact: false
}).string()
new TestStringResponse({
  command: 'test time3',
  expect: 'ms', // e.g. +102ms
  exact: false
}).string()
new TestStringResponse({
  command: 'test time3',
  expect: '+', // e.g. +102ms
  exact: false
}).string() */

describe(`experimental command ${process.env.MOCHA_RUN_TARGET || ''}`, function (this: Common.ISuite) {
  before(Common.before(this))
  after(Common.after(this))

  it('should execute an experimental command', () =>
    CLI.command('test string', this.app)
      .then(() => this.app.client.$(Selectors.EXPERIMENTAL_PROMPT_BLOCK_TAG))
      .then(_ => _.waitForExist())
      .catch(Common.oops(this, true)))
})
