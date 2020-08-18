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

import { NavResponse } from '@kui-shell/core'
import { about, commands, controller, analytics } from '../utility/iter8about'

/** A no-argument Command Handler */
export const printiter8about: NavResponse = {
  apiVersion: 'kui-shell/v1',
  kind: 'NavResponse',
  breadcrumbs: [{ label: 'iter8' }, { label: 'about', command: 'iter8 about' }],
  menus: [
    {
      label: 'Iter8',
      items: [
        {
          mode: 'About', // show in F
          content: about,
          contentType: 'text/markdown'
        },
        {
          mode: 'Commands',
          content: commands,
          contentType: 'text/markdown'
        }
      ]
    },
    {
      label: 'Components',
      items: [
        {
          mode: 'Iter8 Controller',
          content: controller,
          contentType: 'text/markdown'
        },
        {
          mode: 'Iter8 Analytics',
          content: analytics,
          contentType: 'text/markdown'
        }
      ]
    }
  ],
  links: [
    { label: 'Github', href: 'https://github.com/iter8-tools/iter8' },
    {
      label: 'Join Slack',
      href:
        'https://join.slack.com/t/iter8-tools/shared_invite/enQtODU0NTczMTQ5NDU4LTJmNGE1OTBhOWI4NzllZGE0ZjdhM2M3MzJlMjcxYjliMTJlM2YxMzQ4OWQ5NGViYTM2MTU4MWRkZTgxNzZiMzg'
    },
    { label: 'Learn More', href: 'https://iter8.tools/' }
  ]
}
