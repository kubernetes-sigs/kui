const composer = require('@ibm-functions/composer')
const http = require('@ibm-functions/composer/plugins/http')

/** the CDC flu data endpoint */
const url = 'https://www.cdc.gov/flu/weekly/flureport.xml'

/** turn a given XML string into JSON */
const xml2json = xmlString => {
  const { parseString } = require('xml2js')

  return new Promise((resolve, reject) => {
    parseString(xmlString, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * This code uses the HTTP plugin to fetch an XML string,
 * and then turns the XML into JSON. Note the use of the
 * ACTION operation, which turns the given inline function
 * into a deployed Cloud Function.
 */
module.exports = composer.seq(
  http.get({ url }), // fetch the data
  ({ body }) => body, // we want the XML string, which is in "body"
  composer.action('xml2json', { action: xml2json }))
