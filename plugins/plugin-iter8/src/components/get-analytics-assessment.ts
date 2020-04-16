export default class GetAnalyticsAssessment {
  public data = {}
  public url = ''
  public constructor(data, url = 'http://localhost:8000/assessment') {
    this.url = url
    this.data = data
  }

  public getAnalyticsAssessment() {
    const data = this.data // eslint-disable-line @typescript-eslint/no-this-alias
    const url = this.url
    const promiseObj = new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(data))
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log('Request processed successfully')
            const resp = xhr.responseText
            const respJson = JSON.stringify(resp)
            resolve(respJson)
          } else {
            reject(xhr.status)
            console.log('Request failed')
          }
        } else {
          console.log('Request processing going on')
        }
      }
      console.log('Request sent succesfully')
    })
    return promiseObj
  }
}
// async () => {let x = await ob2.getAnalyticsAssessment(); return x;}
