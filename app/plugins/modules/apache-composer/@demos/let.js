const { sequence: Seq, let: Let } = require('openwhisk-composer')

const state = { secret: 42 }

/**
 * Here, we execute a simple function in a stateful (Let)
 * context. Second, we verify that the "secret" variable hasn't
 * escaped beyond the scope of the Let.
 *
 */
module.exports = Seq(Let(state, _ => ({ ok: secret === 42 })),
  _ => ({ ok: (typeof secret === 'undefined') }))
