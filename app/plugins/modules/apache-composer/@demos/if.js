const { if: If } = require('openwhisk-composer')

/**
 * Creates an if-then-else composition. The input is passed to the
 * condition, and again to the "then" or "else" code.
 */
module.exports = If(
  'authenticate', // returns { value: true|false }
  'welcome', // execute this Function is value is true
  'login' // otherwise execute this Function
)

/**
 * Notes: Previously deployed Cloud Functions can be referenced by
 * 'name'. You may also use inline NodeJS functions.
 */
