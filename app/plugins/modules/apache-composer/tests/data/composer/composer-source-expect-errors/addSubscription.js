'use strict'

const composer = require('@ibm-functions/composer')

const dbname = 'travis2slack'
const cloudantBinding = process.env['CLOUDANT_PACKAGE_BINDING'];
const slackConfig = {
  token: process.env['SLACK_TOKEN'],
  username: 'whiskbot',
  url: 'https://slack.com/api/chat.postMessage'
}

if (slackConfig.token === undefined) {
  console.error('SLACK_TOKEN required in environment.')
  process.exit(-1)
}

if (cloudantBinding === undefined) {
  console.error('CLOUDANT_PACKAGE_BINDING required in environment.')
  process.exit(-1)
}

module.exports = composer.let({ db: dbname, sc: slackConfig, userID: undefined, name: undefined },
  composer.sequence(
    `/whisk.system/utils/echo`,
    p => { name = p.text; userID = p.user_id },
    composer.try(
      composer.sequence(
        _ => ({ dbname: db, doc: { _id: name, display_name: name, userID: userID, onSuccess: true }, overwrite: false }),
        `${cloudantBinding}/write`,
        _ => ({ message: "Hi, " + name + ". I will now notify you when TravisCI jobs for your Apache OpenWhisk PRs complete." })
      ),
      // write failed.  Try to figure out why
      composer.try(
        composer.sequence(
          p => ({ dbname: db, docid: name }),
          `${cloudantBinding}/read-document`,
          doc => ({ message: "I'm sorry, but <@" + doc.userID + "> is already subscribed to be notified for PRs by `" + name + "`" })
        ),
        _ => ({ message: "I'm sorry. There was an error updating Cloudant. Try again later." })
      )
    ),
    p => Object.assign(sc, { channel: "@" + userID, text: p.message }),
    `/whisk.system/slack/post`
))
