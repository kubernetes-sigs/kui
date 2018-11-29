const composer = require('@ibm-functions/composer')

module.exports = composer.sequence(
  p => ({payload: p.Body, number: p.From}),

  composer.retain(
    composer.sequence(
      args => ({ payload: args.payload }),
      composer.try(

        composer.sequence(
          composer.retain('watsonLanguage/languageId'),
          composer.if(p => p.result.language !== 'en',

            composer.sequence(
              p => ({ translateFrom: p.result.language, translateTo: 'en', payload: p.params.payload }),
              'watsonLanguage/translator'),

            'sms-translate/en2shakespeare')),

        err => ({payload: 'Sorry, we cannot translate your text'})))),

  ({ params, result }) => ({ Body: result.payload, number: params.number }),
  'sms-translate/sendsms')
