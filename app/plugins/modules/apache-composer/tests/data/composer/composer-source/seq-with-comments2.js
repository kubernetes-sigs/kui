const composer = require('@ibm-functions/composer')

// test comment
module.exports = composer.sequence("seq1", "seq2", "seq3")
