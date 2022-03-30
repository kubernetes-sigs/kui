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

import { Node } from 'hast'
import { visit } from 'unist-util-visit'
import { Capabilities } from '@kui-shell/core'

import { isTabGroup } from '..'
import { ChoiceState } from '../..'

import arch from './arch'
import platform from './platform'
import homebrew from './homebrew'

const providers = [arch, platform, homebrew]

/**
 * Scan tab groups to see if we can squash down the choice given our a
 * priori knowledge, e.g. about what platform we are on.
 *
 */
export default function identifyRecognizableTabGroups(tree: Node, choices: ChoiceState) {
  if (!Capabilities.inElectron()) {
    // I don't think this is a meaningful thing to do whilst running
    // in browser? TODO: maybe we should allow the providers a say?
    return
  }

  providers.forEach(_ => _.populateChoice(choices))

  visit(tree, 'element', node => {
    if (isTabGroup(node)) {
      for (let idx = 0; idx < providers.length; idx++) {
        if (providers[idx].checkAndSet(node)) {
          // Assumption: a given tab group can only have one match,
          // e.g. it is either a platform choice (macos/linux/windows)
          // or an download method choice (homebrew, curl)
          break
        }
      }
    }
  })

  return tree
}
