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

import { PropsWithChildren, ReactElement, RefObject } from 'react'

/**
 * A Tooltip can be one of:
 *
 * 1) `ByReference`: have children be the content of the tooltip,
 * and use a `reference` property to point to the item that is being tooltipped.
 *  <Tooltip reference={thatOtherElement}>Hello this is the tooltip string</Tooltip>
 *
 * 2) `ByChildrenWithMarkdown`: have children be the item that is being tooltipped,
 * and a `markdown` property that is the content of the tooltip, to be interpreted
 * as markdown source.
 *  <Tooltip markdown="# heading\n\netc."><Button>Ok</Button></Tooltip>
 *
 * 3) `ByChildrenWithContent`: ibid, but instead a `content` property that can be
 * either a string or a ReactElement.
 *  <Tooltip content={<h1>heading</h1><div>etc</div>}><Button>Ok</Button></Tooltip>
 *
 */

type CommonProps = {
  /** DOM class */
  className?: string

  /** Default 200ms */
  entryDelay?: number

  /** If true, tries to keep the tooltip in view by flipping it if necessary */
  enableFlip?: boolean

  /** Orienation of the tooltip relative to the tooltiped element */
  position?:
    | 'auto'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end'
    | 'bottom-start'
    | 'bottom-end'
}

type ByChildren = ByChildrenWithMarkdown | ByChildrenWithContent

type ByChildrenWithMarkdown = PropsWithChildren<{
  markdown: string
}> &
  CommonProps

type ByChildrenWithContent = PropsWithChildren<{
  content: string | ReactElement
}> &
  CommonProps

/** Reference to attached item; children is tooltip content */
type ByReference = PropsWithChildren<{
  reference: RefObject<any>
}> &
  CommonProps

type Props = ByReference | ByChildren

export function isMarkdownProps(props: Props): props is ByChildrenWithMarkdown {
  return typeof (props as ByChildrenWithMarkdown).markdown === 'string'
}

export function isReferenceProps(props: Props): props is ByReference {
  return typeof (props as ByReference).reference !== 'undefined'
}

export default Props
