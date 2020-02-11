const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode   : 'development',
  entry  : './src/index.ts',
  output : {
    path    : `${__dirname}/dist`,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './public',
    port: 3000
  },
  module : {
    rules: [
      {
        test: /\.ts$/,
        use : 'ts-loader'
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};

