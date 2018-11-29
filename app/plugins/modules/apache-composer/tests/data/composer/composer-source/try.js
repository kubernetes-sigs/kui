const composer = require('@ibm-functions/composer')

module.exports = composer.try('RandomError', /* catch */ args => ({ message: args.error + ' is caught' }))
