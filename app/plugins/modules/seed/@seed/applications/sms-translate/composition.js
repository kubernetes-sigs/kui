const composer = require('@wdpdist/composer')

module.exports = composer.sequence(
  p => ({ payload: p.Body, number: p.From, version: '2018-05-01' }),

  composer.retain(
    composer.sequence(
      args => ({ text: args.payload, version: args.version }),
      composer.try(

        composer.sequence(
          composer.retain('watson-language/identify'),
          composer.if(p => p.result.languages[0].language !== 'en',

            composer.sequence(
              p => ({ model_id: p.result.languages[0].language + '-' + 'en',
                text: [p.params.text],
                version: p.params.version }),
              'watson-language/translate'),
            composer.sequence(
              p => ({ payload: p.params.text }),
              'sms-translate/en2shakespeare')
          )
        ),

        () => ({ payload: 'Sorry, we cannot translate your text' }))
    )
  ),

  ({ params, result }) => ({ Body: result.translations[0].translation, number: params.number })
  // 'sms-translate/sendsms'
)
