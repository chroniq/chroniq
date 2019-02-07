const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@chroniq/chroniq/lib': path.resolve(__dirname, '../src/'),
    }
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      { 
        test: /\.styl$/, 
        use: [
          {
            loader: 'style-loader' 
          },
          {
            loader: 'css-loader' 
          },
          {
            loader: 'stylus-loader' 
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $ : "jquery",
      Backbone : "backbone",
      _ : "underscore"
    })
  ]
};
