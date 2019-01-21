var request = require('request')

function main (params) {
  // Language Translation Service Credentials
  var search = params.search

  var url = 'https://swapi.co/api/people/?search=' + search

  return new Promise(function (resolve, reject) {
    request.get({
      url: url
    },
    function (error, response, body) {
      resolve({
        // need to return this so that HTTP Response body is parsed correctly
        headers: {
          'content-type': 'application/json'
        },
        body: body
      })
    })
  })
}
