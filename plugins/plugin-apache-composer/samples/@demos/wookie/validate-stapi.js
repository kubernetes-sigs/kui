// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main(params) {
  // return {status: 'Good', myResult: params}

  var answer = params.result.body.page
  if (answer.totalElements > 0) {
    return { value: true }
  } else {
    return { value: false }
  }
}
