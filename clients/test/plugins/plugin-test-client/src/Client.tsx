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

import * as React from 'react'

import { DefaultClient } from '@kui-shell/plugin-client-default/mdist/Client'
import { ContextWidgets, MeterWidgets } from '@kui-shell/plugin-client-common'
import CounterWidget from './CounterWidget'

import '../web/css/static/test.scss'

/**
 * Format our body, with extra status stripe Context and Meter
 * widgets. This is a simple test client. We are intentionally placing
 * the same widget type in two places. The impl for the widget is
 * to be found in `./CounterWidget.tsx`.
 *
 */
export default function renderMain(isPopup: boolean, commandLine?: string[]) {
  return (
    <DefaultClient isPopup commandLine={commandLine}>
      <ContextWidgets>
        <CounterWidget idx={0} />
      </ContextWidgets>

      <MeterWidgets>
        <CounterWidget idx={1} />
      </MeterWidgets>
    </DefaultClient>
  )
}
