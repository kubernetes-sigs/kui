/*
 * Copyright 2017 The Kubernetes Authors
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

import Debug from 'debug'
import { Entity } from '../models/entity'
const debug = Debug('util/tee')

export default async function (response: Entity) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createWriteStream } = await import('fs')
    const stream = createWriteStream(process.env.KUI_TEE_TO_FILE)
    const logger = (data: string | Buffer) => stream.write(data)
    try {
      const { print } = await import('../main/headless-pretty-print')
      print(response, logger, stream)
      if (process.env.KUI_TEE_TO_FILE_END_MARKER) {
        stream.write(process.env.KUI_TEE_TO_FILE_END_MARKER)
      }
    } finally {
      stream.end()

      if (process.env.KUI_TEE_TO_FILE_EXIT_ON_END_MARKER) {
        // we were asked to exit after writing an end marker
        try {
          const { app } = require('@electron/remote')
          debug('attempting to quit', app)
          app.quit()
        } catch (err) {
          console.error('Error exiting', err)
        }
      }
    }
  } catch (err) {
    debug('error teeing output to console')
    console.error(err)
  }
}
