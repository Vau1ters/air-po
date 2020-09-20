const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: './public',
    port: 3000,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
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
        test: /\.wav$/,
        exclude: /node_modules/,
        loader: 'url-loader',
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
