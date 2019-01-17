const composer = require('openwhisk-composer')

module.exports = composer.sequence('echo', 'echo')
