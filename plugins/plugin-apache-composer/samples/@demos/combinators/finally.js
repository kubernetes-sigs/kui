const composer = require('openwhisk-composer')

/** since the result has an 'error' field, an error is triggered */
const fail = () => ({ error: 'intentional failure' })

/**
 * This code uses FINALLY to ensure that cleanup logic is
 * always executed. The input to the finalizer is the output
 * of the body, whether it succeeds or fails.
 */
module.exports = composer.finally(
  composer.sequence('mainLogic', fail), // body
  composer.async('cleanup')
) // finalizer

/**
 * Notes: Previously deployed Cloud Functions can be referenced by
 * 'name'. You may also use inline NodeJS functions.
 */

/**
 * Related: ASYNC, which implements a "fire and forget"
 * invocation scheme. This can be useful for pulling
 * cleanup or logging functions off the main latency path.
 */
