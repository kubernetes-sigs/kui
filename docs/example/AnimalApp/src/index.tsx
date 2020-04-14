import * as React from 'react'
import { render } from 'react-dom'

import { Kui } from '@kui-shell/plugin-client-common'

const wrapper = document.querySelector('.main')
if (wrapper) {
  render(<Kui />, wrapper)
}
