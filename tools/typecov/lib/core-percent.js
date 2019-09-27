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

/** our filename filter */
const CORE = /packages\/core\//

/** parse the typecov model */
const typecov = require(process.argv[2])

/** tally up the stats */
const incr = (sum, stats) => {
  if (!sum) {
    return Object.assign({}, stats)
  } else {
    sum.knownTypes += stats.knownTypes
    sum.totalTypes += stats.totalTypes
    return sum
  }
}

/** main logic starts here */
const stats = typecov.breakdowns.identifiers.files
  .filter(_ => CORE.test(_.filename))
  .map(_ => _.stats)
  .reduce(incr, undefined)

stats.percentage = stats.totalTypes === 0 ? 100 : (100 * stats.knownTypes) / stats.totalTypes

console.log(JSON.stringify(stats, undefined, 2))
