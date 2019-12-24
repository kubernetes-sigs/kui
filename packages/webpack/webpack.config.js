/*
 * Copyright 2018-19 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs')
const path = require('path')

const mode = process.env.MODE || 'development'
const target = process.env.TARGET || 'web'
const inBrowser = target === 'web'
const isWatching = !!process.argv.find(_ => /--watch/.test(_) || /webpack-dev-server/.test(_))
const webCompress = process.env.WEB_COMPRESS
const noCompression = !inBrowser || webCompress === 'none' || isWatching
const CompressionPlugin = !noCompression && require('compression-webpack-plugin') // could be 'brotli-webpack-plugin' if needed

const optimization = {}
if (process.env.NO_OPT) {
  console.log('optimization? disabled')
  optimization.minimize = false
}

const PORT_OFFSET = process.env.WEBPACK_PORT_OFFSET || process.env.PORT_OFFSET

// http port
const port = process.env.KUI_PORT || (PORT_OFFSET === undefined ? 9080 : 9080 + parseInt(PORT_OFFSET, 10))

console.log('port?', port)
console.log('mode?', mode)
console.log('target?', target)
console.log('inBrowser?', inBrowser)
console.log('watching?', isWatching)
console.log('explicit compression option?', webCompress || '<not set>')
console.log('bundle compression disabled?', noCompression)

// darwin/macos seems to have high cpu utilization without poll
const pollInterval = undefined // process.platform === 'darwin' && (process.env.WEBPACK_POLL_INTERVAL || 2000)
console.log('webpack poll interval', pollInterval)

const defaultConnectCSP = `http://localhost:8081 http://localhost:9953 ws://localhost:8081 ws://localhost:${port} http://localhost:${port}`

const contentSecurityPolicyForDevServer =
  process.env.WEBPACK_DEV_SERVER &&
  `default-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' file: 'nonce-kuiDefaultNonce' data:; script-src 'self' 'nonce-kuiDefaultNonce' 'strict-dynamic' 'unsafe-eval'; font-src 'self' file:; connect-src 'self' ${process
    .env.CSP_ALLOWED_HOSTS || defaultConnectCSP}`
if (contentSecurityPolicyForDevServer) {
  console.log('ContentSecurityPolicy: dev-server', contentSecurityPolicyForDevServer)
} else {
  console.log('ContentSecurityPolicy: from-client')
}

const isMonorepo = process.env.KUI_MONO_HOME !== undefined
if (isMonorepo) {
  console.log('monorepo mode', process.env.KUI_MONO_HOME)
} else {
  console.log('external client mode')
}

/** point webpack to the root directory */
const stageDir = path.resolve(process.env.KUI_STAGE || process.env.KUI_MONO_HOME || process.cwd())
console.log('stageDir', stageDir)

/** point webpack to the output directory */
const buildDir =
  ((!inBrowser || isWatching) && path.join(stageDir, 'node_modules/@kui-shell/build')) ||
  process.env.KUI_BUILDDIR ||
  (process.env.KUI_MONO_HOME && path.join(process.env.KUI_MONO_HOME, 'node_modules/@kui-shell/build')) ||
  path.join(stageDir, 'dist/webpack')
console.log('buildDir', buildDir)

const builderHome =
  process.env.KUI_BUILDER_HOME ||
  (process.env.KUI_MONO_HOME
    ? path.join(process.env.KUI_MONO_HOME, 'packages/builder')
    : path.join(stageDir, 'node_modules/@kui-shell/builder'))
console.log('builderHome', builderHome)

if (!process.env.CLIENT_HOME) {
  if (process.env.KUI_MONO_HOME) {
    process.env.CLIENT_HOME = path.join(process.env.KUI_MONO_HOME, 'clients', process.env.CLIENT)
  } else {
    process.env.CLIENT_HOME = stageDir
  }
}
console.log('clientHome', process.env.CLIENT_HOME)

/**
 * Note: these are _webpack plugins_ not Kui plugins; we will assemble
 * this list of webpack plugins as we go.
 */
