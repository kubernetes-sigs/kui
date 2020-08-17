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
