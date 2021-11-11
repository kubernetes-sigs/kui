/*
 * Copyright 2021 The Kubernetes Authors
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

import { spawn } from 'child_process'
import { ExecOptions } from '@kui-shell/core'

export default function doExecPipe(
  argvs: string[][],
  execOptions?: Pick<ExecOptions, 'cwd' | 'env' | 'stderr' | 'stdout'>
) {
  return new Promise((resolve, reject) => {
    const children = argvs.map(argv => spawn(argv[0], argv.slice(1), Object.assign({ shell: true }, execOptions)))

    let nRemaining = children.length
    children.forEach((child, idx) => {
      // wire stderr
      if (!execOptions || !execOptions.stderr) {
        child.stderr.pipe(process.stderr)
      } else {
        child.stderr.on('data', err => execOptions.stderr(err.toString()))
      }

      // wire stdins
      if (idx === 0) {
        // first stage: wire process.stdin to child.stdin
        process.stdin.pipe(child.stdin)
      } else {
        // all other stages: wire previous stage's stdout to child.stdin
        children[idx - 1].stdout.pipe(child.stdin)
      }

      // wire stdout of the last stage
      if (idx === children.length - 1) {
        if (!execOptions || !execOptions.stdout) {
          child.stdout.pipe(process.stdout)
        } else {
          child.stdout.on('data', out => execOptions.stdout(out))
        }
      }

      child.on('error', reject)
      child.on('close', exitCode => {
        if (exitCode !== 0) {
          reject(new Error(argvs.length === 1 ? 'Non-zero exit code' : `Non-zero exit code in pipeline stage ${idx}`))
        } else if (--nRemaining === 0) {
          resolve(true)
        }
      })
    })
  })
}
