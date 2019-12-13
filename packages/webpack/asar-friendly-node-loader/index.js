/**
 * Attribution: https://github.com/webpack-contrib/node-loader/issues/12#issuecomment-404631907
 *
 */

/**
 * Notes by @starpit. Apparently the node-loader does not cooperate
 * fully with asar builds of electron. The node-loader correctly loads
 * native bits, but only as the absolute path from which they
 * originated. This works fine for development mode, e.g. when using
 * webpack-dev-server. But it does not work in production asar-based
 * builds of electron.
 *
 * As noted in the attribution, this loader is effectively a
 * node-loader-by-copy; i.e. it copies the assets into the bundle,
 * then copies it out to the local filesystem and dlopens the binary.
 *
 */

const { basename, dirname, join } = require('path')
const { readFile, readdir } = require('fs')

module.exports = function asarFriendlyNodeLoader() {
  const filename = basename(this.resourcePath)
  const callback = this.async()
  const dir = dirname(this.resourcePath)

  readdir(dir, async (err, files) => {
    if (err) {
      callback(err)
    }

    try {
      const assets = await Promise.all(
        files.map(
          filename =>
            new Promise((resolve, reject) => {
              const resourcePath = join(dir, filename)
              readFile(resourcePath, { encoding: 'binary' }, (err, src) => {
                if (err) {
                  reject(err)
                } else {
                  resolve({ filename, src })
                }
              })
            })
        )
      )

      callback(
        null,
        `
const assets = ${JSON.stringify(assets)};
const fs = require("fs");
const path = require("path");
const tmpdir = require("os").tmpdir();
assets.forEach(({ filename, src }) => {
  const destFilename = path.join(tmpdir, filename);
  fs.writeFileSync(destFilename, src, "binary");
})
const nodeFilename = ${JSON.stringify(filename)}
try {
  const mainFilepath = path.join(tmpdir, nodeFilename);
  global.process.dlopen(
    module,
    mainFilepath
  );
} catch(e) {
  throw new Error('node-loader: Cannot open ' + nodeFilename + ': ' + e);
}
`
      )
    } catch (err) {
      callback(err)
    }
  })
}
