const composer = require('openwhisk-composer')

function hello({ name = 'world' }) {
  return { msg: `hello ${name}!` }
}

module.exports = composer.function(hello)
