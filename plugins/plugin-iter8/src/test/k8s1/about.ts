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

import { TestNavResponse } from '@kui-shell/test'

const testiter8about = new TestNavResponse({
  command: 'iter8 about',
  showing: 'Iter8',
  modes: ['About', 'Commands', 'Iter8 Controller', 'Iter8 Analytics'],
  hrefLinks: [
    { label: 'Github', href: 'https://github.com/iter8-tools/iter8' },
    {
      label: 'Join Slack',
      href:
        'https://join.slack.com/t/iter8-tools/shared_invite/enQtODU0NTczMTQ5NDU4LTJmNGE1OTBhOWI4NzllZGE0ZjdhM2M3MzJlMjcxYjliMTJlM2YxMzQ4OWQ5NGViYTM2MTU4MWRkZTgxNzZiMzg'
    },
    { label: 'Learn More', href: 'https://iter8.tools/' }
  ]
})
testiter8about.run()
