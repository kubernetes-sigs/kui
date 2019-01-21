const { seq: Seq } = require('openwhisk-composer')

/**
 * This code forms a three-element sequence. As with UNIX pipes,
 * the output of one is input to the next.
 */
module.exports = Seq(
  '/whisk.system/utils/date', // deployed Function
  x => x, // inline function
  '/whisk.system/utils/echo' // deployed Function
)

/**
 * Notes: Previously deployed Cloud Functions can be referenced by
 * 'name'. You may also use inline NodeJS functions.
 */
