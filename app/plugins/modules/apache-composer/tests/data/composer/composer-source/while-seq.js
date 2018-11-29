const composer = require('@ibm-functions/composer')

module.exports = composer.sequence(composer.while(composer.sequence("cond1", "cond2"), composer.sequence("seq1", "seq2", "seq3")), composer.while("cond3", "action4"))
