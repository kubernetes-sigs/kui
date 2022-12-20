/*
 * Copyright 2018 The Kubernetes Authors
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
const requireAll = require('require-all')
const { NormalModuleReplacementPlugin } = require('webpack')

const mode = process.env.MODE || 'development'
const target = process.env.TARGET || 'web'
const inBrowser = target === 'web'
const isWatching = !!process.argv.find(_ => /--watch/.test(_) || /webpack-dev-server/.test(_))
const webCompress = process.env.WEB_COMPRESS || 'none'
const noCompression = !inBrowser || webCompress === 'none' || isWatching
const CompressionPlugin = !noCompression && require('compression-webpack-plugin') // could be 'brotli-webpack-plugin' if needed
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { IgnorePlugin, ProvidePlugin } = require('webpack')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const sassLoaderChain = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      esModule: true
    }
  },
  'css-loader',
  'sass-loader'
]

const optimization = {
  splitChunks: {
    cacheGroups: {
      styles: {
        name: 'styles',
        type: 'css/mini-extract',
        chunks: chunk => chunk.name === 'main',
        enforce: true
      }
    }
  }
}
if (process.env.NO_OPT) {
  console.log('optimization? disabled')
  optimization.minimize = false
} else {
  optimization.minimizer = ['...', new CssMinimizerPlugin()]
}

const PORT_OFFSET = process.env.WEBPACK_PORT_OFFSET || process.env.PORT_OFFSET

// http port
const port = process.env.KUI_PORT || (PORT_OFFSET === undefined ? 9080 : 9080 + parseInt(PORT_OFFSET, 10))

// contextRoot
let contextRoot = ''
try {
  if (process.env.CLIENT_HOME && !isWatching) {
    contextRoot =
      require(path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/client/config.d/client.json')).contextRoot ||
      ''
    if (contextRoot && !/\/$/.test(contextRoot)) {
      contextRoot = contextRoot + '/'
    }
  }
} catch (err) {
  console.error('Error parsing contextRoot from theme', err)
}

console.log('port?', port)
console.log('mode?', mode)
console.log('target?', target)
console.log('inBrowser?', inBrowser)
console.log('watching?', isWatching)
console.log('contextRoot?', contextRoot)
console.log('explicit compression option?', webCompress || '<not set>')
console.log('bundle compression disabled?', noCompression)

const defaultConnectCSP = `http://localhost:8081 http://localhost:9953 ws://localhost:8081 ws://localhost:${port} http://localhost:${port}`

const contentSecurityPolicyForDevServer =
  process.env.WEBPACK_DEV_SERVER &&
  `default-src 'none'; frame-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' file: 'nonce-kuiDefaultNonce' data: http: https:; script-src 'self' 'nonce-kuiDefaultNonce' 'strict-dynamic' 'unsafe-eval'; font-src 'self' file:; connect-src 'self' ${
    process.env.CSP_ALLOWED_HOSTS || defaultConnectCSP
  }`
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

/** this is the full path in which will be serving up bundles; it includes contextRoot */
const outputPath = contextRoot ? path.join(buildDir, contextRoot) : buildDir
console.log('outputPath', outputPath)

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

// if (process.env.WEBPACK_ANALYZER) {
//  plugins.push(new BundleAnalyzerPlugin())
// }

// any compression plugins?
if (CompressionPlugin) {
  plugins.push(new CompressionPlugin({ deleteOriginalAssets: true, exclude: /.html$/ }))
}

const allFiles = /.*/
plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /\/tests\// }))
plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /\/@kui-shell\/build/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /tsconfig\.cjs\.spec\.json/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /\.node$/ }))

if (inBrowser) {
  plugins.push(
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: require.resolve('./process.js')
    })
  )
}

/**
 * Convenience function that makes a regexp out of a path; this helps with avoiding windows path.sep issues
 */
