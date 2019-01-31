const composer = require('openwhisk-composer')

module.exports = composer.sequence(composer.action('A', { filename: 'doesnotexist.js' }))
