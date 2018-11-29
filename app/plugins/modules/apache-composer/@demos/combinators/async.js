const composer = require('@ibm-functions/composer')
const cloudant = require('@ibm-functions/composer/plugins/cloudant')

/** the database to use */
const db = 'testDB'

/** the insert key  to use */
const key = 'testKey'

/** a mock format function */
const formatDocument = document => ({ timestamp: new Date(), document })

/**
 * This code executes uses ASYNC to execute a
 * task in a fire-and-forget fashion. In this
 * case, the goal is to format and upload
 * a document to Cloudant; note the use of the
 * GET operation provided by the cloudant plugin.
 */
module.exports = composer.async(
  formatDocument,
  cloudant.insert({ db, key }))

/**
 * Notes: data can flow flexibly, either from
 * static values (such as db and key) or from
 * invocation parameters (as is the case with
 * the document to insert.
 */
