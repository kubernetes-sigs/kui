/*
 * Copyright 2017 IBM Corporation
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

/** sort by action name */
export const nameSorter = {
  id: 'name',
  field: group => group.path,
  compare: (a, b) => a.localeCompare(b),
  extraCss: 'cell-label'
}

/** sort by string field */
export const stringSorter = id => ({
  id,
  field: group => group[id],
  compare: (a, b) => a.localeCompare(b),
  extraCss: `cell-${id}`
})

/** sort by the semver field */
export const versionSorter = stringSorter('version') // note how, in grouping.js, the SemVer class supports a string-compatible localeCompare method

/** sort by an element of statistical data */
export const statDataSorter = (n, field = 'n') => ({
  id: n,
  field: group => group.statData[field][n],
  compare: (a, b) => b - a,
  extraCss: 'cell-numeric'
})

/** generic sorter for numerical attributes */
export const numericalSorter = (id, sortDir = +1) => ({
  id,
  field: group => group[id],
  compare: (a, b) => sortDir * (b - a),
  extraCss: 'cell-numeric'
})

/** sort by activation duration */
export const durationSorter = numericalSorter('duration')

/** sort by activation start time */
export const startTimeSorter = numericalSorter('start', -1) // sort from earliest to latest

/** sort by group count */
export const countSorter = numericalSorter('count')

/** sort by numerical groupKey */
export const numericalGroupKeySorter = numericalSorter('groupKey')

/** the default sorter */
export const defaultSorter = statDataSorter(90) // sort by 90th percentile of duration by default

/**
 * Create a sort function
 *
 */
const sortFn = (sorter, sortDir) => (a, b) => {
  const f1 = sorter.field(a)
  const f2 = sorter.field(b)
  return sortDir * sorter.compare(f1, f2)
}

/**
 * Sort the given group data using the given sorter
 *
 */
export const sort = (groups, sorter, sortDir) => {
  // sort the rows
  groups.sort(sortFn(sorter, sortDir))
}

/**
 * Secondary sort, i.e. sort the activations within each group
 *
 */
export const sortActivations = (groups, sorter, sortDir) => {
  const comparator = sortFn(sorter, sortDir)

  groups.forEach(group => {
    ;(group.successes || group.activations).sort(comparator)
  })
}
