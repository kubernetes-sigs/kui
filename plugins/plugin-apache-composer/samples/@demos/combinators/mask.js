const composer = require('openwhisk-composer')

/**
 * A helper composition. Note how one can modularize compositions!
 * This function implements a looping subroutine. In order not to
 * pollute the parameter bindings of the given composition, this
 * helper uses the MASK combinator to "mask out" the n variable.
 */
function loop(n, composition) {
  return composer.let(
    { n },
    composer.while(() => n-- > 0, composer.mask(composition))
  )
}

/**
 * The exported composition uses the loop helper. Thanks to MASK,
 * this composition returns the expected { value: 12 }. With MASK,
 * the two scopes of the "n" variable (one used by loop, and the
 * other by this main composition) do not collide.
 */
module.exports = composer.let(
  // the parameter bindings of the let
  { n: 0 },

  // the body of the let; the n referenced here should
  // be "our" n, not the n declared by the loop helper.
  // With mask, we achieve the desired scoping.
  loop(3, loop(4, () => ++n))
)
