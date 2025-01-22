const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  entry: '/src/v2/server.ts', 
  target: 'node', 
  output: {
    path: path.resolve(__dirname, 'build'), 
    filename: 'server.cjs', 
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'], 
  },
  module: {
    rules: [
      {
        test: /\.ts$/, 
        use: 'ts-loader', 
        exclude: /node_modules/, 
      },
    ],
  },
  externals: [nodeExternals()], 
  devtool: 'source-map', 
};
