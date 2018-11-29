const composer = require('@ibm-functions/composer')

function hello ({ name = 'world' }) {
  return { msg: `hello ${name}!` }
}

module.exports = composer.function(hello)
