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

const mode = process.env.MODE || 'development'
const target = process.env.HEADLESS_TARGET || 'electron-main'
const TerserJSPlugin = require('terser-webpack-plugin')
const { IgnorePlugin } = require('webpack')

// this lets us create a headless.zip file
const ZipPlugin = require('zip-webpack-plugin')

// in case the client has some oddities that require classnames to be preserved
const terserOptions = process.env.KEEP_CLASSNAMES
  ? {
      terserOptions: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        keep_classnames: true
      }
    }
  : {}

const optimization = {}
if (process.env.NO_OPT) {
  console.log('optimization? disabled')
  optimization.minimize = false
} else {
  optimization.minimizer = [new TerserJSPlugin(terserOptions)]
}

console.log('mode?', mode)
console.log('target?', target)

/** point webpack to the output directory */
const buildDir = path.join(process.env.CLIENT_HOME, 'dist/headless')
console.log('buildDir', buildDir)

/** this is the full path in which will be serving up bundles */
const outputPath = buildDir
console.log('outputPath', outputPath)

/**
 * Note: these are _webpack plugins_ not Kui plugins; we will assemble
 * this list of webpack plugins as we go.
 */
const plugins = []

// ignore these bits for headless
const allFiles = /.*/
plugins.push(new IgnorePlugin({ resourceRegExp: /\.css/, contextRegExp: /@kui-shell/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /\.scss/, contextRegExp: /@kui-shell/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /\/tests\// }))
plugins.push(new IgnorePlugin({ resourceRegExp: /tsconfig\.cjs\.spec\.json/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@patternfly\/react-charts/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@patternfly\/react-core/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@patternfly\/react-icons/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@patternfly\/react-table/ }))

plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /@kui-shell\/build/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@kui-shell\/plugin-\w+-themes/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /plugin-client-common/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /plugin-electron-components/ }))
plugins.push(new IgnorePlugin({ resourceRegExp: /@kui-shell\/plugin-electron-components/ }))
;[
  /^d3$/,
  /^elkjs\/lib\/elk.bundled.js$/,
  /^react(-.*)?$/,
  /^jquery$/,
  // /^electron$/,
  /^monaco-editor$/,
  /^xterm$/
].forEach(resourceRegExp => plugins.push(new IgnorePlugin({ resourceRegExp })))

/**
 * Define the set of bundle entry points; there is one default entry
 * point (the main: entry below). On top of this, we scan the plugins,
 * looking to see if they define a `webpack.entry` field in their
 * package.json; if so, we add this to the mix. See plugin-editor for
 * an example of this.
 *
 */
const kuiHeadlessMain = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/core/mdist/main/main.js')
const kuiProxyMain = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell/proxy/app/bin/www')

