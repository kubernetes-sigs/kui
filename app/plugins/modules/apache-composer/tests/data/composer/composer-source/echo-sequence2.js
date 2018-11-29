const composer = require('@ibm-functions/composer')

module.exports = composer.sequence('echo', 'echo')
