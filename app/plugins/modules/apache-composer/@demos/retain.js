const composer = require('openwhisk-composer')

/**
 * This code uses RETAIN to alter the flow of data so that
 * the input is forwarded around a given sequence. The input
 * params are passed to sequence, then combined with the
 * result of the sequence into a pair {params,result}.
 */
module.exports = composer.retain(_ => ({ x: _.x + 1 }),
  _ => ({ x: _.x + 2 }))

/**
 * e.g. input:  { x: 0 }
 *       output: { params: { x: 0 }, result: { x : 3 } }
 */

/**
 * Related: RETAIN_CATCH, which always returns {params,result}
 * even if the body fails.
 */
