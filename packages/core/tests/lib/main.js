/*
 * This is only for webpack test.
 * This launches an electron app, sets the window size as Kui's test requirement,
 * and loads kui's local url to test Kui's browser mode.
 */

try {
  const { app, BrowserWindow } = require('electron')

  let window

  app.once('ready', () => {
    window = new BrowserWindow({ width: 1400, height: 1050 }) // define browser window size according to WINDOW_WIDTH and WINDOW_HEIGHT in travis.yml
    window.loadURL(process.env.WEBPACK_CLIENT_URL)
  })
} catch (err) {
  console.error(err)
}
