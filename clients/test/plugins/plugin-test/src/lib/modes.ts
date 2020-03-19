/*
 * Copyright 2019 IBM Corporation
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

import { Tab, ResourceWithMetadata, BadgeRegistration, ModeRegistration, ParsedOptions } from '@kui-shell/core'

export interface MyResource extends ResourceWithMetadata {
  foo: boolean
}

function isMyResource(resource: ResourceWithMetadata): resource is MyResource {
  return typeof (resource as MyResource).foo === 'boolean'
}

export const mode1 = {
  when: isMyResource,
  mode: {
    mode: 'mode1',
    content: 'yo: this is mode1'
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingModeType1: ModeRegistration<MyResource> = mode1

export const mode2 = {
  when: isMyResource,
  mode: {
    mode: 'mode2',
    content: () => ({
      content: 'this is mode2'
    })
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingModeType2: ModeRegistration<MyResource> = mode2

export const mode3 = {
  when: isMyResource,
  mode: {
    mode: 'mode3',
    label: 'mode3 label',
    content: (_: Tab, resource: MyResource) =>
      Promise.resolve({
        // <-- just for fun, return a Promise, as this is supported by the API
        content: `# this is mode3\nvalue is ${resource.foo}`, // <-- here, we take a command line option and splice it into the view
        contentType: 'text/markdown'
      })
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingModeType3: ModeRegistration<MyResource> = mode3

export const drilldownButtonWithString = {
  when: isMyResource,
  mode: {
    mode: 'button1',
    label: 'button1 label',
    command: 'test string',
    kind: 'drilldown' as const
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingButtonType1: ModeRegistration<MyResource> = drilldownButtonWithString

export const drilldownButtonWithFunction = {
  when: isMyResource,
  mode: {
    mode: 'button2',
    label: 'button2 label',
    command: (tab: Tab, resource: MyResource, args: { argvNoOptions: string[] }) => {
      return `${args.argvNoOptions[0]} string` // => should be 'test string'
    },
    kind: 'drilldown' as const
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingButtonType2: ModeRegistration<MyResource> = drilldownButtonWithFunction

export const mode5 = {
  when: isMyResource,
  mode: {
    mode: 'mode5',
    label: 'mode5 label',
    content: (tab: Tab, MyResource: MyResource, args: { argvNoOptions: string[]; parsedOptions: ParsedOptions }) => ({
      contentFrom: `${args.argvNoOptions[0]} string`, // => should be 'test string'
      order: 999,
      contentType: 'text/plain' as const
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingModeType5: ModeRegistration<MyResource> = mode5

export const badge1 = {
  when: isMyResource,
  badge: {
    title: 'badge1'
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingBadgeType1: BadgeRegistration<MyResource> = badge1

export const badge2 = {
  when: isMyResource,
  badge: {
    title: 'badge2',
    css: 'red-background'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingBadgeType2: BadgeRegistration<MyResource> = badge2

export const badge3 = {
  when: isMyResource,
  badge: (resource: MyResource) => {
    return {
      title: 'badge3',
      css: resource.foo ? 'red-background' : 'green-background'
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingBadgeType3: BadgeRegistration<MyResource> = badge3
