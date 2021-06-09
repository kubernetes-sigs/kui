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

function paddingHorizontal(elt: Element) {
  const style = window.getComputedStyle(elt)
  return (
    parseInt(style.getPropertyValue('padding-left') || '0', 10) +
    parseInt(style.getPropertyValue('padding-right') || '0', 10)
  )
}

export default function getSize(this: HTMLElement): { width: number; height: number } {
  const enclosingRect = this.querySelector('.kui--scrollback-block-list-for-sizing').getBoundingClientRect()

  const selectorForWidthPad = '.repl-block .repl-output'
  const widthPadElement = this.querySelector(selectorForWidthPad)
  /* const heightPadElement = this */

  const selectorForContext = '.repl-block .repl-context'
  const contextElement = this.querySelector(selectorForContext)
  const { width: contextWidth } = contextElement ? contextElement.getBoundingClientRect() : { width: 0 }

  const width = enclosingRect.width - paddingHorizontal(widthPadElement) - contextWidth
  const height = enclosingRect.height // kui--scrollback-block-list-for-sizing will include any outer padding

  return { width, height }
}
