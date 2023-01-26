/*
 * Copyright 2020 The Kubernetes Authors
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

import type { CommandCompleteEvent } from '@kui-shell/core'
import { isWatchable } from '@kui-shell/core/mdist/api/Watch'

import { FinishedBlock, isAnnouncement, isCancelled, isEmpty, isOk, isOops } from './Block/BlockModel'

export function snapshot(block: FinishedBlock): FinishedBlock {
  if (!isAnnouncement(block) && (isOops(block) || isOk(block))) {
    const execOptions = Object.assign(
      {},
      block.completeEvent.execOptions,
      { block: undefined },
      { tab: block.completeEvent.execOptions.tab ? block.completeEvent.execOptions.tab.uuid : undefined }
    )
    const evaluatorOptions = Object.assign({}, block.completeEvent.evaluatorOptions, {
      usage: undefined,
      flags: undefined
    })

    /**
     * We excluded watch for now since a `Watchable` instance is not serializable
     * see issue: https://github.com/IBM/kui/issues/5399
     * and issue: https://github.com/IBM/kui/issues/5452
     *
     */
    const excludeWatchable = (response: CommandCompleteEvent['response']) => {
      if (response && isWatchable(response)) {
        return Object.assign({}, response, { watch: undefined })
      } else {
        return response
      }
    }

    const tab = block.startEvent.tab
      ? block.startEvent.tab.uuid
      : block.completeEvent.tab
      ? block.completeEvent.tab.uuid
      : undefined
    const startEvent = Object.assign({}, block.startEvent, { tab })

    const completeEvent = Object.assign(
      {},
      block.completeEvent,
      { execOptions, evaluatorOptions },
      { tab },
      { response: excludeWatchable(block.completeEvent.response) }
    )

    return Object.assign({}, block, {
      isReplay: true,
      response: excludeWatchable(block.response),
      startEvent,
      completeEvent
    })
  } else if (isEmpty(block)) {
    const execOptions = Object.assign(
      {},
      block.completeEvent.execOptions,
      { block: undefined },
      {
        tab:
          block.completeEvent.execOptions && block.completeEvent.execOptions.tab
            ? block.completeEvent.execOptions.tab.uuid
            : undefined
      }
    )

    const evaluatorOptions = Object.assign({}, block.completeEvent.evaluatorOptions, {
      usage: undefined,
      flags: undefined
    })

    const tab = block.completeEvent.tab ? block.completeEvent.tab.uuid : undefined

    const completeEvent = Object.assign({}, block.completeEvent, { execOptions, evaluatorOptions }, { tab })

    return Object.assign(block, {
      isReplay: true,
      completeEvent
    })
  } else if (isCancelled(block)) {
    return Object.assign(block, { isReplay: true })
  }
}
