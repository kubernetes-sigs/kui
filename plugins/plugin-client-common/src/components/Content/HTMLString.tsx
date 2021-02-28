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

/**
 * For html-formatted text, wrap it in an IFrame container with
 * padding. We set the backgroundColor of the iframe to `white` in
 * order to match the expectations of web pages vis-a-vis defaults.
 *
 * See https://github.com/IBM/kui/issues/7101 for why we use an iframe.
 * The html content will not inherit Kui's stylings. This is not possible,
 * and perhaps not desirable. Random HTML will have its own home-grown
 * stylings. In any case, there is no good way to inject random Kui stylings
 * into random iframes.
 *
 */
export default function HTMLString({ content }: { content: string }) {
  return (
    <div className="padding-content">
      <iframe srcDoc={content} width="100%" height="100%" style={{ backgroundColor: 'white' }} />
    </div>
  )
}
