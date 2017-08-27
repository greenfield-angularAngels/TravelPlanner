var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');
const webpack = require('webpack');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'QPX_API',
      'APC_AUTH',
      'APC_SECRET',
      'clientId',
      'clientSecret',
      'darkskyAPI',
      'geolocationAPI',
      'MONGODB_URI',
      'WEATHER_API',
      'YELP_TOKEN',
      'GEO_API'
    ])
  ],
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',
        query: {
          presets: ['react', 'es2015']
       }
      }
    ]
  }
};
