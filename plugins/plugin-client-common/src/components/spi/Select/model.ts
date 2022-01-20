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
export type SelectOptions = {
  label: string
  command?: string | (() => Promise<string>)
  quietExec?: boolean
  description?: React.ReactNode
  isSelected?: boolean
  isDisabled?: boolean
}

type BaseProps = {
  /** Variant of rendered Select */
  variant: 'single' | 'checkbox' | 'typeahead' | 'typeaheadmulti'

  /** extra css classes */
  className?: string

  /** Flag to indicate if select is open. Default: false */
  isOpen?: boolean

  /** Flag to indicate whether we should allow the select to be closed. Default: true */
  isClosable?: boolean

  /** selected item */
  selected?: string

  /** max height of the select options */
  maxHeight?: string

  /** Flag to indicate if select options are grouped */
  isGrouped?: boolean

  /** Flag to indicate if select option is disabled */
  isDisabled?: boolean
}

type Divider = { divider: true }
type Group = { label: string; options: SelectOptions[] }

type GroupedProps = BaseProps & {
  /** select groups */
  groups: (Divider | Group)[]
}

export function isDivider(group: Divider | Group): group is Divider {
  return (group as Divider).divider === true
}

type NonGroupedProps = BaseProps & {
  /** select options */
  options: SelectOptions[]
}

type Props = GroupedProps | NonGroupedProps

export function isGrouped(props: Props): props is GroupedProps {
  return Array.isArray((props as GroupedProps).groups)
}

export default Props
