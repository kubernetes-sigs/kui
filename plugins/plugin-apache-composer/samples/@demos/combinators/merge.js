const composer = require('openwhisk-composer')

/**
 * MERGE is equivalent to RETAIN, except that
 * it merges the input parameters and the output
 * of the given sequence.
 *
 * This code shows how easy it is to extend the
 * built-in primitives: merge is a simple macro
 * on top of seq and retain.
 */
function merge(...components) {
  return composer.seq(composer.retain(...components), _ => Object.assign(_.params, _.result))
}

/**
 * A simple example use of our new MERGE macro
 */
module.exports = merge('/whisk.system/utils/date', '/whisk.system/utils/echo')
