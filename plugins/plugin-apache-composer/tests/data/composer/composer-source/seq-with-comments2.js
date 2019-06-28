const composer = require('openwhisk-composer')

// test comment
module.exports = composer.sequence('seq1', 'seq2', 'seq3')
