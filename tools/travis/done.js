const { sequence: Seq, if: If, finally: Finally, retain: Retain } = require('openwhisk-composer')

/** travis for some reason gives us this in string form */
const parse = ({ payload }) => {
  console.log(payload)
  return { value: typeof payload === 'string' ? JSON.parse(payload) : payload }
}

/** composer And method */
const And = result => {
  console.log(result)

  /** did the test pass? */
  const passed = ({ value: { status } }) => status === 0

  /** is the test the result of a push commit? */
  const push = ({ value: { type } }) => type === 'push'

  /** is the test from the master branch? */
  const master = ({ value: { branch } }) => branch === 'master'

  const fns = [passed, push, master]
  return fns.reduce((yup, fn) => yup && fn(result), true)
}

module.exports = Seq(
  parse,
  Finally(Retain(If(And, 'travis-for-kui/swapIntoPlace')), Seq(({ params }) => params, 'travis-for-kui/cleanBucket'))
)
