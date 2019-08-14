const request = require('request')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main(params) {
  // Language Translation Service Credentials
  const search = params.search

  const url = 'https://swapi.co/api/people/?search=' + search

  return new Promise(function(resolve) {
    request.get(
      {
        url: url
      },
      // eslint-disable-next-line handle-callback-err
      function(error, response, body) {
        resolve({
          // need to return this so that HTTP Response body is parsed correctly
          headers: {
            'content-type': 'application/json'
          },
          body: body
        })
      }
    )
  })
}
