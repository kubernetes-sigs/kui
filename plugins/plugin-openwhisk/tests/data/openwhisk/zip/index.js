const fs = require('fs'),
      path = require('path')

exports.main = params => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'data.txt'), (err, data) => {
        if (err) {
            reject(err)
        } else {
            resolve(Object.assign(params, {
                data: data.toString()
            }))
        }
    })
})
