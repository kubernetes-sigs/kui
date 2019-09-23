# Packaging up Kui

NOTE: Internal consumption only! Don't use this directly!

Beyond local development of Kui, you may want to package and
distribute Kui to others. The code base currently supports three
packaging modes:

- [Headless](#headless-packaging) &mdash; making a lightweight headless release
- [Electron](#electron-packaging) &mdash; building an Electron client app
- [Browser](#browser-packaging) &mdash; building for the browser, using [webpack](https://webpack.js.org/)

## Headless packaging

```bash
> cd dist/headless && ./build.sh
> ls dist/builds
Kui-headless.tar.bz2 Kui-headless.zip
```

## Electron packaging

Kui uses
[electron-packager](https://github.com/electron-userland/electron-packager)
for the heavy lifting. The `electron-packager` npm supports building
for Windows, macOS, and Linux. When building an Electron distribution,
the script by default will build for all three platforms.

```bash
> (cd dist/electron && ./build.sh [target])
> ls dist/builds
Kui-darwin-x64.dmg Kui-darwin-x64.tar.bz2 Kui-win32-x64.zip Kui-linux-x64.tar.bz2
```

To test out builds on your laptop, you may wish only to build for one
platform. You can do so by adding a `target` option, which is one of
`win32`, `mac`, or `linux`. If you only want the Electron
double-clickable, and not the distributables (e.g. the `dmg` and `zip`
files), set the `NO_INSTALLER=true` environment variable when
executing `build.sh`.

## Browser packaging

To build for use in a browser, Kui uses
[webpack](https://webpack.js.org/). Before your first webpack build,
make sure to issue an `npm install` from within the `dist/webpack`
directory:

```bash
> cd dist/webpack && npm install && ./build.sh
> ls dist/webpack/build
... lots of *.bundle.js.br files ...
```

After you have built the webpack bundles, you can test them out
locally:

```bash
> cd dist/webpack && npm run http
Now visit this url:
https://localhost:8080/app/build/index-webpack-local.html
```

The first time you do so, you will be asked to set up a local https
certificate. You should see the normal openssl series of prompts; make
sure that you provide at least one non-empty answer to the self-signed
certificate prompts, otherwise it will fail in odd ways.
