const composer = require('openwhisk-composer')

/** swap the first field into the second */
const swap = (f1, f2) => obj => {
  obj[f2] = obj[f1]
  delete obj[f1]
  return obj
}

/** use a built-in Cloud Function to find the current time */
const now = field => composer.sequence('/whisk.system/utils/date', swap('date', field))

/**
 * This code uses SLEEP and MERGE operations to produce,
 * with the help of an inline function "swap" and the
 * "now" composition, to produce a pair { start, end }.
 */
module.exports = composer.sequence(
  now('start'), // places the current time into {start}

  // sleep for 1s, produce {end}, then merges {start} and {end}
  composer.merge(composer.sleep(1000), now('end'))
)
