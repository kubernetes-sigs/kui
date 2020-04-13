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
      // { test: /\.css$/i, include: thisPath('@kui-shell/plugin-'), exclude: thisPath('web/css/static'), use: ['to-string-loader', 'css-loader'] },
      { test: /\.css$/i, exclude: thisPath('web/css/static'), use: ['style-loader', 'css-loader'] },
      { test: /\.png$/, use: 'file-loader' },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  target: process.env.TARGET || 'web',
  output: {
    path: path.resolve('./dist')
  },
  node: {
    fs: 'empty',
    // eslint-disable-next-line @typescript-eslint/camelcase
    child_process: 'empty'
  },
  devServer: {
    port: 9080,
    clientLogLevel: 'silent',
    watchOptions: {
      ignored: ['**/*.d.ts', '**/*.js.map', /node_modules/, '**/clients/default/**']
    },
    writeToDisk: process.env.TARGET === 'electron-renderer'
  },
  // externals: { 'node-pty-prebuilt-multiarch': 'commonjs node-pty-prebuilt-multiarch' },
  externals: ['net', 'module', 'readline', 'node-pty-prebuilt-multiarch'],
  stats: {
    // while developing, you should set this to true
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
