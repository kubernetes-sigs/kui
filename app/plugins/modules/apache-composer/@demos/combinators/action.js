const composer = require('openwhisk-composer')

/**
 * The ACTION operation is useful in two circumstances.
 * First, if your composition is a single Cloud Function,
 * you must use the action operation, as shown in this code.
 *
 * Second, if you would like to deploy an inline function
 * as a Cloud Function, you may do so with action(name, code).
 */
module.exports = composer.action('/whisk.system/utils/date')

/**
 * Related: LITERAL, which shows an example of using the action
 * operation to deploy an inline function as a named Cloud Function.
 */
