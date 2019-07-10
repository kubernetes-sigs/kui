const composer = require('openwhisk-composer')

/**
 * Sometimes it is helpful, for clarity's sake,
 * to note that a certain call back is expected
 * not to be taken. Use EMPTY for these cases.
 */
module.exports = composer.if(() => true, '/whisk.system/utils/date', composer.empty())
