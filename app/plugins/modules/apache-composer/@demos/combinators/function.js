const composer = require('openwhisk-composer')

/**
 * If your composition is a single inline function,
 * you must use the FUNCTION operation. In all
 * other cases, its use is optional: i.e. if your
 * inline function appears as a part of a larger
 * composition, you may simple use the function
 * code directly.
 */
module.exports = composer.function(x => x)
