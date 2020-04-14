import { safeLoad } from 'js-yaml'

const execSync = require('child_process').execSync

export default class GetMetricConfig {
  public constructor() {
    try {
      this.output = {
        configmaps: execSync('kubectl get configmaps -n iter8 iter8config-metrics2 -o yaml', {
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

  public getCounterMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    return safeLoad(safeLoad(this.output['configmaps'])['data']['counter_metrics.yaml'])
  }

  public getRatioMetrics() {
    if ({}.hasOwnProperty.call(this.output, 'error')) {
      return this.errorResponse()
    }
    return safeLoad(safeLoad(this.output['configmaps'])['data']['ratio_metrics.yaml'])
  }
}
