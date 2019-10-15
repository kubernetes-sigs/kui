/*
 * Copyright 2017-2019 IBM Corporation
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

import { type as osType } from 'os'

export default () => {
  const isLinux = osType() === 'Linux'

  if (isLinux) {
    return new (require(process.env.LOCAL_OPENWHISK ? 'http' : 'https')).Agent({
      keepAlive: true,
      keepAliveMsecs: process.env.RUNNING_SHELL_TEST ? 20000 : 1000
    })
  } else {
    return undefined
  }
}
