const composer = require('openwhisk-composer')

module.exports = composer.try('RandomError', /* catch */ args => ({ message: args.error + ' is caught' }))
