const main = params => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('all done')
        resolve({ message: 'done' })
    }, 3000)
})
