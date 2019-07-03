const composer = require('openwhisk-composer')

/**
 * @param  { payload: string to translate }
 * @return { payload: string after translation }
 */
function translate() {
  return composer.sequence(
    composer.retain('watsonLanguage/languageId'),

    composer.if(
      p => p.result.language !== 'en',

      /* then */ composer.sequence(
        p => ({
          translateFrom: p.result.language,
          translateTo: 'en',
          payload: p.params.payload
        }),
        'watsonLanguage/translator'
      ),

      /* else */ 'sms-translate/en2shakespeare'
    )
  )
}

/**
 * @param { Body: SMS message, From: phone number to text back }
 * @return { html: OK message }
 */
module.exports = composer.sequence(
  p => ({ payload: p.Body, number: p.From }),

  composer.retain(
    composer.sequence(
      args => ({ payload: args.payload }),
      composer.try(translate(), () => ({
        payload: 'Sorry, we cannot translate your text'
      }))
    )
  ),

  ({ params, result }) => ({ Body: result.payload, number: params.number }),
  'sms-translate/sendsms'
)
