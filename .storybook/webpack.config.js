const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@chroniq/chroniq/lib': path.resolve(__dirname, '../packages/chroniq/src/'),
      '@chroniq/chroniq-layout-strategy-default': path.resolve(__dirname, '../packages/chroniq-layout-strategy-default/src/'),
      '@chroniq/chroniq-layout-strategy-enhanced': path.resolve(__dirname, '../packages/chroniq-layout-strategy-enhanced/src/'),  
      '@chroniq/chroniq-accessors-object': path.resolve(__dirname, '../packages/chroniq-accessors-object/src/'),
      '@chroniq/chroniq-accessors-immutable': path.resolve(__dirname, '../packages/chroniq-accessors-immutable/src/'),
      '@chroniq/chroniq-accessor-helpers': path.resolve(__dirname, '../packages/chroniq-accessor-helpers/src/'),
      '@chroniq/chroniq-view-month': path.resolve(__dirname, '../packages/chroniq-view-month/src/'),
      '@chroniq/chroniq-view-week': path.resolve(__dirname, '../packages/chroniq-view-week/src/'),
      '@chroniq/chroniq-view-workweek': path.resolve(__dirname, '../packages/chroniq-view-workweek/src/'),
      '@chroniq/chroniq-view-day': path.resolve(__dirname, '../packages/chroniq-view-day/src/'),
      '@chroniq/chroniq-view-agenda': path.resolve(__dirname, '../packages/chroniq-view-agenda/src/'),
      '@chroniq/chroniq-storybook': path.resolve(__dirname, '../packages/chroniq-storybook/src/'),
    }
  },
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
