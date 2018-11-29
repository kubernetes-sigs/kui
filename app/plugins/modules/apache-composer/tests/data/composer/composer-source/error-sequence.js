const composer = require('@ibm-functions/composer')

module.exports = composer.sequence(x => x, x => ({ error: x }))
