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

let enabled = process.env.KUI_S3 !== 'false'

/**
 * Allow clients to selectively disable plugin-s3; e.g. perhaps
 * plugin-s3 is not needed in headless mode.
 */
export default function isEnabled() {
  return enabled
}

export function enable() {
  enabled = true

  return import('./preload').then(_ => _.default())
}
