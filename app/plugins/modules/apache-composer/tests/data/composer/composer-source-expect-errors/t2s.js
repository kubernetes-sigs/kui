'use strict'

const composer = require('@ibm-functions/composer')

const prefix  = 'travis2slack'

module.exports = composer.sequence(
  `/whisk.system/utils/echo`,
  args => { return JSON.parse(args.payload) },
  `${prefix}/extract`,
  `${prefix}/fetch.job.id`,
  composer.retain(
    composer.sequence(
      composer.retry(3, `${prefix}/fetch.log.url`),
      `${prefix}/analyze.log`)),
  ({result, params}) => Object.assign({}, result, params),
  `${prefix}/format.for.slack`,
  composer.retain(slackConfig),
  ({result, params}) => Object.assign({}, result, params),
  `${prefix}.slack/post`)
