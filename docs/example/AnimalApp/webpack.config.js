const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FontConfigWebpackPlugin = require('font-config-webpack-plugin')

const mode = process.env.MODE || 'development'

/**
 * Convenience function that makes a regexp out of a path; this helps with avoiding windows path.sep issues
 */
function thisPath(aPath /* : string */) {
  return new RegExp(aPath.replace(/\//g, '\\' + path.sep))
}

const sassLoaderChain = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: mode === 'development',
      esModule: true
    }
  },
  'css-loader',
  'sass-loader'
]

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: thisPath('web/css/static'),
        use: sassLoaderChain
      },
      {
        test: /\.scss$/i,
        use: sassLoaderChain
      },
      { test: /\.css$/i, exclude: thisPath('web/css/static'), use: ['style-loader', 'css-loader'] }
    ]
  },
  output: {
    path: path.resolve('./dist')
  },
  node: {
    fs: 'empty',
    // eslint-disable-next-line @typescript-eslint/camelcase
    child_process: 'empty'
  },
  externals: ['net', 'node-pty-prebuilt-multiarch'],
  devServer: {
    port: 9080,

    // otherwise, webpack-dev-server spews a gigantic volume of
    // messages to the browser every time it recompiles
    clientLogLevel: 'silent',

    // these are build artifacts, no need to watch for changes therein
    watchOptions: {
      ignored: ['**/*.d.ts', '**/*.js.map', /node_modules/]
    }
  },
  stats: {
    warnings: false
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin(),
    new FontConfigWebpackPlugin()
  ]
}
