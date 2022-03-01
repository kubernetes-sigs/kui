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

import { basename } from 'path'
import { Common, CLI } from '@kui-shell/test'
import { encodeComponent } from '@kui-shell/core'

import inputs from './inputs'
import { Tree } from './Input'

inputs.forEach(markdown => {
  describe(`markdown code block dependence tree ${basename(markdown.input)} ${process.env.MOCHA_RUN_TARGET ||
    ''}`, function(this: Common.ISuite) {
    before(Common.before(this))
    after(Common.after(this))

    const timeout = { timeout: CLI.waitTimeout }

    const checkNode = async (tree: Tree, containerSelector: string) => {
      console.error('5', tree.name)
      const nodeSelector = `${containerSelector} .pf-c-tree-view__node`
      console.error('6', tree.name, nodeSelector)
      const nodeElement = await this.app.client.$(nodeSelector)
      console.error('7', tree.name)
      await nodeElement.waitForExist(timeout)
      console.error('8', tree.name)

      const nameSelector = '.pf-c-tree-view__node-text'
      console.error('9', tree.name)
      const nameElement = await nodeElement.$(nameSelector)
      console.error('10', tree.name)
      await nameElement.waitForExist(timeout)
      console.error('11', tree.name)

      await this.app.client.waitUntil(async () => {
        const actualText = await nameElement.getText()
        if (actualText !== tree.name) {
          console.error('12a', tree.name, actualText)
          console.error('12b', containerSelector)
        }
        return actualText === tree.name
      }, timeout)
      console.error('13', tree.name)
    }

    const scanNode = async (tree: Tree, containerSelector: string) => {
      await checkNode(tree, containerSelector)

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await scanNodes(tree.children, containerSelector)
    }

    const scanNodes = async (children: Tree[], containerSelector: string) => {
      if (children) {
        await Promise.all(
          children.map(async (subtree, idx) => {
            const listItemSelector = `${containerSelector} > ul > li:nth-child(${idx + 1})`
            const listItemElement = await this.app.client.$(listItemSelector)
            await listItemElement.waitForExist(timeout)

            const isExpanded = await listItemElement.getAttribute('aria-expanded')
            if (!isExpanded) {
              await listItemElement.scrollIntoView()
              await listItemElement.click()
            }

            await scanNode(subtree, listItemSelector)

            if (!isExpanded) {
              await listItemElement.scrollIntoView()
              await listItemElement.click()
            }
          })
        )
      }
    }

    it(`should load the markdown and show dependence tree with root=${markdown.tree[0].name}`, async () => {
      try {
        await CLI.command(`commentary -f ${encodeComponent(markdown.input)}`, this.app)

        console.error('1')
        const treeSelector = '.kui--dependence-tree'
        console.error('2')
        const treeElement = await this.app.client.$(treeSelector)
        console.error('3')
        await treeElement.waitForExist(timeout)
        console.error('4')

        await scanNodes(markdown.tree, treeSelector)
      } catch (err) {
        await Common.oops(this, true)(err)
      }
    })
  })
})
