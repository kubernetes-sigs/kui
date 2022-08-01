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
import { join } from 'path'
import { parse } from 'ini'
import { REPL } from '@kui-shell/core'
import { FStat } from '@kui-shell/plugin-bash-like/fs'

import Provider, { ProviderInitializer } from './model'

const baseMountName = 'aws'
const debug = Debug('plugin-s3/providers/aws')

class AWSS3Provider implements Provider {
  public readonly accessKey: string
  public readonly secretKey: string

  public readonly understandsFolders = true

  public constructor(
    profile: string,
    creds?: ValidCredential,
    public readonly endPoint = 's3.amazonaws.com',
    public readonly mountName = join(baseMountName, profile)
  ) {
    this.accessKey = creds ? creds.aws_access_key_id : ''
    this.secretKey = creds ? creds.aws_secret_access_key : ''
  }
}

class PublicAWSS3Provider extends AWSS3Provider {
  public publicOnly = true

  public constructor() {
    super('public')
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

function extractValidCredentials(
  creds: void | Record<string, any>,
  config: void | Record<string, any>
): { profile: string; creds: ValidCredential; endpoint: string }[] {
  if (!creds) {
    return []
  } else {
    return Object.entries(creds)
      .filter(([, creds]) => isValidCredential(creds))
      .map(([profile, creds]) => {
        const endpoint = config ? config[profile].endpoint_url : undefined
        return { profile, creds, endpoint: endpoint ? endpoint.replace(/https?:\/\//, '') : undefined }
      })
  }
}

async function init(repl: REPL /*, reinit: () => void */) {
  try {
    // to test publicOnly: throw new Error('test')
    const [{ data: configData }, { data: credsData }] = await Promise.all([
      repl.rexec<FStat>('vfs fstat --with-data ~/.aws/config').then(_ => _.content),
      repl.rexec<FStat>('vfs fstat --with-data ~/.aws/credentials').then(_ => _.content)
    ])
    if (credsData) {
      const config = configData ? parse(configData) : {}
      const creds = extractValidCredentials(parse(credsData), config)
      if (creds.length > 0) {
        // one mount per aws profile, e.g. /s3/aws/default and /s3/aws/myOtherProfile
        return creds.map(({ profile, creds, endpoint }) => new AWSS3Provider(profile, creds, endpoint))
      }
    }

    // throw new UnsupportedS3ProviderError('Could not find AWS S3 credentials')
    return [new PublicAWSS3Provider()]
  } catch (err) {
    debug('Got an error setting up S3 provider; backing out to use public access only', err)
    return [new PublicAWSS3Provider()]
  }
}

const initializer: ProviderInitializer = {
  init,
  mountName: baseMountName
}

export default initializer
