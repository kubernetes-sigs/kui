const composer = require('openwhisk-composer')

/**
 * This code executes three tasks in parallel. The input is
 * passed to each of the tasks, and the output is an array
 * of their results.
 */
module.exports = composer.par('/whisk.system/utils/date', x => x, '/whisk.system/utils/echo')

/**
 * Notes: Previously deployed Cloud Functions can be referenced by
 * 'name'. You may also use inline NodeJS functions.
 */
