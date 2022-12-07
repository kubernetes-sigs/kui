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
import { Common, CLI, ReplExpect, Selectors, Util } from '@kui-shell/test'

const ROOT = join(dirname(require.resolve('@kui-shell/plugin-client-common/notebooks/wizard.md')), '..')

interface Step {
  name: string
  description: string
  body: string | ((command: string) => string)
  codeBlocks: { index: number; output: string }[]
}

interface Input {
  input: string
  title: string
  description: string
  expectedSplitCount: number
  expectedCodeBlockTasks: number
  steps: Step[]
  notIn?: (command: string) => boolean
}

const steps: Step[] = [
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
      { index: 1, output: 'bbb' },
      { index: 2, output: 'ccc' }
    ]
  }
]

const IN1: Input = {
  input: join(ROOT, 'notebooks/wizard.md'),
  title: 'WizardTitle',
  description: 'WizardDescription',
  steps,
  expectedSplitCount: 1,
  expectedCodeBlockTasks: 3
}

// make sure we can display wizards in tabs with splits
const IN2: Input = {
  input: join(ROOT, 'tests/data/wizard-with-splits.md'),
  title: 'WizardTitleWithSplits',
  description: 'WizardDescriptionWithSplits',
  steps,
  expectedSplitCount: 2,
  expectedCodeBlockTasks: IN1.expectedCodeBlockTasks
}

// make sure we can display wizards in tabs with splits
const IN3: Input = {
  input: join(ROOT, 'tests/data/wizard-steps-in-topmatter.md'),
  title: 'Getting Started with Knative',
  description: 'WizardDescriptionInTopmatter',
  expectedSplitCount: 1,
  expectedCodeBlockTasks: 20,
  steps: [
    { name: 'TestRewritingOfStepName', body: 'provides a quick and easy interface', description: '', codeBlocks: [] },
    {
      name: 'Install the Knative quickstart plugin',
      body: 'To get started, install the Knative',
      description: 'TestDescription2',
      codeBlocks: []
    },
    {
      name: 'Run the Knative quickstart plugin',
      body: 'plugin completes the following functions',
      description: 'This will quickly set up Knative against kind or minikube',
      codeBlocks: []
    },
    { name: 'Next steps', body: "Now you've installed Knative", description: '', codeBlocks: [] }
  ],

  // the guide does not yet show non-code block steps
  // i don't think we'll ever want this?
  notIn: (command: string) => command === 'guide'
}

// sequential execution of code blocks
const IN4: Input = {
  input: join(ROOT, 'tests/data/wizard-steps-in-topmatter2.md'),
  title: 'WizardTitle',
  description: 'WizardDescription',
  expectedSplitCount: 1,
  expectedCodeBlockTasks: 3,
  steps: [
    { name: 'AAA', body: 'AAAContent', description: '', codeBlocks: [{ index: 0, output: '111' }] },
    { name: 'BBB', body: 'BBBContent', description: '', codeBlocks: [{ index: 1, output: '222' }] },
    { name: 'CCC', body: 'CCCContent', description: '', codeBlocks: [{ index: 2, output: '333' }] }
  ]
}

const aaaBody = (command: string) => (command === 'guide' ? 'Tab11' : 'AAAContent')

// nested choice
const IN5: Input = {
  input: join(ROOT, 'tests/data/nested-choice1.md'),
  title: 'WizardTitle',
  description: 'WizardDescription',
  expectedSplitCount: 1,
  expectedCodeBlockTasks: 2,
  steps: [{ name: 'AAA', body: aaaBody, description: '', codeBlocks: [{ index: 0, output: 'XXX' }] }]
}

