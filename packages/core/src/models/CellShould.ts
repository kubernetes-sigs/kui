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

/**
 * Hints to improve visualization of table cells
 *
 */
const enum CellShould {
  HideWithSidecar = 'hide-with-sidecar',
  HideWhenNarrow = 'hide-with-narrow-window',
  ElideWhenNarrow = 'elide-with-narrow-window',
  BeGrayish = 'sub-text',
  BeHidden = 'hide',

  HaveGreenBadge = 'green-background',
  HaveYellowBadge = 'yellow-background',
  HaveRedBadge = 'red-background',
  HaveGrayBadge = 'gray-background'
}

function cellShouldHaveBadge2(hint: CellShould) {
  return (
    hint === CellShould.HaveGreenBadge ||
    hint === CellShould.HaveRedBadge ||
    hint === CellShould.HaveYellowBadge ||
    hint === CellShould.HaveGrayBadge
  )
}

/** Check whether the cell hints include a hint to display as badge */
export function cellShouldHaveBadge(hints: CellShould | CellShould[]): CellShould | void {
  if (!hints) {
  } else if (Array.isArray(hints)) {
    return hints.find(cellShouldHaveBadge2)
  } else if (cellShouldHaveBadge2(hints)) {
    return hints
  }
}

export default CellShould
