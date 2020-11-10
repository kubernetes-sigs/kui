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

import { CLI, ReplExpect, SidecarExpect, Common, Selectors } from '@kui-shell/test'
import { waitForGreen, createNS, allocateNS, deleteNS } from '@kui-shell/plugin-kubectl/tests/lib/k8s/utils'

import { dirname } from 'path'
const ROOT = dirname(require.resolve('@kui-shell/plugin-kubectl/tests/package.json'))

const crashy: SidecarExpect.ExpectedTree[] = [
  {
    id: 'all',
    children: [
      {
        id: 'unlabeled',
        children: [
          {
            id: 'unlabeled---Pod',
            children: [
              {
                id: 'unlabeled---Pod---kui-crashy'
              }
            ]
          }
        ]
      }
    ]
  }
]

const bunch = [
  {
    id: 'all',
    children: [
      {
        id: 'travelapp',
        children: [
          {
            id: 'travelapp---Deployment',
            children: [
              {
                id: 'travelapp---Deployment---travelapp'
              }
            ]
          },
          {
            id: 'travelapp---HorizontalPodAutoscaler',
            children: [
              {
                id: 'travelapp---HorizontalPodAutoscaler---travelapp-hpa'
              }
            ]
          }
        ]
      },
      {
        id: 'unlabeled',
        children: [
          {
            id: 'unlabeled---Pod',
            children: [
              {
                id: 'unlabeled---Pod---eventgen'
              },
              {
                id: 'unlabeled---Pod---nginx'
              }
            ]
          }
        ]
      }
    ]
  }
]

const commands = ['kubectl']
if (process.env.NEEDS_OC) {
  commands.push('oc')
}

commands.forEach(command => {
  const ns: string = createNS()
  const inNamespace = `-n ${ns}`

  describe(`${command} get dashF ${process.env.MOCHA_RUN_TARGET || ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    allocateNS(this, ns)

    const doGet = (
      file: string,
      sourceTree: SidecarExpect.ExpectedTree[],
      deployedTree?: SidecarExpect.ExpectedTree[],
      apply?: boolean,
      waitForApply?: string
    ) => {
      it(`should get dashF ${deployedTree ? 'deployed' : 'undeployed'} file ${file} ${
        apply ? 'and hit apply' : ''
      }`, () =>
        CLI.command(`${command} get -f ${file} ${inNamespace}`, this.app)
          .then(ReplExpect.ok)
          .then(SidecarExpect.open)
          .then(SidecarExpect.mode('sources'))
          .then(SidecarExpect.tree(sourceTree))
          .then(async _ => {
            if (apply) {
              const buttonSelector = Selectors.SIDECAR_TOOLBAR_BUTTON(_.count, 'apply')
              await this.app.client.waitForVisible(buttonSelector)
              await this.app.client.click(buttonSelector)
              if (waitForApply) {
                const res = ReplExpect.blockAfter(_)
                const selector = await ReplExpect.okWithCustom({ selector: Selectors.BY_NAME(waitForApply) })(res)
                await waitForGreen(this.app, selector)
              }
            }

            if (deployedTree) {
              const modeSelector = Selectors.SIDECAR_MODE_BUTTON(_.count, 'deployed resources')
              await this.app.client.waitForVisible(modeSelector)
              await this.app.client.click(modeSelector)
              await SidecarExpect.mode('deployed resources')(_).then(SidecarExpect.tree(deployedTree))
            }

            return _
          })
          .catch(Common.oops(this, true)))
    }

    doGet(`${ROOT}/data/k8s/crashy.yaml`, crashy, undefined, true, 'kui-crashy')
    doGet(`${ROOT}/data/k8s/crashy.yaml`, crashy, crashy)
    doGet(`${ROOT}/data/k8s/bunch`, bunch, undefined, true)
    doGet(`${ROOT}/data/k8s/bunch`, bunch, bunch)

    deleteNS(this, ns)
  })
})
