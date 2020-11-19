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

import { parse } from 'ini'
import { REPL } from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

import Provider, { UnsupportedS3ProviderError } from './model'

class AWSS3Provider implements Provider {
  public readonly mountName = 'aws'
  public readonly endPoint: string
  public readonly accessKey: string
  public readonly secretKey: string

  public constructor(creds: ValidCredential) {
    this.endPoint = 's3.amazonaws.com'
    this.accessKey = creds.aws_access_key_id
    this.secretKey = creds.aws_secret_access_key
  }
}

type ValidCredential = {
  aws_access_key_id: string
  aws_secret_access_key: string
}

function isValidCredential(value: any | ValidCredential): value is ValidCredential {
  return typeof value.aws_access_key_id === 'string' && typeof value.aws_secret_access_key === 'string'
}

type ValidConfig = Record<string, ValidCredential>

type WithDefaultCredentials = ValidConfig & {
  default: ValidCredential
}

function hasDefaultCredential(config: void | Record<string, any>): config is WithDefaultCredentials {
  const conf = config as WithDefaultCredentials
  return conf && conf.default && isValidCredential(conf.default)
}

function getFirstValidCreds(config: void | Record<string, any>): ValidCredential {
  if (config) {
    const validKey = Object.keys(config).find(key => isValidCredential(config[key]))
    if (validKey && isValidCredential(config[validKey])) {
      return config[validKey]
    }
  }
}

/* function isValidConfig(config: void | Record<string, any>): config is ValidConfig {
  return config && (hasDefaultCredential(config) || !!getFirstValidCreds(config))
} */

export default async function init(repl: REPL /*, reinit: () => void */) {
  try {
    const { data } = (await repl.rexec<FStat>('vfs fstat --with-data ~/.aws/credentials')).content
    if (data) {
      const config = parse(data)
      if (hasDefaultCredential(config)) {
        return new AWSS3Provider(config.default)
      } else {
        const creds = getFirstValidCreds(config)
        if (creds) {
          return new AWSS3Provider(creds)
        }
      }
    }

    throw new UnsupportedS3ProviderError('Could not find AWS S3 credentials')
  } catch (err) {
    throw new UnsupportedS3ProviderError(err.message)
  }
}
