/**
 * Copyright 2017 IBM Corp. All Right Reserved.
 * @author Watson Education
 *
 * Util class for Composer actions.
 *
 */

const composer = require('openwhisk-composer')
const composerUtils = require('./composer_utils')

// Actions
const authentication = require('./actions/authentication/index.js').main
const configuration = require('./actions/configuration/index.js').main
const options = require('./actions/options/index.js').main
const postProcessing = require('./actions/post_processing/index.js').main
const startSession = require('./actions/start_session/index.js').main

const app = composer.if(composerUtils.isOptionsCall, options, function(args) {
  const metricsAggregator = composerUtils.MetricsAggregator()
  return composerUtils.TimeOutPromise(
    Promise.resolve(
      composer.sequence(
        composerUtils.addMetricAggregator(metricsAggregator, authentication),
        composerUtils.addMetricAggregator(metricsAggregator, configuration),
        composerUtils.addMetricAggregator(metricsAggregator, startSession),
        composerUtils.addMetricAggregator(metricsAggregator, postProcessing)
      ),
      args.origin,
      metricsAggregator,
      args.max_seconds * 1000
    )
  )
})

module.exports = app
