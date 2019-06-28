const composer = require('openwhisk-composer')

module.exports = composer.sequence('seq1', 'seq2', 'seq3')