function thisPath(aPath /* : string */) {
  return new RegExp(aPath.replace(/\//g, '\\' + path.sep))
}

/**
 * Define the set of bundle entry points; there is one default entry
 * point (the main: entry below). On top of this, we scan the plugins,
 * looking to see if they define a `webpack.entry` field in their
 * package.json; if so, we add this to the mix. See plugin-editor for
 * an example of this.
 *
 */
const main = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/react')
const pluginBase = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell')
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
        kuiPluginRequiredWebpackPlugins.forEach(_ => {
          if (typeof _ === 'string') {
            plugins.push(new (require(_))())
          } else {
            plugins.push(new (require(_.plugin))(_.options || {}))
          }
        })
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

const clientBase = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/client')

plugins.push(
  new CopyPlugin({
    patterns: [
      { from: path.join(clientBase, 'icons'), to: 'icons/' },
      { from: path.join(clientBase, 'images'), to: 'images/' }
    ]
  })
)

const clientOptions = requireAll(path.resolve(path.join(clientBase, 'config.d')))
if (!clientOptions.opengraph) {
  clientOptions.opengraph = {}
}

clientOptions.style.bodyCss = (inBrowser ? ['not-electron'] : ['in-electron']).concat(clientOptions.style.bodyCss)
clientOptions.style.htmlCss = !clientOptions.style.htmlCss
  ? []
  : typeof clientOptions.style.htmlCss === 'string'
  ? [clientOptions.style.htmlCss]
  : clientOptions.style.htmlCss

if (contentSecurityPolicyForDevServer) {
  // only override the CSP when running webpack-dev-server;
  // otherwise, we will inherit the settings from theme.json
  // https://github.com/IBM/kui/pull/2395
  clientOptions.client.contentSecurityPolicy = contentSecurityPolicyForDevServer
}

const htmlBuildOptions = Object.assign(
  {
    scriptLoading: 'defer',
    inject: false
  },
  clientOptions,
  {
    filename: path.join(outputPath, 'index.html'),
    template: path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/core/templates/index.ejs')
  }
)

plugins.push(new HtmlWebpackPlugin(htmlBuildOptions))
plugins.push(new MiniCssExtractPlugin())

//
// touch the LOCKFILE when we are done
//
plugins.push({
  apply: compiler => {
    compiler.hooks.done.tap('done', () => {
      // touch the lockfile to indicate that we are done
      try {
        if (process.env.LOCKFILE) {
          console.log('Kui Client webpack build done, touching lockfile', process.env.LOCKFILE)
          fs.closeSync(fs.openSync(process.env.LOCKFILE, 'w'))
        }
      } catch (err) {
        console.error(err)
        throw err
      }
    })
  }
})

// this handles the node:path, node:process imports that came about in
// node 16
if (inBrowser) {
  plugins.push(
    new NormalModuleReplacementPlugin(/node:/, resource => {
      const mod = resource.request.replace(/^node:/, '')

      switch (mod) {
        case 'path':
          resource.request = 'path-browserify'
          break
        case 'process':
          resource.request = require.resolve('./process.js')
          break
        case 'readline':
          resource.request = require.resolve('./readline.js')
          break

        default:
          throw new Error(`Not found ${mod}`)
      }
    })
  )
}

console.log('webpack plugins', plugins)

// Notes: when !inBrowser, we want electron to pull
// node-pty in as a commonjs external module; this
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
  ? ['node-pty']
  : [
      'tape', // modules/composer/node_modules/safer-buffer
      'dns', // modules/openwhisk/node_modules/retry/example/dns.js
      'tls', // needed by request
      'tap', // wskflow
      'request', // needed by some apache-composer samples
      'babel-core/register', // wskflow
      'aws-sdk', // wskflow
      'node-pty', // bash-like
      './es6/crc9_1wire', // k8s
      './es6/crc17_xmodem', // k8s, openwhisk
      './es6/crc17_modbus', // k8s, openwhisk
      './es6/crc17_kermit', // k8s, openwhisk
      './es6/crc17_ccitt', // k8s, openwhisk
      'globby',
      'fast-glob',
      'ws',
      'readline',
      'chokidar',
      'fsevents',
      'shelljs',
      'module',
      'net',
      'webworker-threads', // wskflow
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

const fallback = !inBrowser
  ? {}
  : {
      fs: false,
      child_process: false,
      'docker-modem': false,
      'fs-extra': false,
      assert: require.resolve('assert'),
      constants: require.resolve('constants-browserify'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
      process: require.resolve('./process.js'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
      tty: require.resolve('tty-browserify'),
      util: require.resolve('util'),
      zlib: require.resolve('browserify-zlib')
    }

const alias = !inBrowser
  ? {}
  : {
      url: require.resolve('./url')
    }

module.exports = {
  context: process.env.CLIENT_HOME,
  stats: {
    // while developing, you should set this to true
    warnings: false
  },
  entry,
  target,
  mode,
  node: {
    __filename: true,
    __dirname: true
  },
  externals,
  resolve: {
    alias,
    extensions: ['.tsx', '.ts', '.js'],
    fallback
  },
  /* resolveLoader: {
    alias: {
      'snippet-inliner': require.resolve('@kui-shell/plugin-client-common/dist/controller/snippets-inliner.js')
    }
  }, */
  watchOptions: {
    ignored: [
      '**/dist/headless/**',
      '**/dist/webpack/**',
      '**/dist/electron/**',
      '**/*.d.ts',
      '**/*.js.map',
      '**/node_modules/**',
      '**/clients/default/**'
    ]
  },
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*', 'Set-Cookie': 'KUI_PROXY_COHOSTED=false' },
    compress: true,
    client: {
      logging: 'none',
      overlay: {
        errors: true,
        warnings: false
      }
    },
    devMiddleware: {
      writeToDisk: !inBrowser
    },
    host: '0.0.0.0',
    allowedHosts:
      'all' /* webpack 4.43 -> 4.44 seemed to require this, otherwise console errors WDS Disconnected, and no auto-reload on save+recompile */,
    port
  },
  optimization,
  module: {
    rules: kuiPluginRules.concat([
      // patternfly has some huge image assets for demos; we can't use IgnorePlugin, because about-modal-box.css uses this demo image. sigh
      {
        test: new RegExp(
          `\\${path.sep}@patternfly\\${path.sep}react-styles\\${path.sep}css\\${path.sep}assets\\${path.sep}images\\${path.sep}pfbg_.*\\.jpg$`
        ),
        use: 'ignore-loader'
      },

      // ignore commonjs bits
      {
        test: new RegExp(`\\${path.sep}node_modules\\${path.sep}@kui-shell\\${path.sep}\\.*\\${path.sep}dist`),
        use: 'ignore-loader'
      },
      {
        test: /\.css$/i,
        include: thisPath('web/css/static'),
        use: sassLoaderChain
      },
      {
        test: /\.scss$/i,
        use: sassLoaderChain
      },
      // { test: /\.css$/i, include: thisPath('@kui-shell/plugin-'), exclude: thisPath('web/css/static'), use: ['to-string-loader', 'css-loader'] },
      {
        test: /\.css$/i,
        exclude: thisPath('web/css/static'),
        use: sassLoaderChain
      },

      {
        test: /\.(eot)$/i,
        use: 'ignore-loader'
      },

      {
        test: /\.(ttf|woff2)$/i,
        type: 'asset'
      },

      //
      // typescript exclusion rules
      { test: /\/node_modules\/typescript\//, use: 'ignore-loader' },
      { test: /\/node_modules\/proxy-agent\//, use: 'ignore-loader' },
      { test: /\/node_modules\/@types\//, use: 'ignore-loader' },
      // end of typescript rules
      { test: /\/terser\/tools/, use: 'ignore-loader' },
      { test: /beautify-html\.js/, use: 'ignore-loader' },
      { test: /jquery\.map/, use: 'ignore-loader' },
      { test: /sizzle\.min\.map/, use: 'ignore-loader' },
      { test: /\/modules\/queue-view\//, use: 'ignore-loader' },
      { test: /\/node_modules\/proxy-agent\//, use: 'ignore-loader' },
      // { test: /\/node_modules\/fsevents\//, use: 'ignore-loader' },
      { test: /\/node_modules\/nan\//, use: 'ignore-loader' },
      { test: /translation-demo\/composition.js$/, use: 'ignore-loader' },
      { test: /@seed/, use: 'ignore-loader' },
      { test: /\.DOCS/, use: 'ignore-loader' },
      { test: /plugins\/*\/node_modules/, use: 'ignore-loader' },
      { test: /packages\/*\/node_modules/, use: 'ignore-loader' },
      // { test: /modules\/composer\/@demos\/.*\.js/, use: 'raw-loader' },
      // DANGEROUS: some node modules must have critical files under src/: { test: /\/src\//, use: 'ignore-loader' },
      // { test: /\/test\//, use: 'ignore-loader' },
      { test: /AUTHORS/, use: 'ignore-loader' },
      { test: /LICENSE/, use: 'ignore-loader' },
      { test: /license.txt/, use: 'ignore-loader' },

      // was: file-loader; but that loader does not allow for dynamic
      // loading of markdown *content* in a browser-based client
      { test: /\.md$/, use: 'raw-loader' }, // was: 'snippet-inliner'
      { test: /\.markdown$/, use: 'raw-loader' },
      { test: /CHANGELOG\.md$/, use: 'ignore-loader' }, // too big to pull in to the bundles

      { test: /~$/, use: 'ignore-loader' },
      { test: /Dockerfile$/, use: 'ignore-loader' },
      { test: /flycheck*\.js/, use: 'ignore-loader' },
      { test: /flycheck*\.d.ts/, use: 'ignore-loader' },
      // end of ignore-loader
      //
      // { test: /\.js$/, use: ['source-map-loader'], enforce: 'pre' },
      // { test: /samples\/.*\.js$/, use: 'raw-loader' }, // don't try to parse out sample input, e.g. for dependencies
      // { test: /\.js.map$/, use: 'ignore-loader' },

      // support for asciinema "casts"
      { test: /\.cast$/, type: 'asset' },

      { test: /\.py$/, use: 'file-loader' },
      { test: /\.ico$/, use: 'url-loader' },
      { test: /\.jpg$/, use: 'url-loader' },
      { test: /\.png$/, use: 'url-loader' },
      { test: /\.svg$/, use: 'svg-url-loader' },
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
    filename: mode === 'production' ? '[name].[contenthash].bundle.js' : '[name].bundle.js',

    // live watching should never use a contextRoot, otherwise you
    // will get "Cannot GET /" errors
    publicPath:
      (process.env.WATCH !== 'true' && contextRoot) || (inBrowser ? '/' : mode === 'production' ? '' : `${buildDir}/`),
    path: outputPath
  }
}
