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
      label: 'Slack',
      href:
        'https://join.slack.com/t/iter8-tools/shared_invite/enQtODU0NTczMTQ5NDU4LTJmNGE1OTBhOWI4NzllZGE0ZjdhM2M3MzJlMjcxYjliMTJlM2YxMzQ4OWQ5NGViYTM2MTU4MWRkZTgxNzZiMzg'
    },
    { label: 'Learn More', href: 'https://iter8.tools/' }
  ]
}
