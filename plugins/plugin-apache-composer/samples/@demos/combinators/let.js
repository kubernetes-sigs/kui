const composer = require('openwhisk-composer')

/**
 * This program uses LET to inject a parameter binding
 * for the variable "idx". Note how the body of the LET
 * leverages the initial value of idx.
 */
module.exports = composer.let(
  // parameter bindings
  { idx: 100 },

  // body of let
  composer.while(
    () => idx-- > 0, // condition
    '/whisk.system/utils/echo'
  )
) // body of while

/**
 * Notes: the parameter bindings by default only visible to
 * inline functions. To make them available to Cloud Functions,
 * you must explicitly inject them, e.g. via an inline function
 * such as () => ({idx}), which would inject that variable.
 */

/**
 * Related: LITERAL, which is akin to let, except that it only
 * injects a parameter binding.
 */