const pluginBase = path.join(process.env.CLIENT_HOME, 'node_modules/@kui-shell')
console.log('main', kuiHeadlessMain)
console.log('pluginBase', pluginBase)
const allKuiPlugins = fs.readdirSync(pluginBase)
const kuiPluginRules = []
const kuiPluginExternals = []
allKuiPlugins.forEach(dir => {
  try {
    const pjson = path.join(pluginBase, dir, 'package.json')
    const { kui } = require(pjson)
    const providedEntries = (kui && kui.webpack && kui.webpack.entry) || {}

    // does the kui plugin need any webpack plugins?
    if (kui && kui.webpack) {
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

    return providedEntries
  } catch (err) {
    return {}
  }
})

const { productName } = require('@kui-shell/client/config.d/name.json')
console.log(`productName=${productName}`)

//
// touch the LOCKFILE when we are done
//
plugins.push({
  apply: compiler => {
    compiler.hooks.done.tap('done', () => {
      // touch the lockfile to indicate that we are done
      try {
        if (process.env.LOCKFILE) {
          console.log('Kui Headless webpack build done, touching lockfile', process.env.LOCKFILE)
          fs.closeSync(fs.openSync(process.env.LOCKFILE, 'w'))
        }
      } catch (err) {
        console.error(err)
        throw err
      }
    })
  }
})

// zip after emit, so we get a dist/headless.zip
if (process.env.KUI_BUILD_HEADLESS_ZIP) {
  plugins.push(
    new ZipPlugin({
      filename: 'headless.zip', // ZipPlugin by default names it based on the name of the main bundle
      path: '..', // ZipPlugin seems to treat this as relative to the output path specified below
      include: /.*/ // ZipPlugin by default only includes the main bundle file
    })
  )
}

// console.log('webpack plugins', plugins)

const externals = []
kuiPluginExternals.forEach(_ => {
  externals[_] = _
})

const config = (
  entry,
  target,
  extraPlugins = [],
  filename = productName.toLowerCase().replace(/\s/g, '-'),
  nameSuffix = ''
) => ({
  context: process.env.CLIENT_HOME,
  stats: {
    // while developing, you should set this to true
    warnings: false
  },
  entry,
  target,
  mode,
  node: {
    __filename: true
    //    __dirname: true <-- node-loader is not compatible with this
  },
  externals,
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
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
  optimization,
  module: {
    rules: kuiPluginRules.concat([
      {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
          name: `[name]${nameSuffix}.[ext]`
        }
      },
      // ignore commonjs bits
      {
        test: new RegExp(`\\${path.sep}node_modules\\${path.sep}@kui-shell\\${path.sep}\\.*\\${path.sep}dist`),
        use: 'ignore-loader'
      },
      {
        test: /\.css$/i,
        use: 'ignore-loader'
      },
      {
        test: /\.scss$/i,
        use: 'ignore-loader'
      },
      {
        test: /\.(eot)$/i,
        use: 'ignore-loader'
      },
      {
        test: /\.(ttf)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(woff2?)$/i,
        use: 'file-loader'
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
      { test: /\.md$/, use: 'raw-loader' },
      { test: /\.markdown$/, use: 'raw-loader' },
      { test: /CHANGELOG\.md$/, use: 'ignore-loader' }, // too big to pull in to the bundles

      { test: /~$/, use: 'ignore-loader' },
      { test: /Dockerfile$/, use: 'ignore-loader' },
      { test: /flycheck*\.js/, use: 'ignore-loader' },
      { test: /flycheck*\.d.ts/, use: 'ignore-loader' },
      // end of ignore-loader
      //
      { test: /\.py$/, use: 'file-loader' },
      { test: /\.ico$/, use: 'ignore-loader' },
      { test: /\.jpg$/, use: 'ignore-loader' },

      // support for asciinema "casts"
      { test: /\.cast$/, type: 'ignore-loader' },

      // handles template images for Tray menus
      { test: x => x.endsWith('.png') && !/Template(@[^.]+)?\.png$/.test(x), use: 'ignore-loader' },
      {
        test: /Template(@[^.]+)?\.png$/,
        type: 'asset/resource',
        generator: {
          // here, we make sure to preserve the original name, because
          // electron depends on the tray image file being named
          // fooTemplate.png, i.e. the Template.png part is important
          filename: 'images/[name][ext]'
        }
      },

      { test: /\.svg$/, use: 'ignore-loader' },
      { test: /\.sh$/, use: 'raw-loader' },
      { test: /\.html$/, type: 'raw-loader' },
      { test: /\.yaml$/, use: 'raw-loader' },
      { test: /JSONStream\/index.js$/, use: 'shebang-loader' }
    ])
  },

  plugins: plugins.concat(extraPlugins),

  // stats: 'verbose',
  output: {
    filename: filename + '.min.js',
    publicPath: '',
    path: outputPath,
    library: {
      type: 'commonjs'
    }
  }
})

const ignoreNotebooks = [new IgnorePlugin({ resourceRegExp: allFiles, contextRegExp: /\/notebooks\// })]

if (process.env.TARGET !== 'electron-renderer') {
  // with a kui-proxy backed client, we need notebooks in the "main"
  console.log('Processing webpack electron-main and kui-proxy', process.env.TARGET)
  const electronMain = config(kuiHeadlessMain, 'node')
  const proxy = config(kuiProxyMain, 'node', ignoreNotebooks, 'kui-proxy', '-proxy')
  module.exports = [electronMain, proxy]
} else {
  console.log('Processing webpack for electron-main')
  module.exports = config(kuiHeadlessMain, 'electron-main', ignoreNotebooks)
}
