const composer = require('@ibm-functions/composer')

module.exports = composer.sequence("seq1", "seq2", "seq3")
