const composer = require('openwhisk-composer')

/** the database to use */
const dbname = 'testDB'

/** the insert key  to use */
const id = 'testId'

/** a mock format function */
const formatDocument = document => ({ timestamp: new Date(), document })

/**
 * This code executes uses ASYNC to execute a
 * task in a fire-and-forget fashion. In this
 * case, the goal is to format and upload
 * a document to Cloudant; note the use of the
 * GET operation provided by the cloudant plugin.
 */
module.exports = composer.async(formatDocument, doc => ({ dbname, id, doc }), '/whisk.system/cloudant/write')
