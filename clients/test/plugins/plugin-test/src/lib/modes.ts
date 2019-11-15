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
import { Tab } from '@kui-shell/core/api/tab'
import Models from '@kui-shell/core/api/models'
import { UI } from '@kui-shell/core'
import { BadgeRegistration, ModeRegistration } from '@kui-shell/core/api/registrars'

export interface MyResource extends Models.ResourceWithMetadata {
  foo: boolean
}

function isMyResource(resource: Models.ResourceWithMetadata): resource is MyResource {
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

export const button = {
  when: isMyResource,
  mode: {
    mode: 'mode4',
    label: 'mode4 label',
    command: 'test string',
    kind: 'drilldown' as const,
    defaultMode: true // set defaultMode true to test error handling
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkingModeType4: ModeRegistration<MyResource> = button

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

// these are for the tests
export const badgesWeWillRegister: UI.BadgeSpec[] = [badge1, badge2].map(_ => _.badge)
