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

import React from 'react'
import { Button } from 'carbon-components-react'

import Props from '../model'

// import '../../../../../web/scss/components/Tag/Carbon.scss'
import 'carbon-components/scss/components/button/_button.scss'

export default function CarbonButton(props: Props) {
  return <Button {...props} className={['kui--tag', props.className].join(' ')} />
}
