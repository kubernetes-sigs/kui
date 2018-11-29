const composer = require('@ibm-functions/composer')

module.exports = composer.on(
  'messagehub/trigger',
  composer.forall(
    composer.sequence('get-ML-models', 'filter-relevant-models'),
    'invoke'))