const plugins = []

// any compression plugins?
if (CompressionPlugin) {
  plugins.push(new CompressionPlugin({ deleteOriginalAssets: true }))
}

/**
 * Define the set of bundle entry points; there is one default entry
 * point (the main: entry below). On top of this, we scan the plugins,
 * looking to see if they define a `webpack.entry` field in their
 * package.json; if so, we add this to the mix. See plugin-editor for
 * an example of this.
 *
 */
const main = path.join(stageDir, 'node_modules/@kui-shell/core/mdist/webapp/bootstrap/webpack.js')
const pluginBase = path.join(stageDir, 'node_modules/@kui-shell')
console.log('main', main)
console.log('pluginBase', pluginBase)
const allKuiPlugins = fs.readdirSync(pluginBase)
const kuiPluginRules = []
const kuiPluginExternals = []
const pluginEntries = allKuiPlugins.map(dir => {
  try {
    const pjson = path.join(pluginBase, dir, 'package.json')
    const { kui } = require(pjson)
    const providedEntries = (kui && kui.webpack && kui.webpack.entry) || {}

    // does the kui plugin need any webpack plugins?
    if (kui && kui.webpack) {
      if (kui.webpack.plugins) {
        const kuiPluginRequiredWebpackPlugins = kui.webpack.plugins
        kuiPluginRequiredWebpackPlugins.forEach(_ => plugins.push(new (require(_))()))
      }

      if (kui.webpack.externals) {
        kui.webpack.externals.forEach(_ => {
          kuiPluginExternals.push(_)
        })
      }

      if (kui.webpack.rules) {
        if (kui.webpack.rules['file-loader']) {
          kui.webpack.rules['file-loader'].forEach(test => {
            kuiPluginRules.push({
              test: new RegExp(test.replace(/(\S)\/(\S)/g, `$1\\${path.sep}$2`)),
              use: 'file-loader'
            })
          })
        }
      }
    }

    // return Object.assign({}, providedEntries, pluginEntry, preloadEntry)
    return providedEntries
  } catch (err) {
    return {}
  }
})
const entry = Object.assign({ main }, ...pluginEntries)
console.log('entry', entry)

console.log('webpack plugins', plugins)

// the Kui builder plugin
plugins.push({
  apply: compiler => {
    let hash
    compiler.hooks.compilation.tap('KuiHtmlBuilder', compilation => {
      compilation.hooks.afterHash.tap('KuiHtmlBuilder', () => {
        // we need to inject the name of the main bundle into the configuration
        hash = compilation.hash
      })
    })
    compiler.hooks.done.tapPromise('KuiHtmlBuilder', () => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const main = `main.${hash}.bundle.js` // <-- this is the name of the main bundle
          console.log('KuiHtmlBuilder using this build hash', hash)

          const overrides = {
            build: { writeConfig: false },
            env: { main, hash, bodyCss: inBrowser ? ['not-electron'] : ['in-electron'] }
          }

          if (PORT_OFFSET !== undefined) {
            overrides.env.nameSuffix = PORT_OFFSET
          }

          if (contentSecurityPolicyForDevServer) {
            overrides.theme = {
              // only override the CSP when running webpack-dev-server;
              // otherwise, we will inherit the settings from theme.json
              // https://github.com/IBM/kui/pull/2395
              contentSecurityPolicy: contentSecurityPolicyForDevServer
            }
          }

          if (!inBrowser || isWatching) {
            overrides.build.buildDir = buildDir
            overrides.build.configDir = path.join(path.dirname(buildDir), 'settings')
          }

          // and this will inject it
          const Builder = require(path.join(builderHome, 'lib/configure'))
          await new Builder().build(!inBrowser || isWatching ? 'webpack-watch' : 'webpack', overrides)

          // touch the lockfile to indicate that we are done
          if (process.env.LOCKFILE) {
            fs.closeSync(fs.openSync(process.env.LOCKFILE, 'w'))
          }

          resolve()
        } catch (err) {
          reject(err)
        }
      })
    })
  }
})

