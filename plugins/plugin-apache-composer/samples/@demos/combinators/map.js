const composer = require('openwhisk-composer')

/**
 * This code MAP to apply a task, in parallel,
 * to each element of an array. The simple task
 * is to multiply each element by a given factor.
 *
 * The array is injected via the LITERAL
 * operator, and the multiplication factor is
 * passed in as an input to the composition.
 *
 * Since LITERAL replaces the entire input payload,
 * we use MERGE to combine the {value} literal with
 * the input {factor} payload, so that we have both
 * available to the body of our map.
 */
module.exports = composer.sequence(
  composer.merge(composer.literal({ value: [1, 2, 3] })),
  composer.map(({ value, factor }) => ({ value: value * factor }))
)
