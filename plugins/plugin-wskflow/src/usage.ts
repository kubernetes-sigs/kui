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

// const sampleInputs = require('../../composer/lib/sample-inputs')

/** a srcFile.js input */
const srcJs = {
  name: 'src.js',
  docs: 'generate a preview of a Composer source file',
  file: true
}

/** a srcFile.json input */
const srcJson = {
  name: 'src.json',
  docs: 'ibid, but for a pre-compiled composition',
  file: true
}

/**
 * Usage string for app preview
 *
 */
export const preview = command => ({
  command,
  strict: command,
  title: 'preview composition',
  header: 'Visualize a composition, without deploying it.',
  example: `${command} <sourceFile>`,
  detailedExample: {
    command: `${command} @demos/hello.js`,
    docs: 'preview a built-in hello world demo'
  },
  oneof: [srcJs, srcJson],
  optional: [
    { name: '--ast', boolean: true, docs: 'validate and show raw AST' },
    {
      name: '--functions',
      alias: '-f',
      boolean: true,
      docs: 'show all functions directly in the view'
    },
    {
      name: '--env',
      alias: '-e',
      docs: 'Assign a value to an environment variable',
      narg: 2
    },
    {
      name: '--show-code',
      alias: '-c',
      boolean: true,
      docs: 'Show code and preview side-by-side'
    }
  ],
  // sampleInputs: sampleInputs(command),
  parents: ['composer', { command: 'composer app' }],
  related: ['app create']
})

/**
 * Usage string for app source
 *
 */
export const source = command => ({
  command,
  strict: command,
  title: 'Composition source',
  header: 'Show the source code of a composition, without deploying it.',
  example: `${command} <sourceFile>`,
  detailedExample: {
    command: `${command} @demos/hello.js`,
    docs: 'show the source of a built-in hello world demo'
  },
  required: [srcJs],
  parents: ['composer', { command: 'composer app' }],
  related: ['preview']
})
