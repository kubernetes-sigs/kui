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

import React from 'react'

import { Kui, KuiProps, ContextWidgets, MeterWidgets, SpaceFiller } from '@kui-shell/plugin-client-common'
import CounterWidget from './CounterWidget'

/** We have tests that ensure the scss import worked */
import '../web/css/static/test.scss'

/**
 * Use the stock Kui client, with extra status stripe Context and
 * Meter widgets.
 *
 * Note: we are intentionally placing the same widget type in two
 * places. The impl for the widget is to be found in
 * `./CounterWidget.tsx`.
 *
 */
export default function TestClient(props: KuiProps) {
  return (
    <Kui {...props} disableTableTitle sidecarName="heroText">
      <ContextWidgets>
        <CounterWidget idx={0} />
      </ContextWidgets>

      <SpaceFiller />

      <MeterWidgets>
        <CounterWidget idx={1} />
      </MeterWidgets>
    </Kui>
  )
}
