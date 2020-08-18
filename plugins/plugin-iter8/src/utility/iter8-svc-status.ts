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

import { execSync } from 'child_process'

export function iter8ServiceStatus(svc) {
  const svcStr = execSync(`kubectl get svc -n iter8 -o jsonpath='{.items[*].metadata.name}'`, {
    encoding: 'utf-8'
  })
  const s = svcStr.split(' ')
  if (s.includes(svc)) {
    return true
  } else {
    return false
  }
}

export function getAnalyticsURL() {
  let url = process.env.ITER8_ANALYTICS_URL
  if (url === undefined) {
    url = 'http://0.0.0.0:8080/'
  }
  return url
}