// Notes: when !inBrowser, we want electron to pull
// node-pty-prebuilt-multiarch in as a commonjs external module; this
// is because node-pty has binary bits, and we are building one set of
// bundles for all electron platforms. If, in the future, we decide to
// rebuild the bundles for each platform, we can remove this 'commonjs
// node-pty...' bit, and, below, restore the `rule` pertaining to
// node-pty (i will leave that rule in the code here, for now, though
// commented out; just make sure to remove the commonjs bit here, and
// uncomment the node-pty rule below, if you decide to rebuild the
// bundles, once for each platform, in the future). The kui issue
// covering this topic is here:
// https://github.com/IBM/kui/issues/3381; and if you're curious about
// the 'commonjs node-pty' syntax, see
// https://github.com/webpack/webpack/issues/4238
const externals = !inBrowser
  ? { 'node-pty-prebuilt-multiarch': 'commonjs node-pty-prebuilt-multiarch' }
  : [
      'tape', // modules/composer/node_modules/safer-buffer
      'dns', // modules/openwhisk/node_modules/retry/example/dns.js
      'tls', // needed by request
      'tap', // wskflow
      'request', // needed by some apache-composer samples
      'babel-core/register', // wskflow
      'aws-sdk', // wskflow
      'node-pty-prebuilt-multiarch', // bash-like
      './es6/crc9_1wire', // k8s
      './es6/crc17_xmodem', // k8s, openwhisk
      './es6/crc17_modbus', // k8s, openwhisk
      './es6/crc17_kermit', // k8s, openwhisk
      './es6/crc17_ccitt', // k8s, openwhisk
      'ws',
      'readline',
      'chokidar',
      'fsevents',
      'shelljs',
      'module',
      'net',
      'webworker-threads', // wskflow
      'xml2js', // used by plugins/plugin-apache-composer/@demos/combinators/http.js
      'nyc',
      'electron'
    ]

kuiPluginExternals.forEach(_ => {
  if (!inBrowser) {
    externals[_] = _
  } else {
    externals.push(_)
  }
})

const emptyIfInBrowser = inBrowser ? 'empty' : true

