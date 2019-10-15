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

/** how many options to show at a time, i.e. before scrolling */
const nRowsInViewport = 4

/** list of related commands */
const all = [
  'summary',
  // 'timeline',
  'grid'
]
const allExcept = (cmd: string) => all.filter(_ => _ !== cmd)

interface Optional {
  name: string
  alias?: string
  docs?: string
  positional?: boolean
  defaultValue?: string | number
  entity?: string
  numeric?: boolean
  boolean?: boolean
  booleanOK?: boolean
  hidden?: boolean
  allowed?: (string | number)[]
}

/** optional arguments */
const optional: Optional[] = [
  {
    name: 'action|app',
    positional: true,
    docs: 'include only activity for the given action or composition',
    entity: 'action'
  },
  {
    name: '--success',
    boolean: true,
    docs: 'include only successful activations'
  },
  { name: '--failure', boolean: true, docs: 'include only failed activations' },
  {
    name: '--outliers',
    docs: 'include only outlier activations',
    allowed: ['min', 25, 50, 90, 95, 99, 'max'],
    defaultValue: 90
  },
  { name: '--since', hidden: true },
  { name: '--live', boolean: true, docs: 'Poll for updates' },
  { name: '--latency-bucket', hidden: true },
  { name: '--upto', hidden: true },
  { name: '--today', docs: 'show only activations from today' },
  { name: '--yesterday', docs: 'show only activations from yesterday' },
  {
    name: '--this',
    docs: 'time filter, e.g. --this week',
    allowed: ['week', 'month', 'year']
  },
  {
    name: '--last',
    docs: 'time filter, e.g. --last week',
    allowed: ['week', 'month', 'year']
  },
  {
    name: '--batches',
    numeric: true,
    docs: 'the number of 200-activation batches to fetch',
    allowed: [1, 2, '...', 32],
    defaultValue: 2
  }
]

/* the breadcrumb chain */
const parents = ['visualize']

const header = {
  summary: 'Visualize the statistical distribution of activation latencies',
  // timeline: 'Show activity over time',
  grid: 'Show a large number of recent activations in a grid view'
}

/**
 * Usage model for the editor plugin
 *
 */
export const toplevel = {
  title: 'Activation visualizations',
  header: 'These commands will help you visualize your activations',
  example: 'visualize <command>',
  commandPrefix: 'visualize',
  commandPrefixNotNeeded: true,
  available: [
    { command: 'summary', docs: header.summary },
    // { command: 'timeline', docs: header.timeline },
    { command: 'grid', docs: header.grid }
  ],
  related: ['wsk activation', 'composer session']
}

export const summary = {
  strict: 'summary',
  command: 'summary',
  nRowsInViewport,
  title: 'Summarize performance',
  header: `${header.summary}.`,
  example: 'summary [action|app]',
  optional,
  parents,
  related: allExcept('summary')
}

/* timeline: {
   strict: 'timeline',
   command: 'timeline',
   nRowsInViewport,
   title: 'Activity timeline',
   header: '${header.timeline}.',
   example: 'timeline [action|app]',
   optional: optional.concat([{ name: '--theme', docs: 'a color theme to use' }]),
   parents,
   related: allExcept('timeline')
   }, */

export const grid = {
  strict: 'grid',
  command: 'grid',
  nRowsInViewport,
  title: 'Activity grid',
  header: `${header.grid}.`,
  example: 'grid [action|app]',
  detailedExample: {
    command: 'grid --outliers max --success',
    docs: 'show only the worst offending successful activations'
  },
  optional: optional.concat([
    {
      name: '--timeline',
      booleanOK: true,
      alias: '-t',
      docs: 'Draw as a timeline'
    }
  ]),
  parents,
  related: allExcept('grid')
}
