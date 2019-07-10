const composer = require('openwhisk-composer')

module.exports = composer.sequence(
  composer.retain('swapi'),
  composer.if(
    'validate-swapi',
    'report-swapi',
    composer.sequence(composer.retain('stapi'), composer.if('validate-stapi', 'report-stapi', 'report-empty'))
  )
)
