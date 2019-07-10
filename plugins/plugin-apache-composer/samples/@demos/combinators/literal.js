const composer = require('openwhisk-composer')

/**
 * An inline function that we will turn into
 * a named Cloud Function below
 */
const log = params => ({ message: 'Composition time: ' + params.value })

/**
 * This code uses the LITERAL operation to inject
 * a value into a composition. You may also use
 * the synonymous "value" in place of "literal".
 *
 * Note the use of the ACTION operation to make
 * a named Cloud Function out of an inline function.
 */
module.exports = composer.sequence(composer.literal(Date()), composer.action('log', { action: log }))
