/*
 * Copyright 2020 IBM Corporation
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

import { Entity } from './entity'
import { Mode } from './mmr/types'

export interface Breadcrumb {
  label: string
  command?: string
}

/**
 * A `NavResponse` is a collection of `MultiModalResponse` with menu navigation
 *
 */
export type NavResponse = {
  apiVersion: 'kui-shell/v1'
  kind: 'NavResponse'
  menus: Menu[]
  links?: Link[]
  breadcrumbs?: Breadcrumb[]
}

export type Menu = Label & MenuItems
type MenuItems = { items: Mode[] }

type Label = { label: string }
type Command = { command: string }
type Href = { href: string }

export type Link = Label & (Command | Href)

export function isLinkWithCommand(link: Link): link is Label & Command {
  return (link as Label & Command).command !== undefined
}

export function isLinkWithHref(link: Link): link is Label & Href {
  return (link as Label & Href).href !== undefined
}

export function isLink(link: Link): link is Link {
  return isLinkWithHref(link) || isLinkWithCommand(link)
}

export function isNavResponse(entity: Entity): entity is NavResponse {
  const nav = entity as NavResponse
  return nav.apiVersion === 'kui-shell/v1' && nav.kind === 'NavResponse'
}
