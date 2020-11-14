const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './src/app.js',
    settings: './src/settingsPage.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js/'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};