const composer = require('@ibm-functions/composer')

module.exports = composer.if(
  /* cond */ 'authenticate',,  /* double comma, expect parse error */
  /* then */ 'welcome',
  /* else */ 'login')
