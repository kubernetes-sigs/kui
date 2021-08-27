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

import { S3Provider } from '@kui-shell/plugin-s3'

import Config from './model/Config'
import Geos, { GeoDefaults } from './model/geos'

export default class IBMCloudS3Provider implements S3Provider {
  public readonly endPoint: string
  public readonly directEndPoint: string

  public readonly region: string
  public readonly accessKey: string
  public readonly secretKey: string

  public readonly understandsFolders = true
  public readonly bucketNameNSlashes: 1
  public readonly listBuckets: S3Provider['listBuckets']

  public isDefault: boolean

  public constructor(
    private readonly geo: string,
    public readonly mountName: string,
    config?: Pick<Config, 'AccessKeyID' | 'SecretAccessKey' | 'endpointForKui'>,
    public readonly error?: Error
  ) {
    const accessKey = config ? config.AccessKeyID : undefined
    const secretKey = config ? config.SecretAccessKey : undefined

    this.endPoint = Geos[geo] || (config ? config.endpointForKui : undefined)
    this.region = geo
    this.accessKey = accessKey
    this.secretKey = secretKey

    // fast-path endpoint when executing in a cloud job?
    // e.g. s3.ap.cloud-object-storage.appdomain.cloud -> s3.direct.ap.cloud-object-storage.appdomain.cloud
    this.directEndPoint = this.endPoint.replace(/^s3\./, 's3.direct.')

    const defaultRegion = GeoDefaults[config['Default Region']] || config['Default Region']
    this.isDefault = config && geo === defaultRegion

    // use the closest available endpoint for listBuckets, since it is geo-agnostic
    this.listBuckets = {
      endPoint: config ? config.endpointForKui : Geos[geo],
      region: geo,
      accessKey,
      secretKey
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public bucketFilter({ name, locationConstraint }: { name: string; locationConstraint: string }): boolean {
    return !locationConstraint || locationConstraint.startsWith(this.geo)
  }
}
