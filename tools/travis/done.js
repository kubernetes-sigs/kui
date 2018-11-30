const { sequence: Seq, if: If, finally: Finally, retain: Retain } = require('openwhisk-composer')

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
  return Seq(Seq(...fns),
    log,
    every)
}

if (!Array.prototype.every) {
  Array.prototype.every = function (callbackfn, thisArg) {
    'use strict'
    var T, k

    if (this == null) {
      throw new TypeError('this is null or not defined')
    }

    // 1. Let O be the result of calling ToObject passing the this
    //    value as the argument.
    var O = Object(this)

    // 2. Let lenValue be the result of calling the Get internal method
    //    of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0

    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== 'function') {
      throw new TypeError()
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg
    }

    // 6. Let k be 0.
    k = 0

    // 7. Repeat, while k < len
    while (k < len) {
      var kValue

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal method
        //    of O with argument Pk.
        kValue = O[k]

        // ii. Let testResult be the result of calling the Call internal method
        //     of callbackfn with T as the this value and argument list
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O)

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false
        }
      }
      k++
    }
    return true
  }
}

module.exports = Seq(parse, Finally(Retain(If(And(passed, push, master),
  'travis-for-kui/swapIntoPlace')),
Seq(({ params }) => params,
  'travis-for-kui/cleanBucket')))
