const { sequence: Seq, if: If, finally: Finally, parallel: InParallel, retain: Retain } = require('openwhisk-composer')

/** travis for some reason gives us this in string form */
const parse = ({ payload }) => {
  // console.log(payload)
  return { value: typeof payload === 'string' ? JSON.parse(payload) : payload }
}

/** did the test pass? */
const passed = ({ value: { status } }) => status === 0

/** is the test the result of a push commit? */
const push = ({ value: { type } }) => type === 'push'

/** is the test from the master branch? */
const master = ({ value: { branch } }) => branch === 'master'

/** local And method */
const every = ({ value }) => {
  return value.every(({ value }) => value === true)
}

/** log the input and pass it through */
const log = result => {
  console.log(result)
  return result
}

/** composer And method */
const And = (...fns) => {
  return Seq(InParallel(...fns),
    log,
    every)
}

module.exports = Seq(parse, Finally(Retain(If(And(passed, push, master),
  'travis-for-kui/swapIntoPlace')),
Seq(({ params }) => params,
  'travis-for-kui/cleanBucket')))
