const composer = require('openwhisk-composer')

/**
 * If you would like to invoke previously deployed
 * composition, you must use the COMPOSITION operation.
 * All other cases of nested compositions, where
 * the source for the composition is available,
 * you are encouraged to use it directly.
 */
module.exports = composer.composition('myComposition')

/**
 * Related: see the documentation of the sleep
 * operation for an example of using a composition
 * by directly including its source.
 */
