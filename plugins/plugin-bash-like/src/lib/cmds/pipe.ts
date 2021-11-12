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

import Debug from 'debug'
import { spawn } from 'child_process'
import { ExecOptions, REPL, encodeComponent } from '@kui-shell/core'

const debug = Debug('plugin-bash-like/exec/pipe')

export default function doExecPipe(
  argvs: string[][],
  repl: REPL,
  execOptions?: Pick<ExecOptions, 'cwd' | 'env' | 'stderr' | 'stdout'>
) {
  const firstPipeIdx = argvs.findIndex(_ => _[0] !== 'cat')

  const children = argvs
    .slice(firstPipeIdx)
    .map(argv => spawn(argv[0], argv.slice(1), Object.assign({ shell: true }, execOptions)))

  return new Promise((resolve, reject) => {
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
        if (firstPipeIdx > 0) {
          const filepath = argvs[firstPipeIdx - 1][1]
          debug('piping input file to first child', filepath)
          const ingress = repl.qexec(`vfs cat ${encodeComponent(filepath)}`, undefined, undefined, {
            data: child.stdin
          })
          ingress.catch(reject).then(() => debug('pipe ingress done'))
        } else {
          process.stdin.pipe(child.stdin)
        }
      } else {
        // all other stages: wire previous stage's stdout to child.stdin
        children[idx - 1].stdout.pipe(child.stdin)
      }

      // wire stdout of the last stage
      if (idx === children.length - 1) {
        if (!execOptions || !execOptions.stdout) {
          child.stdout.pipe(process.stdout)
        } else {
          child.stdout.on('data', execOptions.stdout)
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
