/**
 * Copyright 2017 IBM Corp. All Right Reserved.
 * @author Watson Education
 *
 * Util class for Composer actions.
 *
 */

function isOptionsCall(args) {
  return args['__ow_method'] === 'options'
}

exports.isOptionsCall = isOptionsCall

exports.addMetricAggregator = function(metricsAggregator, action) {
  return function(args) {
    return action(args, metricsAggregator)
  }
}

exports.MetricsAggregator = function() {
  let value = []
  return {
    addMetric: function(metric) {
      value.push(metric)
      return this
    },
    finish: function() {
      const result = value.map(function(metric) {
        metric.endTiming()
        return metric
      })
      value = []
      return result
    }
  }
}

const WebErrorResponseBuilder = (function() {
  let value = {}
  return {
    withStatusCode: function(statusCode) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      value.status_code = statusCode
      return this
    },
    withError: function(error) {
      value.error = error
      return this
    },
    withDescription: function(description) {
      value.description = description
      return this
    },
    withOrigin: function(origin) {
      value.origin = origin
      return this
    },
    build: function() {
      const result = {}
      result.statusCode = value.status_code
      result.headers = {
        'access-control-allow-headers': 'authorization, content-type',
        'access-control-allow-origin': value.origin,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-credentials': 'true',
        'Content-Type': 'application/json'
      }
      result.body = Buffer.from(
        JSON.stringify({
          code: value.status_code,
          error: value.error,
          description: value.description
        })
      )
      value = {}
      return result
    }
  }
})()

exports.TimeOutPromise = function(internalPromise, metricsAggregator, origin, timeOutInMilliseconds) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(function() {
      return reject(
        WebErrorResponseBuilder.withStatusCode(504)
          .withError('SERVER_TIMEOUT')
          .withDescription(`Request timed out. ${JSON.stringify(metricsAggregator.finish())}`)
          .withOrigin(origin)
          .build()
      )
    }, timeOutInMilliseconds)
    internalPromise.then(
      result => {
        clearTimeout(timeout)
        return resolve(result)
      },
      error => {
        clearTimeout(timeout)
        return reject(error)
      }
    )
  })
}

exports.WebErrorResponseBuilder = WebErrorResponseBuilder
