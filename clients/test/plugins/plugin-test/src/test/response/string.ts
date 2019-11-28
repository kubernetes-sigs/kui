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

/**
 * This file tests "test string" command that expects a simple `hello world`
 * string response
 *
 * See the command implementation in: plugin-test/src/lib/cmds/say-hello.ts
 *
 */

import { TestStringResponse } from '@kui-shell/test'

// string response with no arguments
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

// string response with pass-through of command line option
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

// HTMLElement response
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

// MixedResponse
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

// ansi pretty printing
new TestStringResponse({
  command: 'test ansi1',
  expect: 'hello world',
  exact: true
}).string()
new TestStringResponse({
  command: 'test ansi1',
  expect: 'hello world',
  exact: true
}).string()
new TestStringResponse({
  command: 'test ansi2',
  expect: 'xxxxxx',
  exact: false
}).string()
new TestStringResponse({
  command: 'test ansi2',
  expect: 'hello world',
  exact: false
}).string()
new TestStringResponse({
  command: 'test ansi3',
  expect: 'xxxxxx',
  exact: false
}).string()
new TestStringResponse({
  command: 'test ansi3',
  expect: 'hello world',
  exact: false
}).string()
new TestStringResponse({
  command: 'test ansi3',
  expect: 'yyyy',
  exact: false
}).string()

// time pretty printing
new TestStringResponse({
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
}).string()
