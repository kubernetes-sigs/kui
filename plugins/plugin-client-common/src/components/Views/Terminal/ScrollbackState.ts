/*
 * Copyright 2021 The Kubernetes Authors
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

import { Tab as KuiTab, NewSplitRequest } from '@kui-shell/core'

import Block from './Block'
import SplitPosition from './SplitPosition'
import { BlockModel } from './Block/BlockModel'

export type Cleaner = () => void

export type ScrollbackOptions = NewSplitRequest['options']

type ScrollbackState = ScrollbackOptions & {
  uuid: string
  blocks: BlockModel[]
  forceMiniSplit: boolean
  nSectionBreak: number

  /** Display as strip along the bottom */
  position: SplitPosition
  willToggleBottomStripMode(): void

  /** tab facade */
  facade?: KuiTab

  /** grab a ref to the active block, to help us maintain focus */
  _activeBlock?: Block

  /** Has the user clicked to focus on a block? */
  focusedBlockIdx?: number

  /** cleanup routines for this split */
  cleaners: Cleaner[]

  /**
   * Block index (into this.blocks) to show in a MiniSplit. Must be a
   * negative number, interpreted as an index from the end.
   */
  showThisIdxInMiniSplit: number

  /** Remove this scrollback (memoized handler) */
  remove: () => void

  /** Clear the current list of blocks (memoized handler) */
  clear: () => void

  /** Invert colors (memoized handler) */
  invert: () => void

  /** Other memoized handlers (TODO: docs) */
  onClick: (evt: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onMouseDown: (evt: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onFocus: (evt: React.FocusEvent) => void
  onOutputRender: () => void
  navigateTo: (dir: 'first' | 'last' | 'previous' | 'next') => void
  setActiveBlock: (c: Block) => void
  willFocusBlock: (evt: React.SyntheticEvent) => void
  willRemoveBlock: (evt: React.SyntheticEvent, idx?: number) => void
  willUpdateCommand: (idx: number, command: string) => void
  willInsertSection: (idx: number) => void
  willLinkifyBlock: (idx: number) => void
  willUpdateExecutable: () => void
  tabRefFor: (ref: HTMLElement) => void
}

export default ScrollbackState
