const composer = require('openwhisk-composer')

module.exports = composer.sequence(x => x, x => x)
