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
import { TestNavResponse } from '@kui-shell/test'

// test nav response with breadcrumbs
const testNavResponseWithBreadcrumbs = new TestNavResponse({
  command: 'test nav --breadcrumb',
  showing: 'Test Nav Without Links',
  modes: ['table'],
  breadcrumbs: [{ label: 'breadcrumb1', command: 'test string' }, { label: 'breadcrumb2' }]
})
testNavResponseWithBreadcrumbs.run()

// test nav response with links
const testFullNavResponse = new TestNavResponse({
  command: 'test nav',
  showing: 'Test Nav',
  modes: ['table'],
  commandLinks: [{ label: 'switch', expect: { type: 'NavResponse', showing: 'Test Nav 2' } }],
  hrefLinks: [{ label: 'Home Page', href: 'http://kui.tools' }]
})
testFullNavResponse.run()

// test plain nav response (no links, no breadcrumbs)
const testNavResponseWithoutLinks = new TestNavResponse({
  command: 'test nav --noLinks',
  showing: 'Test Nav Without Links',
  modes: ['table']
})
testNavResponseWithoutLinks.run()