// nested choice
const IN6: Input = {
  input: join(ROOT, 'tests/data/nested-choice2.md'),
  title: 'WizardTitle',
  description: 'WizardDescription',
  expectedSplitCount: 1,
  expectedCodeBlockTasks: 3,
  steps: [
    {
      name: 'AAA',
      body: aaaBody,
      description: '',
      codeBlocks: [
        { index: 0, output: 'XXX1' },
        { index: 1, output: 'XXX2' }
      ]
    }
  ]
}
;[IN1, IN2, IN3, IN4, IN5, IN6].forEach(markdown => {
  ;['guide', 'commentary -f'].forEach(command => {
    if (markdown.notIn && markdown.notIn(command)) {
      return
    }

    describe(`wizards in markdown command="${command}" input="${basename(markdown.input)}" ${
      process.env.MOCHA_RUN_TARGET || ''
    }`, function (this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))
      Util.closeAllExceptFirstTab.bind(this)()

      it('should load markdown and show a wizard UI', async () => {
        try {
          await CLI.command(`${command} ${encodeComponent(markdown.input)}`, this.app)
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
              return actualText.includes(markdown.description)
            },
            { timeout: CLI.waitTimeout }
          )
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      if (command !== 'guide') {
        it(`should show "n of ${markdown.expectedCodeBlockTasks}" in progress bar`, () =>
          this.app.client.waitUntil(async () => {
            const actualMeasureText = await this.app.client.$(Selectors.Wizard.progressMeasure).then(_ => _.getText())
            const match = actualMeasureText.match(/of (\d+)/)

            return match && parseInt(match[1], 10) === markdown.expectedCodeBlockTasks
          }))

        it(`should have ${markdown.expectedSplitCount} splits`, () =>
          ReplExpect.splitCount(markdown.expectedSplitCount))
      }

      markdown.steps.forEach((step, idx) => {
        if (idx === 0) {
          const body = typeof step.body === 'string' ? step.body : step.body(command)

          it(`should show wizard body ${body}`, async () => {
            try {
              const elt = await this.app.client.$(Selectors.Wizard.body)
              await elt.waitForExist({ timeout: CLI.waitTimeout })
              await this.app.client.waitUntil(
                async () => {
                  const actualText = await elt.getText()
                  return actualText.includes(body)
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

        if (step.description) {
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
        }

        if (command !== 'guide') {
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
        }
      })
    })

    describe(`sequential execution of code blocks in wizards in markdown ${basename(markdown.input)} ${
      process.env.MOCHA_RUN_TARGET || ''
    }`, function (this: Common.ISuite) {
      before(Common.before(this))
      after(Common.after(this))
      Util.closeAllExceptFirstTab.bind(this)()

      it('should load markdown and show a wizard UI', async () => {
        try {
          await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)
          await this.app.client.$(Selectors.Wizard.wizard).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
        } catch (err) {
          await Common.oops(this, true)(err)
        }
      })

      const stepsWithCodeBlocks = markdown.steps
        .map((step, idx) => ({ step, idx }))
        .filter(_ => Array.isArray(_.step.codeBlocks) && _.step.codeBlocks.length > 0)

      if (stepsWithCodeBlocks.length > 1) {
        it('should show a play button for the first code blocks in the first step (with code blocks)', async () => {
          try {
            const firstBlockInFirstStep = stepsWithCodeBlocks[0].step.codeBlocks[0]
            const codeBlock = await this.app.client.$(Selectors.Markdown.codeBlock(firstBlockInFirstStep.index))
            await codeBlock.waitForExist({ timeout: CLI.waitTimeout })
            await codeBlock.$(Selectors.Markdown.runButton).then(_ => _.waitForExist({ timeout: CLI.waitTimeout }))
          } catch (err) {
            await Common.oops(this, true)(err)
          }
        })

        stepsWithCodeBlocks.slice(1).forEach(({ step, idx }) => {
          it(`should switch to step ${idx}`, async () => {
            try {
              const button = await this.app.client.$(Selectors.Wizard.navItemSwitchToButton(idx))

              await this.app.client.waitUntil(async () => {
                return !(await button.getAttribute('class')).includes(Selectors.Wizard.isCurrentStep)
              })

              await button.waitForExist({ timeout: CLI.waitTimeout })
              await button.click()

              await this.app.client.waitUntil(async () => {
                return (await button.getAttribute('class')).includes(Selectors.Wizard.isCurrentStep)
              })
            } catch (err) {
              await Common.oops(this, true)(err)
            }
          })

          step.codeBlocks.forEach(block => {
            it(`should *not* show a play button for code block ${block.index} in step ${idx}`, async () => {
              try {
                const codeBlock = await this.app.client.$(Selectors.Markdown.codeBlock(block.index))
                await codeBlock.waitForExist({ timeout: CLI.waitTimeout })
                await codeBlock
                  .$(Selectors.Markdown.runButton)
                  .then(_ => _.waitForDisplayed({ reverse: true, timeout: CLI.waitTimeout }))
              } catch (err) {
                await Common.oops(this, true)(err)
              }
            })
          })
        })
      }
    })
  })
})
