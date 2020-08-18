import { TestNavResponse } from '@kui-shell/test'

const testiter8about = new TestNavResponse({
  command: 'iter8 about',
  showing: 'Iter8',
  modes: ['About', 'Commands', 'Iter8 Controller', 'Iter8 Analytics'],
  hrefLinks: [
    { label: 'Github', href: 'https://github.com/iter8-tools/iter8' },
    {
      label: 'Slack',
      href:
        'https://join.slack.com/t/iter8-tools/shared_invite/enQtODU0NTczMTQ5NDU4LTJmNGE1OTBhOWI4NzllZGE0ZjdhM2M3MzJlMjcxYjliMTJlM2YxMzQ4OWQ5NGViYTM2MTU4MWRkZTgxNzZiMzg'
    },
    { label: 'Learn More', href: 'https://iter8.tools/' }
  ]
})
testiter8about.run()
