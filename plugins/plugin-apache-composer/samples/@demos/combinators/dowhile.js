const composer = require('openwhisk-composer')

/**
 * This code shows the construction of a standard
 * DOWHILE pattern. The body is executed at least once,
 * and the condition always receives as input the output
 * of the body.
 */
module.exports = composer.dowhile(
  params => params.n % 2 === 0, // condition
  params => {
    params.n /= 2
  } // body
)

/**
 * Related: DOWHILE_NOSAVE which behaves similarly to DOWHILE,
 * except that the condition always receives the initial input.
 */
