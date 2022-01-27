/*
 * Copyright 2022 The Kubernetes Authors
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

import { basename, dirname, join } from 'path'
import { encodeComponent } from '@kui-shell/core'
import { Common, CLI, ReplExpect, Selectors } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/notebooks/wizard.md')), '..')

const steps = [
  {
    name: 'Step1Title',
    description: 'Step1Description',
    body: 'Step1Body',
    codeBlocks: [{ index: 0, output: 'aaa' }]
  },
  {
    name: 'Step2Title',
    description: 'Step2Description',
    body: 'Step2Body',
    codeBlocks: [
      { index: 0, output: 'bbb' },
      { index: 1, output: 'ccc' }
    ]
  }
]

const IN1 = {
  input: join(ROOT, 'notebooks/wizard.md'),
  title: 'WizardTitle',
  description: 'WizardDescription',
  steps,
  expectedSplitCount: 1
}

// make sure we can display wizards in tabs with splits
const IN2 = {
  input: join(ROOT, 'tests/data/wizard-with-splits.md'),
  title: 'WizardTitleWithSplits',
  description: 'WizardDescriptionWithSplits',
  steps,
  expectedSplitCount: 2
}

// make sure we can display wizards in tabs with splits
const IN3 = {
  input: join(ROOT, 'tests/data/wizard-steps-in-topmatter.md'),
  title: 'Getting Started with Knative',
  description: 'WizardDescriptionInTopmatter',
  expectedSplitCount: 1,
  steps: [
    { name: 'Before you begin', body: 'Before you can get started', description: '', codeBlocks: [] },
    { name: 'Prepare local Kubernetes cluster', body: 'You can use', description: 'TestDescription2', codeBlocks: [] }
  ]
}
;[IN1, IN2, IN3].forEach(markdown => {
  describe(`wizards in markdown ${basename(markdown.input)} ${process.env.MOCHA_RUN_TARGET ||
    ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    it('should load markdown and show a wizard UI', async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
        await this.app.client.$(Selectors.Wizard.wizard).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    it(`should show wizard title ${markdown.title}`, () =>
      this.app.client
        .$(Selectors.Wizard.withTitle(markdown.title))
        .then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
        .catch(Common.oops(this, true)))

    it(`should show wizard description ${markdown.description}`, async () => {
      try {
        const elt = await this.app.client.$(Selectors.Wizard.description)
        await elt.waitForExist({ timeout: CLI.waitTimeout })
        await this.app.client.waitUntil(
          async () => {
            const actualText = await elt.getText()
            return actualText === markdown.description
          },
          { timeout: CLI.waitTimeout }
        )
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })

    it(`should have ${markdown.expectedSplitCount} splits`, () => ReplExpect.splitCount(markdown.expectedSplitCount))

    markdown.steps.forEach((step, idx) => {
      if (idx === 0) {
        it(`should show wizard body ${step.body}`, async () => {
          try {
            const elt = await this.app.client.$(Selectors.Wizard.body)
            await elt.waitForExist({ timeout: CLI.waitTimeout })
            await this.app.client.waitUntil(
              async () => {
                const actualText = await elt.getText()
                return actualText.includes(step.body)
              },
              { timeout: CLI.waitTimeout }
            )
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      }

      it(`should show nav item ${idx} title ${step.name}`, async () => {
        try {
          const elt = await this.app.client.$(Selectors.Wizard.navItemTitle(idx))
          await elt.waitForExist({ timeout: CLI.waitTimeout })
          await this.app.client.waitUntil(
            async () => {
              const actualText = await elt.getText()
              return actualText === step.name
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      it(`should show nav item ${idx} description ${step.description}`, async () => {
        try {
          const elt = await this.app.client.$(Selectors.Wizard.navItemDescription(idx))
          await elt.waitForExist({ timeout: CLI.waitTimeout })
          await this.app.client.waitUntil(
            async () => {
              const actualText = await elt.getText()
              return actualText === step.description
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      step.codeBlocks.forEach((codeBlock, codeBlockIdx) => {
        it(`should show nav item ${idx} progress step ${codeBlockIdx}`, async () => {
          try {
            const elt = await this.app.client.$(Selectors.Wizard.navItemProgressStep(idx, codeBlockIdx))
            await elt.waitForExist({ timeout: CLI.waitTimeout })
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })
      })
    })
  })
})
