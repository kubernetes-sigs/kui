/*
 * Copyright 2017 The Kubernetes Authors
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

const { default: compile } = require('@kui-shell/core/dist/plugins/assembler')
const { default: mimicDom } = require('@kui-shell/core/dist/util/mimic-dom')

mimicDom()

/** dump codecov? */
function codecov() {
  console.log('Writing code coverage data for prescan')
  const { join, relative } = require('path')

  const codeCoverageNyc = () =>
    process.env.TRAVIS_BUILD_DIR
      ? join(process.env.TRAVIS_BUILD_DIR, 'node_modules/nyc')
      : join(process.env.TEST_SUITE_ROOT, '../nyc')
  const codeCoverageRoot = () => relative(process.env.TEST_ROOT, join(process.env.TEST_SUITE_ROOT, 'core'))
  const codeCoverageTempDirectory = () =>
    process.env.TRAVIS_BUILD_DIR
      ? join(process.env.TRAVIS_BUILD_DIR, 'packages/test/.nyc_output')
      : join(process.env.TEST_ROOT, '.nyc_output')

  process.chdir(require('os').tmpdir())

  // Create the nyc instance
  const tempDirectory = codeCoverageTempDirectory()
  const NYC = require(codeCoverageNyc())
  const nyc = new NYC({ tempDirectory, cwd: codeCoverageRoot() })

  // in case we are the first to the line
  nyc.createTempDirectory()

  // Notes: the nyc impl of this removes all of our coverage data due to its
  // this.exclude.shouldInstrument filter (on our about line 343 of its index.js)
  // nyc.writeCoverageFile()

  // see https://github.com/IBM/kui/issues/3217 for some discussion
  Object.keys(__coverage__).forEach(function (absFile) {
    const map = JSON.parse(require('fs').readFileSync(`${absFile}.map`))
    nyc.sourceMaps._sourceMapCache.registerMap(absFile, map)
  }, nyc)

  // so... instead we take care of writeCoverageFile ourselves
  const coverage = nyc.sourceMaps.remapCoverage(__coverage__)
  const coverageFilename = require('path').resolve(tempDirectory, nyc.processInfo.uuid + '.json')
  require('fs').writeFileSync(coverageFilename, JSON.stringify(coverage), 'utf-8')
}

function codecovIfDesired() {
  if (process.env.NYC !== undefined && process.env.NYC_INSTRUMENTATION_DONE !== undefined) {
    return codecov()
  }
}

if (process.argv[2] === 'cleanup') {
  // nothing to do
} else {
  compile()
    .then(codecovIfDesired)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
