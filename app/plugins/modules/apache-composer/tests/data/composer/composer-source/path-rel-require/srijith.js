/**
 * Copyright 2017 IBM Corp. All Right Reserved.
 * @author Watson Education
 *
 * Util class for Composer actions.
 *
 */

const composer = require('@ibm-functions/composer');
const composer_utils = require('./composer_utils');

// Actions
const authentication = require('./actions/authentication/index.js').main,
      configuration = require('./actions/configuration/index.js').main,
      options = require('./actions/options/index.js').main,
      post_processing = require('./actions/post_processing/index.js').main,
      start_session = require('./actions/start_session/index.js').main;

const app = composer.if(
  composer_utils.isOptionsCall,
  options,
  function(args) {
    let metrics_aggregator = composer_utils.MetricsAggregator();
    return composer_utils.TimeOutPromise(
      Promise.resolve(
        composer.sequence(
          composer_utils.addMetricAggregator(metrics_aggregator, authentication),
          composer_utils.addMetricAggregator(metrics_aggregator, configuration),
          composer_utils.addMetricAggregator(metrics_aggregator, start_session),
          composer_utils.addMetricAggregator(metrics_aggregator, post_processing)
        ),
        args.origin,
        metrics_aggregator,
        args.max_seconds * 1000
      )
    );
  }
);

module.exports = app;
