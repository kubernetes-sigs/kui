/**
 * Copyright 2017 IBM Corp. All Right Reserved.
 * @author Watson Education
 *
 * Util class for Composer actions.
 *
 */

function isOptionsCall(args) {
  return args['__ow_method'] === 'options';
}

exports.isOptionsCall = isOptionsCall;

exports.addMetricAggregator = function(metrics_aggregator, action) {
  return function(args) {
    return action(args, metrics_aggregator);
  }
}

exports.MetricsAggregator = function() {
  let value = [];
  return {
    addMetric: function(metric) {
      value.push(metric);
      return this;
    },
    finish: function() {
      let result = value.map(function(metric) {
        metric.endTiming();
        return metric;
      });
      value = [];
      return result;
    }
  };
};

exports.TimeOutPromise = function(internal_promise, metrics_aggregator, origin, time_out_in_milliseconds) {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(function() {
      return reject(
        WebErrorResponseBuilder.withStatusCode(504)
        .withError('SERVER_TIMEOUT')
        .withDescription(`Request timed out. ${JSON.stringify(metrics_aggregator.finish())}`)
        .withOrigin(origin)
        .build()
      )
    }, time_out_in_milliseconds);
    internal_promise.then((result) => {
      clearTimeout(timeout);
      return resolve(result);
    }, (error) => {
      clearTimeout(timeout);
      return reject(error);
    })
  })
}

const WebErrorResponseBuilder = function() {
  let value = {};
  return {
    withStatusCode: function(status_code) {
      value.status_code = status_code;
      return this;
    },
    withError: function(error) {
      value.error = error;
      return this;
    },
    withDescription: function(description) {
      value.description = description;
      return this;
    },
    withOrigin: function(origin) {
      value.origin = origin;
      return this;
    },
    build: function() {
      let result = {};
      result.statusCode = value.status_code;
      result.headers = {
        "access-control-allow-headers": "authorization, content-type",
        "access-control-allow-origin": value.origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-credentials": "true",
        'Content-Type': 'application/json'
      };
      result.body = new Buffer(JSON.stringify({
        code: value.status_code,
        error: value.error,
        description: value.description
      })).toString('base64')
      value = {};
      return result;
    }
  }
}();

exports.WebErrorResponseBuilder = WebErrorResponseBuilder;
