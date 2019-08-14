// eslint-disable-next-line @typescript-eslint/no-unused-vars
function main(params) {
  // return {status: 'Good', myResult: params.result.body}

  const answer = JSON.parse(params.result.body)
  if (answer.count > 0) {
    return { value: true }
  } else {
    return { value: false }
  }
}
