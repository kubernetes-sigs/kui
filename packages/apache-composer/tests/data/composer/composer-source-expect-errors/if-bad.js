const composer = require('openwhisk-composer')

module.exports = composer.if(
  /* cond */ 'authenticate',,  /* double comma, expect parse error */
  /* then */ 'welcome',
  /* else */ 'login')
