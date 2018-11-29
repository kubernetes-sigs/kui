'use strict'

const composer = require('@ibm-functions/composer')

const slackConfig = {
    token: process.env['SLACK_TOKEN'],
    username: 'whiskbot',
    url: 'https://slack.com/api/chat.postMessage'
}

if (slackConfig.token === undefined) {
    console.error('SLACK_TOKEN required in environment.')
    process.exit(1)
}

const prefix = 'travis2slack'

module.exports = composer.sequence(
    args => { return JSON.parse(args.payload) },
    `/whisk.system/utils/echo`,
    `${prefix}/extract`
    `${prefix}/fetch.job.id`,
    composer.retain(
        composer.sequence(
            composer.retry(3, `${prefix}/fetch.log.url`),
            `${prefix}/analyze.log`)),
    ({result, params}) => Object.assign({}, result, params),
    `${prefix}/format.for.slack`,
    app.retain(slackConfig),
    ({result, params}) => Object.assign({}, result, params),
    `/whisk.system/slack/post`)
