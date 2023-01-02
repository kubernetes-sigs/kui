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
import { v4 } from 'uuid'

import Plan from './Plan'
import Guide, { Props as GuideProps } from './Guide'

import read from './read'
import LeftRightSplit from './LeftRightSplit'

export async function planAndGuide(filepath: string, props: Pick<GuideProps, 'tab' | 'title' | 'description'>) {
  const data = await read(filepath, { REPL: props.tab.REPL })

  return (
    <LeftRightSplit tab={props.tab} leftUUID={v4()}>
      <Plan {...props} {...data} />
      <Guide {...props} {...data} uuid={v4()} />
    </LeftRightSplit>
  )
}
