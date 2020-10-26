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

import * as fs from 'fs'
import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

const flip = 'flip'

const removeWhitespace = txt => txt.replace(/\s/g, '')

Common.localDescribe('blackbox actions from a shell script', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  const flipSourcePath = `${ROOT}/data/openwhisk/flip.sh`
  const expectedFlipSource = removeWhitespace(fs.readFileSync(flipSourcePath).toString())

  it('should create a blackbox action', () =>
    CLI.command(`wsk action create --native ${flip} ${ROOT}/data/openwhisk/flip.sh`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(removeWhitespace)
      .then(txt => assert.strictEqual(txt, expectedFlipSource))
      .catch(Common.oops(this)))

  const N1 = 3
  it(`should invoke the native action with implicit entity`, () =>
    CLI.command(`wsk action invoke -p n ${N1}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(
        Util.expectYAMLSubset({
          trials: N1
        })
      )
      .catch(Common.oops(this)))

  const N2 = 4
  it(`should invoke (again) the native action with implicit entity`, () =>
    CLI.command(`wsk action invoke -p n ${N2}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(
        Util.expectYAMLSubset({
          trials: N2
        })
      )
      .catch(Common.oops(this)))

  it('should update a blackbox action variant 1', () =>
    CLI.command(`wsk action update --native ${flip} ${ROOT}/data/openwhisk/flip.sh`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(removeWhitespace)
      .then(txt => assert.strictEqual(txt, expectedFlipSource))
      .catch(Common.oops(this)))

  it('should update a blackbox action variant 2', () =>
    CLI.command(`wsk action update ${flip} --native ${ROOT}/data/openwhisk/flip.sh`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(removeWhitespace)
      .then(txt => assert.strictEqual(txt, expectedFlipSource))
      .catch(Common.oops(this)))

  it('should update a blackbox action variant 3', () =>
    CLI.command(`wsk action update ${flip} ${ROOT}/data/openwhisk/flip.sh --native`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(removeWhitespace)
      .then(txt => assert.strictEqual(txt, expectedFlipSource))
      .catch(Common.oops(this)))

  const N3 = 5
  it(`should invoke (again) the native action, now with explicit`, () =>
    CLI.command(`wsk action invoke ${flip} -p n ${N3}`, this.app)
      .then(ReplExpect.ok)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing(flip))
      .then(Util.getValueFromMonaco)
      .then(
        Util.expectYAMLSubset({
          trials: N3
        })
      )
      .catch(Common.oops(this)))
})
