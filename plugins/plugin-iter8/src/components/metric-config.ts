import { safeLoad } from 'js-yaml'

const execSync = require('child_process').execSync

export default class GetMetricConfig {
  public output = {}
  public constructor() {
    try {
      this.output = {
        configmaps: execSync('kubectl get configmaps -n iter8 iter8config-metrics -o yaml', {
          encoding: 'utf-8',
          stdio: 'pipe'
        })
      }
    } catch (err) {
      this.output = { error: err }
    }
  }

  public errorResponse() {
    if ({}.hasOwnProperty.call(this.output['error'], 'stderr')) {
      return {
        error: {
          message: [this.output['error']['stderr']],
          response: this.output['error']
        }
      }
    } else {
      return {
        error: {
          message: ['An error occured while trying to find available metrics'],
          response: this.output['error']
        }
      }
    }
  }

  public getMetricsConfigMap() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    return this.output['configmaps']
  }

<<<<<<< HEAD
<<<<<<< HEAD
  public getCounterMetrics(): Array<any> {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return [this.errorResponse()]
=======
  public getCounterMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
>>>>>>> Metric config file
=======
  public getCounterMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
>>>>>>> Metric config file
    }
    return safeLoad(safeLoad(this.output['configmaps'])['data']['counter_metrics.yaml'])
  }

<<<<<<< HEAD
<<<<<<< HEAD
  public getRatioMetrics(): Array<any> {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return [this.errorResponse()]
=======
  public getRatioMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
>>>>>>> Metric config file
=======
  public getRatioMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
>>>>>>> Metric config file
    }
    return safeLoad(safeLoad(this.output['configmaps'])['data']['ratio_metrics.yaml'])
  }
}
