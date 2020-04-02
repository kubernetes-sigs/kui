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

import { safeLoad } from 'js-yaml'
import { execSync } from 'child_process'

export default class GetKubeInfo {
  private rawOutput = ''

  public getNamespace(): Array<any> {
    this.rawOutput = execSync('kubectl get ns -o yaml', { encoding: 'utf-8' })
    const rawQuery = safeLoad(this.rawOutput)['items']
    const dataArr = []
    for (let i = 0; i < rawQuery.length; i++) {
      const name = rawQuery[i]['metadata']['name']
      dataArr.push({
        id: `ns-${i}`,
        text: name
      })
    }
    return dataArr
  }

  public getSvc(ns: string): Array<any> {
    this.rawOutput = execSync(`kubectl get svc -n ${ns} -o yaml`, { encoding: 'utf-8' })
    const rawQuery = safeLoad(this.rawOutput)['items']
    const dataArr = []
    for (let i = 0; i < rawQuery.length; i++) {
      const name = rawQuery[i]['metadata']['name']
      dataArr.push({
        id: `svc-${i}`,
        text: name
      })
    }
    return dataArr
  }

  public getDeployment(ns: string, svc: string): Array<any> {
    this.rawOutput = execSync(`kubectl get deployments -n ${ns} -o yaml`, { encoding: 'utf-8' })
    const rawQuery = safeLoad(this.rawOutput)['items']
    const dataArr = []
    for (let i = 0; i < rawQuery.length; i++) {
      const name = rawQuery[i]['metadata']['labels']['app']
      if (name === svc) {
        dataArr.push({
          id: `dep-${i}`,
          text: rawQuery[i]['metadata']['name']
        })
      }
    }
    return dataArr
  }
}
// const ob = new GetKubeInfo()
// const query = ob.getDeployment('bookinfo-iter8', 'reviews');

// console.log(query)
