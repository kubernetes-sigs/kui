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

import Debug from 'debug'
const debug = Debug('tutorial.wskflow')

/** millisecond interval between hover effects */
const stepInterval = 2500

/** terminate the hover effects after at most this many milliseconds */
const terminateAfter = 20000

/** also terminate if we iterate this many times around the nodes */
const maxIter = 5

/**
 * Does the given rect lie within the given bounds?
 *
 */
const inBounds = (rect, bounds) => {
  return (
    rect.left >= bounds.left && rect.right <= bounds.right && rect.top >= bounds.top && rect.bottom <= bounds.bottom
  )
}

/**
 * Simulate a hover on the given elements
 *
 */
const hoverOn = elements => {
  let currentTask
  let cleanupHover

  /** remember how to cancel ourselves; this will be the return value of `hoverOn` */
  let stop = false
  const cancel = () => {
    stop = true

    if (currentTask) {
      debug('wskflowCycle cancel')
      clearTimeout(currentTask)
    }

    if (cleanupHover) {
      debug('cleanup hover')
      cleanupHover()
    }
  }

  /** initiate the timer loop */
  currentTask = setTimeout(() => {
    /** highlight one node, and deal with dispatching the async for the next iter */
    const one = (idx, iter) => {
      if (stop) {
        return
      }

      const element = elements[idx]
      if (!element && iter < maxIter) {
        // we've reached the end of the list of elements to
        // highlight; start over!
        one(0, iter + 1)
      } else {
        const bounds = document.getElementById('wskflowSVG').getBoundingClientRect()
        const rect = element.getBoundingClientRect()

        if (inBounds(rect, bounds)) {
          // debug('wskflowCycle hoverOn', element, rect);

          // send a mouseover event to the element
          const event = new MouseEvent('mouseover', { view: window })
          element.classList.add('hover')
          element.dispatchEvent(event)

          // prepare a mouseout event; note how the mouseout
          // isn't part of the cancellable, because we
          // always want to mouseout, even if the overall
          // hoverOn sequence has been cancelled
          cleanupHover = () => {
            const event = new MouseEvent('mouseout', { view: window })
            element.classList.remove('hover')
            element.dispatchEvent(event)
          }
          setTimeout(cleanupHover, stepInterval)

          // the "next iter" is indeed part of the
          // cancellable, which is stored in the variable
          // `currentTask`
          currentTask = setTimeout(() => {
            if (!stop) {
              one(idx + 1, iter)
            }
          }, stepInterval)
        } else if (!stop) {
          debug('skipping', element)
          one(idx + 1, iter)
        }
      }
    }

    one(0, 0)
  }, 0)

  return cancel
}

/**
 * Cycle through the nodes and edges of the current wskflow,
 * simulating a hover effect on them, each in turn. A cancellable will
 * be registered with the given object.
 *
 */
export const wskflowCycle = obj => {
  debug('wskflowCycle')

  const actions = document.querySelectorAll('#wskflowSVG .node.wskflow-node-with-special-meaning rect')
  const edges = document.querySelectorAll('#wskflowSVG path.has-hover-effect')

  const all = []
  for (let idx = 0; idx < actions.length; idx++) {
    // actions seem to come from bottom to top
    all.push(actions[idx])
  }
  for (let idx = edges.length - 1; idx >= 0; idx--) {
    // edges seem to come from top to bottom
    all.push(edges[idx])
  }

  const cancel = hoverOn(all.reverse())
  setTimeout(cancel, terminateAfter)

  // register our cancellable with the given object
  obj.cancellables.push(cancel)
}
