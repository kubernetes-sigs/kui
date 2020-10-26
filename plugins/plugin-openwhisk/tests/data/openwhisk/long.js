// eslint-disable-next-line @typescript-eslint/no-unused-vars
const main = params =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log('all done')
      resolve({ message: 'done' })
    }, 3000)
  })
