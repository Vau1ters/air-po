/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin')
const { execSync } = require('child_process')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  devServer: {
    static: './public',
    port: 3000,
  },
  watchOptions: {
    ignored: /autogen/,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.ogg$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.mp3$/,
        exclude: /node_modules/,
        loader: 'url-loader',
      },
      {
        test: /\.fnt$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'html-loader',
      },
      {
        test: /\.(vert|frag)$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ],
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ESLintWebpackPlugin({
      extensions: ['.ts', '.js'],
      exclude: 'node_modules',
      fix: true,
    }),
    new class MetaBuildPlugin {
      apply(compiler) {
        compiler.hooks.beforeCompile.tapAsync('MetabuildPlugin', (params, callback) => {
          console.log('metabuild running...')
          execSync('yarn metabuild')
          callback()
        })
      }
    }
  ],
}
