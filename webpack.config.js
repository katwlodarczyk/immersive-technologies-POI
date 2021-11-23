const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");


module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new NodePolyfillPlugin()
    ]

};