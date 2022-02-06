/*
 * Copyright 2022 The Kubernetes Authors
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

import Icons from '../../spi/Icons'

function getClientHomePage() {
  try {
    return require('@kui-shell/client/package.json').homepage
  } catch (err) {
    return undefined
  }
}

export default function GitHubIcon() {
  const homepage = getClientHomePage()

  return !homepage ? (
    <React.Fragment />
  ) : (
    <a
      target="_blank"
      rel="noopener noreferrer"
      title="Visit our GitHub page"
      href={homepage}
      className="kui--status-stripe-element-clickable kui--status-stripe-element"
    >
      <Icons icon="Github" className="somewhat-larger-text" />
    </a>
  )
}