module.exports = {
  context: stageDir,
  stats: {
    // while developing, you should set this to true
    warnings: false
  },
  entry,
  target,
  mode,
  node: {
    __filename: true,
    __dirname: true,
    fs: emptyIfInBrowser,
    // eslint-disable-next-line @typescript-eslint/camelcase
    child_process: emptyIfInBrowser,
    'docker-modem': emptyIfInBrowser,
    'fs-extra': emptyIfInBrowser
  },
  externals,
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  resolveLoader: {
    alias: {
      'asar-friendly-node-loader': require.resolve('@kui-shell/webpack/asar-friendly-node-loader')
    }
  },
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    compress: true,
    clientLogLevel: 'silent',
    watchOptions: {
      'info-verbosity': 'verbose',
      poll: pollInterval,
      ignored: ['**/*.d.ts', '**/*.js.map', /node_modules/, '**/clients/default/**']
    },
    writeToDisk: !inBrowser,
    contentBase: buildDir,
    port
  },
  optimization,
  module: {
    rules: kuiPluginRules.concat([
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              projectReferences: true,
              configFile: path.join(stageDir, 'tsconfig-es6.json')
            }
          }
        ],
        exclude: /node_modules/
      },

      // native binaries for node-pty; commented out for now. !!!!
      // !!! Please do not remove this (commented out) rule !!!!!!
      // See the Notes paragraph, just above the `externals`
      // definition)
      /* {
        test: new RegExp(
          `\\${path.sep}node_modules\\${path.sep}node-pty-prebuilt-multiarch\\${path.sep}build\\${path.sep}Release`
        ),
        use: mode === 'production' ? 'asar-friendly-node-loader' : 'node-loader'
      }, */

      // ignore commonjs bits
      {
        test: new RegExp(`\\${path.sep}node_modules\\${path.sep}@kui-shell\\${path.sep}\\.*\\${path.sep}dist`),
        use: 'ignore-loader'
      },

      //
      // typescript exclusion rules
      { test: /\/node_modules\/typescript\//, use: 'ignore-loader' },
      { test: /\/node_modules\/proxy-agent\//, use: 'ignore-loader' },
      { test: /\/node_modules\/@babel\//, use: 'ignore-loader' },
      { test: /\/node_modules\/@types\//, use: 'ignore-loader' },
      // end of typescript rules
      { test: /\/terser\/tools/, use: 'ignore-loader' },
      { test: /beautify-html\.js/, use: 'ignore-loader' },
      { test: /package-lock\.json/, use: 'ignore-loader' },
      { test: /jquery\.map/, use: 'ignore-loader' },
      { test: /sizzle\.min\.map/, use: 'ignore-loader' },
      { test: /\/modules\/queue-view\//, use: 'ignore-loader' },
      { test: /\/node_modules\/proxy-agent\//, use: 'ignore-loader' },
      // { test: /\/node_modules\/fsevents\//, use: 'ignore-loader' },
      { test: /\/node_modules\/nan\//, use: 'ignore-loader' },
      { test: /translation-demo\/composition.js$/, use: 'ignore-loader' },
      { test: /@seed/, use: 'ignore-loader' },
      { test: /\.DOCS/, use: 'ignore-loader' },
      { test: /\/docs\//, use: 'ignore-loader' },
      { test: /\/examples\//, use: 'ignore-loader' },
      { test: /plugins\/*\/node_modules/, use: 'ignore-loader' },
      { test: /packages\/*\/node_modules/, use: 'ignore-loader' },
      // { test: /modules\/composer\/@demos\/.*\.js/, use: 'raw-loader' },
      // DANGEROUS: some node modules must have critical files under src/: { test: /\/src\//, use: 'ignore-loader' },
      // { test: /\/test\//, use: 'ignore-loader' },
      { test: /\/tests\//, use: 'ignore-loader' },
      { test: /AUTHORS/, use: 'ignore-loader' },
      { test: /LICENSE/, use: 'ignore-loader' },
      { test: /license.txt/, use: 'ignore-loader' },
      { test: /\.md$/, use: 'ignore-loader' },
      { test: /\.markdown$/, use: 'ignore-loader' },
      { test: /~$/, use: 'ignore-loader' },
      { test: /Dockerfile$/, use: 'ignore-loader' },
      { test: /flycheck*\.js/, use: 'ignore-loader' },
      { test: /flycheck*\.d.ts/, use: 'ignore-loader' },
      // end of ignore-loader
      //
      // { test: /\.js$/, use: ['source-map-loader'], enforce: 'pre' },
      // { test: /samples\/.*\.js$/, use: 'raw-loader' }, // don't try to parse out sample input, e.g. for dependencies
      // { test: /\.js.map$/, use: 'ignore-loader' },
      { test: /\.py$/, use: 'file-loader' },
      { test: /\.ico$/, use: 'file-loader' },
      { test: /\.jpg$/, use: 'file-loader' },
      { test: /\.png$/, use: 'file-loader' },
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/i, use: ['to-string-loader', 'css-loader'] },
      { test: /\.sh$/, use: 'raw-loader' },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.yaml$/, use: 'raw-loader' },
      { test: /^kubectl-kui$/, use: 'shebang-loader' },
      { test: /^kubectl-wsk$/, use: 'shebang-loader' },
      { test: /^kui$/, use: 'shebang-loader' },
      { test: /JSONStream\/index.js$/, use: 'shebang-loader' }
    ])
  },
  plugins,
  output: {
    globalObject: 'self', // for monaco
    filename: '[name].[hash].bundle.js',
    publicPath: inBrowser ? '/' : mode === 'production' ? '' : `${buildDir}/`,
    path: buildDir
  }
}
