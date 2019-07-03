const { try: Try } = require('openwhisk-composer')

/**
 * This code illustrates a try/catch pattern. Previously
 * deployed Cloud Functions can be referenced by name.
 */
module.exports = Try(
  // execute this Cloud Function
  'validate',

  // if that fails, execute this inline function
  () => ({
    ok: false
  })
)
