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
import { i18n, REPL } from '@kui-shell/core'

import Card from '../spi/Card'

import KuiIcon from '../../../icons/png/WelcomeLight.png'

const strings = i18n('client')

interface Props {
  repl: REPL
}

export default class LoadingCard extends React.PureComponent<Props> {
  public render() {
    return (
      <Card titleInHeader bodyInHeader title={strings('Successfully connected to your cluster')} icon={KuiIcon}>
        {strings('loadingDone:content')}
      </Card>
    )
  }
}
