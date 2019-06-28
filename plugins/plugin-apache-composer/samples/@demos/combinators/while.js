const { while: While } = require('openwhisk-composer')

/**
 * This code uses two inline functions to implement
 * a simple loop. While the condition returns a truthy
 * value or { value: true }, the body will be executed.
 *
 * The input to the WHILE body is the output of the
 * previous iteration or, for the first iteration, the
 * initial input to the invocation.
 */
module.exports = While(
  params => params.n % 2 === 0,
  params => {
    params.n /= 2
  }
)

/** e.g. given { n: 28 }, yield { n: 7 } */

/**
 * Related:
 * - WHILE_NOSAVE, which passes the output of the
 *   condition to each iteration of the body
 * - DOWHILE, which invokes the given body at least once,
 *   and then while the condition is true
 */
