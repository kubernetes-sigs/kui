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

import { v4 } from 'uuid'
import { REPL } from '@kui-shell/core'

import JobProvider, { JobParameters, JobEnv } from '../'
import { Provider as S3Provider } from '../../providers'

type JobName = string

export default class CodeEngine implements JobProvider<JobName> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(private readonly repl: REPL, private readonly s3: S3Provider) {}

  /** @return the details of the given Job */
  /* public get(jobName: JobName) {
    return undefined
  } */

  /** @return the logs of the give Task of the given Job */
  public logs(jobName: JobName, taskIdx: number) {
    return this.repl.qexec<string>(`ibmcloud ce kubectl logs ${jobName}-${taskIdx}-0`)
  }

  /** Block until the given job completes */
  public async wait(jobName: JobName, nTasks: number) {
    while (true) {
      const json = await this.repl.qexec<string>(`ibmcloud ce jobrun get --name ${jobName} -o json`).catch(err => {
        console.error(err)
        return undefined
      })
      if (json && json.status && json.status.succeeded === nTasks) {
        return
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  /** -e key=value */
  private dashE(env: JobEnv): string {
    return Object.keys(env)
      .map(key => `-e ${key}=${env[key]}`)
      .join(' ')
  }

  /** Schedule a Job execution */
  public async run(image: string, params: JobParameters, env: JobEnv = {}) {
    const { nTasks, nShards } = params
    const jobName = `kui-job-${v4()}`

    const parOpts = this.dashE(params)
    const envOpts = this.dashE(env)
    const keyOpts = this.dashE({ S3_ACCESS_KEY: this.s3.accessKey, S3_SECRET_KEY: this.s3.secretKey })

    const cmdline = `ibmcloud ce job create --image ${image} --name ${jobName} --array-indices 1-${nTasks} -e NSHARDS=${nShards} ${parOpts} ${envOpts} ${keyOpts}`
    await this.repl.qexec<string>(cmdline).catch(err => {
      console.error(err)
      throw new Error(err.message)
    })

    const jobrunName = `kui-jobrun-${v4()}`
    const cmdline2 = `ibmcloud ce jobrun submit --job ${jobName} --name ${jobrunName}`
    await this.repl.qexec<string>(cmdline2).catch(err => {
      console.error(err)
      throw new Error(err.message)
    })

    return jobrunName
  }
}
