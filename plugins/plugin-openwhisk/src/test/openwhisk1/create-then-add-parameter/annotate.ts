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

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import * as assert from 'assert'

import { Common, CLI, ReplExpect, SidecarExpect, Selectors, Util } from '@kui-shell/test'

import * as openwhisk from '@kui-shell/plugin-openwhisk/tests/lib/openwhisk/openwhisk'

import { dirname } from 'path'

const { localDescribe } = Common
const ROOT = dirname(require.resolve('@kui-shell/plugin-openwhisk/tests/package.json'))

// TODO: webpack test
localDescribe('Modify annotations', function(this: Common.ISuite) {
  before(openwhisk.before(this))
  after(Common.after(this))

  // create an action, using the implicit entity type
  it('should create an action', () =>
    CLI.command(`wsk action create foo ${ROOT}/data/openwhisk/foo.js`, this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo')))

  it('should switch to annotations mode', () =>
    CLI.command('wsk action annotations', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ exec: 'nodejs:6' })))

  it('should add a parameter with explicit action name', () =>
    CLI.command('wsk action annotate x=1 in foo', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: 1 })))

  it('should add a parameter with implicit action name', () =>
    CLI.command('wsk action annotate y=1', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: 1, y: 1 })))

  it('should update a parameter value with implicit action name', () =>
    CLI.command('wsk action annotate x=2', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: 2, y: 1 })))

  it('should update an inner structure parameter with implicit action name', () =>
    CLI.command('wsk action annotate z={}', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: 2, y: 1, z: {} })))

  it('should update an inner-inner structure parameter with implicit action name', () =>
    CLI.command('wsk action annotate z.z=true', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: 2, y: 1, z: { z: true } })))

  it('should update a parameter to false, with implicit action name', () =>
    CLI.command('wsk action annotate x=false', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: false, y: 1, z: { z: true } })))

  it('should update a parameter with spaces', () =>
    CLI.command('wsk action annotate humble pie="rumble tummy"', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          'humble pie': 'rumble tummy',
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should update an nested parameter with spaces', () =>
    CLI.command('wsk action annotate z.humble pie="rumble tummy"', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          'humble pie': 'rumble tummy',
          x: false,
          y: 1,
          z: { z: true, 'humble pie': 'rumble tummy' }
        })
      ))

  it('should remove a nested parameter with spaces', () =>
    CLI.command('wsk action deannotate z.humble pie', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          'humble pie': 'rumble tummy',
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should remove a top-level parameter with spaces', () =>
    CLI.command('wsk action deannotate humble pie', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: false, y: 1, z: { z: true } })))

  it('should add a structure', () =>
    CLI.command('wsk action annotate sss={"phone home": 345}', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          sss: { 'phone home': 345 },
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should remove that structure', () =>
    CLI.command('wsk action deannotate sss', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ x: false, y: 1, z: { z: true } })))

  it('should add with a pathy key', () =>
    CLI.command('wsk action annotate m.n={"phone home": 345}', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          m: { n: { 'phone home': 345 } },
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should remove with a pathy key', () =>
    CLI.command('wsk action deannotate m.n', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ m: {}, x: false, y: 1, z: { z: true } })))

  it('should push to a new array', () =>
    CLI.command('wsk action apush 3 to a', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ a: [3], m: {}, x: false, y: 1, z: { z: true } })))

  it('should push to an existing array', () =>
    CLI.command('wsk action apush 4 to a', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(Util.expectSubset({ a: [3, 4], m: {}, x: false, y: 1, z: { z: true } })))

  it('should push to a new pathy array', () =>
    CLI.command('wsk action apush 5 to m.n', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          a: [3, 4],
          m: { n: [5] },
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should push to an existing pathy array', () =>
    CLI.command('wsk action apush 6 to m.n', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          a: [3, 4],
          m: { n: [5, 6] },
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should push to a struct to an existing pathy array', () =>
    CLI.command('wsk action apush {"y": 7 } to m.n', this.app) // <-- some spaces in the value, for good measure
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(
        Util.expectSubset({
          a: [3, 4],
          m: { n: [5, 6, { y: 7 }] },
          x: false,
          y: 1,
          z: { z: true }
        })
      ))

  it('should switch back to code mode', () =>
    CLI.command('wsk action code', this.app)
      .then(ReplExpect.justOK)
      .then(SidecarExpect.open)
      .then(SidecarExpect.showing('foo'))
      .then(app => app.client.getText(`${Selectors.SIDECAR_CONTENT} .action-source`))
      .then(text =>
        assert.strictEqual(
          text.replace(/\s+/g, ''),
          "//eslint-disable-next-line@typescript-eslint/no-unused-varsfunctionmain(params){return{name:'Step1'+params.name}}"
        )
      ))
})
